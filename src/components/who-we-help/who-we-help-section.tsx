"use client";

import React from "react";
import { Row, Col, Typography } from "antd";
import { useTranslation } from "@contexts/translation.context";
import {
  ShopOutlined,
  TeamOutlined,
  RocketOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ITEMS = [
  { key: "small_businesses", icon: ShopOutlined, color: "#22C55E" },
  { key: "ngos", icon: TeamOutlined, color: "#0ea5e9" },
  { key: "startups", icon: RocketOutlined, color: "#8b5cf6" },
  { key: "organizations", icon: BankOutlined, color: "#f59e0b" },
];

export default function WhoWeHelpSection() {
  const { t } = useTranslation();

  return (
    <section
      id="who-we-help"
      style={{
        padding: "56px 24px",
        background: "#ffffff",
        position: "relative",
        marginTop: "100px",
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
            fontSize: "1.75rem",
          }}
        >
          {t("who_we_help.title")}
        </Title>
        <Row gutter={[24, 24]} justify="center">
          {ITEMS.map(({ key, icon: Icon, color }) => (
            <Col xs={12} sm={12} md={6} key={key}>
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${color}18`,
                    color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                    fontSize: "1.5rem",
                  }}
                >
                  <Icon />
                </div>
                <Text style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1e293b" }}>
                  {t(`who_we_help.${key}`)}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
