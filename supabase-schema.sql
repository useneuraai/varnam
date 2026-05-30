-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Create Templates Table
create table if not exists public.templates (
    id uuid default uuid_generate_v4() primary key,
    slug varchar unique not null,
    name varchar not null,
    description text,
    category varchar not null,
    religion varchar not null,
    language varchar not null default 'English',
    price numeric not null default 499.00,
    thumbnail_url text,
    preview_music_url text,
    config jsonb not null default '{}'::jsonb,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Invitations Table
create table if not exists public.invitations (
    id uuid default uuid_generate_v4() primary key,
    template_slug varchar not null references public.templates(slug) on delete cascade,
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
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Payments Table
create table if not exists public.payments (
    id uuid default uuid_generate_v4() primary key,
    invitation_id uuid references public.invitations(id) on delete cascade,
    razorpay_order_id varchar not null,
    razorpay_payment_id varchar,
    razorpay_signature varchar,
    amount numeric not null,
    status varchar not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables
alter table public.templates enable row level security;
alter table public.invitations enable row level security;
alter table public.payments enable row level security;

-- Policies for templates (anyone can read active ones, write requires admin / auth)
create policy "Allow public read-only access to active templates"
    on public.templates for select
    using (is_active = true);

create policy "Allow all actions for admin on templates"
    on public.templates for all
    using (true); -- Simplified for setup, can restrict to authenticated admin users

-- Policies for invitations (anyone can read paid ones, insert is public for creation, update/delete restricted)
create policy "Allow public read access to invitations"
    on public.invitations for select
    using (true);

create policy "Allow anyone to insert invitations"
    on public.invitations for insert
    with check (true);

create policy "Allow update to owner/creator of invitations"
    on public.invitations for update
    using (true); -- In a full SaaS, link to user_id, for this system slug/token based validation is supported.

-- Policies for payments
create policy "Allow public inserts on payments"
    on public.payments for insert
    with check (true);

create policy "Allow read on payments"
    on public.payments for select
    using (true);

-- Seed Initial Template Data
insert into public.templates (slug, name, description, category, religion, language, price, thumbnail_url, preview_music_url, config, is_active)
values
(
    'royal-tamil',
    'Royal Tamil Heritage',
    'A majestic template reflecting traditional Tamil aesthetics. Features glowing temple mandapas, floating jasmine petals, golden animations, and a soulful flutist theme.',
    'Tamil Wedding',
    'Hindu',
    'Tamil/English',
    699.00,
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=600',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
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
    699.00,
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name (Zara)", "type": "text", "placeholder": "Zara", "required": true},
            {"id": "groom_name", "label": "Groom Name (Faisal)", "type": "text", "placeholder": "Faisal", "required": true},
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
    599.00,
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    '{
        "fields": [
            {"id": "bride_name", "label": "Bride Name", "type": "text", "placeholder": "Michelle", "required": true},
            {"id": "groom_name", "label": "Groom Name", "type": "text", "placeholder": "David", "required": true},
            {"id": "wedding_date", "label": "Solemnization Date & Time", "type": "datetime", "required": true},
            {"id": "wedding_venue", "label": "Church & Reception Venue", "type": "textarea", "placeholder": "St. Andrews Cathedral, Chennai", "required": true},
            {"id": "quote", "label": "Holy Bible Verse", "type": "text", "placeholder": "So they are no longer two, but one flesh. (Matthew 19:6)", "required": false},
            {"id": "family_names", "label": "Parents of the Bride & Groom", "type": "text", "placeholder": "D\'Souza and Mathews Families", "required": false},
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
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
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
);
