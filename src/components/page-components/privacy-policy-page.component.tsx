"use client";
import React from "react";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { Typography, Card, Divider } from "antd";
import { SafetyOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function PrivacyPolicyPageComponent() {
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
              <SafetyOutlined style={{ fontSize: "24px", color: "#22C55E" }} />
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>PRIVACY POLICY</span>
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
              Privacy Policy
            </Title>
            
            <Paragraph style={{ 
              fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)", 
              color: "#64748b", 
              maxWidth: "600px", 
              margin: "0 auto",
              lineHeight: "1.6",
              fontWeight: "400"
            }}>
              Your privacy is important to us. This policy explains how we collect, use, and protect 
              your personal information when you use our platform and services.
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
                  1. Information We Collect
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  We collect information you provide directly to us, such as when you create an account, 
                  enroll in courses, or contact us for support. This may include:
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li>Personal identification information (name, email, phone number)</li>
                  <li>Account credentials and preferences</li>
                  <li>Payment and billing information</li>
                  <li>Course progress and learning analytics</li>
                  <li>Communications with our support team</li>
                </ul>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  2. How We Use Your Information
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  We use the information we collect to:
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze usage patterns</li>
                  <li>Personalize your learning experience</li>
                  <li>Send promotional communications (with your consent)</li>
                </ul>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  3. Information Sharing and Disclosure
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except in the following circumstances:
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li>With service providers who assist in operating our platform</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  4. Data Security
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction. 
                  These measures include:
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data centers and infrastructure</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  5. Cookies and Tracking Technologies
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  We use cookies and similar tracking technologies to enhance your experience on our 
                  platform. These technologies help us:
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how our platform is used</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Improve our services and user experience</li>
                </ul>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", marginTop: "16px" }}>
                  You can control cookie settings through your browser preferences.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  6. Your Rights and Choices
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  You have the following rights regarding your personal information:
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                </ul>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  7. Data Retention
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  We retain your personal information for as long as necessary to provide our services 
                  and fulfill the purposes outlined in this policy. We may retain certain information 
                  for longer periods as required by law or for legitimate business purposes, such as 
                  resolving disputes and enforcing our agreements.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  8. International Data Transfers
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  Your information may be transferred to and processed in countries other than your 
                  country of residence. We ensure that such transfers comply with applicable data 
                  protection laws and implement appropriate safeguards to protect your personal information.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  9. Children&apos;s Privacy
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  Our services are not intended for children under the age of 13. We do not knowingly 
                  collect personal information from children under 13. If we become aware that we have 
                  collected personal information from a child under 13, we will take steps to delete 
                  such information promptly.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  10. Changes to This Policy
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new Privacy Policy on this page and updating the 
                  &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  11. Contact Us
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </Paragraph>
                <div style={{ 
                  background: "#f8fafc", 
                  padding: "24px", 
                  borderRadius: "12px", 
                  marginTop: "16px" 
                }}>
                  <Paragraph style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#374151" }}>
                    <strong>Email:</strong> privacy@cumi.dev
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
