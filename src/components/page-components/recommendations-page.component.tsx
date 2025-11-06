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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "16px" }}>
          <Text>Loading recommendations...</Text>
        </div>
      </div>
    );
  }

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
      <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={1} style={{ color: "#22C55E", marginBottom: "16px" }}>
            🛠️ Recommended Tools & Services
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              color: "#6B7280",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            Discover handpicked tools and services that we use and recommend.
            These are carefully curated recommendations based on our experience
            and expertise.
          </Paragraph>
        </div>

        {/* Search and Filters */}
        <Card style={{ marginBottom: "24px", borderRadius: "12px" }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search tools and services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
                size="large"
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
              <Text type="secondary">
                Showing {filteredReferrals.length} of {referrals.length}{" "}
                recommendations
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Results */}
        {filteredReferrals.length === 0 ? (
          <Card style={{ textAlign: "center", padding: "50px" }}>
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
          <Row gutter={[24, 24]}>
            {filteredReferrals.map((referral) => (
              <Col xs={24} sm={12} lg={8} key={referral.id}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderRadius: "16px",
                    border: referral.isFeatured
                      ? "2px solid #22C55E"
                      : "1px solid #E5E7EB",
                    boxShadow: referral.isFeatured
                      ? "0 8px 24px rgba(34, 197, 94, 0.12)"
                      : "0 2px 8px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{ padding: "24px" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Featured Badge */}
                  {referral.isFeatured && (
                    <div style={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16,
                      zIndex: 1,
                    }}>
                      <Tag 
                        color="success" 
                        icon={<StarOutlined />}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          borderRadius: '8px',
                          padding: '4px 12px',
                          border: 'none',
                          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        Featured
                      </Tag>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div style={{ marginBottom: "16px" }}>
                    <Tag 
                      color={getCategoryColor(referral.category)}
                      style={{
                        fontSize: '11px',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {referral.category}
                    </Tag>
                    <Tag 
                      color={getPriceRangeColor(referral.priceRange)}
                      style={{
                        fontSize: '11px',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        marginLeft: '8px',
                      }}
                    >
                      {referral.priceRange}
                    </Tag>
                  </div>

                  {/* Company Name with Icon */}
                  <div style={{ 
                    marginBottom: "12px",
                    padding: '12px',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
                    borderRadius: '10px',
                    border: '1px solid rgba(34, 197, 94, 0.15)',
                  }}>
                    <Text 
                      style={{ 
                        fontSize: '13px', 
                        color: '#6b7280',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {referral.company}
                    </Text>
                  </div>
                  {/* Tool Name */}
                  <Title level={4} style={{ marginBottom: "12px", fontSize: '20px', color: '#1f2937' }}>
                    {referral.name}
                  </Title>

                  {/* Description */}
                  <Paragraph
                    style={{
                      color: "#4b5563",
                      marginBottom: "16px",
                      minHeight: "60px",
                      lineHeight: '1.6',
                    }}
                    ellipsis={{ rows: 3 }}
                  >
                    {referral.description}
                  </Paragraph>

                  {/* Rating with Stars */}
                  <div style={{ 
                    marginBottom: "16px",
                    padding: '12px',
                    background: '#fff',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space size="small">
                        <Text strong style={{ color: '#4b5563', fontSize: '13px' }}>Rating:</Text>
                        {renderStars(referral.rating)}
                        <Text style={{ fontWeight: 600, color: '#22C55E' }}>
                          {referral.rating}/5
                        </Text>
                      </Space>
                    </div>
                  </div>

                  {/* Discount and Bonus Badges */}
                  {(referral.discount || referral.bonus) && (
                    <div style={{ marginBottom: "16px" }}>
                      <Space wrap>
                        {referral.discount && (
                          <Tag 
                            color="success" 
                            style={{ 
                              fontSize: "12px",
                              fontWeight: 600,
                              padding: '4px 12px',
                              borderRadius: '6px',
                            }}
                          >
                            {referral.discount}
                          </Tag>
                        )}
                        {referral.bonus && (
                          <Tag 
                            color="processing" 
                            style={{ 
                              fontSize: "12px",
                              fontWeight: 600,
                              padding: '4px 12px',
                              borderRadius: '6px',
                            }}
                          >
                            {referral.bonus}
                          </Tag>
                        )}
                      </Space>
                    </div>
                  )}

                  {/* Stats */}
                  <div style={{ 
                    marginBottom: "20px",
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                    borderRadius: '10px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary" style={{ fontSize: "11px", fontWeight: 600 }}>
                        👆 {referral.clickCount || 0} clicks
                      </Text>
                      <Text type="secondary" style={{ fontSize: "11px", fontWeight: 600 }}>
                        🎯 {referral.conversionCount || 0} conversions
                      </Text>
                    </div>
                  </div>

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
                      height: '44px',
                      fontWeight: 600,
                      background: referral.isFeatured
                        ? 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)'
                        : 'linear-gradient(135deg, #0EA5E9 0%, #0284c7 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                    }}
                  >
                    Visit {referral.company}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Footer */}
        <div
          style={{ textAlign: "center", marginTop: "48px", padding: "24px" }}
        >
          <Card style={{ borderRadius: "12px" }}>
            <Title level={3} style={{ color: "#22C55E" }}>
              Why These Recommendations?
            </Title>
            <Paragraph
              style={{
                fontSize: "16px",
                color: "#6B7280",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              These tools and services are carefully selected based on our
              personal experience, industry best practices, and proven track
              records. We only recommend solutions that we genuinely use and
              believe will add value to your projects and business.
            </Paragraph>
          </Card>
        </div>
      </div>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
};

export default RecommendationsPageComponent;
