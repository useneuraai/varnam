-- =====================================================================================
-- VARNAM DATABASE SECURITY & RLS HARDENING MIGRATION
-- 1. Adds rsvp_token for guest device idempotency
-- 2. Enforces trigger-level entitlement protection so client JWTs cannot mark is_paid = true
-- 3. Ensures strict isolation across profiles, invitations, orders, payments, and rsvps
-- =====================================================================================

-- 1. Add rsvp_token column to rsvps for client-side device idempotency
alter table public.rsvps add column if not exists rsvp_token varchar;
create index if not exists idx_rsvps_token on public.rsvps(rsvp_token);
create index if not exists idx_rsvps_contact on public.rsvps(invitation_slug, guest_contact);

-- 2. Trigger function to prevent non-service-role clients from setting is_paid = true or status = 'published'
create or replace function public.protect_invitation_entitlement_changes()
returns trigger as $$
begin
    -- Service role and internal database processes can perform all entitlement changes
    if auth.role() = 'service_role' or current_user in ('postgres', 'service_role') then
        return new;
    end if;

    -- Block client-side elevation to is_paid = true
    if (new.is_paid is true and (old.is_paid is not true or old.is_paid is null)) then
        raise exception 'SECURITY_VIOLATION: is_paid entitlement can only be granted by the backend payment gateway verification.';
    end if;

    -- Block client-side setting of published status if unpaid
    if (new.status in ('paid', 'published') and (old.is_paid is not true or old.is_paid is null) and (new.is_paid is not true)) then
        raise exception 'SECURITY_VIOLATION: Status cannot be set to paid or published without verified payment.';
    end if;

    -- Prevent changing ownership of an existing invitation
    if (old.user_id is not null and new.user_id is distinct from old.user_id) then
        raise exception 'SECURITY_VIOLATION: Reassigning invitation ownership is prohibited.';
    end if;

    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_protect_invitation_entitlement on public.invitations;
create trigger tr_protect_invitation_entitlement
    before update or insert on public.invitations
    for each row execute function public.protect_invitation_entitlement_changes();

-- 3. Trigger to prevent normal users from elevating their role in profiles
create or replace function public.protect_profile_role()
returns trigger as $$
begin
    if auth.role() != 'service_role' and current_user not in ('postgres', 'service_role') then
        if new.role is distinct from old.role then
            new.role = old.role;
        end if;
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_protect_profile_role on public.profiles;
create trigger tr_protect_profile_role
    before update on public.profiles
    for each row execute function public.protect_profile_role();

-- 4. Re-assert strict Row Level Security (RLS) on all 5 tables
alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.rsvps enable row level security;

-- Profiles Policies
drop policy if exists "Allow users to read their own profile" on public.profiles;
create policy "Allow users to read their own profile"
    on public.profiles for select
    using (auth.uid() = id or auth.role() = 'service_role');

drop policy if exists "Allow users to update their own profile" on public.profiles;
create policy "Allow users to update their own profile"
    on public.profiles for update
    using (auth.uid() = id or auth.role() = 'service_role');

-- Invitations Policies
drop policy if exists "Allow public to view published invitations" on public.invitations;
create policy "Allow public to view published invitations"
    on public.invitations for select
    using (
        (status = 'published' and is_paid = true and deleted_at is null)
        or auth.uid() = user_id
        or auth.role() = 'service_role'
    );

drop policy if exists "Allow authenticated users to create invitations" on public.invitations;
create policy "Allow authenticated users to create invitations"
    on public.invitations for insert
    with check (
        (auth.uid() = user_id and (is_paid is not true) and (status in ('draft', 'pending_payment')))
        or auth.role() = 'service_role'
    );

drop policy if exists "Allow owner to update their own invitations" on public.invitations;
create policy "Allow owner to update their own invitations"
    on public.invitations for update
    using (auth.uid() = user_id or auth.role() = 'service_role')
    with check (auth.uid() = user_id or auth.role() = 'service_role');

drop policy if exists "Allow owner to delete their own invitations" on public.invitations;
create policy "Allow owner to delete their own invitations"
    on public.invitations for delete
    using (auth.uid() = user_id or auth.role() = 'service_role');

-- Orders Policies (Users can only view their own orders; only service role can create/update)
drop policy if exists "Allow owner to view their orders" on public.orders;
create policy "Allow owner to view their orders"
    on public.orders for select
    using (auth.uid() = user_id or auth.role() = 'service_role');

-- Payments Policies (Users can only view their own payments; only service role can create/update)
drop policy if exists "Allow owner to view their payments" on public.payments;
create policy "Allow owner to view their payments"
    on public.payments for select
    using (auth.uid() = user_id or auth.role() = 'service_role');

-- RSVPs Policies (Only owner can read private RSVP list; public guests can insert into published invites)
drop policy if exists "Allow anyone to submit an RSVP" on public.rsvps;
create policy "Allow anyone to submit an RSVP"
    on public.rsvps for insert
    with check (
        exists (
            select 1 from public.invitations i
            where (i.id = invitation_id or i.slug = invitation_slug)
              and i.status = 'published'
              and i.is_paid = true
              and i.deleted_at is null
        )
        or auth.role() = 'service_role'
    );

drop policy if exists "Allow invitation owner to view RSVPs" on public.rsvps;
create policy "Allow invitation owner to view RSVPs"
    on public.rsvps for select
    using (
        exists (
            select 1 from public.invitations i
            where (i.id = invitation_id or i.slug = invitation_slug)
              and (i.user_id = auth.uid() or auth.role() = 'service_role')
        )
    );

drop policy if exists "Allow invitation owner to delete RSVPs" on public.rsvps;
create policy "Allow invitation owner to delete RSVPs"
    on public.rsvps for delete
    using (
        exists (
            select 1 from public.invitations i
            where (i.id = invitation_id or i.slug = invitation_slug)
              and (i.user_id = auth.uid() or auth.role() = 'service_role')
        )
    );
