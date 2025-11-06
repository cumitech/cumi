'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  separator?: string;
}

export default function Breadcrumb({ 
  items = [], 
  showHome = true, 
  separator = '/' 
}: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Auto-generate breadcrumbs from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items.length > 0) return items;
    
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = generateBreadcrumbs();
  
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `https://cumi.dev${item.href}` })
    }))
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb mb-0">
          {showHome && (
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none">
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
            </li>
          )}
          
          {breadcrumbItems.map((item, index) => (
            <li 
              key={index} 
              className={`breadcrumb-item ${!item.href ? 'active' : ''}`}
              aria-current={!item.href ? 'page' : undefined}
            >
              {item.href ? (
                <Link href={item.href} className="text-decoration-none">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
