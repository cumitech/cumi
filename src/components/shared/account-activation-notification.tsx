"use client";

import React, { useState } from "react";
import {
  Alert,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  message,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { userAPI } from "@store/api/user_api";

const { Title, Text, Paragraph } = Typography;

interface AccountActivationNotificationProps {
  onActivationSuccess?: () => void;
}

export default function AccountActivationNotification({
  onActivationSuccess,
}: AccountActivationNotificationProps) {
  const { data: session } = useSession();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // RTK Query hooks
  const [updateUserStatus] = userAPI.useUpdateUserStatusMutation();

  const handleActivateAccount = async () => {
    try {
      setLoading(true);
      
      await updateUserStatus({
        userId: session?.user?.id || "",
        accountStatus: "active",
      }).unwrap();

      messageApi.success("Account activated successfully!");
      setModalVisible(false);
      onActivationSuccess?.();
    } catch (error: any) {
      messageApi.error(error?.data?.message || "Failed to activate account");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestActivation = async () => {
    try {
      setLoading(true);
      
      // Send activation request email
      const response = await fetch("/api/auth/send-activation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          email: session?.user?.email,
        }),
      });

      if (response.ok) {
        messageApi.success("Activation email sent! Please check your inbox.");
        setModalVisible(false);
      } else {
        const error = await response.json();
        messageApi.error(error.message || "Failed to send activation email");
      }
    } catch (error) {
      messageApi.error("Failed to send activation email");
    } finally {
      setLoading(false);
    }
  };

  const showActivationModal = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Don't show notification if user is already active
  // Also handle cases where accountStatus might be undefined/null
  if (session?.user?.accountStatus === "active") {
    return null;
  }

  return (
    <>
      {contextHolder}
      <Alert
        message={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ExclamationCircleOutlined style={{ color: "#fa8c16", fontSize: 20 }} />
              <div>
                <Text strong style={{ fontSize: 16 }}>
                  Account Activation Required
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary">
                    Your account is currently inactive. Please activate it to access all features.
                  </Text>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              onClick={showActivationModal}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              Activate Account
            </Button>
          </div>
        }
        type="warning"
        showIcon={false}
        style={{
          marginBottom: 24,
          borderRadius: 12,
          border: "1px solid #fa8c16",
          background: "linear-gradient(135deg, #fff7e6 0%, #fff2d9 100%)",
        }}
      />

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>
              Account Activation
            </Title>
          </div>
        }
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        style={{ top: 20 }}
      >
        <div style={{ padding: "20px 0" }}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: 12,
                  background: "#fafafa",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <UserOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
                  <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                    {session?.user?.name}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    {session?.user?.email}
                  </Text>
                </div>

                <Divider />

                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>Account Status</Title>
                  <Space>
                    <ExclamationCircleOutlined style={{ color: "#fa8c16" }} />
                    <Text strong style={{ color: "#fa8c16" }}>
                      Inactive Account
                    </Text>
                  </Space>
                  <Paragraph type="secondary" style={{ marginTop: 8 }}>
                    Your account is currently inactive. To activate your account, you can either:
                  </Paragraph>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>Activation Options</Title>
                  
                  <div style={{ marginBottom: 16 }}>
                    <Card
                      size="small"
                      style={{
                        border: "1px solid #52c41a",
                        background: "#f6ffed",
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        <div style={{ flex: 1 }}>
                          <Text strong style={{ color: "#52c41a" }}>
                            Instant Activation
                          </Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Activate your account immediately
                            </Text>
                          </div>
                        </div>
                        <Button
                          type="primary"
                          onClick={handleActivateAccount}
                          loading={loading}
                          style={{
                            background: "#52c41a",
                            borderColor: "#52c41a",
                            borderRadius: 6,
                          }}
                        >
                          Activate Now
                        </Button>
                      </div>
                    </Card>

                    <Card
                      size="small"
                      style={{
                        border: "1px solid #1890ff",
                        background: "#f0f9ff",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <MailOutlined style={{ color: "#1890ff" }} />
                        <div style={{ flex: 1 }}>
                          <Text strong style={{ color: "#1890ff" }}>
                            Email Verification
                          </Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Receive activation link via email
                            </Text>
                          </div>
                        </div>
                        <Button
                          onClick={handleRequestActivation}
                          loading={loading}
                          style={{
                            borderColor: "#1890ff",
                            color: "#1890ff",
                            borderRadius: 6,
                          }}
                        >
                          Send Email
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>

                <div style={{ background: "#fff7e6", padding: 16, borderRadius: 8, border: "1px solid #fa8c16" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <ExclamationCircleOutlined style={{ color: "#fa8c16", marginTop: 2 }} />
                    <div>
                      <Text strong style={{ color: "#fa8c16" }}>
                        Important Notice
                      </Text>
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          • Inactive accounts have limited access to platform features
                          <br />
                          • Some content and interactions may be restricted
                          <br />
                          • Activation is required for full platform access
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
}
