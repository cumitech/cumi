"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  notification,
  Typography,
  Space,
  Alert,
  Progress,
} from "antd";
import {
  LockOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

function ResetPasswordForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      api.error({
        message: "Invalid Reset Link",
        description:
          "The password reset link is invalid or missing. Please request a new one.",
        placement: "topRight",
      });
      setTimeout(() => router.push("/forgot-password"), 3000);
    }
  }, [token, router, api]);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 10;
    if (/[^a-zA-Z\d]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 30) return "#ff4d4f";
    if (strength < 60) return "#faad14";
    if (strength < 80) return "#1890ff";
    return "#22C55E";
  };

  const getStrengthText = (strength: number): string => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  const handleSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        api.success({
          message: "Password Reset Successful",
          description: "Your password has been updated successfully.",
          placement: "topRight",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        api.error({
          message: "Password Reset Failed",
          description: data.error || "Failed to reset password. Please try again.",
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Password Reset Failed",
        description: "An error occurred. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{
              padding: "40px",
              borderRadius: "20px",
              textAlign: "center",
              maxWidth: "500px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <Space direction="vertical" size="large" align="center">
              <CheckCircleOutlined style={{ fontSize: 64, color: "#22C55E" }} />
              <Title level={2} style={{ color: "#22C55E", margin: 0 }}>
                Password Reset Successful!
              </Title>
              <Text style={{ fontSize: "16px", color: "#666" }}>
                Your password has been updated successfully. You will be
                redirected to the sign-in page shortly.
              </Text>
              <Button
                type="primary"
                size="large"
                onClick={() => router.push("/login")}
                style={{
                  borderRadius: "8px",
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Go to Sign In
              </Button>
            </Space>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          style={{
            padding: "40px",
            borderRadius: "20px",
            maxWidth: "500px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <SafetyOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              <Title level={2} style={{ margin: "16px 0 8px 0" }}>
                Reset Your Password
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Create a new secure password for your account
              </Text>
            </div>

            <Alert
              message="Security Requirements"
              description="Your password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters."
              type="info"
              showIcon
              style={{ marginBottom: "16px" }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
            >
              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter your new password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message:
                      "Password must contain uppercase, lowercase, number, and special character",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your new password"
                  onChange={handlePasswordChange}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              {passwordStrength > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <Text>Password Strength:</Text>
                    <Text
                      style={{
                        color: getStrengthColor(passwordStrength),
                        fontWeight: "500",
                      }}
                    >
                      {getStrengthText(passwordStrength)}
                    </Text>
                  </div>
                  <Progress
                    percent={passwordStrength}
                    strokeColor={getStrengthColor(passwordStrength)}
                    showInfo={false}
                    size="small"
                  />
                </div>
              )}

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm your new password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: "center" }}>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push("/login")}
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Back to Sign In
              </Button>
            </div>
          </Space>
        </Card>
      </motion.div>
      {contextHolder}
    </div>
  );
}

export default function ResetPasswordPageComponent() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          }}
        >
          <Card style={{ padding: "40px", borderRadius: "20px" }}>
            <Space direction="vertical" size="large" align="center">
              <LockOutlined style={{ fontSize: 48, color: "#22C55E" }} />
              <Text>Loading...</Text>
            </Space>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
