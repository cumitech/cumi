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
} from "react-icons/si";
import Link from "next/link";
import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { useNotification } from "@refinedev/core";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { auth0SocialLogin } from "@utils/auth0-social-login";

const { Title, Text } = Typography;

export default function RegisterPageComponent() {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const { open } = useNotification();

const onFinish = async (values: any) => {
    setLoading(true);

try {
      const response = await signIn("credentials", {
        email: values.email,
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        action: "register",
        redirect: false,
      });

if (response?.ok) {
        // Update session to refresh authentication state
        await update();
        
        // Force a page reload to ensure session is properly updated
        window.location.href = "/";
        
        open?.({
          type: "success",
          message: "Registration Successful!",
          description: "Welcome to CUMI! Your account has been created successfully.",
          key: "registration-success",
        });
      } else {
        open?.({
          type: "error",
          message: "Registration Failed!",
          description: response?.error || "Failed to create account. Please try again.",
          key: "registration-error",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      open?.({
        type: "error",
        message: "Registration Failed!",
        description: "An error occurred during registration. Please try again.",
        key: "registration-error",
      });
    } finally {
      setLoading(false);
    }
  };

return (
    <>
      {}
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

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
              {}
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
                  <FaUserPlus style={{ fontSize: "24px", color: "white" }} />
                </div>
                <Title
                  level={2}
                  style={{ margin: 0, color: "#1a1a1a", fontWeight: "600" }}
                >
                  Join CUMI
                </Title>
                <Text style={{ color: "#666", fontSize: "16px" }}>
                  Create your account to access our technology platform
                </Text>
              </div>

{}
              <Form
                name="register"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                style={{ marginTop: "2rem" }}
                autoComplete="off"
              >
                <Form.Item
                  label={
                    <Text strong style={{ color: "#1a1a1a", fontSize: "14px" }}>
                      Username
                    </Text>
                  }
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your username!" },
                  ]}
                >
                  <Input
                    placeholder="Enter your username"
                    disabled={loading}
                    autoComplete="username"
                    aria-label="Username"
                    aria-required="true"
                    prefix={
                      <FaUser
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
                      Email Address
                    </Text>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Enter a valid email!" },
                  ]}
                >
                  <Input
                    placeholder="Enter your email address"
                    disabled={loading}
                    autoComplete="email"
                    aria-label="Email address"
                    aria-required="true"
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
                    {
                      min: 6,
                      message: "Password must be at least 6 characters!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="new-password"
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

<Form.Item
                  label={
                    <Text strong style={{ color: "#1a1a1a", fontSize: "14px" }}>
                      Confirm Password
                    </Text>
                  }
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Confirm your password"
                    disabled={loading}
                    autoComplete="new-password"
                    aria-label="Confirm password"
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

{}
                <Form.Item style={{ marginBottom: "1.5rem" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    aria-label="Create your account"
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
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form.Item>

{}
                <Divider style={{ margin: "2rem 0" }}>
                  <Text style={{ color: "#999", fontSize: "14px" }}>OR</Text>
                </Divider>

{}
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
                    Register with Social Media
                  </Text>

<Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    {}
                    <Button
                      icon={<SiGoogle style={{ fontSize: "20px" }} />}
                      onClick={auth0SocialLogin.google}
                      aria-label="Register with Google"
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
                      Register with Google
                    </Button>

{}
                    <Button
                      icon={<SiFacebook style={{ fontSize: "20px" }} />}
                      onClick={auth0SocialLogin.facebook}
                      aria-label="Register with Facebook"
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
                      Register with Facebook
                    </Button>
                  </Space>
                </div>

{}
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
                    onClick={() => signIn("auth0")}
                    aria-label="Register with Auth0 Universal Login"
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

{}
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Text style={{ color: "#666", fontSize: "16px" }}>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    style={{
                      color: "var(--cumi-primary)",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    Sign In
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
