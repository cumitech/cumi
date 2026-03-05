"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Spin,
  Alert,
  Empty,
} from "antd";
import { SearchOutlined, StarOutlined, LinkOutlined } from "@ant-design/icons";
import {
  useFetchReferralsQuery,
  useTrackReferralClickMutation,
} from "@store/api/referral_api";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import BannerComponent from "@components/banner/banner.component";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const RecommendationsPageComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");

  // Use RTK Query to fetch referrals
  const {
    data: referrals = [],
    isLoading: loading,
    error,
  } = useFetchReferralsQuery({});

  // Use RTK Query mutation for tracking clicks
  const [trackClick] = useTrackReferralClickMutation();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "hosting", label: "Web Hosting" },
    { value: "tools", label: "Development Tools" },
    { value: "finance", label: "Finance & Payments" },
    { value: "marketing", label: "Marketing & Analytics" },
    { value: "education", label: "Education & Learning" },
    { value: "other", label: "Other Tools" },
  ];

  const priceRanges = [
    { value: "all", label: "All Price Ranges" },
    { value: "free", label: "Free" },
    { value: "budget", label: "Budget" },
    { value: "mid-range", label: "Mid-Range" },
    { value: "premium", label: "Premium" },
  ];

  // Use useMemo to compute filtered referrals without causing re-renders
  const filteredReferrals = useMemo(() => {
    let filtered = referrals.filter((referral) => referral.isActive);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (referral) =>
          referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          referral.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          referral.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (referral.features &&
            referral.features.some((feature) =>
              feature.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (referral) => referral.category === selectedCategory
      );
    }

    // Price range filter
    if (selectedPriceRange !== "all") {
      filtered = filtered.filter(
        (referral) => referral.priceRange === selectedPriceRange
      );
    }

    // Sort by priority and featured status (create new array to avoid mutation)
    return [...filtered].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.priority - b.priority;
    });
  }, [referrals, searchTerm, selectedCategory, selectedPriceRange]);

  const handleReferralClick = async (
    referralId: string,
    referralUrl: string
  ) => {
    try {
      // Track the click using RTK Query mutation
      await trackClick({
        referralId,
        sessionId: `rec-${Date.now()}`,
        referrer: typeof window !== "undefined" ? window.location.href : "",
      }).unwrap();

      // Open the referral link
      window.open(referralUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error tracking referral click:", error);
      // Still open the link even if tracking fails
      window.open(referralUrl, "_blank", "noopener,noreferrer");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarOutlined
        key={index}
        style={{
          color: index < rating ? "#faad14" : "#d9d9d9",
          fontSize: "14px",
        }}
      />
    ));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      hosting: "blue",
      tools: "green",
      finance: "gold",
      marketing: "purple",
      education: "cyan",
      other: "default",
    };
    return colors[category] || "default";
  };

  const getPriceRangeColor = (priceRange: string) => {
    const colors: { [key: string]: string } = {
      free: "green",
      budget: "blue",
      "mid-range": "orange",
      premium: "red",
    };
    return colors[priceRange] || "default";
  };

  if (error) {
    console.log("error: ", error);
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Error Loading Recommendations"
          description="Failed to load recommendations. Please try again later."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <BannerComponent
        pageTitle="Recommended Tools & Services"
        breadcrumbs={[{ label: "Tools", uri: "recommendations" }]}
      />

      <section style={{ padding: "60px 0", minHeight: "70vh" }}>
        <div className="container">
          {/* Search and Filters */}
          <Card
            style={{
              marginBottom: "32px",
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            styles={{ body: { padding: "24px" } }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Search tools and services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined style={{ color: "#20b2aa" }} />}
                  size="large"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e8e8e8",
                  }}
                />
              </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: "100%" }}
                size="large"
              >
                {categories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={selectedPriceRange}
                onChange={setSelectedPriceRange}
                style={{ width: "100%" }}
                size="large"
              >
                {priceRanges.map((price) => (
                  <Option key={price.value} value={price.value}>
                    {price.label}
                  </Option>
                ))}
              </Select>
            </Col>
              <Col xs={24} sm={12} md={8}>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  Showing {filteredReferrals.length} of {referrals.length}{" "}
                  recommendations
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Results */}
          {loading ? (
            <div
              style={{
                minHeight: "260px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text>Loading recommendations...</Text>
              </div>
            </div>
          ) : filteredReferrals.length === 0 ? (
          <Card
            style={{
              textAlign: "center",
              padding: "48px",
              borderRadius: "16px",
              border: "1px solid #f0f0f0",
            }}
            styles={{ body: { padding: "48px" } }}
          >
            <Empty
              description="No recommendations found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedPriceRange("all");
                }}
              >
                Clear Filters
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[32, 32]}>
            {filteredReferrals.map((referral) => (
              <Col key={referral.id} xs={24} sm={12} md={8} lg={8}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderRadius: "16px",
                    border: referral.isFeatured
                      ? "2px solid #20b2aa"
                      : "1px solid #f0f0f0",
                    boxShadow: referral.isFeatured
                      ? "0 8px 24px rgba(32, 178, 170, 0.15)"
                      : "0 4px 16px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    position: "relative",
                    background: "white",
                  }}
                  styles={{
                    body: {
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "380px",
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = referral.isFeatured
                      ? "0 16px 40px rgba(32, 178, 170, 0.25)"
                      : "0 12px 32px rgba(32, 178, 170, 0.2)";
                    e.currentTarget.style.borderColor = "#20b2aa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = referral.isFeatured
                      ? "0 8px 24px rgba(32, 178, 170, 0.15)"
                      : "0 4px 16px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.borderColor = referral.isFeatured
                      ? "#20b2aa"
                      : "#f0f0f0";
                  }}
                >
                  {/* Featured Badge - positioned relative to card */}
                  {referral.isFeatured && (
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 1,
                      }}
                    >
                      <Tag
                        color="cyan"
                        icon={<StarOutlined />}
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          borderRadius: "8px",
                          padding: "4px 12px",
                          border: "none",
                          margin: 0,
                        }}
                      >
                        Featured
                      </Tag>
                    </div>
                  )}

                  {/* Tags row */}
                  <div style={{ marginBottom: "12px" }}>
                    <Space size={[8, 8]} wrap>
                      <Tag
                        color={getCategoryColor(referral.category)}
                        style={{
                          fontSize: "11px",
                          padding: "2px 10px",
                          borderRadius: "6px",
                          margin: 0,
                          textTransform: "uppercase",
                        }}
                      >
                        {referral.category}
                      </Tag>
                      <Tag
                        color={getPriceRangeColor(referral.priceRange)}
                        style={{
                          fontSize: "11px",
                          padding: "2px 10px",
                          borderRadius: "6px",
                          margin: 0,
                        }}
                      >
                        {referral.priceRange}
                      </Tag>
                    </Space>
                  </div>

                  {/* Tool name (primary) */}
                  <Title
                    level={4}
                    style={{
                      marginBottom: "4px",
                      fontSize: "18px",
                      color: "#1f2937",
                      fontWeight: 600,
                    }}
                  >
                    {referral.name}
                  </Title>

                  {/* Company (secondary) */}
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "13px",
                      marginBottom: "12px",
                      display: "block",
                    }}
                  >
                    {referral.company}
                  </Text>

                  {/* Description */}
                  <Paragraph
                    style={{
                      color: "#6b7280",
                      marginBottom: "16px",
                      lineHeight: 1.6,
                      flex: 1,
                      minHeight: "48px",
                    }}
                    ellipsis={{ rows: 3 }}
                  >
                    {referral.description}
                  </Paragraph>

                  {/* Rating - compact inline */}
                  <div style={{ marginBottom: "12px" }}>
                    <Space size={4}>
                      {renderStars(referral.rating)}
                      <Text style={{ fontSize: "13px", fontWeight: 600 }}>
                        {referral.rating}/5
                      </Text>
                    </Space>
                  </div>

                  {/* Discount and Bonus */}
                  {(referral.discount || referral.bonus) && (
                    <div style={{ marginBottom: "16px" }}>
                      <Space wrap size={[8, 8]}>
                        {referral.discount && (
                          <Tag color="green" style={{ margin: 0 }}>
                            {referral.discount}
                          </Tag>
                        )}
                        {referral.bonus && (
                          <Tag color="blue" style={{ margin: 0 }}>
                            {referral.bonus}
                          </Tag>
                        )}
                      </Space>
                    </div>
                  )}

                  {/* Visit Button */}
                  <Button
                    type="primary"
                    size="large"
                    icon={<LinkOutlined />}
                    block
                    onClick={() =>
                      handleReferralClick(referral.id, referral.referralUrl)
                    }
                    style={{
                      borderRadius: "12px",
                      height: "44px",
                      fontWeight: 600,
                      background: "#20b2aa",
                      border: "none",
                      marginTop: "auto",
                    }}
                  >
                    Visit {referral.company}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}

          {/* Footer CTA */}
          <div
            style={{
              textAlign: "center",
              marginTop: "48px",
              padding: "24px 0",
            }}
          >
            <Card
              style={{
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Title level={3} style={{ color: "#20b2aa", marginBottom: "16px" }}>
                Why These Recommendations?
              </Title>
              <Paragraph
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  maxWidth: "800px",
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                We recommend these based on our own experience. We only include tools we use and find useful for our projects.
              </Paragraph>
            </Card>
          </div>
        </div>
      </section>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
};

export default RecommendationsPageComponent;
