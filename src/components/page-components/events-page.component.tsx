"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Space, Button, Tag, Input, Select, Empty, Spin, App } from "antd";
import { CalendarOutlined, EnvironmentOutlined, EyeOutlined, SearchOutlined, FilterOutlined, TeamOutlined, RocketOutlined, FireOutlined, TrophyOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import BannerComponent from "@components/banner/banner.component";
import { eventAPI } from "@store/api/event_api";
import { motion } from "framer-motion";
import { IEvent } from "@domain/models/event.model";
import { useTranslation } from "@contexts/translation.context";
import { useRouter } from "next/navigation";
import EventRegistrationModal from "@components/shared/event-registration-modal.component";
import {
  RegisterButton,
  ViewDetailsButton,
} from "@components/shared/modern-button-styles";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function EventsPageComponent() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const { message } = App.useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [registrationModalVisible, setRegistrationModalVisible] =
    useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

const {
    data: events,
    error,
    isLoading,
    isFetching,
  } = eventAPI.useFetchAllEventsQuery({
    searchTitle: debouncedSearchTerm,
    sortBy: "date",
  });

// Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

return () => clearTimeout(timer);
  }, [searchTerm]);

const filteredEvents =
    events?.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        event.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      // Note: IEvent doesn't have category property, so we'll skip category filtering for now
      return matchesSearch;
    }) || [];

const handleRegisterEvent = (event: IEvent) => {
    setSelectedEvent(event);
    setRegistrationModalVisible(true);
  };

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

const loading = isLoading || isFetching;

return (
    <>
      <div
        className="container-fluid"
        style={{ width: "100%", backgroundColor: "white" }}
      >
        <AppNav logoPath="/" />
      </div>

{loading ? (
        <div style={{ minHeight: "65vh", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
          <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>Loading events...</div>
          </Card>
        </div>
      ) : (
        <>
      {}
      <BannerComponent
        breadcrumbs={[{ label: t("nav.events"), uri: "events" }]}
        pageTitle={t("nav.events")}
      />

<div
        className="container pb-5"
        style={{ marginTop: 24, backgroundColor: "white" }}
      >
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row gutter={[16, 16]} style={{ marginBottom: '2rem' }}>
            <Col xs={24} sm={12} md={6}>
              <Card
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.15)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)',
                  textAlign: 'center',
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <CalendarOutlined style={{ fontSize: '32px', color: '#f59e0b', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px', color: '#d97706', fontWeight: 700 }}>
                  {filteredEvents?.length || 0}
                </Title>
                <Text style={{ color: '#4b5563', fontSize: '14px', fontWeight: 500 }}>Total</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)',
                  textAlign: 'center',
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <TrophyOutlined style={{ fontSize: '32px', color: '#22C55E', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px', color: '#16a34a', fontWeight: 700 }}>
                  {events?.filter(e => e.category === 'workshop').length || 0}
                </Title>
                <Text style={{ color: '#4b5563', fontSize: '14px', fontWeight: 500 }}>Workshops</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
                  border: '1px solid rgba(20, 184, 166, 0.15)',
                  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)',
                  textAlign: 'center',
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <TeamOutlined style={{ fontSize: '32px', color: '#14B8A6', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px', color: '#0d9488', fontWeight: 700 }}>
                  {events?.filter(e => e.category === 'seminar').length || 0}
                </Title>
                <Text style={{ color: '#4b5563', fontSize: '14px', fontWeight: 500 }}>Seminars</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  border: '1px solid rgba(14, 165, 233, 0.15)',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.1)',
                  textAlign: 'center',
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <RocketOutlined style={{ fontSize: '32px', color: '#0EA5E9', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px', color: '#0284c7', fontWeight: 700 }}>
                  {events?.filter(e => e.category === 'conference').length || 0}
                </Title>
                <Text style={{ color: '#4b5563', fontSize: '14px', fontWeight: 500 }}>Conferences</Text>
              </Card>
            </Col>
          </Row>
        </motion.div>

{}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            className="search-filter-card"
            style={{
              backgroundColor: "white",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              borderRadius: "20px",
              overflow: "hidden",
              marginBottom: 24,
              border: "1px solid rgba(245, 158, 11, 0.1)",
            }}
            styles={{ body: { padding: '32px' } }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <Title level={4} style={{ margin: 0, color: '#1f2937', fontWeight: 700 }}>
                    <FilterOutlined style={{ marginRight: '8px', color: '#f59e0b' }} />
                    Find Your Next Event
                  </Title>
                  <Text type="secondary" style={{ fontSize: '15px' }}>Search and filter events by category</Text>
                </div>
              </Col>

<Col xs={24} style={{ textAlign: 'center' }}>
                <Search
                  placeholder={t("events.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined style={{ color: '#f59e0b' }} />}
                  style={{ maxWidth: "500px", marginBottom: 24 }}
                  styles={{
                    affixWrapper: {
                      height: "48px",
                      borderRadius: '12px',
                      border: '1.5px solid #e5e7eb',
                    },
                  }}
                  allowClear
                  size="large"
                />
              </Col>

<Col xs={24} style={{ textAlign: 'center' }}>
                <Space wrap size="middle">
                  {[
                    { key: 'all', label: t("events.all_categories"), icon: <FireOutlined /> },
                    { key: 'workshop', label: 'Workshop', icon: <TrophyOutlined /> },
                    { key: 'seminar', label: 'Seminar', icon: <TeamOutlined /> },
                    { key: 'conference', label: 'Conference', icon: <RocketOutlined /> },
                    { key: 'training', label: 'Training', icon: <CalendarOutlined /> },
                  ].map(({ key, label, icon }) => (
                    <Button
                      key={key}
                      type={filterCategory === key ? "primary" : "default"}
                      onClick={() => setFilterCategory(key)}
                      size="large"
                      icon={icon}
                      style={{
                        borderRadius: '12px',
                        fontWeight: 600,
                        height: '44px',
                        padding: '0 24px',
                        ...(filterCategory === key ? {
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                        } : {
                          borderColor: '#e5e7eb',
                        })
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </Space>
              </Col>
            </Row>
          </Card>
        </motion.div>

{}
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              style={{
                borderRadius: "24px",
                textAlign: "center",
                padding: "4rem 2rem",
                background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                border: '2px solid rgba(245, 158, 11, 0.15)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)'
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
                }}>
                  <CalendarOutlined style={{ fontSize: '48px', color: 'white' }} />
                </div>
                <Title level={3} style={{ color: "#1f2937", marginBottom: '12px', fontWeight: 700 }}>
                  No Events Found
                </Title>
                <Text style={{ fontSize: '16px', color: '#6b7280', display: 'block', marginBottom: '24px' }}>
                  Try adjusting your filters or search criteria
                </Text>
                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  onClick={() => { setSearchTerm(""); setFilterCategory("all"); }}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    height: '48px',
                    padding: '0 32px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        ) : (
          <>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '4px', 
                  height: '32px', 
                  background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '4px',
                }} />
                <Title level={3} style={{ margin: 0, color: '#1f2937', fontWeight: 700 }}>
                  Upcoming Events
                </Title>
              </div>
              <Tag 
                style={{ 
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  color: '#d97706',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
              </Tag>
            </div>
            <Row gutter={[24, 24]}>
              {filteredEvents.map((event, index) => (
                <Col xs={24} md={12} lg={8} key={event.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(index * 0.08, 0.6),
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2 },
                    }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      hoverable
                      style={{
                        backgroundColor: "white",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: 'none',
                        height: '100%',
                        transition: 'all 0.3s ease',
                      }}
                      styles={{ body: { padding: '24px' } }}
                      cover={
                        <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                          <Image
                            alt={event.title}
                            src={event.imageUrl || "/img/design-3.jpg"}
                            fill
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)",
                            }}
                          />
                          <Tag
                            style={{
                              position: "absolute",
                              top: 16,
                              right: 16,
                              backgroundColor: "rgba(245, 158, 11, 0.95)",
                              backdropFilter: "blur(10px)",
                              color: "white",
                              padding: "8px 16px",
                              borderRadius: "24px",
                              fontSize: "13px",
                              fontWeight: 700,
                              border: 'none',
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                            }}
                            icon={<CalendarOutlined />}
                          >
                            {new Date(event.eventDate).toLocaleDateString()}
                          </Tag>
                        </div>
                      }
                    actions={[
                      <RegisterButton
                        key="register"
                        icon={<CalendarOutlined />}
                        onClick={() => handleRegisterEvent(event)}
                        style={{
                          background:
                            "linear-gradient(135deg, #22C55E 0%, #16a34a 100%)",
                          border: "none",
                          borderRadius: "12px",
                          fontWeight: 600,
                          fontSize: "14px",
                          height: "44px",
                          padding: "0 24px",
                          boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #16a34a 0%, #15803d 100%)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(34, 197, 94, 0.4)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #22C55E 0%, #16a34a 100%)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(34, 197, 94, 0.3)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        Register
                      </RegisterButton>,
                      <ViewDetailsButton
                        key="view"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          router.push(`/events/${event.slug}`);
                        }}
                        style={{
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                          border: "2px solid #667eea",
                          color: "#667eea",
                          borderRadius: "12px",
                          fontWeight: 600,
                          fontSize: "14px",
                          height: "44px",
                          padding: "0 24px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.borderColor = "transparent";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(245, 158, 11, 0.3)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
                          e.currentTarget.style.color = "#f59e0b";
                          e.currentTarget.style.borderColor = "#f59e0b";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(0, 0, 0, 0.1)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        View Details
                      </ViewDetailsButton>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Space>
                          <Text strong>{event.title}</Text>
                          <Tag color="blue">Event</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {event.description}
                          </Paragraph>
                          <Space>
                            <CalendarOutlined style={{ color: "#1890ff" }} />
                            <Text type="secondary">
                              {formatDate(event.eventDate.toString())}
                            </Text>
                          </Space>
                          <Space>
                            <EnvironmentOutlined style={{ color: "#faad14" }} />
                            <Text type="secondary">{event.location}</Text>
                          </Space>
                        </Space>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
          </>
        )}
      </div>

{}
      <EventRegistrationModal
        visible={registrationModalVisible}
        onCancel={() => setRegistrationModalVisible(false)}
        event={selectedEvent}
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
