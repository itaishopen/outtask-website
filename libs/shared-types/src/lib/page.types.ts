import { ContentStatus, SectionType } from './enums';

export interface PageSection {
  id: string;
  pageId: string;
  type: SectionType;
  order: number;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: ContentStatus;
  seoTitle: string | null;
  seoDesc: string | null;
  ogImage: string | null;
  sections: PageSection[];
  createdAt: string;
  updatedAt: string;
}

// Section config shapes — used by the frontend section renderer

export interface HeroConfig {
  headline: string;
  subheadline?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  backgroundImage?: string | null;
  backgroundVideo?: string | null;
}

export interface TextImageConfig {
  eyebrow?: string;
  heading: string;
  body: string;
  image?: string | null;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  cta?: CtaLink;
}

export interface CardItem {
  icon?: string;
  image?: string | null;
  title: string;
  description: string;
  href?: string;
}

export interface CardsConfig {
  eyebrow?: string;
  heading?: string;
  columns?: 2 | 3 | 4;
  cards: CardItem[];
}

export interface Testimonial {
  quote: string;
  author: string;
  title?: string;
  company?: string;
  avatar?: string | null;
}

export interface TestimonialsConfig {
  heading?: string;
  testimonials: Testimonial[];
}

export interface CtaConfig {
  heading: string;
  subheading?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  style?: 'light' | 'dark' | 'brand';
}

export interface RichTextConfig {
  content: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
}

export interface VacancyListConfig {
  heading?: string;
  limit?: number;
  showFilters?: boolean;
  department?: string;
}

export interface BlogListConfig {
  heading?: string;
  limit?: number;
  showViewAll?: boolean;
}

export interface Logo {
  name: string;
  image: string;
  href?: string;
}

export interface LogoCloudConfig {
  heading?: string;
  logos: Logo[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqConfig {
  heading?: string;
  items: FaqItem[];
}

export interface CtaLink {
  label: string;
  href: string;
  external?: boolean;
}
