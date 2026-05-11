import { PrismaClient, RoleName, ContentStatus, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Roles
  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: { name: RoleName.ADMIN },
  });
  await prisma.role.upsert({
    where: { name: RoleName.EDITOR },
    update: {},
    create: { name: RoleName.EDITOR },
  });
  await prisma.role.upsert({
    where: { name: RoleName.VIEWER },
    update: {},
    create: { name: RoleName.VIEWER },
  });

  console.log('✅ Roles created');

  // Example admin user (update microsoftId with real value after first login)
  await prisma.user.upsert({
    where: { email: 'admin@outtask.nl' },
    update: {},
    create: {
      microsoftId: 'REPLACE_WITH_REAL_MICROSOFT_ID',
      email: 'admin@outtask.nl',
      name: 'Outtask Admin',
      roleId: adminRole.id,
    },
  });

  console.log('✅ Admin user created');

  // Manual job provider
  await prisma.jobProviderConfig.upsert({
    where: { name: 'manual' },
    update: {},
    create: {
      name: 'manual',
      type: 'manual',
      enabled: true,
      config: {},
    },
  });

  console.log('✅ Default job provider created');

  // Homepage
  const homepage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Homepage',
      slug: 'home',
      locale: 'en',
      status: ContentStatus.PUBLISHED,
      seoTitle: 'Outtask — Your IT Staffing & Nearshoring Partner',
      seoDesc:
        'Outtask connects ambitious companies with top IT talent through staffing, nearshoring, and dedicated developer teams.',
      sections: {
        create: [
          {
            type: SectionType.HERO,
            order: 0,
            config: {
              headline: 'The IT talent partner that delivers',
              subheadline:
                'We connect ambitious companies with the developers, engineers, and tech teams they need to grow.',
              primaryCta: { label: 'View vacancies', href: '/en/vacancies' },
              secondaryCta: { label: 'Our services', href: '/en/services/staffing' },
              backgroundImage: null,
            },
          },
          {
            type: SectionType.LOGO_CLOUD,
            order: 1,
            config: {
              heading: 'Trusted by companies across the Netherlands',
              logos: [],
            },
          },
          {
            type: SectionType.TEXT_IMAGE,
            order: 2,
            config: {
              eyebrow: 'What we do',
              heading: 'We make IT hiring simple',
              body: 'Whether you need one senior developer or an entire nearshore team, Outtask handles sourcing, screening, and placement so you can focus on building.',
              image: null,
              imageAlt: '',
              imagePosition: 'right',
              cta: { label: 'Learn more', href: '/en/services/staffing' },
            },
          },
          {
            type: SectionType.CARDS,
            order: 3,
            config: {
              heading: 'Our services',
              cards: [
                {
                  icon: 'users',
                  title: 'IT Staffing',
                  description:
                    'Permanent and contract placement of IT professionals across all seniority levels.',
                  href: '/en/services/staffing',
                },
                {
                  icon: 'globe',
                  title: 'Nearshoring',
                  description:
                    'Dedicated development teams in Eastern Europe integrated with your workflow.',
                  href: '/en/services/nearshoring',
                },
                {
                  icon: 'code',
                  title: 'Hire a Developer',
                  description: 'Find the right developer profile fast with our curated talent pool.',
                  href: '/en/hire-a-developer',
                },
              ],
            },
          },
          {
            type: SectionType.TESTIMONIALS,
            order: 4,
            config: {
              heading: 'What our clients say',
              testimonials: [
                {
                  quote:
                    'Outtask found us a senior React developer in under two weeks. The quality of candidates was exceptional.',
                  author: 'CTO, Amsterdam FinTech',
                  avatar: null,
                },
              ],
            },
          },
          {
            type: SectionType.CTA,
            order: 5,
            config: {
              heading: 'Ready to grow your team?',
              subheading: 'Schedule a free consultation and we will find the right talent for you.',
              primaryCta: { label: 'Schedule a meeting', href: '/en/contact' },
              secondaryCta: { label: 'View vacancies', href: '/en/vacancies' },
              style: 'dark',
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Homepage created (id: ${homepage.id})`);

  // Sample blog post
  await prisma.blogPost.upsert({
    where: { slug: 'it-staffing-trends-2025' },
    update: {},
    create: {
      title: 'IT Staffing Trends to Watch in 2025',
      slug: 'it-staffing-trends-2025',
      excerpt:
        'The IT talent market is shifting fast. Here is what hiring managers and candidates need to know.',
      content:
        '<p>The demand for skilled IT professionals continues to outpace supply across the Netherlands and Europe...</p>',
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date('2025-01-15'),
      seoTitle: 'IT Staffing Trends 2025 — Outtask Insights',
      seoDesc:
        'Discover the top IT hiring trends shaping 2025, from nearshoring growth to AI skill demands.',
    },
  });

  console.log('✅ Sample blog post created');

  // Sample vacancies
  const manualProvider = await prisma.jobProviderConfig.findUnique({ where: { name: 'manual' } });

  await prisma.vacancy.upsert({
    where: { slug: 'senior-react-developer-amsterdam' },
    update: {},
    create: {
      title: 'Senior React Developer',
      slug: 'senior-react-developer-amsterdam',
      location: 'Amsterdam, Netherlands',
      department: 'Engineering',
      employmentType: 'Full-time',
      seniority: 'Senior',
      description:
        '<p>We are looking for a Senior React Developer to join a fast-growing fintech client in Amsterdam.</p>',
      requirements:
        '<ul><li>5+ years React experience</li><li>TypeScript proficiency</li><li>Experience with state management (Redux, Zustand, or similar)</li></ul>',
      benefits:
        '<ul><li>Competitive salary</li><li>Flexible working</li><li>Learning budget</li></ul>',
      applyUrl: null,
      status: ContentStatus.PUBLISHED,
      providerId: manualProvider?.id,
    },
  });

  await prisma.vacancy.upsert({
    where: { slug: 'java-backend-developer-remote' },
    update: {},
    create: {
      title: 'Java Backend Developer',
      slug: 'java-backend-developer-remote',
      location: 'Remote / Netherlands',
      department: 'Engineering',
      employmentType: 'Full-time',
      seniority: 'Medior',
      description:
        '<p>Join a leading logistics company as a Java Backend Developer working on high-throughput systems.</p>',
      requirements:
        '<ul><li>3+ years Java / Spring Boot</li><li>Experience with microservices</li><li>PostgreSQL or MySQL</li></ul>',
      benefits: '<ul><li>Remote-first</li><li>25 vacation days</li><li>Equipment budget</li></ul>',
      applyUrl: null,
      status: ContentStatus.PUBLISHED,
      providerId: manualProvider?.id,
    },
  });

  console.log('✅ Sample vacancies created');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
