"use client";

import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Form,
  Input,
  message,
  Row,
  Col,
  Alert,
} from "antd";
import {
  MailOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const { Title, Text, Paragraph } = Typography;

export default function ResendActivationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const handleResendActivation = async (values: { email: string }) => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/auth/send-activation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          email: values.email,
        }),
      });

      if (response.ok) {
        messageApi.success("Activation email sent! Please check your inbox.");
        form.resetFields();
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

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      {contextHolder}
      <Card style={{ 
        width: '100%',
        maxWidth: 500,
        borderRadius: 16,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: 'none'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <MailOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Resend Activation Email
          </Title>
          <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 16 }}>
            Enter your email address to receive a new account activation link
          </Paragraph>
        </div>

        <Alert
          message="Account Activation Required"
          description="Your account needs to be activated before you can access all features. Check your email for the activation link, or request a new one below."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          onFinish={handleResendActivation}
          layout="vertical"
          initialValues={{
            email: session?.user?.email || "",
          }}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email address"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                width: '100%',
                height: 48,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 500
              }}
            >
              Send Activation Email
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToLogin}
            style={{
              borderColor: '#d9d9d9',
              color: '#666',
              borderRadius: 8,
              fontWeight: 500
            }}
          >
            Back to Login
          </Button>
        </div>

        <div style={{ 
          marginTop: 32, 
          padding: 20, 
          background: '#f6ffed', 
          borderRadius: 8, 
          border: '1px solid #b7eb8f' 
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <CheckCircleOutlined style={{ color: '#52c41a', marginTop: 2 }} />
            <div>
              <Text strong style={{ color: '#52c41a' }}>
                What happens next?
              </Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 14, lineHeight: 1.6 }}>
                  • Check your email inbox (and spam folder)<br />
                  • Click the activation link in the email<br />
                  • Your account will be activated immediately<br />
                  • You can then access all platform features
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
