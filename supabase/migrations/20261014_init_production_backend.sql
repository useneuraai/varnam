-- =====================================================================================
-- VARNAM WEDDING INVITATIONS — PRODUCTION SUPABASE DATABASE SCHEMA
-- Exactly 5 Core Tables: profiles, invitations, orders, payments, rsvps (with wishes)
-- No database templates table (all template configs are code-based in @/lib/templates.ts)
-- =====================================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================================
-- 2. REUSABLE TRIGGER FUNCTIONS
-- =====================================================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Clean up any legacy or unused tables & constraints if present
drop table if exists public.wishes cascade;
drop table if exists public.webhook_events cascade;
alter table if exists public.invitations drop constraint if exists invitations_template_id_fkey;
alter table if exists public.invitations drop constraint if exists invitations_template_slug_fkey;
drop table if exists public.templates cascade;

-- =====================================================================================
-- TABLE 1: PROFILES (User accounts synced with auth.users)
-- =====================================================================================
create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    email varchar not null,
    display_name varchar,
    full_name varchar,
    avatar_url text,
    phone varchar,
    role varchar not null default 'customer',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist
alter table public.profiles add column if not exists email varchar;
alter table public.profiles add column if not exists display_name varchar;
alter table public.profiles add column if not exists full_name varchar;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone varchar;
alter table public.profiles add column if not exists role varchar not null default 'customer';
alter table public.profiles add column if not exists created_at timestamp with time zone default timezone('utc'::text, now());
alter table public.profiles add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Auto-sync from auth.users to public.profiles on signup/login
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, display_name, full_name, avatar_url, created_at, updated_at)
    values (
        new.id,
        coalesce(new.email, ''),
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(coalesce(new.email, ''), '@', 1)),
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    on conflict (id) do update set
        email = excluded.email,
        display_name = coalesce(nullif(excluded.display_name, ''), public.profiles.display_name),
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
        avatar_url = coalesce(nullif(excluded.avatar_url, ''), public.profiles.avatar_url),
        updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert or update of email, raw_user_meta_data on auth.users
    for each row execute function public.handle_new_user();

drop trigger if exists tr_profiles_updated_at on public.profiles;
create trigger tr_profiles_updated_at
    before update on public.profiles
    for each row execute function public.handle_updated_at();

-- =====================================================================================
-- TABLE 2: INVITATIONS (Customer projects, customizations, state machine)
-- =====================================================================================
create table if not exists public.invitations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete set null,
    template_slug varchar not null,
    title varchar,
    slug varchar unique not null,
    status varchar not null default 'draft', -- 'draft' | 'pending_payment' | 'paid' | 'published' | 'unpublished' | 'removed'
    content_json jsonb not null default '{}'::jsonb,
    template_version varchar default 'v1.0',
    revision integer not null default 1,
    is_paid boolean default false,
    payment_id varchar,
    order_id varchar,
    published_at timestamp with time zone,
    deleted_at timestamp with time zone,

    -- Relational fields for fast queries, filtering & template rendering
    bride_name varchar not null default '',
    groom_name varchar not null default '',
    wedding_date timestamp with time zone not null default timezone('utc'::text, now() + interval '90 days'),
    wedding_venue text not null default '',
    quote text,
    family_names text,
    rsvp_phone varchar,
    custom_message text,
    music_url text,
    bg_image_url text,
    slideshow_images text,
    dress_code text,
    transport_info text,
    scratch_enabled varchar default 'no',
    sangeet_enabled varchar default 'no',
    sangeet_date timestamp with time zone,
    sangeet_venue text,
    reception_date timestamp with time zone,
    reception_venue text,
    gmap_coordinates text,
    music_enabled varchar default 'yes',
    slideshow_enabled varchar default 'yes',
    dress_code_enabled varchar default 'yes',
    transport_enabled varchar default 'yes',
    custom_sections text,

    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist
alter table public.invitations add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.invitations add column if not exists template_slug varchar not null default 'rose-classic';
alter table public.invitations add column if not exists title varchar;
alter table public.invitations add column if not exists status varchar not null default 'draft';
alter table public.invitations add column if not exists content_json jsonb not null default '{}'::jsonb;
alter table public.invitations add column if not exists template_version varchar default 'v1.0';
alter table public.invitations add column if not exists revision integer not null default 1;
alter table public.invitations add column if not exists is_paid boolean default false;
alter table public.invitations add column if not exists payment_id varchar;
alter table public.invitations add column if not exists order_id varchar;
alter table public.invitations add column if not exists published_at timestamp with time zone;
alter table public.invitations add column if not exists deleted_at timestamp with time zone;
alter table public.invitations add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

drop trigger if exists tr_invitations_updated_at on public.invitations;
create trigger tr_invitations_updated_at
    before update on public.invitations
    for each row execute function public.handle_updated_at();

-- Indexes for performance & security
create index if not exists idx_invitations_user_id on public.invitations(user_id);
create index if not exists idx_invitations_slug on public.invitations(slug);
create index if not exists idx_invitations_status on public.invitations(status);
create index if not exists idx_invitations_is_paid on public.invitations(is_paid);
create index if not exists idx_invitations_created_at on public.invitations(created_at desc);

-- =====================================================================================
-- TABLE 3: ORDERS (Payment gateway checkout orders)
-- =====================================================================================
create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete set null,
    invitation_id uuid references public.invitations(id) on delete cascade,
    amount_inr numeric not null,
    currency varchar not null default 'INR',
    status varchar not null default 'created', -- 'created' | 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded'
    payment_provider varchar not null default 'razorpay',
    provider_order_id varchar unique not null,
    provider_payment_id varchar,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists tr_orders_updated_at on public.orders;
create trigger tr_orders_updated_at
    before update on public.orders
    for each row execute function public.handle_updated_at();

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_invitation_id on public.orders(invitation_id);
create index if not exists idx_orders_provider_order_id on public.orders(provider_order_id);
create index if not exists idx_orders_status on public.orders(status);

-- =====================================================================================
-- TABLE 4: PAYMENTS (Verified payment transaction audit records)
-- =====================================================================================
create table if not exists public.payments (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete set null,
    invitation_id uuid references public.invitations(id) on delete set null,
    invitation_slug varchar,
    user_id uuid references auth.users(id) on delete set null,
    provider varchar not null default 'razorpay',
    provider_order_id varchar not null,
    provider_payment_id varchar unique not null,
    provider_signature varchar,
    amount_inr numeric not null,
    currency varchar not null default 'INR',
    status varchar not null default 'captured',
    verified_at timestamp with time zone default timezone('utc'::text, now()),
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments add column if not exists order_id uuid references public.orders(id) on delete set null;
alter table public.payments add column if not exists provider varchar not null default 'razorpay';
alter table public.payments add column if not exists provider_signature varchar;
alter table public.payments add column if not exists amount_inr numeric;
alter table public.payments add column if not exists verified_at timestamp with time zone;
alter table public.payments add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

drop trigger if exists tr_payments_updated_at on public.payments;
create trigger tr_payments_updated_at
    before update on public.payments
    for each row execute function public.handle_updated_at();

create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_payments_invitation_id on public.payments(invitation_id);
create index if not exists idx_payments_provider_order_id on public.payments(provider_order_id);
create index if not exists idx_payments_provider_payment_id on public.payments(provider_payment_id);
create index if not exists idx_payments_created_at on public.payments(created_at desc);

-- =====================================================================================
-- TABLE 5: RSVPS (Guest responses WITH guest wishes / blessings included)
-- =====================================================================================
create table if not exists public.rsvps (
    id uuid default uuid_generate_v4() primary key,
    invitation_id uuid references public.invitations(id) on delete cascade,
    invitation_slug varchar not null references public.invitations(slug) on delete cascade,
    guest_name varchar not null,
    guest_contact varchar,
    attendance_status varchar not null default 'attending', -- 'attending' | 'not_attending' | 'undecided'
    guest_count integer not null default 1,
    wishes text, -- Guest wedding wishes & blessings message stored directly in rsvps!
    message text, -- Backwards compatibility alias
    dietary_preferences text,
    ip_address varchar,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist
alter table public.rsvps add column if not exists guest_contact varchar;
alter table public.rsvps add column if not exists attendance_status varchar not null default 'attending';
alter table public.rsvps add column if not exists wishes text;
alter table public.rsvps add column if not exists message text;
alter table public.rsvps add column if not exists dietary_preferences text;
alter table public.rsvps add column if not exists ip_address varchar;
alter table public.rsvps add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

drop trigger if exists tr_rsvps_updated_at on public.rsvps;
create trigger tr_rsvps_updated_at
    before update on public.rsvps
    for each row execute function public.handle_updated_at();

create index if not exists idx_rsvps_invitation_slug on public.rsvps(invitation_slug);
create index if not exists idx_rsvps_invitation_id on public.rsvps(invitation_id);
create index if not exists idx_rsvps_created_at on public.rsvps(created_at desc);

-- =====================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR THE 5 TABLES
-- =====================================================================================

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.rsvps enable row level security;

-- 1. Profiles Policies
drop policy if exists "Allow users to read their own profile" on public.profiles;
create policy "Allow users to read their own profile"
    on public.profiles for select
    using (auth.uid() = id or auth.role() = 'service_role');

drop policy if exists "Allow users to update their own profile" on public.profiles;
create policy "Allow users to update their own profile"
    on public.profiles for update
    using (auth.uid() = id or auth.role() = 'service_role');

drop policy if exists "Allow service role full access to profiles" on public.profiles;
create policy "Allow service role full access to profiles"
    on public.profiles for all
    using (auth.role() = 'service_role');

-- 2. Invitations Policies
-- Public can ONLY view published, paid, non-deleted invitations
drop policy if exists "Allow public to view published invitations" on public.invitations;
create policy "Allow public to view published invitations"
    on public.invitations for select
    using (
        (status = 'published' and is_paid = true and deleted_at is null)
        or auth.uid() = user_id
        or auth.role() = 'service_role'
    );

-- Authenticated owner can create invitations
drop policy if exists "Allow authenticated users to create invitations" on public.invitations;
create policy "Allow authenticated users to create invitations"
    on public.invitations for insert
    with check (auth.uid() = user_id or auth.role() = 'service_role');

-- Authenticated owner can update their invitations
drop policy if exists "Allow owner to update their own invitations" on public.invitations;
create policy "Allow owner to update their own invitations"
    on public.invitations for update
    using (auth.uid() = user_id or auth.role() = 'service_role')
    with check (auth.uid() = user_id or auth.role() = 'service_role');

-- Authenticated owner can delete their invitations
drop policy if exists "Allow owner to delete their own invitations" on public.invitations;
create policy "Allow owner to delete their own invitations"
    on public.invitations for delete
    using (auth.uid() = user_id or auth.role() = 'service_role');

-- 3. Orders Policies
drop policy if exists "Allow owner to view their orders" on public.orders;
create policy "Allow owner to view their orders"
    on public.orders for select
    using (auth.uid() = user_id or auth.role() = 'service_role');

drop policy if exists "Allow service role full access to orders" on public.orders;
create policy "Allow service role full access to orders"
    on public.orders for all
    using (auth.role() = 'service_role');

-- 4. Payments Policies
drop policy if exists "Allow owner to view their payments" on public.payments;
create policy "Allow owner to view their payments"
    on public.payments for select
    using (auth.uid() = user_id or auth.role() = 'service_role');

drop policy if exists "Allow service role full access to payments" on public.payments;
create policy "Allow service role full access to payments"
    on public.payments for all
    using (auth.role() = 'service_role');

-- 5. RSVPs Policies
-- Guests can submit RSVP to published invitations
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

-- Only invitation owner can view private guest RSVPs
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

-- Only invitation owner can delete RSVPs
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

-- Service role full access
drop policy if exists "Allow service role full access to rsvps" on public.rsvps;
create policy "Allow service role full access to rsvps"
    on public.rsvps for all
    using (auth.role() = 'service_role');

-- =====================================================================================
-- 6. STORAGE BUCKET CONFIGURATION
-- =====================================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'invitation-assets',
    'invitation-assets',
    true,
    5242880, -- 5 MB limit
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'audio/mpeg', 'audio/mp3', 'audio/wav']
)
on conflict (id) do update set
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'audio/mpeg', 'audio/mp3', 'audio/wav'];

-- Storage RLS
drop policy if exists "Allow authenticated uploads to invitation-assets" on storage.objects;
create policy "Allow authenticated uploads to invitation-assets"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'invitation-assets');

drop policy if exists "Allow public read of invitation-assets" on storage.objects;
create policy "Allow public read of invitation-assets"
    on storage.objects for select
    using (bucket_id = 'invitation-assets');

drop policy if exists "Allow users to delete their own uploaded assets" on storage.objects;
create policy "Allow users to delete their own uploaded assets"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'invitation-assets' and auth.uid()::text = (storage.foldername(name))[1]);
