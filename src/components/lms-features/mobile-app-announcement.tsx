"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Button, Space, Badge } from "antd";
import {
  MobileOutlined,
  AppleOutlined,
  AndroidOutlined,
  BellOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslation } from "@contexts/translation.context";

const { Title, Paragraph, Text } = Typography;

// Dynamically import motion components to avoid SSR issues
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => <div />,
  }
);

export const MobileAppAnnouncement = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create animated wrapper component
  const AnimatedWrapper = ({ children, ...props }: any) => {
    // Extract motion-specific props to avoid passing them to regular DOM elements
    const { 
      initial, 
      animate, 
      whileInView, 
      viewport, 
      transition, 
      ...domProps 
    } = props;
    
    if (!isClient) {
      return <div {...domProps}>{children}</div>;
    }
    return (
      <MotionDiv 
        initial={initial}
        animate={animate}
        whileInView={whileInView}
        viewport={viewport}
        transition={transition}
        {...domProps}
      >
        {children}
      </MotionDiv>
    );
  };

  return (
    <section
      style={{
        padding: "0 0 48px  0",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
      }}
    >
      <div className="container bg-none" style={{ maxWidth: "1000px" }}>
        <AnimatedWrapper
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card
            size="small"
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              boxShadow: "0 8px 24px rgba(34, 197, 94, 0.08)",
              overflow: "hidden",
            }}
            bodyStyle={{ padding: "32px 24px" }}
          >
            <Row gutter={[32, 24]} align="middle">
              <Col xs={24} md={14}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Link href="/mobile-app" style={{ textDecoration: "none" }}>
                    <Badge
                      count={t("lms.coming_soon")}
                      style={{
                        background:
                          "linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)",
                        fontSize: "11px",
                        padding: "0 12px",
                        height: "24px",
                        lineHeight: "24px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease"
                      }}
                      onMouseOver={(e) => (e.target as HTMLElement).style.transform = "translateY(-1px)"}
                      onMouseOut={(e) => (e.target as HTMLElement).style.transform = "translateY(0)"}
                    />
                  </Link>
                  <Title
                    level={2}
                    style={{
                      margin: "12px 0 8px 0",
                      fontSize: "clamp(1.375rem, 3vw, 1.875rem)",
                      lineHeight: "1.3",
                    }}
                  >
                    <MobileOutlined
                      style={{
                        color: "#22C55E",
                        marginRight: "10px",
                        fontSize: "clamp(1.375rem, 3vw, 1.875rem)",
                      }}
                    />
                    <span className="gradient-title">
                      {t("mobile.title_short")}
                    </span>
                  </Title>
                  <Paragraph
                    style={{
                      color: "#6B7280",
                      margin: "0 0 16px 0",
                      fontSize: "15px",
                      lineHeight: "1.6",
                    }}
                  >
                    {t("mobile.subtitle_short")}
                  </Paragraph>
                  <Space size="middle" wrap style={{ marginTop: "8px" }}>
                    <Space size="small">
                      <AppleOutlined
                        style={{ fontSize: "22px", color: "#6B7280" }}
                      />
                      <Text
                        style={{
                          fontSize: "13px",
                          color: "#6B7280",
                          fontWeight: 500,
                        }}
                      >
                        iOS
                      </Text>
                    </Space>
                    <Space size="small">
                      <AndroidOutlined
                        style={{ fontSize: "22px", color: "#6B7280" }}
                      />
                      <Text
                        style={{
                          fontSize: "13px",
                          color: "#6B7280",
                          fontWeight: 500,
                        }}
                      >
                        Android
                      </Text>
                    </Space>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} md={10} style={{ textAlign: "center" }}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Button
                    size="large"
                    shape="round"
                    icon={<BellOutlined />}
                    style={{
                      background:
                        "linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)",
                      border: "none",
                      color: "white",
                      fontWeight: "600",
                      width: "100%",
                      maxWidth: "280px",
                      height: "48px",
                      fontSize: "15px",
                    }}
                  >
                    {t("mobile.notify_me")}
                  </Button>
                  <Text
                    style={{
                      fontSize: "12px",
                      color: "#9CA3AF",
                      display: "block",
                    }}
                  >
                    {t("mobile.expected_launch")}
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </AnimatedWrapper>
      </div>
    </section>
  );
};

export default MobileAppAnnouncement;
