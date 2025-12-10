"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Button,
  Form,
  Input,
  Typography,
  Divider,
  Card,
  Row,
  Col,
  Space,
} from "antd";
import {
  SiAuth0,
  SiGoogle,
  SiFacebook,
  SiTwitter,
  SiGithub,
  SiLinkedin,
  SiMicrosoft,
  SiApple,
} from "react-icons/si";
import Link from "next/link";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { useNotification } from "@refinedev/core";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { auth0SocialLogin } from "@utils/auth0-social-login";

const { Title, Text } = Typography;

export default function LoginFormComponent() {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { open } = useNotification();

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        action: "login",
        redirect: false,
      });

      if (response?.ok) {
        // Update session to refresh authentication state
        await update();

        // Force a page reload to ensure session is properly updated
        window.location.href = "/";

        open?.({
          type: "success",
          message: "Login Successful!",
          description: "Welcome back to CUMI!",
          key: "login-success",
        });
      } else {
        open?.({
          type: "error",
          message: "Login Failed!",
          description:
            response?.error || "Invalid email or password. Please try again.",
          key: "login-error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      open?.({
        type: "error",
        message: "Login Failed!",
        description: "An error occurred during login. Please try again.",
        key: "login-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNav logoPath="/" />

      {}
      <div
        style={{
          minHeight: "calc(100vh - 200px)",
          background: "var(--cumi-gradient-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <Row justify="center" style={{ width: "100%", maxWidth: "1200px" }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <Card
              style={{
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                border: "none",
                overflow: "hidden",
              }}
              styles={{ body: { padding: "3rem 2rem" } }}
            >
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--cumi-gradient-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    boxShadow: "var(--cumi-shadow-lg)",
                  }}
                >
                  <FaUser style={{ fontSize: "24px", color: "white" }} />
                </div>
                <Title
                  level={2}
                  style={{ margin: 0, color: "#1a1a1a", fontWeight: "600" }}
                >
                  Welcome Back
                </Title>
                <Text style={{ color: "#666", fontSize: "16px" }}>
                  Sign in to your CUMI account to continue
                </Text>
              </div>

              <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                style={{ marginTop: "2rem" }}
              >
                <Form.Item
                  label={
                    <Text strong style={{ color: "#1a1a1a", fontSize: "14px" }}>
                      Email Address
                    </Text>
                  }
                  name="email"
                  required={false}
                  // rules={[
                  //   { required: false, message: "Please enter your email!" },
                  //   { type: "email", message: "Enter a valid email!" },
                  // ]}
                >
                  <Input
                    placeholder="Enter your email address"
                    disabled={loading}
                    required={false}
                    // autoComplete="email"
                    // aria-label="Email address"
                    // aria-required="true"
                    prefix={
                      <FaEnvelope
                        style={{
                          color: "var(--cumi-primary)",
                          fontSize: "16px",
                          marginRight: "8px",
                        }}
                      />
                    }
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #f0f0f0",
                      padding: "12px 16px",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cumi-primary)";
                      e.target.style.boxShadow = "var(--cumi-shadow-sm)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f0f0f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Text strong style={{ color: "#1a1a1a", fontSize: "14px" }}>
                      Password
                    </Text>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
                    aria-label="Password"
                    aria-required="true"
                    prefix={
                      <FaLock
                        style={{
                          color: "var(--cumi-primary)",
                          fontSize: "16px",
                          marginRight: "8px",
                        }}
                      />
                    }
                    iconRender={(visible) =>
                      visible ? (
                        <FaEye style={{ color: "var(--cumi-primary)" }} />
                      ) : (
                        <FaEyeSlash style={{ color: "#999" }} />
                      )
                    }
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #f0f0f0",
                      padding: "12px 16px",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cumi-primary)";
                      e.target.style.boxShadow = "var(--cumi-shadow-sm)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f0f0f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </Form.Item>

                <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
                  <Link
                    href="/forgot-password"
                    style={{
                      color: "var(--cumi-primary)",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Form.Item style={{ marginBottom: "1.5rem" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    aria-label="Sign in to your account"
                    style={{
                      width: "100%",
                      height: "50px",
                      borderRadius: "12px",
                      background: "var(--cumi-gradient-primary)",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: "var(--cumi-shadow-lg)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--cumi-shadow-xl)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--cumi-shadow-lg)";
                    }}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </Form.Item>

                <Divider style={{ margin: "2rem 0" }}>
                  <Text style={{ color: "#999", fontSize: "14px" }}>OR</Text>
                </Divider>

                <div style={{ marginBottom: "2rem" }}>
                  <Text
                    strong
                    style={{
                      textAlign: "center",
                      color: "#1a1a1a",
                      fontSize: "14px",
                      marginBottom: "1rem",
                      display: "block",
                    }}
                  >
                    Continue with Social Media
                  </Text>

                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <Button
                      icon={<SiGoogle style={{ fontSize: "20px" }} />}
                      onClick={() => auth0SocialLogin.google()}
                      aria-label="Sign in with Google"
                      style={{
                        width: "100%",
                        height: "50px",
                        borderRadius: "12px",
                        border: "2px solid #f0f0f0",
                        background: "white",
                        color: "#4285f4",
                        fontSize: "16px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#4285f4";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px rgba(66, 133, 244, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#f0f0f0";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      Continue with Google
                    </Button>

                    {/* Facebook Sign In */}
                    <Button
                      icon={<SiFacebook style={{ fontSize: "20px" }} />}
                      onClick={() => auth0SocialLogin.facebook()}
                      aria-label="Sign in with Facebook"
                      style={{
                        width: "100%",
                        height: "50px",
                        borderRadius: "12px",
                        border: "2px solid #f0f0f0",
                        background: "white",
                        color: "#1877f2",
                        fontSize: "16px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#1877f2";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px rgba(24, 119, 242, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#f0f0f0";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      Continue with Facebook
                    </Button>
                  </Space>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <Text
                    strong
                    style={{
                      color: "#1a1a1a",
                      fontSize: "14px",
                      marginBottom: "1rem",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    Or use Auth0 Universal Login
                  </Text>
                  <Button
                    icon={<SiAuth0 style={{ fontSize: "20px" }} />}
                    onClick={() => signIn("auth0", { callbackUrl: "/" })}
                    aria-label="Sign in with Auth0 Universal Login"
                    style={{
                      width: "100%",
                      height: "50px",
                      borderRadius: "12px",
                      border: "2px solid #f0f0f0",
                      background: "white",
                      color: "#d8452e",
                      fontSize: "16px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#d8452e";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(216, 69, 46, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#f0f0f0";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Auth0 Universal Login
                  </Button>
                </div>
              </Form>

              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Text style={{ color: "#666", fontSize: "16px" }}>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    style={{
                      color: "var(--cumi-primary)",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    Create Account
                  </Link>
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {}
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
