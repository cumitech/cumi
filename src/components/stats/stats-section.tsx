"use client";

import React from "react";
import { Row, Col, Typography } from "antd";
import { useTranslation } from "@contexts/translation.context";

const { Title, Text } = Typography;

const STATS = [
  { key: "projects", value: "50+", valueKey: "stats.projects" },
  { key: "clients", value: "30+", valueKey: "stats.clients" },
  { key: "years", value: "5+", valueKey: "stats.years" },
];

export default function StatsSection() {
  const { t } = useTranslation();

  return (
    <section
      style={{
        padding: "64px 24px",
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container bg-none" style={{ position: "relative", zIndex: 1 }}>
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#1e293b",
            fontWeight: "700",
          }}
        >
          {t("stats.title")}
        </Title>
        <Row gutter={[32, 32]} justify="center">
          {STATS.map((item) => (
            <Col xs={24} sm={8} md={8} key={item.key}>
              <div style={{ textAlign: "center", padding: "24px 16px" }}>
                <Text
                  style={{
                    display: "block",
                    fontSize: "2.25rem",
                    fontWeight: "800",
                    color: "#22C55E",
                    marginBottom: "8px",
                    lineHeight: 1.2,
                  }}
                >
                  {item.value}
                </Text>
                <Text style={{ fontSize: "0.9375rem", color: "#64748b", fontWeight: 500 }}>
                  {t(item.valueKey)}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
