"use client";

import React from "react";
import { Card, Typography, Divider } from "antd";
import BlogCTA from "@components/shared/blog-cta";

const { Title, Paragraph } = Typography;

export default function SampleBlogPost() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Title level={2}>How to Build Your First Website: A Complete Guide</Title>
        
        <Paragraph>
          Building your first website can seem overwhelming, but with the right tools and guidance, 
          anyone can create a professional-looking site. In this comprehensive guide, we&apos;ll walk 
          through everything you need to know to get started.
        </Paragraph>

        <Title level={3}>1. Choose Your Domain and Hosting</Title>
        <Paragraph>
          The first step in building a website is choosing a domain name and web hosting service. 
          Your domain is your website&apos;s address (like www.yoursite.com), while hosting is where 
          your website files are stored and served to visitors.
        </Paragraph>

        <Title level={3}>2. Select a Website Builder or CMS</Title>
        <Paragraph>
          Next, you&apos;ll need to decide how to build your website. You can use website builders 
          like WordPress, Wix, or Squarespace, or build from scratch using HTML, CSS, and JavaScript.
        </Paragraph>

        <Title level={3}>3. Design Your Website</Title>
        <Paragraph>
          Design is crucial for user experience. Choose a clean, professional layout that&apos;s easy 
          to navigate. Make sure your website is mobile-responsive, as most users browse on their phones.
        </Paragraph>

        <Title level={3}>4. Add Content and Optimize</Title>
        <Paragraph>
          Fill your website with valuable content that serves your audience. Don&apos;t forget to 
          optimize for search engines (SEO) to help people find your site.
        </Paragraph>

        <Divider />

        <Paragraph style={{ fontStyle: 'italic', color: '#666' }}>
          This guide covers the basics, but there&apos;s always more to learn about web development 
          and design. Keep experimenting and improving your skills!
        </Paragraph>
      </Card>

      {/* Blog CTA Component - This is how you'd use it in a real blog post */}
      <BlogCTA 
        category="hosting"
        title="Ready to Launch Your Website?"
        description="If you're ready to take the next step and get your website online, here's a hosting service I personally recommend:"
      />

      <Card style={{ borderRadius: 12, marginTop: 24 }}>
        <Title level={3}>More Resources</Title>
        <Paragraph>
          • <a href="/courses">Web Development Courses</a><br/>
          • <a href="/blog-posts">More Blog Posts</a><br/>
          • <a href="/recommendations">Recommended Tools</a>
        </Paragraph>
      </Card>
    </div>
  );
}
