/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import {
  Col,
  Row,
  Card,
  Statistic,
  Typography,
  Space,
  Progress,
  Table,
  Tag,
  Avatar,
  Button,
  Spin,
} from "antd";
import { TbUsersGroup } from "react-icons/tb";
import { GrArticle } from "react-icons/gr";
import { FcInvite } from "react-icons/fc";
import { SiGooglemessages } from "react-icons/si";
import {
  BookOutlined,
  CalendarOutlined,
  ProjectOutlined,
  TrophyOutlined,
  MessageOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { useSession } from "next-auth/react";
import { useTranslation } from "@contexts/translation.context";
import { statsAPI } from "@store/api/stats_api";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import RoleSwitcher from "@components/role-switcher";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Fetch real stats data with auto-refresh for admin dashboard (only for admin users)
  const statsQuery = statsAPI.useGetDashboardStatsQuery(undefined, {
    pollingInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !session?.user, // Only skip if no user session
  });

  // Redirect non-admin users to their appropriate dashboard (only once)
  useEffect(() => {
    if (session?.user && !hasRedirected.current) {
      const userRole = session.user.role || "user";
      
      // If user is not admin, redirect to their role-specific dashboard
      if (userRole !== "admin") {
        const roleDashboards = {
          creator: "/dashboard/creator",
          student: "/dashboard/student", 
          user: "/dashboard/student", // Redirect user role to student dashboard
        };
        
        const targetDashboard = roleDashboards[userRole as keyof typeof roleDashboards];
        if (targetDashboard) {
          hasRedirected.current = true;
          router.replace(targetDashboard);
        }
      }
    }
  }, [session?.user, router]); // Include router in dependencies

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Only render admin dashboard for admin users
  if (!session?.user || session.user.role !== "admin") {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  const {
    data: statsData,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
    error: statsError,
    refetch: refetchStats,
  } = statsQuery;

  // Type assertion to fix refetch call signature
  const handleRefetchStats = refetchStats as () => void;

  // Use real stats data or fallback to 0
  const stats = statsData?.overview || {
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalMessages: 0,
    totalCourses: 0,
    totalProjects: 0,
    totalProfessionals: 0,
    totalOpportunities: 0,
    totalServices: 0,
    totalBanners: 0,
    totalMedia: 0,
    totalSubscribers: 0,
    totalComments: 0,
    totalPostLikes: 0,
    totalCommentLikes: 0,
    totalUserLikes: 0,
    totalUserComments: 0,
  };

  const loading = isLoadingStats || isFetchingStats;

  const mainStats = [
    {
      title: t("dashboard.total_users"),
      value: stats.totalUsers,
      icon: <TbUsersGroup size={24} />,
      color: "#1890ff",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: t("dashboard.total_posts"),
      value: stats.totalPosts,
      icon: <GrArticle size={24} fontWeight={"bold"} />,
      color: "#52c41a",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: t("dashboard.total_events"),
      value: stats.totalEvents,
      icon: <FcInvite size={24} fontWeight={"bold"} />,
      color: "#faad14",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: t("dashboard.total_messages"),
      value: stats.totalMessages,
      icon: <SiGooglemessages size={24} fontWeight={"bold"} />,
      color: "#722ed1",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: t("dashboard.total_subscribers"),
      value: stats.totalSubscribers,
      icon: <MessageOutlined style={{ fontSize: 24 }} />,
      color: "#13c2c2",
      trend: "+20%",
      trendUp: true,
    },
  ];

  const secondaryStats = [
    {
      title: t("dashboard.courses"),
      value: stats.totalCourses,
      icon: <BookOutlined />,
      color: "#13c2c2",
    },
    {
      title: t("dashboard.projects"),
      value: stats.totalProjects,
      icon: <ProjectOutlined />,
      color: "#eb2f96",
    },
    {
      title: t("dashboard.professionals"),
      value: stats.totalProfessionals,
      icon: <UserOutlined />,
      color: "#52c41a",
    },
    {
      title: "Total Comments",
      value: stats.totalComments,
      icon: <MessageOutlined />,
      color: "#722ed1",
    },
    {
      title: "Post Likes",
      value: stats.totalPostLikes,
      icon: <RiseOutlined />,
      color: "#52c41a",
    },
    {
      title: "Comment Likes",
      value: stats.totalCommentLikes,
      icon: <RiseOutlined />,
      color: "#1890ff",
    },
  ];

  // Get recent activities from API data
  const recentActivities = statsData?.recentActivities || [];

  // Handle stats API error
  if (statsError && !isLoadingStats) {
    console.error('Stats API Error:', statsError);
  }

  // User-specific stats for non-admin users
  const userStats = [
    {
      title: "My Comments",
      value: stats.totalUserComments,
      icon: <MessageOutlined />,
      color: "#722ed1",
    },
    {
      title: "My Likes",
      value: stats.totalUserLikes,
      icon: <RiseOutlined />,
      color: "#52c41a",
    },
  ];

  // Creator-specific stats
  const creatorStats = [
    {
      title: "My Posts",
      value: stats.totalPosts, // This would need to be filtered by user in a real implementation
      icon: <GrArticle size={24} fontWeight={"bold"} />,
      color: "#52c41a",
    },
    {
      title: "Post Likes Received",
      value: stats.totalPostLikes, // This would need to be filtered by user's posts
      icon: <RiseOutlined />,
      color: "#1890ff",
    },
    {
      title: "Comment Likes Received",
      value: stats.totalCommentLikes, // This would need to be filtered by user's comments
      icon: <RiseOutlined />,
      color: "#13c2c2",
    },
  ];

  const activityColumns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text: string) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (text: string, record: any) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 200 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "success"
              ? "green"
              : status === "processing"
              ? "blue"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Spin size="large" tip={t("common.loading")} />
      </div>
    );
  }

  // Show error state
  if (statsError) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Card>
          <Text type="danger">
            {t("common.error")}: Failed to load dashboard stats
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Col span={24}>
        <PageBreadCrumbs items={["Dashboard"]} />

        {/* Role Switcher */}
        <RoleSwitcher 
          currentRole={session?.user?.role || "admin"} 
          size="middle"
          showLabel={true}
        />

        {/* Welcome Section */}
        <Card 
          style={{ 
            marginBottom: 24,
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "none",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={1} style={{ margin: 0, fontSize: '2rem', fontWeight: '600' }}>
                {t("dashboard.welcome")}, {session?.user?.name || "Administrator"}! 👋
              </Title>
              <Text type="secondary">{t("dashboard.admin_subtitle")}</Text>
            </Col>
            <Col>
              <Space>
                <Text type="secondary">
                  Last updated: {new Date().toLocaleTimeString()}
                </Text>
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={handleRefetchStats}
                  loading={isFetchingStats}
                  title="Refresh Stats"
                />
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Error Message for Stats API */}
        {statsError && (
          <Card 
            style={{ 
              marginBottom: 24,
              backgroundColor: "#fff2f0",
              border: "1px solid #ffccc7",
              borderRadius: "12px",
            }}
          >
            <Row align="middle" justify="space-between">
              <Col>
                <Text style={{ color: "#ff4d4f", fontSize: "16px", fontWeight: "500" }}>
                  ⚠️ Unable to load dashboard statistics
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  The dashboard is working, but some statistics may not be available. 
                  You can try refreshing the page or contact support if the issue persists.
                </Text>
              </Col>
              <Col>
                <Button
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={handleRefetchStats}
                  loading={isFetchingStats}
                >
                  Retry
                </Button>
              </Col>
            </Row>
          </Card>
        )}

        {/* Main Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {mainStats.map((stat, index) => (
            <Col sm={8} md={6} span={24} key={index}>
              <Card
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none",
                }}
              >
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  valueStyle={{ color: stat.color }}
                  suffix={
                    <Space>
                      {stat.trendUp ? (
                        <RiseOutlined style={{ color: "#52c41a" }} />
                      ) : (
                        <FallOutlined style={{ color: "#ff4d4f" }} />
                      )}
                      <Text
                        style={{
                          color: stat.trendUp ? "#52c41a" : "#ff4d4f",
                          fontSize: 12,
                        }}
                      >
                        {stat.trend}
                      </Text>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Secondary Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {secondaryStats.map((stat, index) => (
            <Col sm={6} md={6} span={24} key={index}>
              <Card size="small">
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                  }
                  valueStyle={{ fontSize: 20 }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* User-specific stats for non-admin users */}
        {session?.user?.role !== "admin" && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Title level={4}>Your Activity</Title>
            </Col>
            {userStats.map((stat, index) => (
              <Col sm={6} md={6} span={24} key={index}>
                <Card size="small">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={
                      <span style={{ color: stat.color }}>{stat.icon}</span>
                    }
                    valueStyle={{ fontSize: 20 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Creator-specific stats */}
        {session?.user?.role && ["creator", "student"].includes(session.user.role) && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Title level={4}>Creator Statistics</Title>
            </Col>
            {creatorStats.map((stat, index) => (
              <Col sm={6} md={6} span={24} key={index}>
                <Card size="small">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={
                      <span style={{ color: stat.color }}>{stat.icon}</span>
                    }
                    valueStyle={{ fontSize: 20 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Charts and Analytics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card 
              title={t("dashboard.platform_growth")} 
              size="small"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "none",
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>User Registration</Text>
                  <Progress
                    percent={Math.min(100, (stats.totalUsers / 1000) * 100)}
                    strokeColor="#1890ff"
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {stats.totalUsers} users registered
                  </Text>
                </div>
                <div>
                  <Text strong>Content Creation</Text>
                  <Progress
                    percent={Math.min(100, (stats.totalPosts / 100) * 100)}
                    strokeColor="#52c41a"
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {stats.totalPosts} posts created
                  </Text>
                </div>
                <div>
                  <Text strong>Event Participation</Text>
                  <Progress
                    percent={Math.min(100, (stats.totalEvents / 50) * 100)}
                    strokeColor="#faad14"
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {stats.totalEvents} events hosted
                  </Text>
                </div>
                <div>
                  <Text strong>Course Completion</Text>
                  <Progress
                    percent={Math.min(100, (stats.totalCourses / 30) * 100)}
                    strokeColor="#722ed1"
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {stats.totalCourses} courses available
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card 
              title={t("dashboard.recent_activity")} 
              size="small"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "none",
              }}
            >
              {recentActivities.length > 0 ? (
                <Table
                  dataSource={recentActivities}
                  columns={activityColumns}
                  pagination={false}
                  size="small"
                  scroll={{ x: 400 }}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#999",
                  }}
                >
                  <Text type="secondary">
                    {t("dashboard.no_recent_activities")}
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card 
          title={t("dashboard.quick_actions")}
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "none",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                size="small" 
                style={{ 
                  textAlign: "center",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none",
                }}
              >
                <Space direction="vertical">
                  <TrophyOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                  <Text strong>{t("dashboard.manage_courses")}</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                size="small" 
                style={{ 
                  textAlign: "center",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none",
                }}
              >
                <Space direction="vertical">
                  <CalendarOutlined
                    style={{ fontSize: 24, color: "#52c41a" }}
                  />
                  <Text strong>{t("dashboard.schedule_events")}</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                size="small" 
                style={{ 
                  textAlign: "center",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none",
                }}
              >
                <Space direction="vertical">
                  <MessageOutlined style={{ fontSize: 24, color: "#faad14" }} />
                  <Text strong>{t("dashboard.view_messages")}</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                size="small" 
                style={{ 
                  textAlign: "center",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none",
                }}
              >
                <Space direction="vertical">
                  <UserOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                  <Text strong>{t("dashboard.user_management")}</Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>

      <Authenticated key="home-page">
        <NavigateToResource />
      </Authenticated>
    </div>
  );
}

