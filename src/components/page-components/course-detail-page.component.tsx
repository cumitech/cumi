"use client";

import Image from "next/image";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import Share from "@components/shared/share";
import { courseAPI } from "@store/api/course_api";
import { useGetCourseModulesQuery } from "@store/api/learning_api";
import { useGetCourseEnrollmentsByCourseQuery } from "@store/api/course-enrollment_api";
import {
  Row,
  Col,
  Layout,
  Empty,
  Spin,
  Card,
  Typography,
  Button,
  Tag,
  Space,
  Divider,
  List,
  Progress,
  Table,
  App,
  Collapse,
  Modal,
} from "antd";
import { motion } from "framer-motion";
import {
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  BookOutlined,
  TrophyOutlined,
  TeamOutlined,
  GlobalOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  StarOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  LockOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  SoundOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { message } from "antd";
import { useSession } from "next-auth/react";
import CourseEnrollmentModal from "@components/shared/course-enrollment-modal.component";
import {
  showLoginRequiredNotificationSimple,
  getCurrentUrlForRedirect,
} from "@components/shared/login-required-notification";
import YouTubePlayerFrame from "@components/shared/youtube.component";
import { useTranslation } from "@contexts/translation.context";

interface ILesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  durationMinutes?: number;
  lessonOrder: number;
  status: "draft" | "published" | "archived";
  difficulty: string;
  createdAt: Date;
  updatedAt: Date;
  lessonType:
    | "video"
    | "text"
    | "audio"
    | "practical"
    | "discussion"
    | "assignment";
  videoUrl?: string;
  audioUrl?: string;
  downloadMaterials?: string;
  isLocked?: boolean;
  isFreePreview?: boolean;
}

interface IModule {
  id: string;
  title: string;
  slug: string;
  description?: string;
  courseId: string;
  moduleOrder: number;
  status: "draft" | "published" | "archived";
  isLocked: boolean;
  totalLessons: number;
  lessons: ILesson[];
}

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface CourseDetailPageComponentProps {
  courseSlug: string;
}

export default function CourseDetailPageComponent({
  courseSlug,
}: CourseDetailPageComponentProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<ILesson | null>(null);
  const { data: session } = useSession();
  const { message } = App.useApp();
  const { t } = useTranslation();

const {
    data: course,
    error,
    isLoading,
    isFetching,
  } = courseAPI.useGetSingleCourseBySlugQuery(courseSlug);

// Fetch course modules with lessons
  const {
    data: modules,
    isLoading: modulesLoading,
    error: modulesError,
  } = useGetCourseModulesQuery(course?.id || "", {
    skip: !course?.id,
  });

// Fetch course enrollments to get actual student count
  const { data: enrollments, isLoading: enrollmentsLoading } =
    useGetCourseEnrollmentsByCourseQuery(course?.id || "", {
      skip: !course?.id,
      pollingInterval: 60000, // Poll every 60 seconds for new enrollments
    });

// Check enrollment status when course loads
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!course || !session?.user?.id) return;

setEnrollmentLoading(true);
      try {
        const response = await fetch(
          `/api/course-enrollments?courseId=${course.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsEnrolled(data.enrolled || false);
        }
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      } finally {
        setEnrollmentLoading(false);
      }
    };

checkEnrollmentStatus();
  }, [course, session?.user?.id]);

// Sort modules and lessons by order
  const sortedModules = modules
    ? [...modules].sort((a, b) => (a.moduleOrder || 0) - (b.moduleOrder || 0))
    : [];

// Sort lessons within each module
  const modulesWithSortedLessons = sortedModules.map((module) => ({
    ...module,
    lessons: module.lessons
      ? [...module.lessons].sort(
          (a, b) => (a.lessonOrder || 0) - (b.lessonOrder || 0)
        )
      : [],
  }));

// Calculate actual enrolled students count from enrollments
  const enrolledStudentsCount = Array.isArray(enrollments) ? enrollments.length : 0;
  const handleEnroll = () => {
    if (!course) return;

// Check if user is logged in
    if (!session?.user?.id) {
      showLoginRequiredNotificationSimple({
        message: "Authentication Required",
        description: `Please log in to enroll in "${course.title}" and start your learning journey.`,
        redirectUrl: getCurrentUrlForRedirect(),
      });
      return;
    }

setEnrollmentModalVisible(true);
  };

const getLessonIcon = (lessonType: string) => {
    switch (lessonType) {
      case "video":
        return <PlayCircleOutlined style={{ color: "#667eea" }} />;
      case "audio":
        return <SoundOutlined style={{ color: "#667eea" }} />;
      case "text":
        return <FileTextOutlined style={{ color: "#667eea" }} />;
      default:
        return <BookOutlined style={{ color: "#667eea" }} />;
    }
  };

const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

const handleLessonClick = (lesson: ILesson) => {
    if ((lesson as any).isLocked) {
      message.warning({
        content:
          "This lesson is locked. Please complete previous lessons to unlock it.",
        duration: 3,
      });
      return;
    }

setSelectedLesson(lesson);
    setLessonModalVisible(true);
  };

const handleLessonModalClose = () => {
    setLessonModalVisible(false);
    setSelectedLesson(null);
  };

const loading = isLoading || isFetching;

if (error || !course) {
    return (
      <>
        <div className="container-fluid" style={{ width: "100%" }}>
          <AppNav logoPath="/" />
        </div>

<div
          style={{
            minHeight: "65vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "2rem",
          }}
        >
          <Empty
            description={
              <div style={{ textAlign: "center" }}>
                <Title level={3}>Course Not Found</Title>
                <Paragraph>
                  The course &ldquo;{courseSlug}&rdquo; could not be found.
                </Paragraph>
                <Button
                  type="primary"
                  onClick={() => window.history.back()}
                  style={{ marginTop: "1rem" }}
                >
                  Go Back
                </Button>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>

<AppFooter logoPath="/" />
        <AppFootnote />
      </>
    );
  }

return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

{loading ? (
        <div style={{ minHeight: "65vh", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
          <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>{t("course_detail.loading")}</div>
          </Card>
        </div>
      ) : error || !course ? (
        <>
        <div className="container-fluid" style={{ width: "100%" }}>
          <AppNav logoPath="/" />
        </div>
        <div
          style={{
            minHeight: "65vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "2rem",
          }}
        >
          <Empty
            description={
              <div style={{ textAlign: "center" }}>
                <Title level={3}>Course Not Found</Title>
                <Paragraph>
                  The course &ldquo;{courseSlug}&rdquo; could not be found.
                </Paragraph>
                <Button
                  type="primary"
                  onClick={() => window.history.back()}
                  style={{ marginTop: "1rem" }}
                >
                  Go Back
                </Button>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <AppFooter logoPath="/" />
        <AppFootnote />
        </>
      ) : (
        <>
      <BannerComponent
        breadcrumbs={[
          { label: "Courses", uri: "courses" },
          { label: course.title, uri: "#" },
        ]}
        pageTitle="Course Details"
      />

<div className="container mb-5">
        <Content>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <motion.div
                className="box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  style={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "none",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <div className="mb-3">
                    <Title
                      level={1}
                      style={{ marginBottom: "16px", color: "#1a1a1a" }}
                    >
                      {course.title}
                    </Title>
                    <Space wrap size="middle">
                      <Tag
                        color="blue"
                        style={{
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        Course
                      </Tag>
                      <Tag
                        color={
                          course.level === "beginner"
                            ? "green"
                            : course.level === "intermediate"
                            ? "orange"
                            : "red"
                        }
                        style={{
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {course.level?.charAt(0).toUpperCase() +
                          course.level?.slice(1)}{" "}
                        Level
                      </Tag>
                      <Tag
                        color={course.isFree ? "green" : "blue"}
                        style={{
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {course.isFree
                          ? "Free"
                          : `${course.price} ${course.currency}`}
                      </Tag>
                      <Tag
                        color="purple"
                        style={{
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {course.language?.charAt(0).toUpperCase() +
                          course.language?.slice(1)}
                      </Tag>
                      {course.certificateAvailable && (
                        <Tag
                          color="gold"
                          style={{
                            borderRadius: "20px",
                            padding: "4px 12px",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          Certificate Available
                        </Tag>
                      )}
                    </Space>
                  </div>

{course.imageUrl && (
                    <div className="mb-6">
                      <div style={{ position: 'relative', width: '100%', height: 400 }}>
                        <Image
                          src={course.imageUrl}
                          alt={`${course.title} - Course details`}
                          fill
                          style={{
                            objectFit: "cover",
                            borderRadius: "12px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                          }}
                        />
                      </div>
                    </div>
                  )}

<div className="mb-3">
                    <Title
                      level={3}
                      style={{
                        marginBottom: "20px",
                        marginTop: 10,
                        color: "#1a1a1a",
                      }}
                    >
                      {t("course_detail.about_course")}
                    </Title>
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        padding: "24px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Paragraph
                        style={{
                          fontSize: "16px",
                          lineHeight: "1.7",
                          color: "#4a5568",
                          margin: 0,
                        }}
                      >
                        {course.description}
                      </Paragraph>
                    </div>
                  </div>

{}
                  <Row gutter={[20, 20]} className="mb-6">
                    <Col xs={24} md={12}>
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          padding: "20px",
                          borderRadius: "12px",
                          color: "white",
                          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
                        }}
                      >
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <Text
                            strong
                            style={{
                              color: "white",
                              fontSize: "14px",
                              opacity: 0.9,
                            }}
                          >
                            <ClockCircleOutlined
                              style={{ marginRight: "8px" }}
                            />
                            Duration
                          </Text>
                          <Text
                            style={{
                              color: "white",
                              fontSize: "18px",
                              fontWeight: "600",
                            }}
                          >
                            {course.durationWeeks
                              ? `${course.durationWeeks} weeks`
                              : t("course_detail.self_paced")}
                          </Text>
                        </Space>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #22C55E 0%, #16a34a 100%)",
                          padding: "20px",
                          borderRadius: "12px",
                          color: "white",
                          boxShadow: "0 4px 20px rgba(34, 197, 94, 0.3)",
                        }}
                      >
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <Text
                            strong
                            style={{
                              color: "white",
                              fontSize: "14px",
                              opacity: 0.9,
                            }}
                          >
                            <TeamOutlined style={{ marginRight: "8px" }} />
                            Students Enrolled
                          </Text>
                          <Text
                            style={{
                              color: "white",
                              fontSize: "18px",
                              fontWeight: "600",
                            }}
                          >
                            {enrolledStudentsCount} enrolled
                          </Text>
                          {course.maxStudents && (
                            <Text
                              style={{
                                color: "white",
                                fontSize: "12px",
                                opacity: 0.8,
                              }}
                            >
                              Max: {course.maxStudents}
                            </Text>
                          )}
                        </Space>
                      </div>
                    </Col>
                  </Row>

{}
                  {course.prerequisites && (
                    <div className="mb-6">
                      <Title
                        level={4}
                        style={{ marginBottom: "16px", color: "#1a1a1a" }}
                      >
                        <InfoCircleOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        Prerequisites
                      </Title>
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                          padding: "20px",
                          borderRadius: "12px",
                          border: "1px solid #f59e0b",
                        }}
                      >
                        <Paragraph
                          style={{
                            margin: 0,
                            color: "#92400e",
                            fontSize: "15px",
                            lineHeight: "1.6",
                          }}
                        >
                          {course.prerequisites}
                        </Paragraph>
                      </div>
                    </div>
                  )}

{}
                  {course.learningOutcomes && (
                    <div className="mb-6">
                      <Title
                        level={4}
                        style={{ marginBottom: "16px", color: "#1a1a1a" }}
                      >
                        <CheckCircleOutlined
                          style={{ marginRight: "8px", color: "#22C55E" }}
                        />
                        {t("course_detail.what_learn")}
                      </Title>
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                          padding: "20px",
                          borderRadius: "12px",
                          border: "1px solid #10b981",
                        }}
                      >
                        <Paragraph
                          style={{
                            margin: 0,
                            color: "#065f46",
                            fontSize: "15px",
                            lineHeight: "1.6",
                          }}
                        >
                          {course.learningOutcomes}
                        </Paragraph>
                      </div>
                    </div>
                  )}

{}
                  {course.targetAudience && (
                    <div className="mb-6">
                      <Title
                        level={4}
                        style={{ marginBottom: "16px", color: "#1a1a1a" }}
                      >
                        <UserOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        Target Audience
                      </Title>
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                          padding: "20px",
                          borderRadius: "12px",
                          border: "1px solid #3b82f6",
                        }}
                      >
                        <Tag
                          color="blue"
                          style={{
                            borderRadius: "20px",
                            padding: "6px 16px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {course.targetAudience}
                        </Tag>
                      </div>
                    </div>
                  )}
                </Card>

{}
                <motion.div
                  className="box mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Share
                    title={course.title}
                    description={course.description}
                    slug={course.slug}
                    type="courses"
                    showModern={true}
                  />
                </motion.div>

{}
                <motion.div
                  className="box mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card
                    style={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "none",
                      borderRadius: "12px",
                    }}
                  >
                    <Title level={3} style={{ marginBottom: "24px" }}>
                      <BookOutlined
                        style={{ marginRight: "8px", color: "#667eea" }}
                      />
                      {t("course_detail.course_curriculum")}
                    </Title>

{modulesLoading ? (
                      <div className="text-center py-4">
                        <Spin size="large" />
                        <div className="mt-2">{t("course_detail.loading_curriculum")}</div>
                      </div>
                    ) : modulesWithSortedLessons.length > 0 ? (
                      <Collapse
                        defaultActiveKey={[0]}
                        ghost
                        size="large"
                        items={modulesWithSortedLessons.map(
                          (module, moduleIndex) => ({
                            key: moduleIndex,
                            label: (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {module.isLocked ? (
                                    <LockOutlined
                                      style={{
                                        marginRight: "8px",
                                        color: "#faad14",
                                      }}
                                    />
                                  ) : (
                                    <UnlockOutlined
                                      style={{
                                        marginRight: "8px",
                                        color: "#52c41a",
                                      }}
                                    />
                                  )}
                                  <Text strong style={{ fontSize: "16px" }}>
                                    Module {module.moduleOrder}: {module.title}
                                  </Text>
                                  {module.isLocked && (
                                    <Tag
                                      color="warning"
                                      style={{ marginLeft: "8px" }}
                                    >
                                    {t("course_detail.locked")}
                                  </Tag>
                                  )}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Text type="secondary">
                                    {module.totalLessons} {t("course_detail.lessons")}
                                  </Text>
                                  <Tag
                                    color="blue"
                                    style={{ borderRadius: "6px" }}
                                  >
                                    {module.status}
                                  </Tag>
                                </div>
                              </div>
                            ),
                            children: (
                              <div style={{ padding: "16px 0" }}>
                                {module.description && (
                                  <Paragraph
                                    style={{
                                      marginBottom: "16px",
                                      color: "#666",
                                    }}
                                  >
                                    {module.description}
                                  </Paragraph>
                                )}
                                <List
                                  dataSource={module.lessons}
                                  renderItem={(lesson, lessonIndex) => (
                                    <List.Item
                                      key={lesson.id}
                                      style={{
                                        padding: "12px 16px",
                                        margin: "8px 0",
                                        borderRadius: "8px",
                                        backgroundColor: (lesson as any)
                                          .isLocked
                                          ? "#fafafa"
                                          : "#fff",
                                        border: (lesson as any).isLocked
                                          ? "1px solid #f0f0f0"
                                          : "1px solid #e8e8e8",
                                        opacity: (lesson as any).isLocked
                                          ? 0.7
                                          : 1,
                                        cursor: (lesson as any).isLocked
                                          ? "not-allowed"
                                          : "pointer",
                                        transition: "all 0.3s ease",
                                      }}
                                      onClick={() => handleLessonClick(lesson)}
                                    >
                                      <List.Item.Meta
                                        avatar={
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              width: "40px",
                                              height: "40px",
                                              borderRadius: "50%",
                                              backgroundColor: (lesson as any)
                                                .isLocked
                                                ? "#f0f0f0"
                                                : "#f0f9ff",
                                              color: (lesson as any).isLocked
                                                ? "#999"
                                                : "#667eea",
                                            }}
                                          >
                                            {(lesson as any).isLocked ? (
                                              <LockOutlined />
                                            ) : (
                                              getLessonIcon(lesson.lessonType)
                                            )}
                                          </div>
                                        }
                                        title={
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "8px",
                                            }}
                                          >
                                            <Text
                                              strong
                                              style={{
                                                fontSize: "15px",
                                                color: (lesson as any).isLocked
                                                  ? "#999"
                                                  : "#333",
                                              }}
                                            >
                                              {lesson.lessonOrder}.{" "}
                                              {lesson.title}
                                            </Text>
                                            {(lesson as any).isFreePreview &&
                                              !(lesson as any).isLocked && (
                                                <Tag color="green">
                                  {t("course_detail.free_preview")}
                                </Tag>
                                              )}
                                            {(lesson as any).isLocked && (
                                              <Tag color="warning">{t("course_detail.locked")}</Tag>
                                            )}
                                          </div>
                                        }
                                        description={
                                          <div>
                                            <Paragraph
                                              style={{
                                                margin: "4px 0",
                                                color: (lesson as any).isLocked
                                                  ? "#999"
                                                  : "#666",
                                                fontSize: "14px",
                                              }}
                                              ellipsis={{ rows: 2 }}
                                            >
                                              {lesson.description}
                                            </Paragraph>
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "16px",
                                                marginTop: "8px",
                                                flexWrap: "wrap",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "4px",
                                                }}
                                              >
                                                <ClockCircleOutlined
                                                  style={{
                                                    fontSize: "12px",
                                                    color: "#999",
                                                  }}
                                                />
                                                <Text
                                                  type="secondary"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  {formatDuration(
                                                    lesson.durationMinutes
                                                  )}
                                                </Text>
                                              </div>
                                              <Tag
                                                color={
                                                  lesson.difficulty?.toLowerCase() ===
                                                  "beginner"
                                                    ? "green"
                                                    : lesson.difficulty?.toLowerCase() ===
                                                      "intermediate"
                                                    ? "orange"
                                                    : lesson.difficulty?.toLowerCase() ===
                                                      "advanced"
                                                    ? "red"
                                                    : "default"
                                                }
                                              >
                                                {lesson.difficulty || "N/A"}
                                              </Tag>
                                              <Tag
                                                color={
                                                  lesson.lessonType === "video"
                                                    ? "blue"
                                                    : lesson.lessonType ===
                                                      "audio"
                                                    ? "purple"
                                                    : lesson.lessonType ===
                                                      "text"
                                                    ? "green"
                                                    : "default"
                                                }
                                              >
                                                {lesson.lessonType}
                                              </Tag>
                                            </div>
                                          </div>
                                        }
                                      />
                                    </List.Item>
                                  )}
                                />
                              </div>
                            ),
                          })
                        )}
                      />
                    ) : (
                      <Empty
                        description={t("course_detail.no_curriculum")}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{ padding: "2rem" }}
                      />
                    )}
                  </Card>
                </motion.div>
              </motion.div>
            </Col>

<Col xs={24} lg={8}>
              <motion.div
                className="box"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card
                  style={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "none",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <Title
                    level={3}
                    style={{ marginBottom: "24px", color: "#1a1a1a" }}
                  >
                    {t("course_detail.course_information")}
                  </Title>

<Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    {}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "16px", color: "#1a1a1a" }}
                      >
                        <DollarOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        {t("course_detail.price")}
                      </Text>
                      <div style={{ marginTop: "8px" }}>
                        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
                          {course.isFree ? (
                            <span style={{ color: "#22C55E" }}>{t("course_detail.free")}</span>
                          ) : (
                            <span style={{ color: "#667eea" }}>
                              {course.price} {course.currency}
                            </span>
                          )}
                        </Text>
                      </div>
                    </div>

{}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "16px", color: "#1a1a1a" }}
                      >
                        <ClockCircleOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        {t("course_detail.duration")}
                      </Text>
                      <div style={{ marginTop: "8px" }}>
                        <Text
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#4a5568",
                          }}
                        >
                          {course.durationWeeks
                            ? `${course.durationWeeks} weeks`
                            : "Self-paced"}
                        </Text>
                      </div>
                    </div>

{}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "16px", color: "#1a1a1a" }}
                      >
                        <TrophyOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        {t("course_detail.level")}
                      </Text>
                      <div style={{ marginTop: "8px" }}>
                        <Tag
                          color={
                            course.level === "beginner"
                              ? "green"
                              : course.level === "intermediate"
                              ? "orange"
                              : "red"
                          }
                          style={{
                            borderRadius: "20px",
                            padding: "4px 12px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {course.level?.charAt(0).toUpperCase() +
                            course.level?.slice(1)}
                        </Tag>
                      </div>
                    </div>

{}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "16px", color: "#1a1a1a" }}
                      >
                        <GlobalOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        {t("course_detail.language")}
                      </Text>
                      <div style={{ marginTop: "8px" }}>
                        <Text
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#4a5568",
                          }}
                        >
                          {course.language?.charAt(0).toUpperCase() +
                            course.language?.slice(1)}
                        </Text>
                      </div>
                    </div>

{}
                    <div>
                      <Text strong>
                        <UserOutlined className="me-2" />
                        {t("course_detail.instructor")}
                      </Text>
                      <div className="mt-1">
                        <Text>{course.authorName}</Text>
                        {course.instructorContact && (
                          <div className="mt-1">
                            <Text type="secondary">
                              <PhoneOutlined /> {course.instructorContact}
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>

{}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "16px", color: "#1a1a1a" }}
                      >
                        <TeamOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        {t("course_detail.students_enrolled")}
                      </Text>
                      <div style={{ marginTop: "8px" }}>
                        <Text
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#667eea",
                          }}
                        >
                          {enrolledStudentsCount} enrolled
                        </Text>
                        {course.maxStudents && (
                          <div style={{ marginTop: "4px" }}>
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                              Max: {course.maxStudents}
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>

{}
                    {course.certificateAvailable && (
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                          padding: "20px",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Text
                          strong
                          style={{ fontSize: "16px", color: "#1a1a1a" }}
                        >
                          <TrophyOutlined
                            style={{ marginRight: "8px", color: "#667eea" }}
                          />
                          Certificate
                        </Text>
                        <div style={{ marginTop: "8px" }}>
                          <Tag
                            color="gold"
                            style={{
                              borderRadius: "20px",
                              padding: "4px 12px",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            Available upon completion
                          </Tag>
                        </div>
                      </div>
                    )}

{}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "16px", color: "#1a1a1a" }}
                      >
                        <CalendarOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        Created
                      </Text>
                      <div style={{ marginTop: "8px" }}>
                        <Text
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#4a5568",
                          }}
                        >
                          {new Date(course.createdAt).toLocaleDateString()}
                        </Text>
                      </div>
                    </div>
                  </Space>

<Divider />

{!session?.user?.id ? (
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={() =>
                        showLoginRequiredNotificationSimple({
                          message: "Authentication Required",
                          description: `Please log in to enroll in "${course.title}" and start your learning journey.`,
                          redirectUrl: getCurrentUrlForRedirect(),
                        })
                      }
                    >
                      {t("course_detail.log_in_to_enroll")}
                    </Button>
                  ) : isEnrolled ? (
                    <div className="text-center">
                      <Button
                        type="default"
                        size="large"
                        block
                        disabled
                        icon={<TrophyOutlined />}
                      >
                        {t("course_detail.already_enrolled")}
                      </Button>
                      <div className="mt-3">
                        <Text type="success" strong>
                          ✓ You are enrolled in this course
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      block
                      loading={isEnrolling || enrollmentLoading}
                      onClick={handleEnroll}
                      icon={<BookOutlined />}
                    >
                      {isEnrolling ? t("course_detail.enrolling") : t("course_detail.enroll_in_course")}
                    </Button>
                  )}

{!isEnrolled && session?.user?.id && (
                    <div className="mt-3 text-center">
                      <Text type="secondary">Start learning today!</Text>
                    </div>
                  )}
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Content>
      </div>

{}
      <CourseEnrollmentModal
        visible={enrollmentModalVisible}
        onCancel={() => setEnrollmentModalVisible(false)}
        course={course}
        onSuccess={() => {
          // Optionally refresh data or show success message
        }}
      />

{}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {selectedLesson && getLessonIcon(selectedLesson.lessonType)}
            <span style={{ fontSize: "18px", fontWeight: "600" }}>
              {selectedLesson?.title}
            </span>
          </div>
        }
        open={lessonModalVisible}
        onCancel={handleLessonModalClose}
        footer={null}
        width="50%"
        style={{ top: 20 }}
        styles={{
          body: {
            padding: "20px",
            maxHeight: "75vh",
            overflow: "auto",
          },
        }}
      >
        {selectedLesson && (
          <div>
            {}
            <div
              style={{
                marginBottom: "24px",
                padding: "20px",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={4} style={{ margin: 0, color: "#1a1a1a" }}>
                    {selectedLesson.title}
                  </Title>
                  <Paragraph style={{ margin: "8px 0 0 0", color: "#4a5568" }}>
                    {selectedLesson.description}
                  </Paragraph>
                </Col>
                <Col xs={24} sm={8}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <ClockCircleOutlined style={{ color: "#667eea" }} />
                    <Text strong>
                      Duration: {formatDuration(selectedLesson.durationMinutes)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Tag
                      color={
                        selectedLesson.difficulty?.toLowerCase() === "beginner"
                          ? "green"
                          : selectedLesson.difficulty?.toLowerCase() ===
                            "intermediate"
                          ? "orange"
                          : selectedLesson.difficulty?.toLowerCase() ===
                            "advanced"
                          ? "red"
                          : "default"
                      }
                      style={{ borderRadius: "20px", padding: "4px 12px" }}
                    >
                      {selectedLesson.difficulty}
                    </Tag>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Tag
                      color={
                        selectedLesson.lessonType === "video"
                          ? "blue"
                          : selectedLesson.lessonType === "audio"
                          ? "purple"
                          : selectedLesson.lessonType === "text"
                          ? "green"
                          : "default"
                      }
                      style={{ borderRadius: "20px", padding: "4px 12px" }}
                    >
                      {selectedLesson.lessonType}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </div>

{}
            <div
              style={{
                padding: "20px",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {selectedLesson.lessonType === "video" &&
              selectedLesson.videoUrl ? (
                <div>
                  {}
                  {(() => {
                    const videoUrl = selectedLesson.videoUrl;
                    let videoId = "";

// Handle different YouTube URL formats
                    if (videoUrl.includes("youtube.com/watch?v=")) {
                      videoId = videoUrl.split("v=")[1]?.split("&")[0] || "";
                    } else if (videoUrl.includes("youtu.be/")) {
                      videoId =
                        videoUrl.split("youtu.be/")[1]?.split("?")[0] || "";
                    } else if (videoUrl.includes("youtube.com/embed/")) {
                      videoId =
                        videoUrl.split("embed/")[1]?.split("?")[0] || "";
                    }

return videoId ? (
                      <YouTubePlayerFrame
                        videoId={videoId}
                        title={selectedLesson.title}
                        channel="Course Instructor"
                        views=""
                        uploadDate=""
                        description={selectedLesson.description}
                        showControls={false}
                      />
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <video
                          controls
                          style={{
                            width: "100%",
                            maxWidth: "600px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          }}
                        >
                          <source
                            src={selectedLesson.videoUrl}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  })()}
                </div>
              ) : selectedLesson.lessonType === "audio" &&
                selectedLesson.audioUrl ? (
                <div style={{ textAlign: "center" }}>
                  <audio
                    controls
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      borderRadius: "8px",
                    }}
                  >
                    <source src={selectedLesson.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "#4a5568",
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedLesson.content ||
                      "No content available for this lesson.",
                  }}
                />
              )}
            </div>

{}
            {selectedLesson.downloadMaterials && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  background:
                    "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
                  borderRadius: "12px",
                  border: "1px solid #3b82f6",
                }}
              >
                <Title
                  level={5}
                  style={{ margin: "0 0 8px 0", color: "#1a1a1a" }}
                >
                  📁 Download Materials
                </Title>
                <Text style={{ color: "#1e40af", fontSize: "14px" }}>
                  {selectedLesson.downloadMaterials}
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>

<AppFooter logoPath="/" />
      <AppFootnote />
        </>
      )}
    </>
  );
}
