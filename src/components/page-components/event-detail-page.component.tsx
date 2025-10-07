"use client";

import Image from "next/image";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import Share from "@components/shared/share";
import { eventAPI } from "@store/api/event_api";
import {
  Row,
  Col,
  Layout,
  Empty,
  Spin,
  Card,
  Typography,
  Button,
  Tag,
  Space,
  Divider,
  App,
} from "antd";
import { motion } from "framer-motion";
import EventRegistrationModal from "@components/shared/event-registration-modal.component";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  GlobalOutlined,
  TagOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useSession } from "next-auth/react";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface EventDetailPageComponentProps {
  eventSlug: string;
}

export default function EventDetailPageComponent({
  eventSlug,
}: EventDetailPageComponentProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationModalVisible, setRegistrationModalVisible] =
    useState(false);
  const { data: session } = useSession();
  const { message } = App.useApp();

const {
    data: event,
    error,
    isLoading,
    isFetching,
  } = eventAPI.useGetSingleEventBySlugQuery(eventSlug);

const handleRegister = () => {
    if (!event) return;

// Check if user is logged in
    if (!session?.user?.id) {
      message.error("Please log in to register for events");
      return;
    }

setRegistrationModalVisible(true);
  };

const loading = isLoading || isFetching;

return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

{loading ? (
        <div
          style={{
            minHeight: "65vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Card
            style={{
              padding: "40px",
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <Spin size="large" />
            <div style={{ marginTop: "16px", fontSize: "16px", color: "#666" }}>
              Loading event...
            </div>
          </Card>
        </div>
      ) : error || !event ? (
        <div
          style={{
            minHeight: "65vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Empty description="Event not found" />
        </div>
      ) : (
        <>
          <BannerComponent
            breadcrumbs={[
              { label: "Events", uri: "events" },
              { label: event.title, uri: "#" },
            ]}
            pageTitle="Event Details"
          />

<div className="container mb-5">
            <Content>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <motion.div
                    className="box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card
                      style={{
                        borderRadius: "20px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        border: "none",
                        overflow: "hidden",
                      }}
                      styles={{ body: { padding: 0 } }}
                    >
                      <div style={{ padding: "clamp(1.5rem, 4vw, 3rem)" }}>
                        <div className="mb-4">
                          <Title
                            level={1}
                            style={{
                              marginBottom: "20px",
                              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                              fontWeight: 800,
                              color: "#1f2937",
                              letterSpacing: "-0.02em",
                              lineHeight: 1.2,
                            }}
                          >
                            {event.title}
                          </Title>
                          <Space wrap size="middle">
                            <Tag
                              style={{
                                padding: "8px 18px",
                                borderRadius: "24px",
                                fontSize: "14px",
                                fontWeight: 600,
                                background:
                                  "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                                border: "1px solid rgba(245, 158, 11, 0.2)",
                                color: "#d97706",
                              }}
                            >
                              <CalendarOutlined
                                style={{ marginRight: "6px" }}
                              />
                              Event
                            </Tag>
                            {event.category && (
                              <Tag
                                style={{
                                  padding: "8px 18px",
                                  borderRadius: "24px",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  background:
                                    "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                  border: "1px solid rgba(14, 165, 233, 0.2)",
                                  color: "#0284c7",
                                }}
                              >
                                {event.category?.charAt(0).toUpperCase() +
                                  event.category?.slice(1)}
                              </Tag>
                            )}
                            <Tag
                              style={{
                                padding: "8px 18px",
                                borderRadius: "24px",
                                fontSize: "14px",
                                fontWeight: 600,
                                background: event.isFree
                                  ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
                                  : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                                border: `1px solid ${
                                  event.isFree
                                    ? "rgba(34, 197, 94, 0.25)"
                                    : "rgba(59, 130, 246, 0.2)"
                                }`,
                                color: event.isFree ? "#059669" : "#1e40af",
                              }}
                            >
                              {event.isFree ? "Free Event" : `Paid Event`}
                            </Tag>
                            {event.status && (
                              <Tag
                                style={{
                                  padding: "8px 18px",
                                  borderRadius: "24px",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  ...(event.status === "published" && {
                                    background:
                                      "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                                    border: "1px solid rgba(34, 197, 94, 0.25)",
                                    color: "#059669",
                                  }),
                                  ...(event.status === "draft" && {
                                    background:
                                      "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)",
                                    border: "1px solid rgba(249, 115, 22, 0.2)",
                                    color: "#c2410c",
                                  }),
                                  ...(event.status === "cancelled" && {
                                    background:
                                      "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                    color: "#dc2626",
                                  }),
                                  ...(event.status === "completed" && {
                                    background:
                                      "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                                    border: "1px solid rgba(99, 102, 241, 0.2)",
                                    color: "#4f46e5",
                                  }),
                                }}
                              >
                                {event.status.charAt(0).toUpperCase() +
                                  event.status.slice(1)}
                              </Tag>
                            )}
                          </Space>
                        </div>

{event.imageUrl && (
                          <div
                            className="mb-4"
                            style={{
                              marginLeft: "-3rem",
                              marginRight: "-3rem",
                              marginTop: "-3rem",
                              marginBottom: "2rem",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                                height: "400px",
                                overflow: "hidden",
                              }}
                            >
                              <Image
                                src={event.imageUrl}
                                alt={`${event.title} - Event details`}
                                fill
                                style={{
                                  objectFit: "cover",
                                  transition: "transform 0.5s ease",
                                }}
                                onMouseEnter={(
                                  e: React.MouseEvent<HTMLImageElement>
                                ) => {
                                  e.currentTarget.style.transform =
                                    "scale(1.05)";
                                }}
                                onMouseLeave={(
                                  e: React.MouseEvent<HTMLImageElement>
                                ) => {
                                  e.currentTarget.style.transform = "scale(1)";
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background:
                                    "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)",
                                }}
                              />
                            </div>
                          </div>
                        )}

<div className="mb-4">
                          <Title
                            level={3}
                            style={{
                              color: "#1f2937",
                              fontWeight: 700,
                              marginBottom: "16px",
                            }}
                          >
                            About This Event
                          </Title>
                          <Paragraph
                            style={{
                              fontSize: "15px",
                              lineHeight: 1.8,
                              color: "#4b5563",
                              padding: "20px",
                              background:
                                "linear-gradient(135deg, #f9fafb 0%, #fef3c7 100%)",
                              borderLeft: "4px solid #f59e0b",
                              borderRadius: "0 12px 12px 0",
                            }}
                          >
                            {event.description}
                          </Paragraph>
                        </div>

{}
                        <Row gutter={[16, 16]} className="mb-4">
                          <Col xs={24} sm={12} md={6}>
                            <Card
                              style={{
                                borderRadius: "12px",
                                background:
                                  "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                                border: "1px solid rgba(245, 158, 11, 0.15)",
                                textAlign: "center",
                              }}
                              styles={{ body: { padding: "20px" } }}
                            >
                              <CalendarOutlined
                                style={{
                                  fontSize: "28px",
                                  color: "#f59e0b",
                                  marginBottom: "12px",
                                }}
                              />
                              <Text
                                style={{
                                  display: "block",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginBottom: "6px",
                                }}
                              >
                                Event Date
                              </Text>
                              <Text
                                strong
                                style={{
                                  display: "block",
                                  fontSize: "14px",
                                  color: "#d97706",
                                  fontWeight: 600,
                                  marginBottom: "4px",
                                }}
                              >
                                {new Date(event.eventDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </Text>
                              <Text
                                type="secondary"
                                style={{ fontSize: "13px" }}
                              >
                                {new Date(event.eventDate).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </Text>
                            </Card>
                          </Col>
                          <Col xs={24} sm={12} md={6}>
                            <Card
                              style={{
                                borderRadius: "12px",
                                background:
                                  "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
                                border: "1px solid rgba(20, 184, 166, 0.15)",
                                textAlign: "center",
                              }}
                              styles={{ body: { padding: "20px" } }}
                            >
                              <EnvironmentOutlined
                                style={{
                                  fontSize: "28px",
                                  color: "#14B8A6",
                                  marginBottom: "12px",
                                }}
                              />
                              <Text
                                style={{
                                  display: "block",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginBottom: "6px",
                                }}
                              >
                                Location
                              </Text>
                              <Text
                                strong
                                style={{
                                  display: "block",
                                  fontSize: "14px",
                                  color: "#0d9488",
                                  fontWeight: 600,
                                }}
                              >
                                {event.location || "TBA"}
                              </Text>
                              {(event.city || event.region) && (
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "13px", display: "block" }}
                                >
                                  {[event.city, event.region]
                                    .filter(Boolean)
                                    .join(", ")}
                                </Text>
                              )}
                            </Card>
                          </Col>
                          <Col xs={24} sm={12} md={6}>
                            <Card
                              style={{
                                borderRadius: "12px",
                                background:
                                  "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                border: "1px solid rgba(14, 165, 233, 0.15)",
                                textAlign: "center",
                              }}
                              styles={{ body: { padding: "20px" } }}
                            >
                              <DollarOutlined
                                style={{
                                  fontSize: "28px",
                                  color: "#0EA5E9",
                                  marginBottom: "12px",
                                }}
                              />
                              <Text
                                style={{
                                  display: "block",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginBottom: "6px",
                                }}
                              >
                                Entry Fee
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "14px",
                                  color: "#0284c7",
                                  fontWeight: 600,
                                }}
                              >
                                {event.isFree
                                  ? "Free"
                                  : event.registrationFee || "TBA"}
                              </Text>
                            </Card>
                          </Col>
                          <Col xs={24} sm={12} md={6}>
                            <Card
                              style={{
                                borderRadius: "12px",
                                background:
                                  "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                                border: "1px solid rgba(34, 197, 94, 0.15)",
                                textAlign: "center",
                              }}
                              styles={{ body: { padding: "20px" } }}
                            >
                              <TeamOutlined
                                style={{
                                  fontSize: "28px",
                                  color: "#22C55E",
                                  marginBottom: "12px",
                                }}
                              />
                              <Text
                                style={{
                                  display: "block",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginBottom: "6px",
                                }}
                              >
                                Max Attendees
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "14px",
                                  color: "#16a34a",
                                  fontWeight: 600,
                                }}
                              >
                                {event.maxAttendees || "Unlimited"}
                              </Text>
                            </Card>
                          </Col>
                        </Row>

{}
                        {event.requirements && (
                          <div className="mb-4">
                            <Title
                              level={4}
                              style={{
                                color: "#1f2937",
                                fontWeight: 700,
                                marginBottom: "16px",
                              }}
                            >
                              <InfoCircleOutlined
                                style={{ marginRight: "8px", color: "#f59e0b" }}
                              />
                              Requirements
                            </Title>
                            <Paragraph
                              style={{
                                fontSize: "15px",
                                lineHeight: 1.8,
                                color: "#4b5563",
                                padding: "20px",
                                background:
                                  "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
                                borderLeft: "4px solid #f59e0b",
                                borderRadius: "0 12px 12px 0",
                              }}
                            >
                              {event.requirements}
                            </Paragraph>
                          </div>
                        )}

{}
                        {event.targetAudience && (
                          <div className="mb-4">
                            <Title
                              level={4}
                              style={{
                                color: "#1f2937",
                                fontWeight: 700,
                                marginBottom: "16px",
                              }}
                            >
                              <UserOutlined
                                style={{ marginRight: "8px", color: "#14B8A6" }}
                              />
                              Target Audience
                            </Title>
                            <div
                              style={{
                                padding: "16px 24px",
                                background:
                                  "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
                                borderRadius: "12px",
                                border: "1px solid rgba(20, 184, 166, 0.15)",
                              }}
                            >
                              <Tag
                                style={{
                                  padding: "8px 18px",
                                  borderRadius: "20px",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  background: "white",
                                  border: "1px solid rgba(20, 184, 166, 0.2)",
                                  color: "#0d9488",
                                }}
                              >
                                {event.targetAudience}
                              </Tag>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </Col>

<Col xs={24} lg={8}>
                  <motion.div
                    className="box"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card>
                      <Title level={3}>Event Information</Title>

<Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                      >
                        {}
                        <div>
                          <Text strong>
                            <DollarOutlined className="me-2" />
                            Entry Fee
                          </Text>
                          <div className="mt-1">
                            <Text
                              style={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              {event.isFree ? (
                                <span style={{ color: "#52c41a" }}>Free</span>
                              ) : (
                                <span style={{ color: "#1890ff" }}>
                                  {event.entryFee} XAF
                                </span>
                              )}
                            </Text>
                          </div>
                        </div>

{}
                        <div>
                          <Text strong>
                            <CalendarOutlined className="me-2" />
                            Event Date
                          </Text>
                          <div className="mt-1">
                            <Text>
                              {new Date(event.eventDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </Text>
                            <div>
                              <Text type="secondary">
                                {new Date(event.eventDate).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </Text>
                            </div>
                          </div>
                        </div>

{}
                        {event.eventEndDate && (
                          <div>
                            <Text strong>
                              <ClockCircleOutlined className="me-2" />
                              End Date
                            </Text>
                            <div className="mt-1">
                              <Text>
                                {new Date(
                                  event.eventEndDate
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </Text>
                              <div>
                                <Text type="secondary">
                                  {new Date(
                                    event.eventEndDate
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </Text>
                              </div>
                            </div>
                          </div>
                        )}

{}
                        <div>
                          <Text strong>
                            <EnvironmentOutlined className="me-2" />
                            Location
                          </Text>
                          <div className="mt-1">
                            <Text>{event.location || "TBA"}</Text>
                            {event.city && (
                              <div>
                                <Text type="secondary">{event.city}</Text>
                              </div>
                            )}
                            {event.region && (
                              <div>
                                <Text type="secondary">{event.region}</Text>
                              </div>
                            )}
                          </div>
                        </div>

{}
                        {event.category && (
                          <div>
                            <Text strong>
                              <TagOutlined className="me-2" />
                              Category
                            </Text>
                            <div className="mt-1">
                              <Tag color="purple">
                                {event.category?.charAt(0).toUpperCase() +
                                  event.category?.slice(1)}
                              </Tag>
                            </div>
                          </div>
                        )}

{}
                        <div>
                          <Text strong>
                            <GlobalOutlined className="me-2" />
                            Language
                          </Text>
                          <div className="mt-1">
                            <Text>
                              {event.language?.charAt(0).toUpperCase() +
                                event.language?.slice(1)}
                            </Text>
                          </div>
                        </div>

{}
                        <div>
                          <Text strong>
                            <TeamOutlined className="me-2" />
                            Attendance
                          </Text>
                          <div className="mt-1">
                            <Text>
                              {event.currentAttendees || 0} registered
                            </Text>
                            {event.maxAttendees && (
                              <div>
                                <Text type="secondary">
                                  Max: {event.maxAttendees}
                                </Text>
                              </div>
                            )}
                          </div>
                        </div>

{}
                        {event.registrationRequired && (
                          <div>
                            <Text strong>
                              <CheckCircleOutlined className="me-2" />
                              Registration
                            </Text>
                            <div className="mt-1">
                              <Tag color="green">Required</Tag>
                              {event.registrationDeadline && (
                                <div className="mt-1">
                                  <Text type="secondary">
                                    Deadline:{" "}
                                    {new Date(
                                      event.registrationDeadline
                                    ).toLocaleDateString()}
                                  </Text>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

{}
                        <div>
                          <Text strong>
                            <InfoCircleOutlined className="me-2" />
                            Status
                          </Text>
                          <div className="mt-1">
                            <Tag
                              color={
                                event.status === "published"
                                  ? "green"
                                  : event.status === "draft"
                                  ? "orange"
                                  : event.status === "cancelled"
                                  ? "red"
                                  : event.status === "completed"
                                  ? "blue"
                                  : "default"
                              }
                            >
                              {event.status?.charAt(0).toUpperCase() +
                                event.status?.slice(1)}
                            </Tag>
                          </div>
                        </div>
                      </Space>

<Divider />

{}
                      {(event.contactPhone ||
                        event.contactEmail ||
                        event.whatsappNumber) && (
                        <div className="mb-4">
                          <Title level={4}>Contact Information</Title>
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            {event.contactPhone && (
                              <div>
                                <Text strong>
                                  <PhoneOutlined className="me-2" />
                                  Phone
                                </Text>
                                <div className="mt-1">
                                  <Text>{event.contactPhone}</Text>
                                </div>
                              </div>
                            )}

{event.contactEmail && (
                              <div>
                                <Text strong>
                                  <MailOutlined className="me-2" />
                                  Email
                                </Text>
                                <div className="mt-1">
                                  <Text>{event.contactEmail}</Text>
                                </div>
                              </div>
                            )}

{event.whatsappNumber && (
                              <div>
                                <Text strong>
                                  <MessageOutlined className="me-2" />
                                  WhatsApp
                                </Text>
                                <div className="mt-1">
                                  <Text>{event.whatsappNumber}</Text>
                                </div>
                              </div>
                            )}
                          </Space>
                          <Divider />
                        </div>
                      )}

<Button
                        type="primary"
                        size="large"
                        block
                        loading={isRegistering}
                        onClick={handleRegister}
                        disabled={
                          event.status === "cancelled" ||
                          event.status === "completed"
                        }
                        icon={<CalendarOutlined />}
                        style={{
                          background:
                            event.status === "cancelled" ||
                            event.status === "completed"
                              ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                              : "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                          border: "none",
                          borderRadius: "14px",
                          fontWeight: 700,
                          height: "56px",
                          fontSize: "16px",
                          letterSpacing: "0.3px",
                          boxShadow:
                            event.status === "cancelled" ||
                            event.status === "completed"
                              ? "none"
                              : "0 8px 24px rgba(34, 197, 94, 0.3)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onMouseEnter={(e) => {
                          if (
                            event.status !== "cancelled" &&
                            event.status !== "completed"
                          ) {
                            e.currentTarget.style.transform =
                              "translateY(-4px) scale(1.02)";
                            e.currentTarget.style.boxShadow =
                              "0 12px 40px rgba(34, 197, 94, 0.4)";
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #16a34a 0%, #0d9488 100%)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (
                            event.status !== "cancelled" &&
                            event.status !== "completed"
                          ) {
                            e.currentTarget.style.transform =
                              "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 24px rgba(34, 197, 94, 0.3)";
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)";
                          }
                        }}
                      >
                        {event.status === "cancelled"
                          ? "Event Cancelled"
                          : event.status === "completed"
                          ? "Event Completed"
                          : "Register for Event"}
                      </Button>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </Content>
          </div>

{}
          <div className="container mb-4">
            <Share
              title={event.title}
              description={event.description}
              slug={event.slug}
              type="events"
              showModern={true}
            />
          </div>

{}
          <EventRegistrationModal
            visible={registrationModalVisible}
            onCancel={() => setRegistrationModalVisible(false)}
            event={event}
            onSuccess={() => {
              // Optionally refresh data or show success message
            }}
          />

<AppFooter logoPath="/" />
          <AppFootnote />
        </>
      )}
    </>
  );
}
