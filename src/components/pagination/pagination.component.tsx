'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl,
  searchParams = {}
}: PaginationProps) {
  const searchParamsObj = useSearchParams();
  
  // Build URL with search parameters
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParamsObj.toString());
    Object.entries(searchParams).forEach(([key, value]) => {
      params.set(key, value);
    });
    params.set('page', page.toString());
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav aria-label="Pagination Navigation" className="pagination-nav">
      <ul className="pagination justify-content-center">
        {/* Previous button */}
        <li className={`page-item ${!prevPage ? 'disabled' : ''}`}>
          {prevPage ? (
            <Link 
              href={buildUrl(prevPage)}
              className="page-link"
              rel="prev"
              aria-label="Go to previous page"
            >
              <i className="fas fa-chevron-left"></i>
              Previous
            </Link>
          ) : (
            <span className="page-link" aria-disabled="true">
              <i className="fas fa-chevron-left"></i>
              Previous
            </span>
          )}
        </li>
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <li 
            key={index} 
            className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
          >
            {page === '...' ? (
              <span className="page-link">...</span>
            ) : (
              <Link 
                href={buildUrl(page as number)}
                className="page-link"
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
        
        {/* Next button */}
        <li className={`page-item ${!nextPage ? 'disabled' : ''}`}>
          {nextPage ? (
            <Link 
              href={buildUrl(nextPage)}
              className="page-link"
              rel="next"
              aria-label="Go to next page"
            >
              Next
              <i className="fas fa-chevron-right"></i>
            </Link>
          ) : (
            <span className="page-link" aria-disabled="true">
              Next
              <i className="fas fa-chevron-right"></i>
            </span>
          )}
        </li>
      </ul>
      
      {/* Page info */}
      <div className="pagination-info text-center mt-2">
        <small className="text-muted">
          Page {currentPage} of {totalPages}
        </small>
      </div>
    </nav>
  );
}
