"use client";

import React from "react";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import BannerComponent from "@components/banner/banner.component";
import { Row, Col, Typography, Card, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useTranslation } from "@contexts/translation.context";
import { trackCtaClick } from "@lib/analytics";

const { Title, Paragraph, Text } = Typography;

const PLANS = [
  {
    key: "per_project",
    titleKey: "pricing.per_project",
    descKey: "pricing.contact_for_pricing",
    features: ["pricing.feature_1", "pricing.feature_2", "pricing.feature_3"],
  },
  {
    key: "custom",
    titleKey: "pricing.custom",
    descKey: "pricing.contact_for_pricing",
    features: ["pricing.feature_4", "pricing.feature_5", "pricing.feature_6"],
    highlighted: true,
  },
  {
    key: "enterprise",
    titleKey: "pricing.enterprise",
    descKey: "pricing.contact_for_pricing",
    features: ["pricing.feature_7", "pricing.feature_8", "pricing.feature_9"],
  },
];

export default function PricingPageComponent() {
  const { t } = useTranslation();

  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>
      <BannerComponent
        breadcrumbs={[{ label: t("nav.pricing"), uri: "pricing" }]}
        pageTitle={t("pricing.title")}
      />
      <section style={{ padding: "60px 0 80px", background: "#f8fafc" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Title level={2} style={{ marginBottom: "8px", color: "#1e293b" }}>
              {t("pricing.title")}
            </Title>
            <Paragraph style={{ fontSize: "1.125rem", color: "#64748b", maxWidth: "560px", margin: "0 auto" }}>
              {t("pricing.subtitle")}
            </Paragraph>
          </div>
          <Row gutter={[24, 24]} justify="center">
            {PLANS.map((plan) => (
              <Col xs={24} sm={24} md={8} key={plan.key}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: "16px",
                    border: plan.highlighted ? "2px solid #22C55E" : "1px solid #e5e7eb",
                    boxShadow: plan.highlighted ? "0 8px 24px rgba(34, 197, 94, 0.15)" : "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                  styles={{ body: { padding: "32px" } }}
                >
                  <Title level={4} style={{ marginBottom: "8px", color: "#1e293b" }}>
                    {t(plan.titleKey)}
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: "24px" }}>
                    {t(plan.descKey)}
                  </Paragraph>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
                    {plan.features.map((fk) => (
                      <li
                        key={fk}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "12px",
                          fontSize: "14px",
                          color: "#374151",
                        }}
                      >
                        <CheckOutlined style={{ color: "#22C55E" }} />
                        {t(fk)}
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="primary"
                    size="large"
                    block
                    shape="round"
                    href="/contact-us"
                    style={{
                      background: plan.highlighted
                        ? "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)"
                        : undefined,
                      border: "none",
                    }}
                    onClick={() => trackCtaClick(`pricing_${plan.key}`, "/contact-us")}
                  >
                    {t("pricing.get_started")}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
