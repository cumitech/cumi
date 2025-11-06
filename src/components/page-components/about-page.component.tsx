"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { Typography, Row, Col, Card, Button, Divider, Space, Avatar, Statistic, Badge, Tag } from "antd";
import { RocketOutlined, CodeOutlined, TeamOutlined, BulbOutlined, HeartOutlined, TrophyOutlined, GlobalOutlined, ThunderboltOutlined, CheckCircleOutlined, StarOutlined, ArrowRightOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useTranslation } from "@contexts/translation.context";
import { AppCTA } from "@components/CTA.component";
import { publicStatsAPI } from "@store/api/public-stats_api";
import { 
  PageLayout, 
  LoadingSpinner 
} from "@components/shared";

const { Title, Paragraph, Text } = Typography;

export default function AboutPageComponent() {
  const { t } = useTranslation();

// Fetch real stats data
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = publicStatsAPI.useGetPublicStatsQuery();

// Log stats data for debugging
  React.useEffect(() => {
    if (statsData) {
      // Stats data loaded successfully
    }
    if (statsError) {
      console.error('Error loading public stats:', statsError);
    }
  }, [statsData, statsError]);

// Use real stats data with proper null/undefined handling
  const stats = {
    totalProjects: statsData?.totalProjects ?? 25,
    totalServices: statsData?.totalServices ?? 8,
    totalPosts: statsData?.totalPosts ?? 12,
    totalEvents: statsData?.totalEvents ?? 5,
    totalCourses: statsData?.totalCourses ?? 10,
    totalUsers: statsData?.totalUsers ?? 50
  };

const statsDisplay = [
    { 
      title: t('about.projects_completed'), 
      value: stats.totalProjects, 
      icon: <TrophyOutlined />,
      suffix: '+'
    },
    { 
      title: t('about.happy_clients'), 
      value: Math.max(stats.totalUsers, 50), 
      icon: <HeartOutlined />,
      suffix: '+'
    },
    { 
      title: t('about.years_experience'), 
      value: 5, 
      icon: <GlobalOutlined />,
      suffix: '+'
    },
    { 
      title: t('about.team_members'), 
      value: 10, 
      icon: <TeamOutlined />,
      suffix: '+'
    }
  ];

const values = [
    {
      icon: <BulbOutlined />,
      title: t('about.innovation'),
      description: t('about.innovation_desc')
    },
    {
      icon: <HeartOutlined />,
      title: t('about.passion'),
      description: t('about.passion_desc')
    },
    {
      icon: <ThunderboltOutlined />,
      title: t('about.excellence'),
      description: t('about.excellence_desc')
    },
    {
      icon: <TeamOutlined />,
      title: t('about.collaboration'),
      description: t('about.collaboration_desc')
    }
  ];

const team = [
    {
      name: "Ayuk Godlove",
      role: "Founder & Software Engineer",
      position: "Creative Designer",
      avatar: "/img/avatar.png",
      description: "At CumiTech, I combine my skills as a software engineer and creative designer to empower startup businesses through innovative web solutions. I develop scalable websites and applications using technologies like React and Laravel, while also managing client relationships and project timelines.",
      skills: ["React", "Laravel", "Node.js", "TypeScript", "PHP", "JavaScript", "UI/UX Design"],
      experience: "5+ years",
      location: "Bamenda, Northwest, Cameroon",
      email: "ayukgodlove@cumi.dev",
      phone: "+237681289411"
    }
  ];

return (
      <PageLayout
        showBanner={true}
        bannerTitle="About Us"
        bannerBreadcrumbs={[{ label: "About Us", uri: "about-us" }]}
      >
        {}
        <section className="py-5">
          <div className="container">
            <Row gutter={[24, 24]} justify="center">
              {statsDisplay.map((stat, index) => (
                <Col xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="text-center border-0 shadow-sm h-100"
                      style={{
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      hoverable
                      loading={isLoadingStats}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div 
                        style={{ 
                          fontSize: '3rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          marginBottom: '16px'
                        }}
                      >
                        {stat.icon}
                      </div>
                      <Statistic 
                        title={stat.title} 
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{ 
                          color: '#1e293b', 
                          fontSize: '2.5rem', 
                          fontWeight: 'bold',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

{}
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

{}
        <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
          <div className="container">
            <Row justify="center" className="mb-5">
              <Col xs={24} lg={16} className="text-center">
                <Title level={2} className="mb-3" style={{ color: '#1e293b' }}>
                  {t('about.meet_team')}
                </Title>
                <Paragraph style={{ fontSize: '18px', color: '#64748b' }}>
                  {t('about.team_description')}
                </Paragraph>
              </Col>
            </Row>
            <Row gutter={[24, 24]} justify="center">
              {team.map((member, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="text-center border-0 shadow-sm h-100"
                      hoverable
                      style={{
                        transition: 'all 0.3s ease',
                        borderRadius: '20px',
                        // background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <Avatar 
                          size={100} 
                          src={member.avatar}
                          style={{
                            border: '4px solid #667eea',
                            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                          }}
                        />
                        <div 
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
                          }}
                        >
                          <CheckCircleOutlined />
                        </div>
                      </div>
                      <Title level={4} className="mb-2" style={{ color: '#1e293b' }}>
                        {member.name}
                      </Title>
                      <Text type="secondary" className="mb-2 d-block" style={{ fontSize: '16px' }}>
                        {member.role}
                      </Text>
                      <Text strong className="mb-3 d-block" style={{ 
                        color: '#667eea', 
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {member.position}
                      </Text>
                      <Paragraph className="text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        {member.description}
                      </Paragraph>
                      <div className="mb-4">
                        <Text strong className="small" style={{ color: '#1e293b' }}>
                          {t('about.skills')}
                        </Text>
                        <div className="mt-2">
                          {member.skills?.slice(0, 4).map((skill: string, skillIndex: number) => (
                            <Tag 
                              key={skillIndex} 
                              color="blue" 
                              className="me-1 mb-1"
                              style={{ borderRadius: '6px', fontSize: '12px' }}
                            >
                              {skill}
                            </Tag>
                          ))}
                          {member.skills?.length > 4 && (
                            <Tag color="default" style={{ borderRadius: '6px', fontSize: '12px' }}>
                              +{member.skills.length - 4}
                            </Tag>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <Space direction="vertical" size="small">
                          <div style={{ fontSize: '13px', color: '#64748b' }}>
                            <EnvironmentOutlined className="me-2" />
                            <strong>{t('about.location')}</strong> {member.location}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>
                            <TrophyOutlined className="me-2" />
                            <strong>{t('about.experience')}</strong> {member.experience}
                          </div>
                        </Space>
                      </div>
                      <Divider style={{ margin: '16px 0' }} />
                      <Space size="middle">
                        <Button 
                          type="text" 
                          icon={<MailOutlined />} 
                          href={`mailto:${member.email}`}
                          style={{ color: '#667eea' }}
                        />
                        <Button 
                          type="text" 
                          icon={<PhoneOutlined />} 
                          href={`tel:${member.phone}`}
                          style={{ color: '#667eea' }}
                        />
                        <Button 
                          type="text" 
                          icon={<LinkedinOutlined />} 
                          href="https://linkedin.com/in/ayukgodlove"
                          style={{ color: '#667eea' }}
                        />
                        <Button 
                          type="text" 
                          icon={<GithubOutlined />} 
                          href="https://github.com/ayeahgodlove"
                          style={{ color: '#667eea' }}
                        />
                      </Space>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

{}
        <AppCTA />
      </PageLayout>
  );
}
