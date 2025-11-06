"use client";

import React from "react";
import { Card, Row, Col, Typography, Divider, Space, Tag, Button } from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  MailOutlined,
  StarOutlined,
  LockOutlined,
  BarChartOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";

const { Title, Text, Paragraph } = Typography;

interface PageSection {
  title: string;
  icon: React.ReactNode;
  description: string;
  pages: {
    path: string;
    title: string;
    description: string;
    access: "public" | "admin" | "creator" | "student" | "authenticated";
    type: "page" | "api" | "auth";
  }[];
}

const SitemapPageComponent: React.FC = () => {
  const pageSections: PageSection[] = [
    {
      title: "Public Pages",
      icon: <HomeOutlined />,
      description: "Main website pages accessible to all visitors",
      pages: [
        {
          path: "/",
          title: "Home",
          description: "Main landing page",
          access: "public",
          type: "page",
        },
        {
          path: "/about-us",
          title: "About Us",
          description: "Company information and team",
          access: "public",
          type: "page",
        },
        {
          path: "/our-services",
          title: "Our Services",
          description: "Services overview and details",
          access: "public",
          type: "page",
        },
        {
          path: "/our-services/[slug]",
          title: "Service Details",
          description: "Individual service pages",
          access: "public",
          type: "page",
        },
        {
          path: "/projects",
          title: "Projects",
          description: "Portfolio and project showcase",
          access: "public",
          type: "page",
        },
        {
          path: "/projects/[slug]",
          title: "Project Details",
          description: "Individual project pages",
          access: "public",
          type: "page",
        },
        {
          path: "/blog-posts",
          title: "Blog Posts",
          description: "Articles and blog content",
          access: "public",
          type: "page",
        },
        {
          path: "/blog-posts/[slug]",
          title: "Blog Post Details",
          description: "Individual blog post pages",
          access: "public",
          type: "page",
        },
        {
          path: "/blog-posts/sample-post",
          title: "Sample Blog Post",
          description: "Example blog post with CTA",
          access: "public",
          type: "page",
        },
        {
          path: "/opportunities",
          title: "Opportunities",
          description: "Job and opportunity listings",
          access: "public",
          type: "page",
        },
        {
          path: "/opportunities/[slug]",
          title: "Opportunity Details",
          description: "Individual opportunity pages",
          access: "public",
          type: "page",
        },
        {
          path: "/events",
          title: "Events",
          description: "Upcoming events and workshops",
          access: "public",
          type: "page",
        },
        {
          path: "/events/[slug]",
          title: "Event Details",
          description: "Individual event pages",
          access: "public",
          type: "page",
        },
        {
          path: "/courses",
          title: "Courses",
          description: "Available courses and training",
          access: "public",
          type: "page",
        },
        {
          path: "/courses/[slug]",
          title: "Course Details",
          description: "Individual course pages",
          access: "public",
          type: "page",
        },
        {
          path: "/recommendations",
          title: "Tools & Recommendations",
          description: "Recommended tools and services",
          access: "public",
          type: "page",
        },
        {
          path: "/mobile-app",
          title: "Mobile App",
          description: "Mobile application information",
          access: "public",
          type: "page",
        },
        {
          path: "/contact-us",
          title: "Contact Us",
          description: "Contact form and information",
          access: "public",
          type: "page",
        },
        {
          path: "/partners",
          title: "Partners",
          description: "Partner organizations",
          access: "public",
          type: "page",
        },
        {
          path: "/authors",
          title: "Authors",
          description: "Content authors and contributors",
          access: "public",
          type: "page",
        },
        {
          path: "/authors/[username]",
          title: "Author Profile",
          description: "Individual author profiles",
          access: "public",
          type: "page",
        },
        {
          path: "/categories",
          title: "Categories",
          description: "Content categories",
          access: "public",
          type: "page",
        },
        {
          path: "/categories/[category]",
          title: "Category Details",
          description: "Individual category pages",
          access: "public",
          type: "page",
        },
        {
          path: "/tags",
          title: "Tags",
          description: "Content tags",
          access: "public",
          type: "page",
        },
        {
          path: "/tags/[tag]",
          title: "Tag Details",
          description: "Individual tag pages",
          access: "public",
          type: "page",
        },
        {
          path: "/faqs",
          title: "FAQs",
          description: "Frequently asked questions",
          access: "public",
          type: "page",
        },
        {
          path: "/terms-of-use",
          title: "Terms of Use",
          description: "Terms and conditions",
          access: "public",
          type: "page",
        },
        {
          path: "/privacy-policy",
          title: "Privacy Policy",
          description: "Privacy policy and data protection",
          access: "public",
          type: "page",
        },
      ],
    },
    {
      title: "Authentication Pages",
      icon: <LockOutlined />,
      description: "User authentication and account management",
      pages: [
        {
          path: "/login",
          title: "Login",
          description: "User login page",
          access: "public",
          type: "auth",
        },
        {
          path: "/register",
          title: "Register",
          description: "User registration page",
          access: "public",
          type: "auth",
        },
        {
          path: "/forgot-password",
          title: "Forgot Password",
          description: "Password reset request",
          access: "public",
          type: "auth",
        },
        {
          path: "/login",
          title: "Sign In",
          description: "Sign in to your account",
          access: "public",
          type: "auth",
        },
        {
          path: "/auth/forgot-password",
          title: "Auth Forgot Password",
          description: "Authentication forgot password",
          access: "public",
          type: "auth",
        },
        {
          path: "/auth/reset-password",
          title: "Reset Password",
          description: "Password reset form",
          access: "public",
          type: "auth",
        },
        {
          path: "/auth/activate",
          title: "Account Activation",
          description: "Account activation page",
          access: "public",
          type: "auth",
        },
        {
          path: "/auth/resend-activation",
          title: "Resend Activation",
          description: "Resend activation email",
          access: "public",
          type: "auth",
        },
      ],
    },
  ];

  const getAccessColor = (access: string) => {
    switch (access) {
      case "public":
        return "green";
      case "admin":
        return "red";
      case "creator":
        return "blue";
      case "student":
        return "purple";
      case "authenticated":
        return "orange";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "page":
        return <FileTextOutlined />;
      case "api":
        return <ToolOutlined />;
      case "auth":
        return <LockOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "blue";
      case "api":
        return "purple";
      case "auth":
        return "orange";
      default:
        return "default";
    }
  };

  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <div style={{ padding: "1.5rem", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={1} style={{ color: "#22C55E", marginBottom: "16px" }}>
             CUMI.dev Sitemap
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              color: "#6B7280",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            Complete overview of all pages, routes, and API endpoints in the
            CUMI platform. This sitemap provides a comprehensive guide to the
            application structure and navigation.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {pageSections.map((section, sectionIndex) => (
            <Col xs={24} key={sectionIndex}>
              <Card
                title={
                  <Space>
                    {section.icon}
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                      {section.title}
                    </span>
                  </Space>
                }
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #E5E7EB",
                }}
                headStyle={{
                  background:
                    "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
                  borderRadius: "12px 12px 0 0",
                  borderBottom: "2px solid #E5E7EB",
                }}
              >
                <Paragraph style={{ color: "#6B7280", marginBottom: "24px" }}>
                  {section.description}
                </Paragraph>

                <Row gutter={[16, 16]}>
                  {section?.pages?.map((page, pageIndex) => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={pageIndex}>
                      <Card
                        size="small"
                        style={{
                          height: "100%",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        hoverable
                        bodyStyle={{ padding: "16px" }}
                      >
                        <div style={{ marginBottom: "12px" }}>
                          <Space>
                            {getTypeIcon(page.type)}
                            <Text strong style={{ fontSize: "14px" }}>
                              {page.title}
                            </Text>
                          </Space>
                        </div>

                        <Text
                          code
                          style={{
                            fontSize: "12px",
                            color: "#22C55E",
                            backgroundColor: "#F0FDF4",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            display: "block",
                            marginBottom: "8px",
                            wordBreak: "break-all",
                          }}
                        >
                          {page.path}
                        </Text>

                        <Paragraph
                          style={{
                            fontSize: "12px",
                            color: "#6B7280",
                            marginBottom: "12px",
                            minHeight: "36px",
                          }}
                        >
                          {page.description}
                        </Paragraph>

                        <Space size="small" wrap>
                          <Tag color={getAccessColor(page.access)}>
                            {page.access}
                          </Tag>
                          <Tag color={getTypeColor(page.type)}>{page.type}</Tag>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider style={{ margin: "48px 0" }} />

        <Card
          title={
            <Space>
              <BarChartOutlined />
              <span style={{ fontSize: "20px", fontWeight: "600" }}>
                Quick Statistics
              </span>
            </Space>
          }
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid #E5E7EB",
          }}
          headStyle={{
            background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
            borderRadius: "12px 12px 0 0",
            borderBottom: "2px solid #E5E7EB",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <div style={{ textAlign: "center", padding: "16px" }}>
                <Title level={3} style={{ color: "#22C55E", margin: 0 }}>
                  {pageSections.reduce(
                    (total, section) => total + (section?.pages?.length || 0),
                    0
                  )}
                </Title>
                <Text type="secondary">Total Pages</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div style={{ textAlign: "center", padding: "16px" }}>
                <Title level={3} style={{ color: "#3B82F6", margin: 0 }}>
                  {pageSections[0]?.pages?.length || 0}
                </Title>
                <Text type="secondary">Public Pages</Text>
              </div>
            </Col>
          </Row>
        </Card>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              href="/"
              icon={<HomeOutlined />}
            >
              Go Home
            </Button>
            <Button
              size="large"
              href="/recommendations"
              icon={<StarOutlined />}
            >
              View Tools
            </Button>
            <Button size="large" href="/contact-us" icon={<MailOutlined />}>
              Contact Us
            </Button>
          </Space>
        </div>
      </div>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
};

export default SitemapPageComponent;
