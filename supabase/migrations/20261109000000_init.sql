-- =============================================================================
-- GROWTHEDUH — initial schema
-- Professional profile & information website (NOT a clinical record system).
-- No booking, payment, diagnosis or counselling-record tables by design.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- admin_roles: which auth users may manage content
-- -----------------------------------------------------------------------------

create table public.admin_roles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

comment on table public.admin_roles is
  'Authorised admin accounts. Rows can only be added via SQL editor / service role.';

-- SECURITY DEFINER so RLS policies can call it without exposing admin_roles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_roles where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- site_settings: single row (id = 1)
-- -----------------------------------------------------------------------------

create table public.site_settings (
  id                 smallint primary key default 1 check (id = 1),
  brand_name         text not null default 'GROWTHEDUH' check (char_length(brand_name) between 1 and 80),
  tagline            text check (char_length(tagline) <= 200),
  logo_url           text,
  whatsapp_number    text check (whatsapp_number is null or whatsapp_number ~ '^[0-9+ ()-]{8,20}$'),
  whatsapp_message   text check (char_length(whatsapp_message) <= 500),
  email              text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  instagram_url      text,
  tiktok_url         text,
  linkedin_url       text,
  address            text,
  maps_url           text,
  business_hours     text,
  hero_headline      text check (char_length(hero_headline) <= 200),
  hero_description   text check (char_length(hero_description) <= 600),
  about_intro        text,
  brand_story        text,
  vision             text,
  mission            text,
  values_text        text,
  footer_description text check (char_length(footer_description) <= 400),
  emergency_info     text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- team_members (the featured row is the main professional profile)
-- -----------------------------------------------------------------------------

create table public.team_members (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  full_name          text not null check (char_length(full_name) between 2 and 120),
  professional_title text check (char_length(professional_title) <= 160),
  portrait_url       text,
  short_bio          text check (char_length(short_bio) <= 400),
  biography          text,
  education          text,
  experience         text,
  specializations    text,
  qualifications     text,
  linkedin_url       text,
  profile_url        text,
  is_featured        boolean not null default false,
  is_published       boolean not null default true,
  sort_order         integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- At most one featured (main) profile.
create unique index team_members_one_featured on public.team_members (is_featured) where is_featured;
create index team_members_published_order on public.team_members (is_published, sort_order);

create trigger team_members_updated_at before update on public.team_members
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- services
-- -----------------------------------------------------------------------------

create table public.services (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null check (char_length(title) between 2 and 120),
  summary          text not null check (char_length(summary) between 1 and 400),
  description      text,
  items            text,
  icon             text,
  image_url        text,
  whatsapp_message text check (char_length(whatsapp_message) <= 500),
  price_info       text,
  duration_info    text,
  location_info    text,
  is_published     boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index services_published_order on public.services (is_published, sort_order);

create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- article_categories / articles / article_category_relations
-- -----------------------------------------------------------------------------

create table public.article_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (char_length(name) between 2 and 80),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger article_categories_updated_at before update on public.article_categories
  for each row execute function public.set_updated_at();

create table public.articles (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title              text not null check (char_length(title) between 3 and 200),
  excerpt            text check (char_length(excerpt) <= 400),
  content            text not null default '',
  featured_image_url text,
  featured_image_alt text check (char_length(featured_image_alt) <= 200),
  author_id          uuid references public.team_members (id) on delete set null,
  author_name        text check (char_length(author_name) <= 120),
  status             text not null default 'draft' check (status in ('draft', 'published')),
  is_featured        boolean not null default false,
  published_at       timestamptz,
  seo_title          text check (char_length(seo_title) <= 120),
  seo_description    text check (char_length(seo_description) <= 300),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint articles_published_has_date check (status = 'draft' or published_at is not null)
);

create index articles_status_published_at on public.articles (status, published_at desc);
create index articles_featured on public.articles (is_featured) where is_featured;
create index articles_author on public.articles (author_id);

create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

create table public.article_category_relations (
  article_id  uuid not null references public.articles (id) on delete cascade,
  category_id uuid not null references public.article_categories (id) on delete cascade,
  primary key (article_id, category_id)
);

create index article_category_relations_category on public.article_category_relations (category_id);

-- -----------------------------------------------------------------------------
-- testimonials (public submissions are always pending until approved)
-- -----------------------------------------------------------------------------

create table public.testimonials (
  id                  uuid primary key default gen_random_uuid(),
  display_name        text not null check (char_length(btrim(display_name)) between 2 and 60),
  rating              smallint not null check (rating between 1 and 5),
  content             text not null check (char_length(btrim(content)) between 10 and 1500),
  service_category    text check (char_length(service_category) <= 120),
  claims_client       boolean not null default false,
  consent_publication boolean not null check (consent_publication),
  status              text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_verified         boolean not null default false,
  approved_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index testimonials_status_created on public.testimonials (status, created_at desc);

create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- faqs
-- -----------------------------------------------------------------------------

create table public.faqs (
  id           uuid primary key default gen_random_uuid(),
  question     text not null check (char_length(question) between 5 and 300),
  answer       text not null check (char_length(answer) between 2 and 3000),
  is_published boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index faqs_published_order on public.faqs (is_published, sort_order);

create trigger faqs_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.admin_roles                enable row level security;
alter table public.site_settings              enable row level security;
alter table public.team_members               enable row level security;
alter table public.services                   enable row level security;
alter table public.article_categories         enable row level security;
alter table public.articles                   enable row level security;
alter table public.article_category_relations enable row level security;
alter table public.testimonials               enable row level security;
alter table public.faqs                       enable row level security;

-- admin_roles: an admin can see the list; nobody can write through the API.
create policy "admins read admin_roles" on public.admin_roles
  for select to authenticated using ((select public.is_admin()));

-- site_settings
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admins update settings" on public.site_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins insert settings" on public.site_settings
  for insert to authenticated with check ((select public.is_admin()));

-- team_members
create policy "public read published team" on public.team_members
  for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "admins manage team" on public.team_members
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- services
create policy "public read published services" on public.services
  for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "admins manage services" on public.services
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- article_categories
create policy "public read categories" on public.article_categories
  for select to anon, authenticated using (true);
create policy "admins manage categories" on public.article_categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- articles: visitors only see published articles whose date has arrived.
create policy "public read published articles" on public.articles
  for select to anon, authenticated
  using ((status = 'published' and published_at <= now()) or (select public.is_admin()));
create policy "admins manage articles" on public.articles
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- article_category_relations: readable when the article is readable.
create policy "public read relations" on public.article_category_relations
  for select to anon, authenticated
  using (exists (
    select 1 from public.articles a
    where a.id = article_id
      and ((a.status = 'published' and a.published_at <= now()) or (select public.is_admin()))
  ));
create policy "admins manage relations" on public.article_category_relations
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- testimonials
create policy "public read approved testimonials" on public.testimonials
  for select to anon, authenticated using (status = 'approved' or (select public.is_admin()));
-- Anyone may submit, but only as pending, unverified and with consent.
create policy "public submit testimonials" on public.testimonials
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and is_verified = false
    and approved_at is null
    and consent_publication = true
  );
create policy "admins update testimonials" on public.testimonials
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete testimonials" on public.testimonials
  for delete to authenticated using ((select public.is_admin()));

-- faqs
create policy "public read published faqs" on public.faqs
  for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "admins manage faqs" on public.faqs
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Column-level hardening: anonymous visitors can only insert the columns the
-- public review form needs (status / is_verified fall back to defaults).
revoke insert on public.testimonials from anon;
grant insert (display_name, rating, content, service_category, claims_client, consent_publication)
  on public.testimonials to anon;

-- =============================================================================
-- Storage: public "media" bucket for logo, portraits, article & service images
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 4194304,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public URLs of a public bucket work without a SELECT policy; listing files
-- through the API is restricted to admins.
create policy "admins list media" on storage.objects
  for select to authenticated using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select public.is_admin()));
