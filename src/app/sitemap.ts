import { MetadataRoute } from 'next'
import { SITE_URL } from "@constants/api-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  try {
    // Fetch dynamic content in parallel
    const [
      postsResponse,
      projectsResponse,
      eventsResponse,
      coursesResponse,
      opportunitiesResponse,
      categoriesResponse,
      tagsResponse,
      servicesResponse,
    ] = await Promise.all([
      fetch(`${baseUrl}/api/posts`).catch(() => null),
      fetch(`${baseUrl}/api/projects`).catch(() => null),
      fetch(`${baseUrl}/api/events`).catch(() => null),
      fetch(`${baseUrl}/api/courses`).catch(() => null),
      fetch(`${baseUrl}/api/opportunities`).catch(() => null),
      fetch(`${baseUrl}/api/categories`).catch(() => null),
      fetch(`${baseUrl}/api/tags`).catch(() => null),
      fetch(`${baseUrl}/api/services`).catch(() => null),
    ]);

    // Parse responses safely (APIs may return array or { data: array })
    const postsRaw = postsResponse ? await postsResponse.json().catch(() => []) : [];
    const projectsRaw = projectsResponse ? await projectsResponse.json().catch(() => []) : [];
    const eventsRaw = eventsResponse ? await eventsResponse.json().catch(() => []) : [];
    const coursesRaw = coursesResponse ? await coursesResponse.json().catch(() => []) : [];
    const opportunitiesRaw = opportunitiesResponse ? await opportunitiesResponse.json().catch(() => []) : [];
    const categoriesRaw = categoriesResponse ? await categoriesResponse.json().catch(() => []) : [];
    const tagsRaw = tagsResponse ? await tagsResponse.json().catch(() => []) : [];
    const servicesRaw = servicesResponse ? await servicesResponse.json().catch(() => []) : [];

    const posts = Array.isArray(postsRaw) ? postsRaw : (postsRaw?.data ?? []);
    const projects = Array.isArray(projectsRaw) ? projectsRaw : (projectsRaw?.data ?? []);
    const events = Array.isArray(eventsRaw) ? eventsRaw : (eventsRaw?.data ?? []);
    const courses = Array.isArray(coursesRaw) ? coursesRaw : (coursesRaw?.data ?? []);
    const opportunities = Array.isArray(opportunitiesRaw) ? opportunitiesRaw : (opportunitiesRaw?.data ?? []);
    const categories = Array.isArray(categoriesRaw) ? categoriesRaw : (categoriesRaw?.data ?? []);
    const tags = Array.isArray(tagsRaw) ? tagsRaw : (tagsRaw?.data ?? []);
    const services = Array.isArray(servicesRaw) ? servicesRaw : (servicesRaw?.data ?? []);

    // Generate dynamic URLs with enhanced metadata
    const postsData = posts?.map((post: any) => ({
      url: `${baseUrl}/blog-posts/${post?.slug}`,
      lastModified: new Date(post?.updatedAt || post?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      images: post?.imageUrl ? [
        {
          url: post?.imageUrl.startsWith('http') ? post?.imageUrl : `${baseUrl}/uploads/posts/${post?.imageUrl}`,
          alt: post?.title || 'Blog post image',
        },
      ] : [],
    })) || [];

    const projectsData = projects?.map((project: any) => ({
      url: `${baseUrl}/projects/${project?.slug || project?.id}`,
      lastModified: new Date(project?.updatedAt || project?.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: project?.imageUrl ? [
        {
          url: project?.imageUrl.startsWith('http') ? project?.imageUrl : `${baseUrl}/uploads/projects/${project?.imageUrl}`,
          alt: project?.title || 'Project image',
        },
      ] : [],
    })) || [];

    const eventsData = events?.map((event: any) => ({
      url: `${baseUrl}/events/${event?.slug || event?.id}`,
      lastModified: new Date(event?.updatedAt || event?.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      images: event?.imageUrl ? [
        {
          url: event?.imageUrl.startsWith('http') ? event?.imageUrl : `${baseUrl}/uploads/events/${event?.imageUrl}`,
          alt: event?.title || 'Event image',
        },
      ] : [],
    })) || [];

    const coursesData = courses?.map((course: any) => ({
      url: `${baseUrl}/courses/${course?.slug || course?.id}`,
      lastModified: new Date(course?.updatedAt || course?.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: course?.imageUrl ? [
        {
          url: course?.imageUrl.startsWith('http') ? course?.imageUrl : `${baseUrl}/uploads/courses/${course?.imageUrl}`,
          alt: course?.title || 'Course image',
        },
      ] : [],
    })) || [];

    const opportunitiesData = opportunities?.map((opportunity: any) => ({
      url: `${baseUrl}/opportunities/${opportunity?.slug || opportunity?.id}`,
      lastModified: new Date(opportunity?.updatedAt || opportunity?.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

    const servicesData = services?.map((service: any) => ({
      url: `${baseUrl}/our-services/${service?.slug}`,
      lastModified: new Date(service?.updatedAt || service?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: service?.imageUrl ? [
        {
          url: service?.imageUrl.startsWith('http') ? service?.imageUrl : `${baseUrl}/uploads/services/${service?.imageUrl}`,
          alt: service?.title || 'Service image',
        },
      ] : [],
    })) || [];

    const categoriesData = categories?.map((category: any) => ({
      url: `${baseUrl}/categories/${category?.slug}`,
      lastModified: new Date(category?.updatedAt || category?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || [];

    const tagsData = tags?.map((tag: any) => ({
      url: `${baseUrl}/tags/${tag?.slug}`,
      lastModified: new Date(tag?.updatedAt || tag?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || [];

    // Enhanced static URLs with better organization
    const staticUrls: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/our-services`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/contact-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog-posts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/events`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/courses`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/opportunities`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/partners`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/tags`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/authors`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/faqs`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/register`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/forgot-password`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.2,
      },
      {
        url: `${baseUrl}/terms-of-use`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/cookie-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/mobile-app`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/sitemap-page`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/recommendations`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ];

    // Combine all URLs
    return [
      ...staticUrls,
      ...postsData,
      ...projectsData,
      ...eventsData,
      ...coursesData,
      ...opportunitiesData,
      ...servicesData,
      ...categoriesData,
      ...tagsData,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Enhanced fallback to static URLs only
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/our-services`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/contact-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog-posts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/events`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/courses`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/opportunities`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/partners`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/tags`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/authors`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/faqs`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/register`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/forgot-password`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.2,
      },
      {
        url: `${baseUrl}/terms-of-use`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/cookie-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/mobile-app`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/sitemap-page`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/recommendations`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ];
  }
}