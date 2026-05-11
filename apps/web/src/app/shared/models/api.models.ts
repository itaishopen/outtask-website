// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Page / Section Models
// ============================================================

export type SectionType =
  | 'hero'
  | 'text-image'
  | 'cards'
  | 'testimonials'
  | 'cta'
  | 'rich-text'
  | 'vacancy-list'
  | 'blog-list'
  | 'logo-cloud'
  | 'faq';

export interface PageSection {
  id: string;
  type: SectionType;
  config: HeroSectionConfig
    | TextImageSectionConfig
    | CardsSectionConfig
    | TestimonialsSectionConfig
    | CtaSectionConfig
    | RichTextSectionConfig
    | VacancyListSectionConfig
    | BlogListSectionConfig
    | LogoCloudSectionConfig
    | FaqSectionConfig;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  sections: PageSection[];
  seo?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

// ---- Section configs ----

export interface CtaLink {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white';
}

export interface HeroSectionConfig {
  headline: string;
  subheadline?: string;
  ctas?: CtaLink[];
  backgroundVariant?: 'gradient' | 'image' | 'dark';
  backgroundImage?: string;
  badge?: string;
}

export interface TextImageSectionConfig {
  eyebrow?: string;
  heading: string;
  body: string;
  cta?: CtaLink;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  backgroundVariant?: 'white' | 'alt';
}

export interface CardItem {
  icon?: string;
  title: string;
  description: string;
  href?: string;
  badge?: string;
}

export interface CardsSectionConfig {
  eyebrow?: string;
  heading?: string;
  subtitle?: string;
  cards: CardItem[];
  columns?: 2 | 3 | 4;
  centeredHeader?: boolean;
}

export interface Testimonial {
  quote: string;
  authorName: string;
  authorTitle?: string;
  company?: string;
  avatarUrl?: string;
}

export interface TestimonialsSectionConfig {
  eyebrow?: string;
  heading?: string;
  testimonials: Testimonial[];
}

export interface CtaSectionConfig {
  heading: string;
  subheading?: string;
  ctas?: CtaLink[];
  variant?: 'light' | 'dark' | 'brand';
}

export interface RichTextSectionConfig {
  html: string;
  centered?: boolean;
}

export interface VacancyListSectionConfig {
  heading?: string;
  subtitle?: string;
  limit?: number;
  department?: string;
  showViewAll?: boolean;
}

export interface BlogListSectionConfig {
  heading?: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
}

export interface LogoItem {
  name: string;
  logoUrl: string;
  href?: string;
}

export interface LogoCloudSectionConfig {
  heading?: string;
  logos: LogoItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionConfig {
  eyebrow?: string;
  heading?: string;
  items: FaqItem[];
}

// ============================================================
// Vacancy Models
// ============================================================

export interface Vacancy {
  id: string;
  slug: string;
  title: string;
  department?: string;
  location?: string;
  employmentType?: string;
  salaryRange?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  applyUrl?: string;
  publishedAt?: string;
  roleTag?: string;
}

export interface VacancyFilter {
  department?: string;
  employmentType?: string;
  roleTag?: string;
  page?: number;
  limit?: number;
}

// ============================================================
// Blog Models
// ============================================================

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImageUrl?: string;
  publishedAt?: string;
  author?: string;
  category?: string;
  readingTime?: number;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
  seo?: {
    title?: string;
    description?: string;
    image?: string;
  };
}
