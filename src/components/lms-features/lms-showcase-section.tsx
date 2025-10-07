"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Statistic,
  Spin,
} from "antd";
import {
  TrophyOutlined,
  RocketOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { userAPI } from "@store/api/user_api";
import { courseAPI } from "@store/api/course_api";
import { courseEnrollmentAPI } from "@store/api/course-enrollment_api";
import { postAPI } from "@store/api/post_api";
import { eventAPI } from "@store/api/event_api";
import { useTranslation } from "@contexts/translation.context";
import styles from "./lms-mobile-styles.module.css";

const { Title, Paragraph, Text } = Typography;

// Dynamically import motion components to avoid SSR issues
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => <div />,
  }
);

export const LMSShowcaseSection = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: users, isLoading: isLoadingUsers } =
    userAPI.useFetchAllUsersQuery(1);
  const { data: courses, isLoading: isLoadingCourses } =
    courseAPI.useFetchAllCoursesQuery(1);
  const { data: enrollmentsData, isLoading: isLoadingEnrollments } =
    courseEnrollmentAPI.useFetchAllCourseEnrollmentsQuery({});
  const { data: posts, isLoading: isLoadingPosts } =
    postAPI.useFetchAllPostsQuery({ page: 1 });
  const { data: events, isLoading: isLoadingEvents } =
    eventAPI.useFetchAllEventsQuery(1);

  const stats = useMemo(() => {
    const creatorCount =
      users?.filter(
        (user: any) => user.role === "creator" || user.role === "admin"
      ).length || 0;
    const courseCount = courses?.length || 0;
    const enrollmentCount =
      enrollmentsData?.total || enrollmentsData?.data?.length || 0;
    const postCount = posts?.length || 0;
    const eventCount = events?.length || 0;

    // Estimated interaction counts based on available data
    // const estimatedPostInteractions = Math.floor(postCount * 25) || 0;
    const estimatedEventRegistrations = Math.floor(eventCount * 15) || 0;

    return [
      {
        title: t("lms.active_creators"),
        value: creatorCount > 0 ? `${creatorCount.toLocaleString()}+` : "0",
        icon: <UsergroupAddOutlined />,
        loading: isLoadingUsers,
        color: "#22C55E",
      },
      {
        title: t("lms.courses_created"),
        value: courseCount > 0 ? `${courseCount.toLocaleString()}+` : "0",
        icon: <BookOutlined />,
        loading: isLoadingCourses,
        color: "#14B8A6",
      },
      {
        title: t("lms.students_enrolled"),
        value:
          enrollmentCount > 0 ? `${enrollmentCount.toLocaleString()}+` : "0",
        icon: <TrophyOutlined />,
        loading: isLoadingEnrollments,
        color: "#0EA5E9",
      },
      {
        title: t("lms.blog_posts_published"),
        value: postCount > 0 ? `${postCount.toLocaleString()}+` : "0",
        icon: <FileTextOutlined />,
        loading: isLoadingPosts,
        color: "#8B5CF6",
      },
      // {
      //   title: t("lms.post_interactions"),
      //   value: estimatedPostInteractions > 0 ? `${estimatedPostInteractions.toLocaleString()}+` : "0",
      //   icon: <LikeOutlined />,
      //   loading: isLoadingPosts,
      //   color: "#F59E0B",
      // },
      {
        title: t("lms.events_published"),
        value: eventCount > 0 ? `${eventCount.toLocaleString()}+` : "0",
        icon: <CalendarOutlined />,
        loading: isLoadingEvents,
        color: "#EF4444",
      },
      {
        title: t("lms.event_registrations"),
        value:
          estimatedEventRegistrations > 0
            ? `${estimatedEventRegistrations.toLocaleString()}+`
            : "0",
        icon: <UserAddOutlined />,
        loading: isLoadingEvents,
        color: "#06B6D4",
      },
    ];
  }, [
    users,
    courses,
    enrollmentsData,
    posts,
    events,
    isLoadingUsers,
    isLoadingCourses,
    isLoadingEnrollments,
    isLoadingPosts,
    isLoadingEvents,
    t,
  ]);

  // Create animated wrapper component
  const AnimatedWrapper = ({ children, ...props }: any) => {
    // Extract motion-specific props to avoid passing them to regular DOM elements
    const { 
      initial, 
      animate, 
      whileInView, 
      viewport, 
      transition, 
      ...domProps 
    } = props;
    
    if (!isClient) {
      return <div {...domProps}>{children}</div>;
    }
    return (
      <MotionDiv 
        initial={initial}
        animate={animate}
        whileInView={whileInView}
        viewport={viewport}
        transition={transition}
        {...domProps}
      >
        {children}
      </MotionDiv>
    );
  };

  return (
    <section
      className={styles.lmsSection}
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #f0fdf4 50%, #ecfeff 100%)",
      }}
    >
      <div className={`container ${styles.lmsContainer} bg-none`}>
        {/* Header */}
        <AnimatedWrapper
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.headerMargin}
          style={{ textAlign: "center" }}
        >
          <Title level={1} className={`gradient-title ${styles.lmsMainTitle}`}>
            {t("lms.showcase_title")}
          </Title>
          <Paragraph
            className={styles.lmsSubtitle}
            style={{
              color: "#6B7280",
              maxWidth: "800px",
              margin: "0 auto 24px",
            }}
          >
            {t("lms.showcase_subtitle")}
          </Paragraph>
          <div
            className={styles.buttonSpace}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
              width: "100%",
            }}
          >
            <Link href="/register" className={styles.buttonWrapper}>
              <Button
                type="primary"
                // href="/register"
                size="large"
                shape="round"
                icon={<RocketOutlined />}
                block
                className={styles.button}
                style={{
                  background:
                    "linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%)",
                  border: "none",
                  fontWeight: "600",
                }}
              >
                {t("lms.start_creating")}
              </Button>
            </Link>
            <Link href="/courses" className={styles.buttonWrapper}>
              <Button
                // href="/courses"
                size="large"
                shape="round"
                block
                className={`${styles.button} ${styles.buttonException}`}
                style={{
                  borderColor: "#22C55E",
                  color: "#22C55E",
                  fontWeight: "600",
                }}
              >
                {t("lms.explore_courses")}
              </Button>
            </Link>
          </div>
        </AnimatedWrapper>

        {/* Stats */}
        <AnimatedWrapper
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.sectionMarginBottom}
        >
          <Row gutter={[8, 8]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={8} md={6} lg={4} key={index}>
                <Card
                  hoverable
                  className={styles.statCard}
                  style={{
                    textAlign: "center",
                    borderRadius: "16px",
                    border: "1px solid rgba(34, 197, 94, 0.1)",
                    boxShadow: "0 4px 20px rgba(34, 197, 94, 0.08)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    className={styles.statIcon}
                    style={{ color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  {stat.loading ? (
                    <Spin size="default" />
                  ) : (
                    <Statistic
                      value={stat.value}
                      valueStyle={{
                        fontSize: "clamp(20px, 5vw, 32px)",
                        fontWeight: "700",
                        background:
                          "linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    />
                  )}
                  <Text
                    className={styles.statLabel}
                    style={{
                      color: "#6B7280",
                      fontWeight: "500",
                      display: "block",
                    }}
                  >
                    {stat.title}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </AnimatedWrapper>
      </div>
    </section>
  );
};

export default LMSShowcaseSection;
