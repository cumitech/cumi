"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Typography, Row, Col, Card, Space, Avatar, Spin, Empty } from "antd";
import { TeamOutlined, BulbOutlined, HeartOutlined, ThunderboltOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useTranslation } from "@contexts/translation.context";
import { AppCTA } from "@components/CTA.component";
import StatsSection from "@components/stats/stats-section";
import { PageLayout } from "@components/shared";

const { Title, Paragraph, Text } = Typography;

interface ITeamMember {
  id: string;
  fullName: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
  order: number;
}

export default function AboutPageComponent() {
  const { t } = useTranslation();
  const [team, setTeam] = useState<ITeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team-members")
      .then((res) => res.json())
      .then((data) => setTeam(Array.isArray(data) ? data.sort((a: ITeamMember, b: ITeamMember) => a.order - b.order) : []))
      .catch(() => setTeam([]))
      .finally(() => setTeamLoading(false));
  }, []);

  const values = [
    {
      icon: <BulbOutlined />,
      title: t("about.innovation"),
      description: t("about.innovation_desc"),
    },
    {
      icon: <HeartOutlined />,
      title: t("about.passion"),
      description: t("about.passion_desc"),
    },
    {
      icon: <ThunderboltOutlined />,
      title: t("about.excellence"),
      description: t("about.excellence_desc"),
    },
    {
      icon: <TeamOutlined />,
      title: t("about.collaboration"),
      description: t("about.collaboration_desc"),
    },
  ];

  return (
      <PageLayout
        showBanner={true}
        bannerTitle="About Us"
        bannerBreadcrumbs={[{ label: "About Us", uri: "about-us" }]}
      >
        <StatsSection />

        <section className="py-5">
        <div className="container">
          <Row justify="center" className="mb-5">
            <Col xs={24} lg={16} className="text-center">
              <Title level={2} className="mb-3" style={{ color: '#1e293b' }}>{t('about.our_story')}</Title>
              <Paragraph className="fs-5" style={{ color: '#64748b' }}>
                {t('about.story_description')}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                  <Image
                    className="rounded-3 shadow-lg"
                    src="/img/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg"
                    alt="CUMI team working on innovative software development projects"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Title level={3} className="mb-4" style={{ color: '#1e293b' }}>{t('about.our_mission')}</Title>
                <Paragraph className="fs-6 mb-4" style={{ color: '#475569' }}>
                  {t('about.mission_description')}
                </Paragraph>
                <div className="mb-4">
                  <Space direction="vertical" size="middle">
                    <div className="d-flex align-items-center">
                      <CheckCircleOutlined className="me-3" style={{ fontSize: '1.2rem', color: '#22C55E' }} />
                      <Text strong style={{ color: '#1e293b' }}>{t('about.innovation_driven')}</Text>
                    </div>
                    <div className="d-flex align-items-center">
                      <CheckCircleOutlined className="me-3" style={{ fontSize: '1.2rem', color: '#22C55E' }} />
                      <Text strong style={{ color: '#1e293b' }}>{t('about.react_laravel')}</Text>
                    </div>
                    <div className="d-flex align-items-center">
                      <CheckCircleOutlined className="me-3" style={{ fontSize: '1.2rem', color: '#22C55E' }} />
                      <Text strong style={{ color: '#1e293b' }}>{t('about.seo_marketing')}</Text>
                    </div>
                    <div className="d-flex align-items-center">
                      <CheckCircleOutlined className="me-3" style={{ fontSize: '1.2rem', color: '#22C55E' }} />
                      <Text strong style={{ color: '#1e293b' }}>{t('about.client_management')}</Text>
                    </div>
                  </Space>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

{}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <Row justify="center" className="mb-5">
            <Col xs={24} lg={16} className="text-center">
              <Title level={2} className="mb-3" style={{ color: '#1e293b' }}>{t('about.core_values')}</Title>
              <Paragraph className="fs-5" style={{ color: '#64748b' }}>
                {t('about.values_description')}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="h-100 text-center border-0 shadow-sm"
                    hoverable
                    style={{
                      transition: 'all 0.3s ease',
                      borderRadius: '12px'
                    }}
                  >
                    <div className="mb-3" style={{ fontSize: '2.5rem', color: '#667eea' }}>
                      {value.icon}
                    </div>
                    <Title level={4} className="mb-3" style={{ color: '#1e293b' }}>{value.title}</Title>
                    <Paragraph style={{ color: '#64748b' }}>{value.description}</Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

        <section className="py-5" style={{ backgroundColor: "#ffffff" }}>
          <div className="container">
            <Row justify="center" className="mb-5">
              <Col xs={24} lg={16} className="text-center">
                <Title level={2} className="mb-3" style={{ color: "#1e293b" }}>
                  {t("about.meet_team")}
                </Title>
                <Paragraph style={{ fontSize: "18px", color: "#64748b" }}>
                  {t("about.team_description")}
                </Paragraph>
              </Col>
            </Row>
            {teamLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
                <Spin size="large" />
              </div>
            ) : !team.length ? (
              <Empty description={t("about.no_team_members")} style={{ padding: "48px 0" }} />
            ) : (
              <Row gutter={[24, 24]} justify="center">
                {team.map((member, index) => (
                  <Col xs={24} sm={12} lg={8} key={member.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        className="text-center border-0 shadow-sm h-100"
                        hoverable
                        style={{
                          transition: "all 0.3s ease",
                          borderRadius: "20px",
                          border: "1px solid rgba(0, 0, 0, 0.05)",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-8px)";
                          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            marginBottom: "24px",
                            width: 100,
                            height: 100,
                            margin: "0 auto",
                          }}
                        >
                          {member.imageUrl ? (
                            <div
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "4px solid #667eea",
                                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                              }}
                            >
                              <Image
                                src={member.imageUrl}
                                alt={member.fullName}
                                width={100}
                                height={100}
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          ) : (
                            <Avatar
                              size={100}
                              icon={<UserOutlined />}
                              style={{
                                border: "4px solid #667eea",
                                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                                backgroundColor: "#22C55E",
                                fontSize: 40,
                              }}
                            />
                          )}
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              background: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "14px",
                              boxShadow: "0 4px 16px rgba(34, 197, 94, 0.3)",
                            }}
                          >
                            <CheckCircleOutlined />
                          </div>
                        </div>
                        <Title level={4} className="mb-2" style={{ color: "#1e293b" }}>
                          {member.fullName}
                        </Title>
                        {member.role && (
                          <Text type="secondary" className="mb-2 d-block" style={{ fontSize: "16px" }}>
                            {member.role}
                          </Text>
                        )}
                        {member.bio && (
                          <Paragraph
                            className="text-muted mb-0"
                            style={{ fontSize: "14px", lineHeight: "1.6" }}
                          >
                            {member.bio.length > 160 ? `${member.bio.slice(0, 160)}...` : member.bio}
                          </Paragraph>
                        )}
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </section>

{}
        <AppCTA />
      </PageLayout>
  );
}
