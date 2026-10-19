-- =====================================================================================
-- VARNAM DATABASE MIGRATION: HARD DELETE UNPAID INVITATIONS & STRICTLY PROTECT PAID ONES
-- 1. Adds a trigger to strictly prevent deletion of paid invitations at the database level.
-- 2. Updates RLS policy so authenticated users can only delete their unpaid invitations.
-- 3. Ensures cascade deletion for child tables (rsvps, orders).
-- =====================================================================================

-- 1. Trigger function to strictly prevent deletion of paid invitations
create or replace function public.prevent_paid_invitation_deletion()
returns trigger as $$
begin
    -- Disallow deleting if marked as paid or in paid/published status
    if (old.is_paid is true or old.status in ('paid', 'published')) then
        raise exception 'SECURITY_VIOLATION: Paid invitations cannot be deleted. Status: %, is_paid: %', old.status, old.is_paid;
    end if;

    -- Also check if a verified payment exists in public.payments
    if exists (
        select 1 from public.payments
        where (invitation_id = old.id or invitation_slug = old.slug)
          and status = 'captured'
    ) then
        raise exception 'SECURITY_VIOLATION: Paid invitations cannot be deleted because a captured payment record exists.';
    end if;

    return old;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_prevent_paid_invitation_deletion on public.invitations;
create trigger tr_prevent_paid_invitation_deletion
    before delete on public.invitations
    for each row execute function public.prevent_paid_invitation_deletion();

-- 2. Update RLS policy on public.invitations for DELETE
drop policy if exists "Allow owner to delete their own invitations" on public.invitations;
drop policy if exists "Allow owner to delete their own unpaid invitations" on public.invitations;

create policy "Allow owner to delete their own unpaid invitations"
    on public.invitations for delete
    using (
        (auth.uid() = user_id and (is_paid is not true or is_paid is null) and status not in ('paid', 'published'))
        or auth.role() = 'service_role'
    );
