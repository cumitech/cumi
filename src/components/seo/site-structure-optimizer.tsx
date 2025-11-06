'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Alert, Progress, Tag } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface PageDepth {
  url: string;
  depth: number;
  title: string;
  status: 'optimal' | 'warning' | 'critical';
}

export default function SiteStructureOptimizer() {
  const [pageDepths, setPageDepths] = useState<PageDepth[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    analyzeSiteStructure();
  }, []);
  
  const analyzeSiteStructure = () => {
    setLoading(true);
    
    // Simulate analysis - in real implementation, this would crawl the site
    const pages: PageDepth[] = [
      // Level 1 - Homepage
      { url: '/', depth: 0, title: 'Homepage', status: 'optimal' },
      
      // Level 2 - Main sections (1 click from home)
      { url: '/about-us', depth: 1, title: 'About Us', status: 'optimal' },
      { url: '/our-services', depth: 1, title: 'Our Services', status: 'optimal' },
      { url: '/blog-posts', depth: 1, title: 'Blog Posts', status: 'optimal' },
      { url: '/projects', depth: 1, title: 'Projects', status: 'optimal' },
      { url: '/courses', depth: 1, title: 'Courses', status: 'optimal' },
      { url: '/events', depth: 1, title: 'Events', status: 'optimal' },
      { url: '/contact-us', depth: 1, title: 'Contact Us', status: 'optimal' },
      
      // Level 3 - Individual content (2 clicks from home)
      { url: '/blog-posts/sample-post', depth: 2, title: 'Sample Blog Post', status: 'optimal' },
      { url: '/projects/sample-project', depth: 2, title: 'Sample Project', status: 'optimal' },
      { url: '/courses/sample-course', depth: 2, title: 'Sample Course', status: 'optimal' },
      { url: '/our-services/web-development', depth: 2, title: 'Web Development Service', status: 'optimal' },
      
      // Level 4 - Sub-content (3 clicks from home)
      { url: '/courses/sample-course/lesson-1', depth: 3, title: 'Course Lesson', status: 'optimal' },
      { url: '/dashboard', depth: 3, title: 'Dashboard', status: 'warning' },
      { url: '/dashboard/blog-posts/create', depth: 4, title: 'Create Blog Post', status: 'critical' },
    ];
    
    setPageDepths(pages);
    setLoading(false);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'critical':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getDepthRecommendation = (depth: number) => {
    if (depth <= 2) return 'Excellent - Easy to find';
    if (depth === 3) return 'Good - Acceptable depth';
    if (depth === 4) return 'Warning - Consider restructuring';
    return 'Critical - Too deep, restructure needed';
  };
  
  const optimalPages = pageDepths.filter(p => p.status === 'optimal').length;
  const warningPages = pageDepths.filter(p => p.status === 'warning').length;
  const criticalPages = pageDepths.filter(p => p.status === 'critical').length;
  const totalPages = pageDepths.length;
  
  const optimizationScore = Math.round(((optimalPages + (warningPages * 0.7)) / totalPages) * 100);
  
  return (
    <div className="site-structure-optimizer">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Site Structure Overview" className="h-100">
            <div className="mb-4">
              <h4>Optimization Score</h4>
              <Progress 
                percent={optimizationScore} 
                status={optimizationScore >= 80 ? 'success' : optimizationScore >= 60 ? 'normal' : 'exception'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <p className="mt-2 text-muted">
                {optimizationScore >= 80 ? 'Excellent site structure!' : 
                 optimizationScore >= 60 ? 'Good structure with room for improvement' : 
                 'Needs significant optimization'}
              </p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number text-success">{optimalPages}</div>
                <div className="stat-label">Optimal Pages</div>
              </div>
              <div className="stat-item">
                <div className="stat-number text-warning">{warningPages}</div>
                <div className="stat-label">Warning Pages</div>
              </div>
              <div className="stat-item">
                <div className="stat-number text-danger">{criticalPages}</div>
                <div className="stat-label">Critical Pages</div>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Card title="Page Depth Analysis" loading={loading}>
            <Alert
              message="Site Structure Optimization"
              description="Your site maintains optimal depth of 3-4 clicks from homepage. Most content is easily accessible within 2-3 clicks."
              type="success"
              showIcon
              className="mb-4"
            />
            
            <div className="page-depth-list">
              {pageDepths.map((page, index) => (
                <div key={index} className="page-depth-item">
                  <div className="page-info">
                    <div className="page-title">
                      {getStatusIcon(page.status)}
                      <span className="ml-2">{page.title}</span>
                    </div>
                    <div className="page-url">
                      <Link href={page.url} target="_blank">
                        {page.url}
                      </Link>
                    </div>
                  </div>
                  
                  <div className="page-meta">
                    <Tag color={getStatusColor(page.status)}>
                      Depth: {page.depth}
                    </Tag>
                    <span className="recommendation">
                      {getDepthRecommendation(page.depth)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="optimization-tips mt-4">
              <h5>Optimization Recommendations:</h5>
              <ul>
                <li>✅ Main navigation is well-structured with 1-click access to key sections</li>
                <li>✅ Content pages are accessible within 2-3 clicks from homepage</li>
                <li>⚠️ Dashboard areas are deeper but acceptable for admin functionality</li>
                <li>💡 Consider adding more internal linking between related content</li>
                <li>💡 Add breadcrumb navigation for better user experience</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
      
      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .stat-item {
          text-align: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #6c757d;
        }
        
        .page-depth-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .page-depth-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .page-info {
          flex: 1;
        }
        
        .page-title {
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        
        .page-url {
          font-size: 0.875rem;
          color: #6c757d;
        }
        
        .page-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }
        
        .recommendation {
          font-size: 0.75rem;
          color: #6c757d;
        }
        
        .optimization-tips {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #28a745;
        }
        
        .optimization-tips ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        .optimization-tips li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
