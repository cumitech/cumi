"use client";
import React from "react";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { Typography, Card, Divider } from "antd";
import { SafetyOutlined, CalendarOutlined } from "@ant-design/icons";
import { useTranslation } from "@contexts/translation.context";

const { Title, Paragraph, Text } = Typography;

export default function CookiePolicyPageComponent() {
  const { t } = useTranslation();

  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <section
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          padding: "80px 0 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 32px",
                background: "white",
                borderRadius: "50px",
                marginBottom: "32px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              <SafetyOutlined style={{ fontSize: "24px", color: "#22C55E" }} />
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                {t("cookie_policy.badge")}
              </span>
            </div>

            <Title
              level={1}
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                marginBottom: "24px",
                background: "linear-gradient(135deg, #1e293b 0%, #22C55E 50%, #0EA5E9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: "1.1",
                fontWeight: "800",
                letterSpacing: "-0.02em",
              }}
            >
              {t("cookie_policy.title")}
            </Title>

            <Paragraph
              style={{
                fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
                color: "#64748b",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
                fontWeight: "400",
              }}
            >
              {t("cookie_policy.intro")}
            </Paragraph>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
                marginTop: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <CalendarOutlined style={{ color: "#22C55E" }} />
                <Text style={{ fontWeight: "500", color: "#1e293b" }}>
                  {t("cookie_policy.last_updated")}: {t("cookie_policy.last_updated_value")}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "white" }}>
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
          <Card
            style={{
              borderRadius: "24px",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
              padding: "48px",
            }}
          >
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  {t("cookie_policy.section_1_title")}
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  {t("cookie_policy.section_1_body")}
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  {t("cookie_policy.section_2_title")}
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  {t("cookie_policy.section_2_body")}
                </Paragraph>
                <ul style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151", paddingLeft: "24px" }}>
                  <li>{t("cookie_policy.section_2_item_1")}</li>
                  <li>{t("cookie_policy.section_2_item_2")}</li>
                  <li>{t("cookie_policy.section_2_item_3")}</li>
                  <li>{t("cookie_policy.section_2_item_4")}</li>
                </ul>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  {t("cookie_policy.section_3_title")}
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  {t("cookie_policy.section_3_body")}
                </Paragraph>
              </div>

              <Divider />

              <div style={{ marginBottom: "48px" }}>
                <Title level={2} style={{ color: "#1e293b", marginBottom: "16px" }}>
                  {t("cookie_policy.section_4_title")}
                </Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
                  {t("cookie_policy.section_4_body")}
                </Paragraph>
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "24px",
                    borderRadius: "12px",
                    marginTop: "16px",
                  }}
                >
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
