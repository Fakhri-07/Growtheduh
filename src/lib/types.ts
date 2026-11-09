export type SiteSettings = {
  brand_name: string;
  tagline: string | null;
  logo_url: string | null;
  whatsapp_number: string | null;
  whatsapp_message: string | null;
  email: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  address: string | null;
  maps_url: string | null;
  business_hours: string | null;
  hero_headline: string | null;
  hero_description: string | null;
  about_intro: string | null;
  brand_story: string | null;
  vision: string | null;
  mission: string | null;
  values_text: string | null;
  footer_description: string | null;
  emergency_info: string | null;
};

export type TeamMember = {
  id: string;
  slug: string;
  full_name: string;
  professional_title: string | null;
  portrait_url: string | null;
  short_bio: string | null;
  biography: string | null;
  education: string | null;
  experience: string | null;
  specializations: string | null;
  qualifications: string | null;
  linkedin_url: string | null;
  profile_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  items: string | null;
  icon: string | null;
  image_url: string | null;
  whatsapp_message: string | null;
  price_info: string | null;
  duration_info: string | null;
  location_info: string | null;
  is_published: boolean;
  sort_order: number;
};

export type ArticleCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type ArticleStatus = "draft" | "published";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  author_id: string | null;
  author_name: string | null;
  status: ArticleStatus;
  is_featured: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  categories: ArticleCategory[];
};

export type TestimonialStatus = "pending" | "approved" | "rejected";

export type Testimonial = {
  id: string;
  display_name: string;
  rating: number;
  content: string;
  service_category: string | null;
  claims_client: boolean;
  is_verified: boolean;
  status: TestimonialStatus;
  created_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
};

/** Standard shape returned by admin server actions to useActionState. */
export type ActionState = {
  ok: boolean;
  message: string;
} | null;
