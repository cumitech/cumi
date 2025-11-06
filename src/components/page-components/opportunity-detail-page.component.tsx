"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import Share from "@components/shared/share";
import ReferralsSidebar from "@components/shared/referrals-sidebar.component";
import {
  Col,
  Layout,
  Alert,
  Card,
  Tag,
  Button,
  Row,
  Typography,
  Space,
  Divider,
  Spin,
} from "antd";
import { motion } from "framer-motion";
import { IOpportunity } from "@domain/models/opportunity.model";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined,
  BookOutlined,
  MailOutlined,
  LinkOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { opportunityAPI } from "@store/api/opportunity_api";
import { useTranslation } from "@contexts/translation.context";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

// Basic HTML tag stripper to ensure public pages do not render raw HTML
const stripHtml = (input: string | null | undefined): string => {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
};

interface OpportunityDetailPageComponentProps {
  opportunitySlug: string;
}

export default function OpportunityDetailPageComponent({
  opportunitySlug,
}: OpportunityDetailPageComponentProps) {
  const { t } = useTranslation();

const {
    data: opportunity,
    error,
    isLoading,
    isFetching,
  } = opportunityAPI.useGetSingleOpportunityBySlugQuery(opportunitySlug);

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

const loading = isLoading || isFetching;

return (
    <Layout className="min-h-screen" style={{ backgroundColor: "white" }}>
      <AppNav logoPath="/" />

{loading ? (
        <Content
          style={{
            backgroundColor: "white",
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
              {t("opportunity_detail.loading")}
            </div>
          </Card>
        </Content>
      ) : error || !opportunity ? (
        <Content style={{ backgroundColor: "white" }}>
          <BannerComponent
            pageTitle={t("opportunity_detail.not_found")}
            breadcrumbs={[
              { label: "Opportunities", uri: "opportunities" },
              { label: "Not Found", uri: "" },
            ]}
          />
          <div className="container py-5" style={{ backgroundColor: "white" }}>
            <Row justify="center">
              <Col xs={24} lg={18}>
                <Alert
                  message={t("opportunity_detail.error")}
                  description={
                    error
                      ? t("opportunity_detail.failed_load")
                      : t("opportunity_detail.not_found_desc")
                  }
                  type="error"
                  showIcon
                />
              </Col>
            </Row>
          </div>
        </Content>
      ) : (
        <>
          <Content style={{ backgroundColor: "white" }}>
            <BannerComponent
              pageTitle={opportunity.title}
              breadcrumbs={[
                { label: "Opportunities", uri: "opportunities" },
                { label: opportunity.title, uri: "" },
              ]}
            />

<div
              className="container py-5"
              style={{ backgroundColor: "white" }}
            >
              <Row justify="center" gutter={[32, 0]}>
                <Col xs={24} lg={14}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        overflow: "hidden",
                        marginBottom: "24px",
                      }}
                      bordered={false}
                      styles={{ body: { padding: "40px" } }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <Tag
                          color={getOpportunityTypeColor(opportunity.opp_type)}
                          icon={getOpportunityTypeIcon(opportunity.opp_type)}
                          style={{
                            padding: "8px 18px",
                            borderRadius: "24px",
                            fontSize: "14px",
                            fontWeight: 600,
                            border: "none",
                            boxShadow: `0 2px 8px ${getOpportunityTypeColor(
                              opportunity.opp_type
                            )}30`,
                          }}
                        >
                          {opportunity.opp_type.charAt(0).toUpperCase() +
                            opportunity.opp_type.slice(1)}
                        </Tag>
                        {isDeadlineNear(opportunity.deadline) && (
                          <Tag
                            color="red"
                            icon={<ClockCircleOutlined />}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              fontWeight: 600,
                              border: "none",
                              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                            }}
                          >
                            {t("opportunity_detail.deadline_soon")}
                          </Tag>
                        )}
                      </div>

<Title
                        level={2}
                        style={{
                          marginBottom: "16px",
                          fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                          fontWeight: 800,
                          color: "#1f2937",
                          letterSpacing: "-0.02em",
                          lineHeight: 1.2,
                        }}
                      >
                        {opportunity.title}
                      </Title>

<div
                        style={{
                          padding: "12px 20px",
                          background:
                            "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
                          borderRadius: "12px",
                          marginBottom: "24px",
                          border: "1px solid rgba(34, 197, 94, 0.15)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#4b5563",
                          }}
                        >
                          <UserOutlined
                            style={{ marginRight: "8px", color: "#22C55E" }}
                          />
                          {opportunity.companyOrInstitution}
                        </Text>
                      </div>

<Row gutter={[16, 16]} className="mb-4">
                        <Col xs={12} sm={12} md={6}>
                          <Card
                            style={{
                              borderRadius: "12px",
                              background:
                                "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                              border: "1px solid rgba(34, 197, 94, 0.15)",
                              textAlign: "center",
                            }}
                            bordered={false}
                            styles={{ body: { padding: "16px" } }}
                          >
                            <EnvironmentOutlined
                              style={{
                                fontSize: "24px",
                                color: "#22C55E",
                                marginBottom: "8px",
                              }}
                            />
                            <Text
                              style={{
                                display: "block",
                                fontSize: "12px",
                                color: "#6b7280",
                                marginBottom: "4px",
                              }}
                            >
                              {t("opportunity_detail.location")}
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: "14px",
                                color: "#16a34a",
                                fontWeight: 600,
                              }}
                            >
                              {opportunity.location}
                            </Text>
                          </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6}>
                          <Card
                            bordered={false}
                            style={{
                              borderRadius: "12px",
                              background:
                                "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
                              border: "1px solid rgba(20, 184, 166, 0.15)",
                              textAlign: "center",
                            }}
                            styles={{ body: { padding: "16px" } }}
                          >
                            <CalendarOutlined
                              style={{
                                fontSize: "24px",
                                color: "#14B8A6",
                                marginBottom: "8px",
                              }}
                            />
                            <Text
                              style={{
                                display: "block",
                                fontSize: "12px",
                                color: "#6b7280",
                                marginBottom: "4px",
                              }}
                            >
                              {t("opportunity_detail.deadline")}
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: "14px",
                                color: "#0d9488",
                                fontWeight: 600,
                              }}
                            >
                              {formatDeadline(opportunity.deadline)}
                            </Text>
                          </Card>
                        </Col>
                        {(opportunity.amount || opportunity.salaryRange) && (
                          <Col xs={12} sm={12} md={6}>
                            <Card
                              style={{
                                borderRadius: "12px",
                                background:
                                  "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                border: "1px solid rgba(14, 165, 233, 0.15)",
                                textAlign: "center",
                              }}
                              styles={{ body: { padding: "16px" } }}
                            >
                              <DollarOutlined
                                style={{
                                  fontSize: "24px",
                                  color: "#0EA5E9",
                                  marginBottom: "8px",
                                }}
                              />
                              <Text
                                style={{
                                  display: "block",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginBottom: "4px",
                                }}
                              >
                                {opportunity.opp_type === "scholarship"
                                  ? t("opportunity_detail.amount")
                                  : t("opportunity_detail.salary")}
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "14px",
                                  color: "#0284c7",
                                  fontWeight: 600,
                                }}
                              >
                                {opportunity.amount || opportunity.salaryRange}
                              </Text>
                            </Card>
                          </Col>
                        )}
                        {opportunity.duration && (
                          <Col xs={12} sm={12} md={6}>
                            <Card
                              style={{
                                borderRadius: "12px",
                                background:
                                  "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                                border: "1px solid rgba(245, 158, 11, 0.15)",
                                textAlign: "center",
                              }}
                              styles={{ body: { padding: "16px" } }}
                            >
                              <ClockCircleOutlined
                                style={{
                                  fontSize: "24px",
                                  color: "#f59e0b",
                                  marginBottom: "8px",
                                }}
                              />
                              <Text
                                style={{
                                  display: "block",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginBottom: "4px",
                                }}
                              >
                                {t("opportunity_detail.duration")}
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "14px",
                                  color: "#d97706",
                                  fontWeight: 600,
                                }}
                              >
                                {opportunity.duration}
                              </Text>
                            </Card>
                          </Col>
                        )}
                      </Row>

<Divider
                         style={{
                           margin: "32px 0",
                           borderColor: "rgba(34, 197, 94, 0.15)",
                         }}
                       />

{}
                       <Row gutter={[16, 16]} className="mb-4">
                         <Col xs={24} sm={12}>
                           <Text style={{ fontSize: '13px', color: '#6b7280' }}>
                             <strong style={{ color: '#4b5563' }}>Posted:</strong>{' '}
                             {formatDeadline(opportunity.createdAt)}
                           </Text>
                         </Col>
                         <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                           <Text style={{ fontSize: '13px', color: '#6b7280' }}>
                             <strong style={{ color: '#4b5563' }}>Last Updated:</strong>{' '}
                             {formatDeadline(opportunity.updatedAt)}
                           </Text>
                         </Col>
                       </Row>

<Divider
                         style={{
                           margin: "24px 0",
                           borderColor: "rgba(34, 197, 94, 0.15)",
                         }}
                       />

<div className="mb-4">
                         <Title
                           level={4}
                           style={{
                             color: "#1f2937",
                             fontWeight: 700,
                             marginBottom: "16px",
                           }}
                         >
                           {t("opportunity_detail.description")}
                         </Title>
                        <div
                          style={{
                            fontSize: "15px",
                            lineHeight: 1.8,
                            color: "#4b5563",
                            padding: "20px",
                            background:
                              "linear-gradient(135deg, #f9fafb 0%, #f0f9ff 100%)",
                            borderLeft: "4px solid #22C55E",
                            borderRadius: "0 12px 12px 0",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: (opportunity.description as unknown as string) || "",
                          }}
                        />
                      </div>

<div className="mb-4">
                        <Title
                          level={4}
                          style={{
                            color: "#1f2937",
                            fontWeight: 700,
                            marginBottom: "16px",
                          }}
                        >
                          {t("opportunity_detail.requirements")}
                        </Title>
                        <div
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
                          dangerouslySetInnerHTML={{
                            __html: (opportunity.requirements as unknown as string) || "",
                          }}
                        />
                      </div>

{}
                       {opportunity.opp_type === "scholarship" && (
                         <>
                           <Divider style={{ margin: '24px 0', borderColor: 'rgba(34, 197, 94, 0.15)' }} />
                           <Title level={4} style={{ color: '#1f2937', fontWeight: 700, marginBottom: '16px' }}>
                             Scholarship Details
                           </Title>
                           <Row gutter={[16, 16]} className="mb-4">
                             {opportunity.academicLevel && (
                               <Col xs={24} sm={12}>
                                 <Card
                                   style={{
                                     borderRadius: '12px',
                                     background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                     border: '1px solid rgba(245, 158, 11, 0.15)',
                                   }}
                                   styles={{ body: { padding: '16px' } }}
                                 >
                                   <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                     Academic Level
                                   </Text>
                                   <Text strong style={{ fontSize: '14px', color: '#d97706', fontWeight: 600 }}>
                                     {opportunity.academicLevel}
                                   </Text>
                                 </Card>
                               </Col>
                             )}
                             {opportunity.fieldOfStudy && (
                               <Col xs={24} sm={12}>
                                 <Card
                                   style={{
                                     borderRadius: '12px',
                                     background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                     border: '1px solid rgba(14, 165, 233, 0.15)',
                                   }}
                                   styles={{ body: { padding: '16px' } }}
                                 >
                                   <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                     Field of Study
                                   </Text>
                                   <Text strong style={{ fontSize: '14px', color: '#0284c7', fontWeight: 600 }}>
                                     {opportunity.fieldOfStudy}
                                   </Text>
                                 </Card>
                               </Col>
                             )}
                             {opportunity.nationality && (
                               <Col xs={24} sm={12}>
                                 <Card
                                   style={{
                                     borderRadius: '12px',
                                     background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
                                     border: '1px solid rgba(20, 184, 166, 0.15)',
                                   }}
                                   styles={{ body: { padding: '16px' } }}
                                 >
                                   <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                     {t("opportunity_detail.nationality_req")}
                                   </Text>
                                   <Text strong style={{ fontSize: '14px', color: '#0d9488', fontWeight: 600 }}>
                                     {opportunity.nationality}
                                   </Text>
                                 </Card>
                               </Col>
                             )}
                             {opportunity.ageLimit && (
                               <Col xs={24} sm={12}>
                                 <Card
                                   style={{
                                     borderRadius: '12px',
                                     background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                     border: '1px solid rgba(239, 68, 68, 0.15)',
                                   }}
                                   styles={{ body: { padding: '16px' } }}
                                 >
                                   <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                     Age Limit
                                   </Text>
                                   <Text strong style={{ fontSize: '14px', color: '#dc2626', fontWeight: 600 }}>
                                     {opportunity.ageLimit} years
                                   </Text>
                                 </Card>
                               </Col>
                             )}
                           </Row>
                         </>
                       )}

{}
                       {opportunity.opp_type === "job" && (
                         <>
                           <Divider style={{ margin: '24px 0', borderColor: 'rgba(34, 197, 94, 0.15)' }} />
                           <Title level={4} style={{ color: '#1f2937', fontWeight: 700, marginBottom: '16px' }}>
                             Job Details
                           </Title>
                           <Row gutter={[16, 16]} className="mb-4">
                             {opportunity.employmentType && (
                               <Col xs={24} sm={12} md={8}>
                                 <Card
                                   style={{
                                     borderRadius: '12px',
                                     background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                     border: '1px solid rgba(34, 197, 94, 0.15)',
                                   }}
                                   styles={{ body: { padding: '16px' } }}
                                 >
                                   <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                     {t("opportunity_detail.employment_type")}
                                   </Text>
                                   <Text strong style={{ fontSize: '14px', color: '#16a34a', fontWeight: 600 }}>
                                     {opportunity.employmentType}
                                   </Text>
                                 </Card>
                               </Col>
                             )}
                             {opportunity.experienceLevel && (
                               <Col xs={24} sm={12} md={8}>
                                 <Card
                                   style={{
                                     borderRadius: '12px',
                                     background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
                                     border: '1px solid rgba(20, 184, 166, 0.15)',
                                   }}
                                   styles={{ body: { padding: '16px' } }}
                                 >
                                   <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                     Experience Level
                                   </Text>
                                   <Text strong style={{ fontSize: '14px', color: '#0d9488', fontWeight: 600 }}>
                                     {opportunity.experienceLevel}
                                   </Text>
                                 </Card>
                               </Col>
                             )}
                             {opportunity.department && (
                               <Col xs={24} sm={12} md={8}>
                                 <Card
                                   style={{
                                     borderRadius: '12px',
                                     background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                     border: '1px solid rgba(14, 165, 233, 0.15)',
                                   }}
                                   styles={{ body: { padding: '16px' } }}
                                 >
                                   <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                     Department
                                   </Text>
                                   <Text strong style={{ fontSize: '14px', color: '#0284c7', fontWeight: 600 }}>
                                     {opportunity.department}
                                   </Text>
                                 </Card>
                               </Col>
                             )}
                             {opportunity.isRemote !== undefined && (
                               <Col xs={24} sm={12} md={8}>
                                 <Card
                                   style={{
                                     borderRadius: '12px',
                                     background: opportunity.isRemote 
                                       ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                                       : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                     border: `1px solid ${opportunity.isRemote ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.15)'}`,
                                   }}
                                   styles={{ body: { padding: '16px' } }}
                                 >
                                   <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                     Remote Work
                                   </Text>
                                   <Text strong style={{ fontSize: '14px', color: opportunity.isRemote ? '#059669' : '#dc2626', fontWeight: 600 }}>
                                     {opportunity.isRemote ? "Yes" : "No"}
                                   </Text>
                                 </Card>
                               </Col>
                             )}
                           </Row>
                         </>
                       )}

{(() => {
                         // Parse skills if it's a string, otherwise use as-is
                         let skillsArray: string[] = [];
                         try {
                           if (typeof opportunity.skills === 'string') {
                             skillsArray = JSON.parse(opportunity.skills);
                           } else if (Array.isArray(opportunity.skills)) {
                             skillsArray = opportunity.skills;
                           }
                         } catch (e) {
                           skillsArray = [];
                         }

return skillsArray && skillsArray.length > 0 ? (
                           <>
                             <Divider style={{ margin: '24px 0', borderColor: 'rgba(34, 197, 94, 0.15)' }} />
                             <div className="mb-4">
                               <Title level={4} style={{ color: '#1f2937', fontWeight: 700, marginBottom: '16px' }}>
                                 Required Skills
                               </Title>
                               <Space wrap size="middle">
                                 {skillsArray.map((skill, index) => (
                                   <Tag
                                     key={index}
                                     style={{
                                       padding: '8px 16px',
                                       borderRadius: '20px',
                                       fontSize: '14px',
                                       fontWeight: 600,
                                       background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                       border: '1px solid rgba(59, 130, 246, 0.2)',
                                       color: '#1e40af',
                                     }}
                                   >
                                     {skill}
                                   </Tag>
                                 ))}
                               </Space>
                             </div>
                           </>
                         ) : null;
                       })()}

<Divider style={{ margin: '32px 0', borderColor: 'rgba(34, 197, 94, 0.15)' }} />

<div className="text-center" style={{ padding: '24px 0' }}>
                        <Space size="large" wrap>
                          <Button
                            type="primary"
                            size="large"
                            icon={<LinkOutlined />}
                            href={opportunity.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                              border: 'none',
                              borderRadius: '14px',
                              fontWeight: 700,
                              height: '56px',
                              padding: '0 40px',
                              fontSize: '16px',
                              letterSpacing: '0.3px',
                              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                              e.currentTarget.style.boxShadow = '0 12px 40px rgba(34, 197, 94, 0.4)';
                              e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #0d9488 100%)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0) scale(1)';
                              e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.3)';
                              e.currentTarget.style.background = 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)';
                            }}
                          >
                            {t("opportunity_detail.apply_now")}
                          </Button>
                          <Button
                            size="large"
                            icon={<MailOutlined />}
                            href={`mailto:${opportunity.contactEmail}`}
                            style={{
                              background: 'white',
                              color: '#0EA5E9',
                              border: '2px solid #0EA5E9',
                              borderRadius: '14px',
                              fontWeight: 700,
                              height: '56px',
                              padding: '0 40px',
                              fontSize: '16px',
                              letterSpacing: '0.3px',
                              boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                              e.currentTarget.style.background = 'linear-gradient(135deg, #0EA5E9 0%, #0284c7 100%)';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.boxShadow = '0 8px 30px rgba(14, 165, 233, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0) scale(1)';
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.color = '#0EA5E9';
                              e.currentTarget.style.borderColor = '#0EA5E9';
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.15)';
                            }}
                          >
                            Contact
                          </Button>
                        </Space>
                      </div>
                    </Card>
                  </motion.div>
                </Col>

                {/* Referrals Sidebar */}
                <Col xs={24} lg={10}>
                  <div style={{ position: 'sticky', top: 20 }}>
                    <ReferralsSidebar 
                      category="tools" 
                      limit={3}
                      title="Recommended Tools"
                    />
                  </div>
                </Col>
              </Row>
            </div>

{}
            <div className="container mb-4">
              <Share
                title={opportunity.title}
                description={opportunity.description}
                slug={opportunity.slug}
                type="opportunities"
                showModern={true}
              />
            </div>
          </Content>
        </>
      )}

<AppFooter logoPath="/" />
      <AppFootnote />
    </Layout>
  );
}
