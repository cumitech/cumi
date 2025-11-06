"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography, Space } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function ForgotPasswordPageComponent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (response.ok) {
        setEmailSent(true);
        message.success('If the email exists, a password reset link has been sent');
      } else {
        message.error(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      message.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <MailOutlined style={{ fontSize: 48, color: '#52c41a' }} />
            <Title level={3}>Check Your Email</Title>
            <Text>
              We&apos;ve sent a password reset link to your email address. 
              Please check your inbox and follow the instructions to reset your password.
            </Text>
            <Text type="secondary">
              The link will expire in 1 hour for security reasons.
            </Text>
            <Button 
              type="primary" 
              onClick={() => router.push('/login')}
              style={{ width: '100%' }}
            >
              Back to Sign In
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <LockOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Title level={2}>Forgot Password?</Title>
            <Text type="secondary">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
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
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Button 
              type="link" 
              onClick={() => router.push('/login')}
            >
              Back to Sign In
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
}
