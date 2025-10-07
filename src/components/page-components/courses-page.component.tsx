"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Typography, Space, Button, Tag, Input, Select, App, Empty, Spin } from "antd";
import { CalendarOutlined, EnvironmentOutlined, EyeOutlined, SearchOutlined, FilterOutlined, BookOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { courseAPI } from "@store/api/course_api";
import { courseEnrollmentAPI } from "@store/api/course-enrollment_api";
import { motion } from "framer-motion";
import { ICourse } from "@domain/models/course";
import { useTranslation } from "@contexts/translation.context";
import { useRouter } from "next/navigation";
import {
  PageLayout,
  LoadingSpinner,
  SearchAndFilterBar,
  EmptyState,
  CourseEnrollmentModal,
} from "@components/shared";
import {
  showLoginRequiredNotificationSimple,
  getCurrentUrlForRedirect,
} from "@components/shared/login-required-notification";
import {
  EnrollButton,
  ViewDetailsButton,
} from "@components/shared/modern-button-styles";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CoursesPageComponent() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const { message } = App.useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [enrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(
    new Set()
  );

const {
    data: courses,
    error,
    isLoading,
    isFetching,
  } = courseAPI.useFetchAllCoursesQuery({
    searchTitle: debouncedSearchTerm,
    sortBy: "date",
  });

// Fetch user enrollments
  const {
    data: userEnrollments,
    isLoading: isLoadingEnrollments,
    refetch: refetchEnrollments,
  } = courseEnrollmentAPI.useGetCourseEnrollmentsByUserQuery(
    session?.user?.id || "",
    {
      skip: !session?.user?.id,
    }
  );

// Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

return () => clearTimeout(timer);
  }, [searchTerm]);

// Update enrolled courses when user enrollments change
  useEffect(() => {
    if (userEnrollments && Array.isArray(userEnrollments)) {
      const enrolledCourseIds = userEnrollments.map(
        (enrollment) => enrollment.courseId
      );
      setEnrolledCourses(new Set(enrolledCourseIds));
    }
  }, [userEnrollments]);

const filteredCourses =
    courses?.filter((course) => {
      const matchesSearch =
        course.title
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      // Note: ICourse doesn't have level/category properties, so we'll skip filtering for now
      return matchesSearch;
    }) || [];

const handleEnrollCourse = (course: ICourse) => {
    // Check if user is logged in
    if (!session?.user?.id) {
      showLoginRequiredNotificationSimple({
        message: "Authentication Required",
        description: `Please log in to enroll in "${course.title}" and start your learning journey.`,
        redirectUrl: getCurrentUrlForRedirect(),
      });
      return;
    }

// Check if already enrolled
    if (enrolledCourses.has(course.id)) {
      message.info({
        content: "You are already enrolled in this course!",
        duration: 3,
      });
      return;
    }

setSelectedCourse(course);
    setEnrollmentModalVisible(true);
  };

const handleEnrollmentSuccess = () => {
    // Refresh enrollments after successful enrollment
    refetchEnrollments();
    setEnrollmentModalVisible(false);
    setSelectedCourse(null);
  };

const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

const loading = isLoading || isFetching;

return (
    <PageLayout
      showBanner={true}
      bannerTitle={t("nav.courses")}
      bannerBreadcrumbs={[{ label: t("nav.courses"), uri: "courses" }]}
    >
      <div
        className="container pb-5"
        style={{ marginTop: 24, backgroundColor: "white" }}
      >
        {loading ? (
          <div style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
            <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>{t("courses.loading_courses")}</div>
            </Card>
          </div>
        ) : (
          <>
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={2} style={{ margin: 0 }}>
                  {t("courses.title")}
                </Title>
                <Text type="secondary">{t("courses.subtitle")}</Text>
              </Col>
            </Row>
          </Card>
        </motion.div>

{}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Card
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Search
                  placeholder={t("courses.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined />}
                  styles={{
                    affixWrapper: {
                      height: "44px",
                    },
                  }}
                  allowClear
                  size="large"
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder={t("courses.level_placeholder")}
                  value={filterLevel}
                  onChange={setFilterLevel}
                  style={{ width: "100%", height: "44px" }}
                  size="large"
                  allowClear
                >
                  <Option value="all">{t("courses.all_levels")}</Option>
                  <Option value="Beginner">{t("courses.beginner")}</Option>
                  <Option value="Intermediate">
                    {t("courses.intermediate")}
                  </Option>
                  <Option value="Advanced">{t("courses.advanced")}</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder={t("courses.category_placeholder")}
                  value={filterCategory}
                  onChange={setFilterCategory}
                  style={{ width: "100%", height: "44px" }}
                  size="large"
                  allowClear
                >
                  <Option value="all">{t("courses.all_categories")}</Option>
                  <Option value="Web Development">
                    {t("courses.web_dev")}
                  </Option>
                  <Option value="Programming">
                    {t("courses.programming")}
                  </Option>
                  <Option value="Data Science">
                    {t("courses.data_science")}
                  </Option>
                  <Option value="Mobile Development">
                    {t("courses.mobile_dev")}
                  </Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => {
                    setSearchTerm("");
                    setFilterLevel("all");
                    setFilterCategory("all");
                  }}
                >
                  {t("courses.clear_filters")}
                </Button>
              </Col>
            </Row>
          </Card>
        </motion.div>

{}
        {filteredCourses.length === 0 ? (
          <Card>
            <Empty
              description={t("courses.no_courses_found")}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredCourses.map((course, index) => (
              <Col xs={24} md={12} lg={8} key={course.id}>
                <motion.div
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
                    hoverable
                    style={{
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                    cover={
                      <div style={{ position: "relative", height: 200, width: '100%' }}>
                        <Image
                          alt={course.title}
                          src={course.imageUrl || "/img/design-3.jpg"}
                          fill
                          style={{
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            background: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          📚 {t("courses.course")}
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          {t("courses.course")}
                        </div>
                      </div>
                    }
                    actions={[
                      enrolledCourses.has(course.id) ? (
                        <Button
                          key="enrolled"
                          disabled
                          style={{
                            background:
                              "linear-gradient(135deg, #22C55E 0%, #16a34a 100%)",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: 600,
                            fontSize: "14px",
                            height: "44px",
                            padding: "0 24px",
                            color: "white",
                            cursor: "not-allowed",
                            opacity: 0.8,
                          }}
                        >
                          ✓ {t("courses.enrolled")}
                        </Button>
                      ) : (
                        <EnrollButton
                          key="enroll"
                          icon={<BookOutlined />}
                          onClick={() => handleEnrollCourse(course)}
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: 600,
                            fontSize: "14px",
                            height: "44px",
                            padding: "0 24px",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 20px rgba(102, 126, 234, 0.4)";
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(102, 126, 234, 0.3)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          {t("courses.enroll")}
                        </EnrollButton>
                      ),
                      <ViewDetailsButton
                        key="view"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          router.push(`/courses/${course.slug}`);
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
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.borderColor = "#667eea";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(102, 126, 234, 0.3)";
                          e.currentTarget.style.transform = "translateY(-2px)";
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
                        {t("courses.view_details")}
                      </ViewDetailsButton>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Space>
                          <Text strong>{course.title}</Text>
                          <Tag color="green">{t("courses.course")}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {course.description}
                          </Paragraph>
                          <Space>
                            <CalendarOutlined style={{ color: "#1890ff" }} />
                            <Text type="secondary">
                              {formatDate(course.createdAt)}
                            </Text>
                          </Space>
                          <Space>
                            <EnvironmentOutlined style={{ color: "#faad14" }} />
                            <Text type="secondary">{course.authorName}</Text>
                          </Space>
                        </Space>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}

{}
        <CourseEnrollmentModal
          visible={enrollmentModalVisible}
          onCancel={() => setEnrollmentModalVisible(false)}
          course={selectedCourse}
          onSuccess={handleEnrollmentSuccess}
        />
          </>
        )}
      </div>
    </PageLayout>
  );
}
