"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Spin } from "antd";
import { useTranslation } from "@contexts/translation.context";

const { Title, Paragraph, Text } = Typography;

function QuoteIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <span style={{ fontSize: "28px", color: "#22C55E", marginBottom: "12px", ...style }} aria-hidden>
      &ldquo;
    </span>
  );
}

function UserIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <span style={{ color: "white", fontSize: "18px", fontWeight: "bold", ...style }} aria-hidden>
      A
    </span>
  );
}

export interface ITestimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
  order: number;
}

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(Array.isArray(data) ? data : []);
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section style={{ padding: "80px 0", background: "white", textAlign: "center" }}>
        <Spin size="large" />
      </section>
    );
  }

  if (!testimonials.length) return null;

  return (
    <section
      style={{
        padding: "80px 0",
        background: "white",
        position: "relative",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Title level={2} style={{ marginBottom: "8px", color: "#1e293b", fontWeight: "700" }}>
            {t("testimonials.title")}
          </Title>
          <Paragraph style={{ fontSize: "1.125rem", color: "#64748b", margin: 0 }}>
            {t("testimonials.subtitle")}
          </Paragraph>
        </div>
        <Row gutter={[24, 24]}>
          {testimonials.map((item) => (
            <Col xs={24} md={8} key={item.id}>
              <Card
                style={{
                  height: "100%",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
                styles={{ body: { padding: "24px" } }}
              >
                <QuoteIcon />
                <Paragraph
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "#374151",
                    marginBottom: "20px",
                    fontStyle: "italic",
                  }}
                >
                  {item.quote}
                </Paragraph>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UserIcon style={{ color: "white", fontSize: "18px" }} />
                  </div>
                  <div>
                    <Text strong style={{ display: "block", color: "#1e293b" }}>
                      {item.authorName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "13px" }}>
                      {item.authorRole || ""}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
