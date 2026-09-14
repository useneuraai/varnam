-- =====================================================================================
-- VARNAM WEDDING PLATFORM - PRODUCTION-READY SUPABASE DATABASE SCHEMA
-- Fully relational, idempotent, secured with Row Level Security (RLS) & Triggers
-- =====================================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================================
-- 2. REUSABLE TRIGGER FUNCTIONS
-- =====================================================================================

-- Auto-update updated_at timestamp column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- =====================================================================================
-- 3. PROFILES TABLE (USER ACCOUNTS & PROFILES)
-- =====================================================================================
create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    email varchar not null,
    full_name varchar,
    avatar_url text,
    phone varchar,
    role varchar not null default 'customer',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist if table was already present
alter table public.profiles add column if not exists email varchar;
alter table public.profiles add column if not exists full_name varchar;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone varchar;
alter table public.profiles add column if not exists role varchar not null default 'customer';
alter table public.profiles add column if not exists created_at timestamp with time zone default timezone('utc'::text, now());
alter table public.profiles add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Auto-sync from auth.users to public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
    values (
        new.id,
        coalesce(new.email, ''),
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    on conflict (id) do update set
        email = excluded.email,
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

-- Trigger for profiles updated_at
drop trigger if exists tr_profiles_updated_at on public.profiles;
create trigger tr_profiles_updated_at
    before update on public.profiles
    for each row execute function public.handle_updated_at();

-- Backfill any existing users from auth.users into public.profiles
insert into public.profiles (id, email, full_name, avatar_url)
select 
    id, 
    coalesce(email, ''), 
    coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
    coalesce(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', '')
from auth.users
on conflict (id) do nothing;

-- =====================================================================================
-- 4. TEMPLATES TABLE
-- =====================================================================================
create table if not exists public.templates (
    id uuid default uuid_generate_v4() primary key,
    slug varchar unique not null,
    name varchar not null,
    description text,
    category varchar not null,
    religion varchar not null,
    language varchar not null default 'English',
    price numeric not null default 799.00,
    thumbnail_url text,
    preview_music_url text,
    config jsonb not null default '{}'::jsonb,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure updated_at column exists on templates
alter table public.templates add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

drop trigger if exists tr_templates_updated_at on public.templates;
create trigger tr_templates_updated_at
    before update on public.templates
    for each row execute function public.handle_updated_at();

-- Indexes on templates
create index if not exists idx_templates_slug on public.templates(slug);
create index if not exists idx_templates_category on public.templates(category);
create index if not exists idx_templates_is_active on public.templates(is_active);

-- =====================================================================================
-- 5. INVITATIONS TABLE
-- =====================================================================================
create table if not exists public.invitations (
    id uuid default uuid_generate_v4() primary key,
    template_slug varchar not null references public.templates(slug) on delete restrict,
    user_id uuid references auth.users(id) on delete set null,
    slug varchar unique not null,
    bride_name varchar not null,
    groom_name varchar not null,
    wedding_date timestamp with time zone not null,
    wedding_venue text not null,
    quote text,
    family_names text,
    rsvp_phone varchar,
    custom_message text,
    music_url text,
    is_paid boolean default false,
    payment_id varchar,
    order_id varchar,
    
    -- Licensed Event Features
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
    
    -- Toggle Options & Custom Sections
    music_enabled varchar default 'yes',
    slideshow_enabled varchar default 'yes',
    dress_code_enabled varchar default 'yes',
    transport_enabled varchar default 'yes',
    custom_sections text,

    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist for existing installations
alter table public.invitations add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.invitations add column if not exists quote text;
alter table public.invitations add column if not exists family_names text;
alter table public.invitations add column if not exists rsvp_phone varchar;
alter table public.invitations add column if not exists custom_message text;
alter table public.invitations add column if not exists music_url text;
alter table public.invitations add column if not exists is_paid boolean default false;
alter table public.invitations add column if not exists payment_id varchar;
alter table public.invitations add column if not exists order_id varchar;
alter table public.invitations add column if not exists bg_image_url text;
alter table public.invitations add column if not exists slideshow_images text;
alter table public.invitations add column if not exists dress_code text;
alter table public.invitations add column if not exists transport_info text;
alter table public.invitations add column if not exists scratch_enabled varchar default 'no';
alter table public.invitations add column if not exists sangeet_enabled varchar default 'no';
alter table public.invitations add column if not exists sangeet_date timestamp with time zone;
alter table public.invitations add column if not exists sangeet_venue text;
alter table public.invitations add column if not exists reception_date timestamp with time zone;
alter table public.invitations add column if not exists reception_venue text;
alter table public.invitations add column if not exists gmap_coordinates text;
alter table public.invitations add column if not exists music_enabled varchar default 'yes';
alter table public.invitations add column if not exists slideshow_enabled varchar default 'yes';
alter table public.invitations add column if not exists dress_code_enabled varchar default 'yes';
alter table public.invitations add column if not exists transport_enabled varchar default 'yes';
alter table public.invitations add column if not exists custom_sections text;
alter table public.invitations add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Trigger for invitations updated_at
drop trigger if exists tr_invitations_updated_at on public.invitations;
create trigger tr_invitations_updated_at
    before update on public.invitations
    for each row execute function public.handle_updated_at();

-- Indexes for performance
create index if not exists idx_invitations_user_id on public.invitations(user_id);
create index if not exists idx_invitations_slug on public.invitations(slug);
create index if not exists idx_invitations_wedding_date on public.invitations(wedding_date);
create index if not exists idx_invitations_created_at on public.invitations(created_at desc);

-- =====================================================================================
-- 6. PAYMENTS TABLE (TRANSACTIONS & AUDIT LOGS)
-- =====================================================================================
create table if not exists public.payments (
    id uuid default uuid_generate_v4() primary key,
    invitation_id uuid references public.invitations(id) on delete set null,
    invitation_slug varchar,
    user_id uuid references auth.users(id) on delete set null,
    razorpay_order_id varchar not null,
    razorpay_payment_id varchar,
    razorpay_signature varchar,
    amount numeric not null,
    currency varchar not null default 'INR',
    status varchar not null default 'captured',
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist for existing databases
alter table public.payments add column if not exists invitation_slug varchar;
alter table public.payments add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.payments add column if not exists currency varchar not null default 'INR';
alter table public.payments add column if not exists status varchar not null default 'captured';
alter table public.payments add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.payments add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Trigger for payments updated_at
drop trigger if exists tr_payments_updated_at on public.payments;
create trigger tr_payments_updated_at
    before update on public.payments
    for each row execute function public.handle_updated_at();

-- Indexes on payments
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_payments_invitation_id on public.payments(invitation_id);
create index if not exists idx_payments_razorpay_order_id on public.payments(razorpay_order_id);
create index if not exists idx_payments_razorpay_payment_id on public.payments(razorpay_payment_id);
create index if not exists idx_payments_created_at on public.payments(created_at desc);

-- =====================================================================================
-- 7. RSVPS & GUEST WISHES TABLE
-- =====================================================================================
create table if not exists public.rsvps (
    id uuid default uuid_generate_v4() primary key,
    invitation_id uuid references public.invitations(id) on delete cascade,
    invitation_slug varchar not null references public.invitations(slug) on delete cascade,
    name varchar not null,
    email varchar,
    phone varchar,
    attendance varchar not null, -- 'yes' | 'no'
    guest_count integer not null default 1,
    dietary_preferences text,
    wishes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist for existing databases
alter table public.rsvps add column if not exists invitation_id uuid references public.invitations(id) on delete cascade;
alter table public.rsvps add column if not exists email varchar;
alter table public.rsvps add column if not exists phone varchar;
alter table public.rsvps add column if not exists dietary_preferences text;

-- Indexes on RSVPs
create index if not exists idx_rsvps_invitation_slug on public.rsvps(invitation_slug);
create index if not exists idx_rsvps_invitation_id on public.rsvps(invitation_id);
create index if not exists idx_rsvps_created_at on public.rsvps(created_at desc);

-- =====================================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================================

alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.invitations enable row level security;
alter table public.payments enable row level security;
alter table public.rsvps enable row level security;

-- -------------------------------------------------------------------------------------
-- Policies for Profiles
-- -------------------------------------------------------------------------------------
drop policy if exists "Allow users to read their own profile" on public.profiles;
create policy "Allow users to read their own profile"
    on public.profiles for select
    using (auth.uid() = id);

drop policy if exists "Allow users to update their own profile" on public.profiles;
create policy "Allow users to update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

drop policy if exists "Allow service role full access to profiles" on public.profiles;
create policy "Allow service role full access to profiles"
    on public.profiles for all
    using (auth.role() = 'service_role');

-- -------------------------------------------------------------------------------------
-- Policies for Templates
-- -------------------------------------------------------------------------------------
drop policy if exists "Allow public read-only access to active templates" on public.templates;
create policy "Allow public read-only access to active templates"
    on public.templates for select
    using (is_active = true or auth.role() = 'service_role');

drop policy if exists "Allow service role full access to templates" on public.templates;
create policy "Allow service role full access to templates"
    on public.templates for all
    using (auth.role() = 'service_role');

-- -------------------------------------------------------------------------------------
-- Policies for Invitations
-- -------------------------------------------------------------------------------------
-- Anyone can view paid invitations via their unique link, or authenticated owners can view their drafts
drop policy if exists "Allow public read access to paid invitations and owners" on public.invitations;
create policy "Allow public read access to paid invitations and owners"
    on public.invitations for select
    using (is_paid = true or auth.uid() = user_id or auth.role() = 'service_role');

-- Anyone can insert invitations (guests start draft, or signed-in users save to their account)
drop policy if exists "Allow anyone to insert invitations" on public.invitations;
create policy "Allow anyone to insert invitations"
    on public.invitations for insert
    with check (true);

-- Only owner or service role can update invitations
drop policy if exists "Allow update to owner of invitations" on public.invitations;
create policy "Allow update to owner of invitations"
    on public.invitations for update
    using (auth.uid() = user_id or auth.role() = 'service_role');

-- Only owner or service role can delete invitations
drop policy if exists "Allow delete to owner of invitations" on public.invitations;
create policy "Allow delete to owner of invitations"
    on public.invitations for delete
    using (auth.uid() = user_id or auth.role() = 'service_role');

-- -------------------------------------------------------------------------------------
-- Policies for Payments
-- -------------------------------------------------------------------------------------
-- Owner or service role can read payment records
drop policy if exists "Allow users to read their own payments" on public.payments;
create policy "Allow users to read their own payments"
    on public.payments for select
    using (
        auth.uid() = user_id
        or auth.role() = 'service_role'
        or exists (
            select 1 from public.invitations 
            where invitations.id = payments.invitation_id 
            and invitations.user_id = auth.uid()
        )
    );

drop policy if exists "Allow insert on payments" on public.payments;
create policy "Allow insert on payments"
    on public.payments for insert
    with check (true);

drop policy if exists "Allow service role full access to payments" on public.payments;
create policy "Allow service role full access to payments"
    on public.payments for all
    using (auth.role() = 'service_role');

-- -------------------------------------------------------------------------------------
-- Policies for RSVPs
-- -------------------------------------------------------------------------------------
-- Anyone can submit RSVP
drop policy if exists "Allow anyone to submit RSVP" on public.rsvps;
create policy "Allow anyone to submit RSVP"
    on public.rsvps for insert
    with check (true);

-- Public can view guest wishes and couple/host can view all RSVPs
drop policy if exists "Allow reading RSVPs" on public.rsvps;
create policy "Allow reading RSVPs"
    on public.rsvps for select
    using (
        true
    );

drop policy if exists "Allow service role full access to RSVPs" on public.rsvps;
create policy "Allow service role full access to RSVPs"
    on public.rsvps for all
    using (auth.role() = 'service_role');

-- =====================================================================================
-- 9. SEED ALL 9 PRODUCTION TEMPLATES
-- =====================================================================================

insert into public.templates (slug, name, description, category, religion, language, price, thumbnail_url, preview_music_url, config, is_active)
values
(
    'thiruvizha',
    'THIRUVIZHA — Grand Traditional Tamil 🛕',
    'A grand Tamil wedding ceremony inside a sacred temple and mantapam. Dark maroon, subtle temple stone texture, carved pillars, antique gold typography, thoranam, banana leaves, and sacred Tamil chants.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    '/images/couples/thiruvizha.jpg',
    'https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Kavya", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Arun", "required": true},
            {"id": "wedding_date", "label": "Muhurtham Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Temple Mandapam Venue", "type": "textarea", "placeholder": "Sri Brihadeeswarar Temple Kalyana Mandapam, Thanjavur", "required": true},
            {"id": "quote", "label": "Sacred Invocation", "type": "text", "placeholder": "மங்கள நாண் பூட்டி, ஏழு அடி எடுத்து வைத்து, இல்லறம் தொடங்கும் இனிய தருணம்.", "required": false},
            {"id": "family_names", "label": "Inviting Families", "type": "text", "placeholder": "The Ramanathan and Sundaresan Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Desk", "type": "text", "placeholder": "+91 98765 43210", "required": true},
            {"id": "custom_message", "label": "Ceremonial Blessing Note", "type": "textarea", "placeholder": "We seek your gracious presence, prayers, and heartfelt blessings for our sacred union.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'manamagan',
    'MANAMAGAN — Soft Jasmine Wedding 🌸',
    'Two people, one love story. Soft, romantic, emotional, and dreamy. Warm ivory canvas, photographic couple hero, realistic cascading Madurai jasmine vines, delicate blush accents, and editorial photo flow.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    '/images/couples/manamagan.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Nila", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Karthik", "required": true},
            {"id": "wedding_date", "label": "Wedding Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "The Leela Palace Seaside Lawns, Adyar, Chennai", "required": true},
            {"id": "quote", "label": "Love Story Note", "type": "text", "placeholder": "A beautiful beginning to forever. Like fresh jasmine at dawn, our love unfolds.", "required": false},
            {"id": "family_names", "label": "Parents & Families", "type": "text", "placeholder": "The Krishnan and Raghavan Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Direct", "type": "text", "placeholder": "+91 90000 54321", "required": true},
            {"id": "custom_message", "label": "Personal Invitation", "type": "textarea", "placeholder": "Join us under the blooming jasmine canopy as we exchange our forever vows.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'mangalam',
    'MANGALAM — Temple Luxury 👑',
    'The ₹999+ royal luxury experience. Dramatic dark charcoal and near-black backdrop, controlled real antique gold architectural details, interactive opening temple doors on scroll, and four ceremonial chapters.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    999.00,
    '/images/couples/mangalam.jpg',
    'https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Dhanya", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Arjun", "required": true},
            {"id": "wedding_date", "label": "Muhurtham Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Temple Mandapam Venue", "type": "textarea", "placeholder": "Grand Temple Sanctum Mandapam, Madurai", "required": true},
            {"id": "quote", "label": "Sacred Mantra", "type": "text", "placeholder": "With the divine blessings of Lord Shiva & Parvati, we embark upon our sacred journey.", "required": false},
            {"id": "family_names", "label": "Royal Lineages of", "type": "text", "placeholder": "The Natarajan and Viswanathan Dynasties", "required": false},
            {"id": "rsvp_phone", "label": "Ceremonial RSVP", "type": "text", "placeholder": "+91 99000 88888", "required": true},
            {"id": "custom_message", "label": "Solemn Proclamation", "type": "textarea", "placeholder": "We request the honor of your auspicious presence at our holy wedding ceremonies.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'vizha',
    'VIZHA — Colourful Tamil Wedding 🌼',
    'Joyful, festive, young, and energetic Tamil wedding celebration. Warm cream canvas accented with marigold garlands, self-drawing Kolam vectors, turmeric yellow, parrot green, and rani pink silk.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    '/images/couples/vizha.jpg',
    'https://archive.org/download/r-12356661-1632393571-2601/04.%20Kajri%20-%20Dadra%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Harini", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Vishnu", "required": true},
            {"id": "wedding_date", "label": "Muhurtham Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Kalyana Mandapam Venue", "type": "textarea", "placeholder": "Mayor Ramanathan Chettiar Kalyana Mandapam, Chennai", "required": true},
            {"id": "quote", "label": "Festive Tagline", "type": "text", "placeholder": "கல்யாண வைபவம்! Two families celebrate joy, laughter, and lifelong love.", "required": false},
            {"id": "family_names", "label": "Welcoming Families", "type": "text", "placeholder": "The Alagappan and Chettiar Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Contact", "type": "text", "placeholder": "+91 98765 43211", "required": true},
            {"id": "custom_message", "label": "Celebration Welcome", "type": "textarea", "placeholder": "Come celebrate with food, music, dance, and unconditional joy!", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'kadhal',
    'KADHAL — Modern Tamil Editorial 🖤',
    'Awwwards website × Vogue wedding editorial × Tamil culture. Minimal, artistic, young, sophisticated. Chalk ivory canvas, stark black typography, vermilion accents, full-screen zoom, and fashion layouts.',
    'Tamil Wedding',
    'Secular',
    'English/Tamil',
    799.00,
    '/images/couples/kadhal.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/3d/Debussy_-_Clair_de_Lune.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Meera", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Adithya", "required": true},
            {"id": "wedding_date", "label": "Celebration Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Editorial Venue", "type": "textarea", "placeholder": "The Glass House Pavilion, Bangalore", "required": true},
            {"id": "quote", "label": "Editorial Poem", "type": "text", "placeholder": "இணையும் இரு இதயங்கள். A modern chapter begins.", "required": false},
            {"id": "family_names", "label": "Hosts", "type": "text", "placeholder": "The Sen and Ramanathan Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Direct", "type": "text", "placeholder": "+91 99887 76655", "required": true},
            {"id": "custom_message", "label": "Curated Note", "type": "textarea", "placeholder": "An intimate evening of contemporary love, art, music, and quiet luxury.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'thanjavur-heritage',
    'Thanjavur Heritage 🪷',
    'A royal, classical Tamil aesthetic inspired by 16th-century Thanjavur art and traditional South Indian culture. Deep burgundy, muted crimson, antique gold leaf, gem-studded ornamental frames, sacred invocations, and ceremonial typography.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    '/images/couples/thanjavur-heritage.jpg',
    'https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Arundhati Devi", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Sundaram Varma", "required": true},
            {"id": "wedding_date", "label": "Muhurtham Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "Brihadeeswara Royal Mandapam, Thanjavur", "required": true},
            {"id": "quote", "label": "Sacred Invocation", "type": "text", "placeholder": "Under the golden grace of the Almighty, two sacred lineages unite in eternal devotion.", "required": false},
            {"id": "family_names", "label": "Welcoming Royal Houses", "type": "text", "placeholder": "The Royal Dynasties of Thanjavur & Pudukkottai", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Desk", "type": "text", "placeholder": "+91 98765 43210", "required": true},
            {"id": "custom_message", "label": "Ceremonial Proclamation", "type": "textarea", "placeholder": "We request the honor of your gracious presence and divine blessings for the auspicious wedding.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'chettinad-vintage',
    'Chettinad Vintage 🏛️',
    'A heritage-luxury aesthetic inspired by Chettinad architecture and interiors. Terracotta, burnt brown, cream, muted mustard, Athangudi tile geometry, carved teak doors, and vintage textured paper.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    '/images/couples/chettinad-vintage.jpg',
    'https://archive.org/download/r-12356661-1632393571-2601/04.%20Kajri%20-%20Dadra%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Meenakshi Achi", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Chidambaram Chettiar", "required": true},
            {"id": "wedding_date", "label": "Muhurtham Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "Saratha Vilas Heritage Mansion, Kadiapatti, Chettinad", "required": true},
            {"id": "quote", "label": "Heritage Blessing", "type": "text", "placeholder": "In the timeless courtyards of our ancestors, our heritage becomes our future.", "required": false},
            {"id": "family_names", "label": "Welcoming Families", "type": "text", "placeholder": "The Chettiar and Alagappa Dynasties", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Contact", "type": "text", "placeholder": "+91 98765 43211", "required": true},
            {"id": "custom_message", "label": "Invitation Message", "type": "textarea", "placeholder": "Step into our family palace and celebrate this cherished heritage union.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'jasmine-romance',
    'Jasmine Romance 🌸',
    'A soft, poetic South Indian wedding aesthetic centered around the feeling of fresh jasmine flowers and a beautiful evening wedding. Ivory, pearl white, soft blush, champagne, delicate cascading jasmine garlands, and romantic calligraphy.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    '/images/couples/jasmine-romance.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Ananya", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Aditya", "required": true},
            {"id": "wedding_date", "label": "Wedding Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "The Leela Palace Seaside Lawns, Adyar, Chennai", "required": true},
            {"id": "quote", "label": "Love Poem", "type": "text", "placeholder": "Like the sweet morning fragrance of fresh Madurai jasmine, our love unfolds forever.", "required": false},
            {"id": "family_names", "label": "Parents & Families", "type": "text", "placeholder": "The Krishnan and Raghavan Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Desk", "type": "text", "placeholder": "+91 90000 54321", "required": true},
            {"id": "custom_message", "label": "Personal Note", "type": "textarea", "placeholder": "Join us beneath the blooming jasmine arches as we exchange our forever vows.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'temple-grandeur',
    'Temple Grandeur 🛕',
    'A dramatic, luxurious temple-wedding aesthetic. Deep vermilion, dark maroon, aged bronze, genuine gold leaf, and rich emerald. Monolithic carved stone pillar arches, gopuram silhouettes, and majestic sacred symmetry.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    '/images/couples/temple-grandeur.jpg',
    'https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Samyuktha", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Vijay Karthik", "required": true},
            {"id": "wedding_date", "label": "Muhurtham Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "Meenakshi Sundareswarar Temple Mandapam, Madurai", "required": true},
            {"id": "quote", "label": "Sacred Chants", "type": "text", "placeholder": "Surrounded by sacred temple bells and timeless granite stone, we take our seven sacred steps.", "required": false},
            {"id": "family_names", "label": "Invited by", "type": "text", "placeholder": "The Natarajan and Viswanathan Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Registry", "type": "text", "placeholder": "+91 99000 88888", "required": true},
            {"id": "custom_message", "label": "Sacred Invitation", "type": "textarea", "placeholder": "With heartfelt devotion and joyous celebration, we seek your presence and blessings.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'modern-tamil-minimal',
    'Modern Tamil Minimal ✨',
    'A high-end contemporary wedding editorial subtly incorporating Tamil culture. Clean ivory canvas, strong black typography, lots of negative space, delicate hairline Kolam geometry, and smooth cinematic reveals.',
    'Tamil Wedding',
    'Secular',
    'English/Tamil',
    799.00,
    '/images/couples/modern-tamil-minimal.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/3d/Debussy_-_Clair_de_Lune.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Maya", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Dev", "required": true},
            {"id": "wedding_date", "label": "Celebration Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "The Glass House Pavilion, Bangalore", "required": true},
            {"id": "quote", "label": "Editorial Verse", "type": "text", "placeholder": "Rooted in tradition, walking forward together into the modern world.", "required": false},
            {"id": "family_names", "label": "Hosts", "type": "text", "placeholder": "The Sen and Ramanathan Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Direct", "type": "text", "placeholder": "+91 99887 76655", "required": true},
            {"id": "custom_message", "label": "Celebration Note", "type": "textarea", "placeholder": "An intimate evening of love, culture, music, and quiet modern luxury.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'temple-gold',
    'Temple Gold ✨',
    'A traditional Tamil wedding template with divine temple aesthetics. Featuring floating brass lamps, temple entrance drawing animations, stone plaque engraving, and Lord Ganesha''s blessings.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=600',
    'https://archive.org/download/r-12356661-1632393571-2601/04.%20Kajri%20-%20Dadra%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Aishwarya", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Karthik", "required": true},
            {"id": "wedding_date", "label": "Wedding Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "Leela Palace, Chennai", "required": true},
            {"id": "quote", "label": "Sacred Wedding Quote", "type": "text", "placeholder": "With the blessings of Lord Ganesha, together we begin a lifetime of love.", "required": false},
            {"id": "family_names", "label": "Welcoming Family Names", "type": "text", "placeholder": "Mr. & Mrs. Sundaram and Family", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Contact Number", "type": "text", "placeholder": "+91 98765 43210", "required": true},
            {"id": "custom_message", "label": "Blessings Message", "type": "textarea", "placeholder": "Please join us to bless the couple.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'traditional-red',
    'Traditional Red ❤️',
    'Classic South Indian wedding invitation. Deep red silk texture backgrounds, self-drawing Kolams, falling jasmine flowers, gold border animations, and traditional nadaswaram notes.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    'https://archive.org/download/r-12356661-1632393571-2601/04.%20Kajri%20-%20Dadra%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Devi", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Suresh", "required": true},
            {"id": "wedding_date", "label": "Wedding Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "Mayor Ramanathan Hall, Chennai", "required": true},
            {"id": "quote", "label": "Wedding Quote", "type": "text", "placeholder": "Joined in love, walking together in harmony.", "required": false},
            {"id": "family_names", "label": "Inviting Families", "type": "text", "placeholder": "The Ramanathan and Krishnan Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Contact", "type": "text", "placeholder": "+91 98765 43211", "required": true},
            {"id": "custom_message", "label": "Greeting Wording", "type": "textarea", "placeholder": "Your presence is our greatest blessing.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'floral-luxury',
    'Floral Luxury 🌸',
    'An elegant luxury destination wedding template. Champagne gold and blush pink tones, blooming floral arrangements, piano soundscapes, and floating rose petals.',
    'Luxury Wedding',
    'Secular',
    'English',
    799.00,
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Zara", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Kabir", "required": true},
            {"id": "wedding_date", "label": "Wedding Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "Grand Hyatt Resort, Goa", "required": true},
            {"id": "quote", "label": "Love Quote", "type": "text", "placeholder": "Love is a friendship set to music.", "required": false},
            {"id": "family_names", "label": "Parents", "type": "text", "placeholder": "Kapoor and Mehta Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Desk", "type": "text", "placeholder": "+91 90000 54321", "required": true},
            {"id": "custom_message", "label": "Invite Wording", "type": "textarea", "placeholder": "Please join us in paradise as we say our vows.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'modern-minimal',
    'Modern Minimal ⚪',
    'A contemporary clean-cut wedding website. Matte white, charcoal black, and beige colors with editorial motion typography and cinematic page transitions.',
    'Modern Wedding',
    'Secular',
    'English',
    799.00,
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600',
    'https://upload.wikimedia.org/wikipedia/commons/3/3d/Debussy_-_Clair_de_Lune.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Riya", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Varun", "required": true},
            {"id": "wedding_date", "label": "Wedding Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "The Glass House, Bangalore", "required": true},
            {"id": "quote", "label": "Simple Verse", "type": "text", "placeholder": "Today, tomorrow, always.", "required": false},
            {"id": "family_names", "label": "Hosts", "type": "text", "placeholder": "Sharma and Verma Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Direct", "type": "text", "placeholder": "+91 99887 76655", "required": true},
            {"id": "custom_message", "label": "Message", "type": "textarea", "placeholder": "Share our special day with us.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'royal-heritage',
    'Royal Heritage 👑',
    'Palace-inspired luxury Tamil wedding theme. Featuring opening palace doors, royal crests, unfolding royal scroll itineraries, sparkling chandeliers, and a fireworks grand finale.',
    'Royal Wedding',
    'Secular',
    'English',
    799.00,
    'https://images.unsplash.com/photo-1618005198143-e528346d9a59?auto=format&fit=crop&q=80&w=600',
    'https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Arundhati", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Vikram", "required": true},
            {"id": "wedding_date", "label": "Wedding Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "Amba Vilas Palace, Mysore", "required": true},
            {"id": "quote", "label": "Royal Blessing", "type": "text", "placeholder": "By royal invitation, we welcome you to witness our sacred union.", "required": false},
            {"id": "family_names", "label": "Royal Houses of", "type": "text", "placeholder": "The Varma and Dev Dynasties", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Registry", "type": "text", "placeholder": "+91 99000 88888", "required": true},
            {"id": "custom_message", "label": "Proclamation", "type": "textarea", "placeholder": "Honour us with your presence on this auspicious royal celebration.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'royal-tamil',
    'Royal Tamil Heritage',
    'A majestic template reflecting traditional Tamil aesthetics. Features glowing temple mandapas, floating jasmine petals, golden animations, and a soulful flutist theme.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    799.00,
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=600',
    'https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Aishwarya", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Karthik", "required": true},
            {"id": "wedding_date", "label": "Wedding Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Wedding Venue", "type": "textarea", "placeholder": "Leela Palace, Chennai", "required": true},
            {"id": "quote", "label": "Sacred Wedding Quote", "type": "text", "placeholder": "Together we begin a lifetime of love and harmony.", "required": false},
            {"id": "family_names", "label": "Welcoming Family Names", "type": "text", "placeholder": "Mr. & Mrs. Sundaram and Family", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Contact Number", "type": "text", "placeholder": "+91 98765 43210", "required": true},
            {"id": "custom_message", "label": "Blessings Message", "type": "textarea", "placeholder": "Please join us to bless the couple.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'elegant-muslim',
    'Elegant Islamic Nikaah',
    'A stunning Nikaah template using royal emerald green and glistening gold. Features Islamic calligraphy, geometric mandalas, glowing crescent animations, and Sufi backdrop.',
    'Muslim Wedding',
    'Muslim',
    'English/Urdu',
    799.00,
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    'https://upload.wikimedia.org/wikipedia/commons/3/3d/Debussy_-_Clair_de_Lune.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Zara", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Faisal", "required": true},
            {"id": "wedding_date", "label": "Nikaah Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Nikaah & Reception Venue", "type": "textarea", "placeholder": "Taj Coromandel, Chennai", "required": true},
            {"id": "quote", "label": "Quranic Quote", "type": "text", "placeholder": "And We created you in pairs. (Quran 78:8)", "required": false},
            {"id": "family_names", "label": "Invited By", "type": "text", "placeholder": "Khan & Syed Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Contact", "type": "text", "placeholder": "+91 91234 56789", "required": true},
            {"id": "custom_message", "label": "Nikaah Ceremony Invitation", "type": "textarea", "placeholder": "Requesting the honor of your presence and prayers.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'modern-christian',
    'Celestial Rose Christian',
    'An ultra-modern, minimalist Christian wedding template. Soft rose gold themes, pristine layouts, falling white rose petals, sliding cross transitions, and elegant string instrumentals.',
    'Christian Wedding',
    'Christian',
    'English',
    799.00,
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Michelle", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "David", "required": true},
            {"id": "wedding_date", "label": "Solemnization Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Church & Reception Venue", "type": "textarea", "placeholder": "St. Andrews Cathedral, Chennai", "required": true},
            {"id": "quote", "label": "Holy Bible Verse", "type": "text", "placeholder": "So they are no longer two, but one flesh. (Matthew 19:6)", "required": false},
            {"id": "family_names", "label": "Parents of the Bride & Groom", "type": "text", "placeholder": "D''Souza and Mathews Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Contact", "type": "text", "placeholder": "+91 99887 76655", "required": true},
            {"id": "custom_message", "label": "Ceremony Invite", "type": "textarea", "placeholder": "Celebrate the union of our lives in Christ.", "required": false}
        ]
    }'::jsonb,
    true
),
(
    'luxury-floral',
    'Royal Golden Foliage',
    'Universal premium luxury wedding template with rich gold leaf details, soft velvet transitions, falling glitter dust, and majestic orchestral music.',
    'Luxury Wedding',
    'Secular',
    'English',
    799.00,
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600',
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Priya", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "Rahul", "required": true},
            {"id": "wedding_date", "label": "Celebration Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Grand Ballroom, ITC Grand Chola", "type": "textarea", "placeholder": "ITC Grand Chola, Chennai", "required": true},
            {"id": "quote", "label": "Love Quote", "type": "text", "placeholder": "Once in a while, right in the middle of an ordinary life, love gives us a fairy tale.", "required": false},
            {"id": "family_names", "label": "Host Families", "type": "text", "placeholder": "Sharma and Kapoor Families", "required": false},
            {"id": "rsvp_phone", "label": "RSVP Desk", "type": "text", "placeholder": "+91 90000 12345", "required": true},
            {"id": "custom_message", "label": "Invitation Wording", "type": "textarea", "placeholder": "We invite you to share our joy as we exchange our wedding vows.", "required": false}
        ]
    }'::jsonb,
    true
)
on conflict (slug) do update set
    name = excluded.name,
    description = excluded.description,
    category = excluded.category,
    religion = excluded.religion,
    language = excluded.language,
    price = excluded.price,
    thumbnail_url = excluded.thumbnail_url,
    preview_music_url = excluded.preview_music_url,
    config = excluded.config,
    is_active = excluded.is_active,
    updated_at = timezone('utc'::text, now());
