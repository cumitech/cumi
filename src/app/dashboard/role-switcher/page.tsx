"use client";
import React from "react";
import { Card, Row, Col, Typography, Space, Divider } from "antd";
import { SwapOutlined, CrownOutlined, UserOutlined, BookOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useTranslation } from "@contexts/translation.context";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import RoleSwitcher from "@components/role-switcher";

const { Title, Text, Paragraph } = Typography;

export default function RoleSwitcherPage() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  const roleDescriptions = {
    admin: {
      title: "Administrator",
      icon: <CrownOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />,
      description: "Full system access and management capabilities. Can manage users, content, settings, and all system features.",
      features: [
        "Manage all users and roles",
        "Create and edit all content",
        "Access system settings",
        "View comprehensive analytics",
        "Manage courses and lessons",
        "Handle contact messages and subscriptions"
      ],
      color: "#ff4d4f"
    },
    creator: {
      title: "Content Creator",
      icon: <UserOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
      description: "Educational content creation and management. Focus on creating courses, lessons, and educational materials.",
      features: [
        "Create and manage courses",
        "Design lessons and quizzes",
        "Upload educational content",
        "Track student progress",
        "Manage assignments",
        "Access creator analytics"
      ],
      color: "#1890ff"
    },
    student: {
      title: "Student",
      icon: <BookOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      description: "Learning-focused interface for accessing courses, completing assignments, and tracking progress.",
      features: [
        "Browse available courses",
        "Enroll in courses",
        "Complete lessons and quizzes",
        "Submit assignments",
        "Track learning progress",
        "Access certificates and achievements"
      ],
      color: "#52c41a"
    }
  };

  const currentRole = session?.user?.role || "admin";
  const currentRoleInfo = roleDescriptions[currentRole as keyof typeof roleDescriptions];

  return (
    <div>
      <PageBreadCrumbs items={["Dashboard", "Role Switcher"]} />
      
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div style={{ textAlign: "center" }}>
                <SwapOutlined style={{ fontSize: "48px", color: "#1890ff", marginBottom: "16px" }} />
                <Title level={2} style={{ margin: 0 }}>
                  Role Switcher
                </Title>
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  Switch between different user roles to experience the platform from different perspectives
                </Text>
              </div>

              <Divider />

              <RoleSwitcher 
                currentRole={currentRole} 
                size="large"
                showLabel={true}
              />

              <Divider />

              <div>
                <Title level={3} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {currentRoleInfo.icon}
                  Current Role: {currentRoleInfo.title}
                </Title>
                <Paragraph style={{ fontSize: "16px", marginBottom: "24px" }}>
                  {currentRoleInfo.description}
                </Paragraph>

                <Title level={4}>Available Features:</Title>
                <Row gutter={[16, 16]}>
                  {currentRoleInfo.features.map((feature, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                      <Card
                        size="small"
                        style={{
                          border: `1px solid ${currentRoleInfo.color}20`,
                          backgroundColor: `${currentRoleInfo.color}05`,
                        }}
                      >
                        <Text style={{ color: currentRoleInfo.color }}>
                          ✓ {feature}
                        </Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              <Divider />

              <Card
                style={{
                  backgroundColor: "#f6ffed",
                  border: "1px solid #b7eb8f",
                }}
              >
                <Space>
                  <InfoCircleOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
                  <div>
                    <Text strong style={{ color: "#52c41a" }}>
                      Note:
                    </Text>
                    <Text style={{ marginLeft: "8px" }}>
                      Role switching allows you to experience different user perspectives. 
                      Your actual permissions remain unchanged - this is for interface testing only.
                    </Text>
                  </div>
                </Space>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
