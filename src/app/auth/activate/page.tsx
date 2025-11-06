"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Result,
  Spin,
  Alert,
  Row,
  Col,
} from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { userAPI } from "@store/api/user_api";

const { Title, Text, Paragraph } = Typography;

export default function AccountActivationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [message, setMessage] = useState("");
  
  const [updateUserStatus] = userAPI.useUpdateUserStatusMutation();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');

        if (!token || !userId) {
          setStatus('invalid');
          setMessage('Invalid activation link. Missing required parameters.');
          return;
        }

        // Verify token and activate account
        const response = await fetch('/api/auth/verify-activation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, userId }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Update user status to active
          await updateUserStatus({
            userId,
            accountStatus: 'active',
          }).unwrap();

          setStatus('success');
          setMessage('Your account has been successfully activated!');
        } else {
          setStatus('error');
          setMessage(result.message || 'Failed to activate account. The link may be expired or invalid.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error?.message || 'An error occurred during activation.');
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [searchParams, updateUserStatus]);

  const handleRedirectToDashboard = () => {
    router.push('/dashboard');
  };

  const handleResendActivation = () => {
    router.push('/auth/resend-activation');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ 
          width: 400, 
          textAlign: 'center',
          borderRadius: 16,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <Spin size="large" />
          <div style={{ marginTop: 24 }}>
            <Title level={4}>Activating Your Account</Title>
            <Text type="secondary">Please wait while we activate your account...</Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <Card style={{ 
        width: '100%',
        maxWidth: 500,
        borderRadius: 16,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: 'none'
      }}>
        {status === 'success' && (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 64 }} />}
            title={
              <Title level={3} style={{ color: '#52c41a', margin: 0 }}>
                Account Activated Successfully!
              </Title>
            }
            subTitle={
              <div style={{ marginTop: 16 }}>
                <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
                  {message}
                </Paragraph>
                <Alert
                  message="Welcome to the platform!"
                  description="Your account is now active and you have full access to all features."
                  type="success"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              </div>
            }
            extra={
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleRedirectToDashboard}
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
                  Go to Dashboard
                </Button>
              </Space>
            }
          />
        )}

        {status === 'error' && (
          <Result
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 64 }} />}
            title={
              <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>
                Activation Failed
              </Title>
            }
            subTitle={
              <div style={{ marginTop: 16 }}>
                <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
                  {message}
                </Paragraph>
                <Alert
                  message="What can you do?"
                  description={
                    <div>
                      <div>• Check if the activation link is still valid</div>
                      <div>• Request a new activation email</div>
                      <div>• Contact support if the problem persists</div>
                    </div>
                  }
                  type="warning"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              </div>
            }
            extra={
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleResendActivation}
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
                  Request New Activation Email
                </Button>
                <Button
                  size="large"
                  onClick={() => router.push('/login')}
                  style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 500
                  }}
                >
                  Back to Login
                </Button>
              </Space>
            }
          />
        )}

        {status === 'invalid' && (
          <Result
            icon={<ExclamationCircleOutlined style={{ color: '#fa8c16', fontSize: 64 }} />}
            title={
              <Title level={3} style={{ color: '#fa8c16', margin: 0 }}>
                Invalid Activation Link
              </Title>
            }
            subTitle={
              <div style={{ marginTop: 16 }}>
                <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
                  {message}
                </Paragraph>
                <Alert
                  message="The activation link is missing required information."
                  description="Please use the activation link sent to your email address."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              </div>
            }
            extra={
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleResendActivation}
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
                  Request Activation Email
                </Button>
                <Button
                  size="large"
                  onClick={() => router.push('/login')}
                  style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 500
                  }}
                >
                  Back to Login
                </Button>
              </Space>
            }
          />
        )}
      </Card>
    </div>
  );
}
