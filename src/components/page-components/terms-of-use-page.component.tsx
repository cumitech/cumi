"use client";
import React from "react";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { Typography, Card, Divider } from "antd";
import { FileTextOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function TermsOfUsePageComponent() {
  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>
      
      {/* Hero Section */}
      <section style={{ 
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: "80px 0 60px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ 
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px", 
              background: "white", 
              borderRadius: "50px", 
              marginBottom: "32px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(0, 0, 0, 0.05)"
            }}>
              <FileTextOutlined style={{ fontSize: "24px", color: "#22C55E" }} />
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>LEGAL DOCUMENT</span>
            </div>
            
            <Title level={1} style={{ 
              fontSize: "clamp(2.5rem, 6vw, 4rem)", 
              marginBottom: "24px",
              background: "linear-gradient(135deg, #1e293b 0%, #22C55E 50%, #0EA5E9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: "1.1",
              fontWeight: "800",
              letterSpacing: "-0.02em"
            }}>
              Terms of Use
            </Title>
            
            <Paragraph style={{ 
              fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)", 
              color: "#64748b", 
              maxWidth: "600px", 
              margin: "0 auto",
              lineHeight: "1.6",
              fontWeight: "400"
            }}>
              Please read these terms carefully before using our platform and services. 
              By accessing or using CUMI Technology, you agree to be bound by these terms.
            </Paragraph>

            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              gap: "24px",
              marginTop: "32px"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                padding: "12px 20px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(0, 0, 0, 0.05)"
              }}>
                <CalendarOutlined style={{ color: "#22C55E" }} />
                <Text style={{ fontWeight: "500", color: "#1e293b" }}>Last Updated: January 2025</Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: "80px 0", background: "white" }}>
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
          <Card style={{ 
            borderRadius: "24px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
            padding: "48px"
          }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              
              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  1. Acceptance of Terms
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  By accessing and using CUMI Technology&apos;s website, mobile applications, and services 
                  (collectively, the &quot;Service&quot;), you accept and agree to be bound by the terms and 
                  provision of this agreement. If you do not agree to abide by the above, please do 
                  not use this service.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  2. Description of Service
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  CUMI Technology provides a comprehensive learning management system (LMS), creator 
                  dashboard, and educational platform. Our services include but are not limited to:
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li>Online course creation and management</li>
                  <li>Student enrollment and progress tracking</li>
                  <li>Content delivery and assessment tools</li>
                  <li>Mobile applications for iOS and Android</li>
                  <li>Creator analytics and reporting</li>
                </ul>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  3. User Accounts and Registration
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  To access certain features of our Service, you must register for an account. You agree to:
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  4. Acceptable Use Policy
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  You agree not to use the Service to:
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Upload malicious code or harmful content</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the Service for commercial purposes without authorization</li>
                </ul>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  5. Content and Intellectual Property
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  You retain ownership of content you create and upload to our platform. However, by 
                  using our Service, you grant us a worldwide, non-exclusive, royalty-free license to 
                  use, reproduce, and distribute your content solely for the purpose of providing our 
                  services. You represent that you have the right to grant this license.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  6. Payment Terms
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  For paid services, you agree to pay all fees as described on our website. Payments 
                  are processed securely through our payment partners. All fees are non-refundable 
                  unless otherwise stated. We reserve the right to change our pricing with 30 days&apos; 
                  notice to existing subscribers.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  7. Privacy and Data Protection
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs 
                  your use of the Service, to understand our practices regarding the collection and use 
                  of your personal information.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  8. Limitation of Liability
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  CUMI Technology shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including but not limited to loss of profits, data, or use, 
                  incurred by you or any third party, whether in an action in contract or tort, 
                  arising from your use of the Service.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  9. Termination
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  We may terminate or suspend your account and access to the Service immediately, 
                  without prior notice or liability, for any reason whatsoever, including without 
                  limitation if you breach the Terms. Upon termination, your right to use the Service 
                  will cease immediately.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  10. Changes to Terms
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  We reserve the right to modify or replace these Terms at any time. If a revision is 
                  material, we will try to provide at least 30 days&apos; notice prior to any new terms 
                  taking effect. What constitutes a material change will be determined at our sole 
                  discretion.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  11. Contact Information
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  If you have any questions about these Terms of Use, please contact us at:
                </Paragraph>
                <div style={{ 
                  background: "#f8fafc", 
                  padding: "24px", 
                  borderRadius: "12px", 
                  marginTop: "16px" 
                }}>
                  <Paragraph style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#374151" }}>
                    <strong>Email:</strong> legal@cumi.dev
                  </Paragraph>
                  <Paragraph style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#374151" }}>
                    <strong>Phone:</strong> +237 681 289 411
                  </Paragraph>
                  <Paragraph style={{ margin: "0", fontSize: "16px", color: "#374151" }}>
                    <strong>Address:</strong> Douala, Cameroon
                  </Paragraph>
                </div>
              </div>

            </div>
          </Card>
        </div>
      </section>
      
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
