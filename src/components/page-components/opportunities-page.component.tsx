"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import {
  Col,
  Empty,
  Layout,
  Alert,
  Card,
  Tag,
  Button,
  Row,
  Typography,
  Space,
  Spin,
  Input,
} from "antd";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined,
  BookOutlined,
  SearchOutlined,
  ShopOutlined,
  TrophyOutlined,
  TeamOutlined,
  RocketOutlined,
  FireOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { opportunityAPI } from "@store/api/opportunity_api";
import { useTranslation } from "@contexts/translation.context";
import {
  ApplyButton,
  ViewDetailsButton,
} from "@components/shared/modern-button-styles";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

export default function OpportunitiesPageComponent() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const {
    data: opportunities,
    error,
    isLoading,
    isFetching,
  } = opportunityAPI.useFetchAllOpportunitiesQuery();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredOpportunities = (opportunities || []).filter((opp) => {
    const matchesFilter = filter === "all" || opp.opp_type === filter;
    const matchesSearch =
      opp.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      opp.description
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      opp.companyOrInstitution
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getOpportunityTypeColor = (type: string) => {
    switch (type) {
      case "scholarship":
        return "green";
      case "job":
        return "blue";
      case "internship":
        return "orange";
      case "fellowship":
        return "purple";
      case "grant":
        return "cyan";
      default:
        return "default";
    }
  };

  const getOpportunityTypeIcon = (type: string) => {
    switch (type) {
      case "scholarship":
        return <BookOutlined />;
      case "job":
        return <UserOutlined />;
      case "internship":
        return <UserOutlined />;
      case "fellowship":
        return <UserOutlined />;
      case "grant":
        return <DollarOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const formatDeadline = (deadline: string | Date) => {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isDeadlineNear = (deadline: string | Date) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <Layout className="min-h-screen" style={{ backgroundColor: "white" }}>
      <AppNav logoPath="/" />
      <Content style={{ backgroundColor: "white" }}>
        <BannerComponent
          pageTitle={t("nav.opportunities")}
          breadcrumbs={[
            { label: t("nav.opportunities"), uri: "opportunities" },
          ]}
        />

        <div className="container py-5" style={{ backgroundColor: "white" }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "2rem" }}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  style={{
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    border: "1px solid rgba(34, 197, 94, 0.15)",
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.1)",
                    textAlign: "center",
                  }}
                  styles={{ body: { padding: "24px" } }}
                >
                  <ShopOutlined
                    style={{
                      fontSize: "32px",
                      color: "#22C55E",
                      marginBottom: "8px",
                    }}
                  />
                  <Title
                    level={3}
                    style={{
                      margin: "8px 0 4px",
                      color: "#16a34a",
                      fontWeight: 700,
                    }}
                  >
                    {filteredOpportunities?.length || 0}
                  </Title>
                  <Text
                    style={{
                      color: "#4b5563",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    Total
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  style={{
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
                    border: "1px solid rgba(20, 184, 166, 0.15)",
                    boxShadow: "0 4px 12px rgba(20, 184, 166, 0.1)",
                    textAlign: "center",
                  }}
                  styles={{ body: { padding: "24px" } }}
                >
                  <BookOutlined
                    style={{
                      fontSize: "32px",
                      color: "#14B8A6",
                      marginBottom: "8px",
                    }}
                  />
                  <Title
                    level={3}
                    style={{
                      margin: "8px 0 4px",
                      color: "#0d9488",
                      fontWeight: 700,
                    }}
                  >
                    {opportunities?.filter((o) => o.opp_type === "scholarship")
                      .length || 0}
                  </Title>
                  <Text
                    style={{
                      color: "#4b5563",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    Scholarships
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  style={{
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    border: "1px solid rgba(14, 165, 233, 0.15)",
                    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.1)",
                    textAlign: "center",
                  }}
                  styles={{ body: { padding: "24px" } }}
                >
                  <TeamOutlined
                    style={{
                      fontSize: "32px",
                      color: "#0EA5E9",
                      marginBottom: "8px",
                    }}
                  />
                  <Title
                    level={3}
                    style={{
                      margin: "8px 0 4px",
                      color: "#0284c7",
                      fontWeight: 700,
                    }}
                  >
                    {opportunities?.filter((o) => o.opp_type === "job")
                      .length || 0}
                  </Title>
                  <Text
                    style={{
                      color: "#4b5563",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    Jobs
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  style={{
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    border: "1px solid rgba(245, 158, 11, 0.15)",
                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.1)",
                    textAlign: "center",
                  }}
                  styles={{ body: { padding: "24px" } }}
                >
                  <RocketOutlined
                    style={{
                      fontSize: "32px",
                      color: "#f59e0b",
                      marginBottom: "8px",
                    }}
                  />
                  <Title
                    level={3}
                    style={{
                      margin: "8px 0 4px",
                      color: "#d97706",
                      fontWeight: 700,
                    }}
                  >
                    {opportunities?.filter((o) => o.opp_type === "internship")
                      .length || 0}
                  </Title>
                  <Text
                    style={{
                      color: "#4b5563",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    Internships
                  </Text>
                </Card>
              </Col>
            </Row>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Row justify="center">
              <Col xs={24}>
                <Card
                  className="search-filter-card"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid rgba(34, 197, 94, 0.1)",
                  }}
                  styles={{ body: { padding: "32px" } }}
                >
                  <div className="text-center">
                    <Title level={4} className="mb-3">
                      {t("opportunities.filter_title")}
                    </Title>

                    {}
                    <Search
                      placeholder="Search opportunities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      prefix={<SearchOutlined />}
                      style={{ maxWidth: "400px", marginBottom: 30 }}
                      styles={{
                        affixWrapper: {
                          height: "44px",
                        },
                      }}
                      allowClear
                      size="large"
                    />

                    <Space wrap>
                      <Button
                        type={filter === "all" ? "primary" : "default"}
                        onClick={() => setFilter("all")}
                        size="large"
                      >
                        {t("opportunities.all_opportunities")}
                      </Button>
                      <Button
                        type={filter === "job" ? "primary" : "default"}
                        onClick={() => setFilter("job")}
                        size="large"
                      >
                        {t("opportunities.jobs")}
                      </Button>
                      <Button
                        type={filter === "scholarship" ? "primary" : "default"}
                        onClick={() => setFilter("scholarship")}
                        size="large"
                      >
                        {t("opportunities.scholarships")}
                      </Button>
                      <Button
                        type={filter === "internship" ? "primary" : "default"}
                        onClick={() => setFilter("internship")}
                        size="large"
                      >
                        {t("opportunities.internships")}
                      </Button>
                      <Button
                        type={filter === "fellowship" ? "primary" : "default"}
                        onClick={() => setFilter("fellowship")}
                        size="large"
                      >
                        {t("opportunities.fellowships")}
                      </Button>
                      <Button
                        type={filter === "grant" ? "primary" : "default"}
                        onClick={() => setFilter("grant")}
                        size="large"
                      >
                        {t("opportunities.grants")}
                      </Button>
                    </Space>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>

          {isLoading || isFetching ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                backgroundColor: "white",
                minHeight: "50vh",
              }}
            >
              <Spin size="large" />
              <Text>Loading opportunities...</Text>
            </div>
          ) : error ? (
            <Row justify="center">
              <Col xs={24} lg={22}>
                <Alert
                  message="Error"
                  description={
                    error ? "Failed to load opportunities" : "An error occurred"
                  }
                  type="error"
                  showIcon
                />
              </Col>
            </Row>
          ) : filteredOpportunities.length > 0 ? (
            <Row justify="center" className="align-items-start mt-5">
              <Col xs={24} lg={22}>
                <div className="row">
                  {filteredOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      className="col-sm-6 col-lg-6 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                      style={{ height: "100%" }}
                    >
                      <Card
                        className="cumi-card h-100"
                        hoverable
                        style={{
                          backgroundColor: "white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                        actions={[
                          <ViewDetailsButton
                            key="view"
                            onClick={() =>
                              (window.location.href = `/opportunities/${opportunity.slug}`)
                            }
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
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                              e.currentTarget.style.color = "#ffffff";
                              e.currentTarget.style.borderColor = "#667eea";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(102, 126, 234, 0.3)";
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
                              e.currentTarget.style.color = "#667eea";
                              e.currentTarget.style.borderColor = "#667eea";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(0, 0, 0, 0.1)";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            View Details
                          </ViewDetailsButton>,
                          <ApplyButton
                            key="apply"
                            onClick={() =>
                              window.open(opportunity.applicationLink, "_blank")
                            }
                            style={{
                              background:
                                "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                              border: "none",
                              borderRadius: "12px",
                              fontWeight: 600,
                              fontSize: "14px",
                              height: "44px",
                              padding: "0 24px",
                              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(135deg, #d97706 0%, #b45309 100%)";
                              e.currentTarget.style.boxShadow =
                                "0 6px 20px rgba(245, 158, 11, 0.4)";
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(245, 158, 11, 0.3)";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            Apply Now
                          </ApplyButton>,
                        ]}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <Tag
                            color={getOpportunityTypeColor(
                              opportunity.opp_type
                            )}
                            icon={getOpportunityTypeIcon(opportunity.opp_type)}
                            className="mb-2"
                          >
                            {opportunity.opp_type.charAt(0).toUpperCase() +
                              opportunity.opp_type.slice(1)}
                          </Tag>
                          {isDeadlineNear(opportunity.deadline) && (
                            <Tag color="red">Deadline Soon</Tag>
                          )}
                        </div>

                        <Title level={4} className="mb-2">
                          <Link href={`/opportunities/${opportunity.id}`}>
                            {opportunity.title}
                          </Link>
                        </Title>

                        <Paragraph className="text-muted mb-3">
                          {opportunity.companyOrInstitution}
                        </Paragraph>

                        <div className="mb-3">
                          <Space direction="vertical" size="small">
                            <div>
                              <EnvironmentOutlined className="me-2" />
                              <Text>{opportunity.location}</Text>
                            </div>
                            <div>
                              <CalendarOutlined className="me-2" />
                              <Text>
                                Deadline: {formatDeadline(opportunity.deadline)}
                              </Text>
                            </div>
                            {opportunity.amount && (
                              <div>
                                <DollarOutlined className="me-2" />
                                <Text strong>{opportunity.amount}</Text>
                              </div>
                            )}
                            {opportunity.salaryRange && (
                              <div>
                                <DollarOutlined className="me-2" />
                                <Text strong>{opportunity.salaryRange}</Text>
                              </div>
                            )}
                          </Space>
                        </div>

                        <Paragraph ellipsis={{ rows: 3 }} className="mb-3">
                          {opportunity.description}
                        </Paragraph>

                        {(() => {
                          // Parse skills if it's a string, otherwise use as-is
                          let skillsArray: string[] = [];
                          try {
                            if (typeof opportunity.skills === "string") {
                              skillsArray = JSON.parse(opportunity.skills);
                            } else if (Array.isArray(opportunity.skills)) {
                              skillsArray = opportunity.skills;
                            }
                          } catch (e) {
                            skillsArray = [];
                          }

                          return skillsArray && skillsArray.length > 0 ? (
                            <div className="mb-3">
                              <Text strong className="me-2">
                                Skills:
                              </Text>
                              <Space wrap>
                                {skillsArray.slice(0, 3).map((skill, index) => (
                                  <Tag key={index}>{skill}</Tag>
                                ))}
                                {skillsArray.length > 3 && (
                                  <Tag>+{skillsArray.length - 3} more</Tag>
                                )}
                              </Space>
                            </div>
                          ) : null;
                        })()}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Col>
            </Row>
          ) : (
            <Row justify="center">
              <Col xs={24} lg={22}>
                <Empty
                  description="No opportunities found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Col>
            </Row>
          )}
        </div>
      </Content>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </Layout>
  );
}
