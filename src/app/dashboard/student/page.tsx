"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Statistic,
  Typography,
  Space,
  Tag,
  Button,
  Spin,
  Tabs,
  Progress,
  Tooltip,
  Avatar,
  Divider,
  Badge,
  Image,
  Modal,
  Descriptions,
  Rate,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  InputNumber,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  EyeOutlined,
  UserOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  HeartFilled,
  ClockCircleOutlined,
  StarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useTranslation } from "@contexts/translation.context";
import { statsAPI } from "@store/api/stats_api";
import { postInteractionAPI } from "@store/api/post-interaction_api";
import { courseEnrollmentAPI } from "@store/api/course-enrollment_api";
import { eventRegistrationAPI } from "@store/api/event-registration_api";
import { useTable } from "@refinedev/antd";
import { BaseRecord, useNotification } from "@refinedev/core";
import { format } from "@utils/format";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import AccountActivationNotification from "@components/shared/account-activation-notification";
import { showLoginRequiredNotificationSimple, getCurrentUrlForRedirect } from "@components/shared/login-required-notification";

const { Title, Text } = Typography;

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  // Learning state
  const [continuingCourse, setContinuingCourse] = useState<string | null>(null);
  const [likingPost, setLikingPost] = useState<string | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<string | null>(null);

  // Modal states
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Enrollment modal states
  const [enrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Event registration modal states
  const [eventRegistrationModalVisible, setEventRegistrationModalVisible] =
    useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // State management for interactions
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(
    new Set()
  );
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(
    new Set()
  );
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const router = useRouter();
  const { open } = useNotification();
  const [enrollmentForm] = Form.useForm();
  const [eventRegistrationForm] = Form.useForm();

  // RTK Query hooks
  const [handlePostInteraction] =
    postInteractionAPI.useHandlePostInteractionMutation();

  // Get user's existing post interactions to initialize liked posts state
  const { data: userInteractions, refetch: refetchInteractions } =
    postInteractionAPI.useGetUserPostInteractionsQuery(
      session?.user?.id || "",
      { skip: !session?.user?.id }
    );

  // Get user's existing course enrollments to initialize enrolled courses state
  const { data: userEnrollments, refetch: refetchEnrollments } =
    courseEnrollmentAPI.useGetCourseEnrollmentsByUserQuery(
      session?.user?.id || "",
      { skip: !session?.user?.id }
    );

  // Get user's existing event registrations to initialize registered events state
  const { data: userEventRegistrations, refetch: refetchEventRegistrations } =
    eventRegistrationAPI.useGetUserEventRegistrationsQuery(session?.user?.id || "", {
      skip: !session?.user?.id,
    });

  // Table refs for focus management
  const coursesTableRef = useRef<any>(null);
  const postsTableRef = useRef<any>(null);
  const eventsTableRef = useRef<any>(null);

  // Fetch stats data
  const statsQuery = statsAPI.useGetDashboardStatsQuery(undefined, {
    skip: !session?.user,
    refetchOnMountOrArgChange: true,
  });

  const stats = statsQuery.data?.overview || {
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalCourses: 0,
    totalProjects: 0,
    totalOpportunities: 0,
    totalServices: 0,
    totalProfessionals: 0,
    totalBanners: 0,
    totalContactMessages: 0,
    totalSubscribers: 0,
    totalComments: 0,
    totalPostLikes: 0,
    totalCommentLikes: 0,
    totalUserLikes: 0,
    totalUserComments: 0,
  };

  // Table configurations
  const {
    tableProps: coursesTableProps,
    tableQueryResult: coursesQueryResult,
  } = useTable({
    resource: "courses",
    syncWithLocation: true,
  });

  const { tableProps: postsTableProps, tableQueryResult: postsQueryResult } =
    useTable({
      resource: "posts",
      syncWithLocation: true,
    });

  const { tableProps: eventsTableProps, tableQueryResult: eventsQueryResult } =
    useTable({
      resource: "events",
      syncWithLocation: true,
    });

  // Initialize liked posts from user's existing interactions
  useEffect(() => {
    if (userInteractions && Array.isArray(userInteractions)) {
      const likedPostIds = userInteractions
        .filter((interaction: any) => interaction.action === "like")
        .map((interaction: any) => interaction.postId);
      setLikedPosts(new Set(likedPostIds));
    }
  }, [userInteractions]);

  // Initialize enrolled courses from user's existing enrollments
  useEffect(() => {
    if (userEnrollments) {
      const enrollments = Array.isArray(userEnrollments)
        ? userEnrollments
        : (userEnrollments as any)?.data || [];

      if (Array.isArray(enrollments)) {
        const enrolledCourseIds = enrollments
          .filter(
            (enrollment: any) =>
              enrollment.status === "active" ||
              enrollment.status === "completed"
          )
          .map((enrollment: any) => enrollment.courseId);

        setEnrolledCourses(new Set(enrolledCourseIds));
      }
    }
  }, [userEnrollments]);

  // Initialize registered events from user's existing registrations
  useEffect(() => {
    if (userEventRegistrations) {
      const registrations = Array.isArray(userEventRegistrations)
        ? userEventRegistrations
        : (userEventRegistrations as any)?.data || [];

      if (Array.isArray(registrations)) {
        const registeredEventIds = registrations
          .filter(
            (registration: any) =>
              registration.status === "pending" ||
              registration.status === "confirmed"
          )
          .map((registration: any) => registration.eventId);

        setRegisteredEvents(new Set(registeredEventIds));
      }
    }
  }, [userEventRegistrations]);

  // Enhanced courses with enrollment progress
  const enhancedCourses = React.useMemo(() => {
    const courses = coursesTableProps.dataSource || [];
    const enrollments = Array.isArray(userEnrollments) 
      ? userEnrollments 
      : (userEnrollments as any)?.data || [];

    return courses.map((course: any) => {
      const enrollment = enrollments.find((enr: any) => enr.courseId === course.id);
      return {
        ...course,
        progress: enrollment?.progress || 0,
        enrollmentStatus: enrollment?.status || null,
        enrollmentId: enrollment?.id || null,
      };
    });
  }, [coursesTableProps.dataSource, userEnrollments]);

  // Handle course continuation
  const handleContinueCourse = async (
    courseId: string,
    courseTitle: string
  ) => {
    setContinuingCourse(courseId);
    try {
      // Navigate to the new learning interface with continue parameter
      router.push(`/dashboard/student/courses/${courseId}/learn?continue=true`);
      open?.({
        type: "success",
        message: "Continuing Course! 📚",
        description: `Welcome back to "${courseTitle.length > 50 ? courseTitle.substring(0, 50) + '...' : courseTitle}"`,
      });
    } catch (error) {
      open?.({
        type: "error",
        message: "Continue Failed",
        description: "Failed to continue course. Please try again.",
      });
    } finally {
      setContinuingCourse(null);
    }
  };

  // Handle course enrollment
  const handleEnrollCourse = async (courseId: string, courseTitle: string) => {
    if (!session?.user?.id) {
      showLoginRequiredNotificationSimple({
        message: "Authentication Required",
        description: `Please log in to enroll in "${courseTitle}" and start your learning journey.`,
        redirectUrl: getCurrentUrlForRedirect()
      });
      return;
    }

    // Check if already enrolled
    if (enrolledCourses.has(courseId)) {
      open?.({
        type: "success",
        message: t("student_dashboard.already_enrolled"),
        description: "You are already enrolled in this course! 📚",
      });
      return;
    }

    try {
      const response = await fetch("/api/course-enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          userId: session.user.id,
          id: nanoid(20),
          enrollmentDate: new Date(),
          status: "active",
          paymentStatus: "free", // Assuming free for students
          studentPhone: (session.user as any).phoneNumber || "",
          motivation: "Student enrollment",
          preferredContact: "email",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setEnrolledCourses((prev) => new Set([...prev, courseId]));

        open?.({
          type: "success",
          message: t("student_dashboard.enrollment_successful"),
          description: `Successfully enrolled in "${courseTitle}"!`,
        });

        coursesQueryResult.refetch();
        refetchEnrollments();
        statsQuery.refetch();
      } else {
        if (
          response.status === 409 ||
          result.message?.includes("already enrolled")
        ) {
          setEnrolledCourses((prev) => new Set([...prev, courseId]));
          open?.({
            type: "success",
            message: t("student_dashboard.already_enrolled"),
            description: "You are already enrolled in this course! 📚",
          });
        } else {
          open?.({
            type: "error",
            message: t("student_dashboard.enrollment_failed"),
            description: result.message || "Failed to enroll in course.",
          });
        }
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      open?.({
        type: "error",
        message: t("student_dashboard.enrollment_failed"),
        description: "Failed to enroll in course. Please try again.",
      });
    }
  };

  // Handle event registration
  const handleRegisterEvent = async (eventId: string, eventTitle: string) => {
    if (!session?.user?.id) {
      open?.({
        type: "error",
        message: "Authentication Required",
        description: "Please log in to register for events.",
      });
      return;
    }

    // Check if already registered
    if (registeredEvents.has(eventId)) {
      open?.({
        type: "success",
        message: "Already Registered",
        description: "You are already registered for this event! 🎪",
      });
      return;
    }

    setRegisteringEvent(eventId);
    try {
      // Create event registration via API
      const response = await fetch("/api/event-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          userId: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          phone: "",
          status: "pending",
          paymentStatus: "pending",
          registrationDate: new Date(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setRegisteredEvents((prev) => new Set([...prev, eventId]));

        open?.({
          type: "success",
          message: "Registration Successful! 🎪",
          description: `Successfully registered for "${eventTitle}"!`,
        });
        eventsQueryResult.refetch();
        refetchEventRegistrations();
        statsQuery.refetch();
      } else {
        if (
          response.status === 409 ||
          result.message?.includes("already registered")
        ) {
          setRegisteredEvents((prev) => new Set([...prev, eventId]));
          open?.({
            type: "success",
            message: "Already Registered",
            description: "You are already registered for this event! 🎪",
          });
        } else {
          open?.({
            type: "error",
            message: "Registration Failed",
            description: result.message || "Failed to register for event.",
          });
        }
      }
    } catch (error) {
      console.error("Event registration error:", error);
      open?.({
        type: "error",
        message: "Registration Failed",
        description: "Failed to register for event. Please try again.",
      });
    } finally {
      setRegisteringEvent(null);
    }
  };

  // Handle post like
  const handleLikePost = async (postId: string, postTitle: string) => {
    if (!session?.user?.id) {
      open?.({
        type: "error",
        message: "Authentication Required",
        description: "Please log in to like posts.",
      });
      return;
    }

    // Check if already liked
    if (likedPosts.has(postId)) {
      open?.({
        type: "success",
        message: "Already Liked",
        description: "You have already liked this post!",
      });
      return;
    }

    setLikingPost(postId);
    try {
      await handlePostInteraction({ postId, action: "like" }).unwrap();

      // Update local state
      setLikedPosts((prev) => new Set([...prev, postId]));

      open?.({
        type: "success",
        message: "Post Liked!",
        description: `Liked "${postTitle}"!`,
      });
      postsQueryResult.refetch();
      refetchInteractions();
    } catch (error: any) {
      console.error("Post interaction error:", error);
      // Handle different error types
      if (error?.status === 409 || error?.data?.isDuplicate) {
        // Handle duplicate like from backend
        setLikedPosts((prev) => new Set([...prev, postId])); // Update local state
        open?.({
          type: "success",
          message: "Already Liked",
          description:
            error?.data?.message || "You have already liked this post!",
        });
      } else if (error?.data?.status === 503 || error?.status === 503) {
        open?.({
          type: "success",
          message: "Feature Coming Soon",
          description: "Post interactions feature is coming soon! 👍",
        });
      } else if (error?.data?.status === 401 || error?.status === 401) {
        open?.({
          type: "error",
          message: "Authentication Required",
          description: "Please log in to like posts.",
        });
      } else if (
        error?.data?.message?.includes("doesn't exist") ||
        error?.message?.includes("doesn't exist")
      ) {
        open?.({
          type: "success",
          message: "Feature Setup in Progress",
          description:
            "Post interactions feature is being set up. Please try again later! 🚀",
        });
      } else {
        open?.({
          type: "error",
          message: "Feature Unavailable",
          description: "Post interactions feature is temporarily unavailable.",
        });
      }
    } finally {
      setLikingPost(null);
    }
  };

  // Handle view course
  const handleViewCourse = (course: any) => {
    setSelectedItem(course);
    setCourseModalVisible(true);
  };

  // Handle navigate to full course
  const handleNavigateToCourse = (courseId: string, courseSlug?: string) => {
    if (courseSlug) {
      router.push(`/courses/${courseSlug}`);
    } else {
      router.push(`/courses/${courseId}`);
    }
  };

  // Handle view post
  const handleViewPost = (post: any) => {
    setSelectedItem(post);
    setPostModalVisible(true);
  };

  // Handle navigate to full post
  const handleNavigateToPost = (postId: string, postSlug?: string) => {
    if (postSlug) {
      router.push(`/blog-posts/${postSlug}`);
    } else {
      router.push(`/blog-posts/${postId}`);
    }
  };

  // Handle view event
  const handleViewEvent = (event: any) => {
    setSelectedItem(event);
    setEventModalVisible(true);
  };

  // Handle navigate to full event
  const handleNavigateToEvent = (eventId: string, eventSlug?: string) => {
    if (eventSlug) {
      router.push(`/events/${eventSlug}`);
    } else {
      router.push(`/events/event/${eventId}`);
    }
  };

  // Course card renderer for students
  const renderCourseCards = (courses: readonly any[]) => {
    if (!courses || courses.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
          <BookOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>No courses available</div>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {courses.map((course: any) => {
          const isEnrolled =
            course.enrollmentStatus === "enrolled" ||
            course.progress > 0 ||
            enrolledCourses.has(course.id);
          const isCompleted = course.progress >= 100;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
              <Card
                hoverable
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "none",
                  minHeight: "350px",
                  display: "flex",
                  flexDirection: "column",
                }}
                cover={
                  <div
                    style={{
                      height: 120,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image
                      alt={course.title}
                      src={course.imageUrl || "/api/placeholder/300/120"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      preview={false}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        borderRadius: "4px",
                        padding: "2px 6px",
                      }}
                    >
                      {course.isFree ? (
                        <Tag
                          color="green"
                          style={{ margin: 0, fontSize: "10px" }}
                        >
                          Free
                        </Tag>
                      ) : (
                        <span style={{ color: "white", fontSize: "10px" }}>
                          {course.price || 0} {course.currency || "XAF"}
                        </span>
                      )}
                    </div>
                    {course.progress > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "4px",
                          backgroundColor: "rgba(0,0,0,0.3)",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${course.progress || 0}%`,
                            backgroundColor:
                              course.progress >= 100 ? "#52c41a" : "#1890ff",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    )}
                  </div>
                }
              >
                <div
                  style={{
                    padding: "12px 16px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 14, lineHeight: 1.2 }}>
                        {course.title?.length > 40
                          ? `${course.title.substring(0, 40)}...`
                          : course.title}
                      </Text>
                    </div>

                    <div style={{ marginBottom: 8, minHeight: 32 }}>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: 1.3 }}
                      >
                        {course.description?.length > 60
                          ? `${course.description.substring(0, 60)}...`
                          : course.description}
                      </Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 8,
                        gap: 8,
                      }}
                    >
                      <Avatar size={16} icon={<UserOutlined />} />
                      <Text style={{ fontSize: 11 }}>{course.authorName}</Text>
                    </div>

                    {course.progress > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        <Progress
                          percent={course.progress || 0}
                          size="small"
                          strokeColor={{
                            "0%": "#108ee9",
                            "100%": "#87d068",
                          }}
                          showInfo={false}
                        />
                        <Text style={{ fontSize: 10, color: "#999" }}>
                          {course.progress || 0}% Complete
                        </Text>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    <Space size={8} style={{ width: "100%" }}>
                      <Tooltip title="View course details">
                        <Button
                          icon={<EyeOutlined />}
                          size="small"
                          style={{ 
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid #e8e8e8',
                            backgroundColor: '#fafafa',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => handleViewCourse(course)}
                        />
                      </Tooltip>
                      {isCompleted ? (
                        <Button
                          type="primary"
                          size="small"
                          icon={<TrophyOutlined />}
                          disabled
                          style={{ 
                            borderRadius: 8, 
                            flex: 1,
                            background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(250, 173, 20, 0.3)',
                            fontWeight: '600'
                          }}
                        >
                          Completed
                        </Button>
                      ) : isEnrolled ? (
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlayCircleOutlined />}
                          loading={continuingCourse === course.id}
                          onClick={() =>
                            handleContinueCourse(course.id, course.title)
                          }
                          style={{ 
                            borderRadius: 8, 
                            flex: 1,
                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Continue
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          size="small"
                          onClick={() =>
                            handleEnrollCourse(course.id, course.title)
                          }
                          style={{ 
                            borderRadius: 8, 
                            flex: 1,
                            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Enroll
                        </Button>
                      )}
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  // Post card renderer
  const renderPostCards = (posts: readonly any[]) => {
    if (!posts || posts.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
          <ReadOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>No posts available</div>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {posts.map((post: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={post.id}>
            <Card
              hoverable
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "none",
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
              }}
              cover={
                <div
                  style={{
                    height: 100,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image
                    alt={post.title}
                    src={post.imageUrl || "/api/placeholder/300/100"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    preview={false}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                  >
                    <Badge
                      status={
                        post.status === "published"
                          ? "success"
                          : post.status === "draft"
                          ? "warning"
                          : "default"
                      }
                      text={post.status}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        fontSize: "10px",
                      }}
                    />
                  </div>
                </div>
              }
            >
              <div
                style={{
                  padding: "12px 16px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 14, lineHeight: 1.2 }}>
                      {post.title?.length > 45
                        ? `${post.title.substring(0, 45)}...`
                        : post.title}
                    </Text>
                  </div>

                  <div style={{ marginBottom: 12, minHeight: 36 }}>
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, lineHeight: 1.3 }}
                    >
                      {post.description?.length > 70
                        ? `${post.description.substring(0, 70)}...`
                        : post.description}
                    </Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 12,
                      gap: 8,
                    }}
                  >
                    <Avatar size={16} icon={<UserOutlined />} />
                    <Text style={{ fontSize: 11 }}>
                      {post.authorName || "Author"}
                    </Text>
                    <Divider type="vertical" style={{ margin: "0 4px" }} />
                    <ClockCircleOutlined
                      style={{ fontSize: 11, color: "#999" }}
                    />
                    <Text style={{ fontSize: 11, color: "#999" }}>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : "Draft"}
                    </Text>
                  </div>
                </div>

                <div style={{ marginTop: "auto" }}>
                  <Space size={8} style={{ width: "100%" }}>
                    <Tooltip title="Read post">
                      <Button
                        icon={<EyeOutlined />}
                        size="small"
                        style={{ 
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: '1px solid #e8e8e8',
                          backgroundColor: '#fafafa',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleViewPost(post)}
                      />
                    </Tooltip>
                    <Button
                      icon={
                        likedPosts.has(post.id) ? (
                          <HeartFilled />
                        ) : (
                          <HeartOutlined />
                        )
                      }
                      size="small"
                      type={likedPosts.has(post.id) ? "primary" : "default"}
                      loading={likingPost === post.id}
                      disabled={likedPosts.has(post.id)}
                      onClick={() => handleLikePost(post.id, post.title)}
                      style={{
                        borderRadius: 8,
                        flex: 1,
                        backgroundColor: likedPosts.has(post.id)
                          ? "#ff4d4f"
                          : undefined,
                        borderColor: likedPosts.has(post.id)
                          ? "#ff4d4f"
                          : undefined,
                        color: likedPosts.has(post.id) ? "white" : undefined,
                        boxShadow: likedPosts.has(post.id) 
                          ? '0 4px 12px rgba(255, 77, 79, 0.3)'
                          : '0 2px 8px rgba(0,0,0,0.1)',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {likedPosts.has(post.id) ? "Liked" : "Like"}
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // Event card renderer
  const renderEventCards = (events: readonly any[]) => {
    if (!events || events.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
          <CalendarOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>No events available</div>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {events.map((event: any) => {
          const isRegistered =
            event.registrationStatus === "registered" ||
            registeredEvents.has(event.id);
          const eventDate = event.eventDate ? new Date(event.eventDate) : null;
          const isUpcoming = eventDate && eventDate > new Date();

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={event.id}>
              <Card
                hoverable
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "none",
                  minHeight: "320px",
                  display: "flex",
                  flexDirection: "column",
                }}
                cover={
                  <div
                    style={{
                      height: 100,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image
                      alt={event.title}
                      src={event.imageUrl || "/api/placeholder/300/100"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      preview={false}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                      }}
                    >
                      <Tag
                        color={
                          event.status === "published"
                            ? "green"
                            : event.status === "cancelled"
                            ? "red"
                            : event.status === "completed"
                            ? "blue"
                            : "orange"
                        }
                        style={{ fontSize: "10px" }}
                      >
                        {event.status}
                      </Tag>
                    </div>
                    {isUpcoming && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          backgroundColor: "#ff4d4f",
                          color: "white",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        UPCOMING
                      </div>
                    )}
                  </div>
                }
              >
                <div
                  style={{
                    padding: "12px 16px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 14, lineHeight: 1.2 }}>
                        {event.title?.length > 40
                          ? `${event.title.substring(0, 40)}...`
                          : event.title}
                      </Text>
                    </div>

                    <div style={{ marginBottom: 8, minHeight: 32 }}>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: 1.3 }}
                      >
                        {event.description?.length > 60
                          ? `${event.description.substring(0, 60)}...`
                          : event.description}
                      </Text>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Space size={4}>
                        <CalendarOutlined
                          style={{ fontSize: 12, color: "#1890ff" }}
                        />
                        <Text style={{ fontSize: 11 }}>
                          {eventDate ? eventDate.toLocaleDateString() : "TBD"}
                        </Text>
                      </Space>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <Space size={4}>
                        <EnvironmentOutlined
                          style={{ fontSize: 12, color: "#52c41a" }}
                        />
                        <Text style={{ fontSize: 11 }}>
                          {event.location || "Online"}
                        </Text>
                      </Space>
                    </div>
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    <Space size={8} style={{ width: "100%" }}>
                      <Tooltip title="View event details">
                        <Button
                          icon={<EyeOutlined />}
                          size="small"
                          style={{ 
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid #e8e8e8',
                            backgroundColor: '#fafafa',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => handleViewEvent(event)}
                        />
                      </Tooltip>
                      {isRegistered ? (
                        <Button
                          type="primary"
                          size="small"
                          icon={<CheckCircleOutlined />}
                          disabled
                          style={{ 
                            borderRadius: 8, 
                            flex: 1,
                            background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(19, 194, 194, 0.3)',
                            fontWeight: '600'
                          }}
                        >
                          Registered
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          size="small"
                          loading={registeringEvent === event.id}
                          onClick={() =>
                            handleRegisterEvent(event.id, event.title)
                          }
                          style={{ 
                            borderRadius: 8, 
                            flex: 1,
                            background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(114, 46, 209, 0.3)',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Register
                        </Button>
                      )}
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Only render student dashboard for student users
  if (!session?.user || session.user.role !== "student") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Calculate real student stats from backend data
  const enrollments = Array.isArray(userEnrollments) 
    ? userEnrollments 
    : (userEnrollments as any)?.data || [];
  
  const registrations = Array.isArray(userEventRegistrations)
    ? userEventRegistrations
    : (userEventRegistrations as any)?.data || [];

  const coursesEnrolled = enrollments.filter((enrollment: any) => 
    enrollment.status === "active" || enrollment.status === "completed"
  ).length;

  const coursesCompleted = enrollments.filter((enrollment: any) => 
    enrollment.status === "completed" || enrollment.progress >= 100
  ).length;

  const eventsAttended = registrations.filter((registration: any) => 
    registration.status === "confirmed" || registration.status === "completed"
  ).length;

  // Student-specific stats
  const studentStats = [
    {
      title: t("student_dashboard.courses_enrolled"),
      value: coursesEnrolled,
      icon: <BookOutlined />,
      color: "#1890ff",
    },
    {
      title: t("student_dashboard.courses_completed"),
      value: coursesCompleted,
      icon: <TrophyOutlined />,
      color: "#52c41a",
    },
    {
      title: t("student_dashboard.my_comments"),
      value: stats.totalUserComments,
      icon: <UserOutlined />,
      color: "#722ed1",
    },
    {
      title: t("student_dashboard.events_attended"),
      value: eventsAttended,
      icon: <CalendarOutlined />,
      color: "#13c2c2",
    },
  ];

  const tabItems = [
    {
      key: "courses",
      label: "My Courses",
      children: (
        <div ref={coursesTableRef}>
          <div style={{ marginBottom: 16 }}>
            <Title level={4}>My Learning Journey</Title>
            <Text type="secondary">
              Track your progress and continue learning
            </Text>
          </div>
          {coursesQueryResult.isLoading ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <Spin size="large" style={{ marginBottom: "16px" }} />
              <div style={{ color: "#666", fontSize: "16px" }}>
                Loading courses...
              </div>
            </div>
          ) : (
            renderCourseCards(enhancedCourses)
          )}
        </div>
      ),
    },
    {
      key: "posts",
      label: "Learning Posts",
      children: (
        <div ref={postsTableRef}>
          <div style={{ marginBottom: 16 }}>
            <Title level={4}>Educational Content</Title>
            <Text type="secondary">
              Explore educational posts and resources
            </Text>
          </div>
          {postsQueryResult.isLoading ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <Spin size="large" style={{ marginBottom: "16px" }} />
              <div style={{ color: "#666", fontSize: "16px" }}>
                Loading posts...
              </div>
            </div>
          ) : (
            renderPostCards([...(postsTableProps.dataSource || [])])
          )}
        </div>
      ),
    },
    {
      key: "events",
      label: "Learning Events",
      children: (
        <div ref={eventsTableRef}>
          <div style={{ marginBottom: 16 }}>
            <Title level={4}>Learning Events</Title>
            <Text type="secondary">Join educational events and workshops</Text>
          </div>
          {eventsQueryResult.isLoading ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <Spin size="large" style={{ marginBottom: "16px" }} />
              <div style={{ color: "#666", fontSize: "16px" }}>
                Loading events...
              </div>
            </div>
          ) : (
            renderEventCards([...(eventsTableProps.dataSource || [])])
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <EnhancedBreadcrumb
        items={[{ title: t("student_dashboard.title") }]}
        showBackButton
      />

      {/* Account Activation Notification */}
      <AccountActivationNotification />

      <div
        style={{
          textAlign: "center",
          marginBottom: "32px",
          padding: "32px 0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          color: "white",
        }}
      >
        <Title level={1} style={{ color: "white", marginBottom: "8px" }}>
          🎓 {t("student_dashboard.learning_hub")}
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px" }}>
          {t("student_dashboard.welcome_back")}, {session?.user?.name}! {t("student_dashboard.ready_to_learn")}
        </Text>
      </div>

      {/* Student Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={3} style={{ color: "#2c3e50", marginBottom: "8px" }}>
              📊 {t("student_dashboard.learning_analytics")}
            </Title>
            <Text style={{ color: "#7f8c8d", fontSize: "16px" }}>
              {t("student_dashboard.track_progress")}
            </Text>
          </div>
        </Col>
        {studentStats.map((stat, index) => (
          <Col sm={6} md={6} span={24} key={index}>
            <Card
              hoverable
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                border: "none",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  padding: "20px",
                }}
              >
                <Statistic
                  title={
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#5a6c7d",
                      }}
                    >
                      {stat.title}
                    </Text>
                  }
                  value={stat.value}
                  prefix={
                    <span
                      style={{
                        color: stat.color,
                        fontSize: "24px",
                        marginRight: "8px",
                      }}
                    >
                      {stat.icon}
                    </span>
                  }
                  valueStyle={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#2c3e50",
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* My Enrolled Courses Section */}
      {(coursesQueryResult.isLoading || enrolledCourses.size > 0) && (
        <Card
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            border: "none",
            marginBottom: "24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
              <Title level={3} style={{ marginBottom: "8px" }}>
                📚 {t("student_dashboard.my_enrolled_courses")}
              </Title>
              <Text style={{ fontSize: "16px" }}>
                {t("student_dashboard.continue_learning_journey")}
              </Text>
            </div>

            {coursesQueryResult.isLoading ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <Spin size="large" style={{ marginBottom: "16px" }} />
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}>
                  {t("student_dashboard.loading_enrolled_courses")}
                </div>
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {enhancedCourses
                  .filter((course: any) => enrolledCourses.has(course.id))
                  .map((course: any) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                    <Card
                      hoverable
                      style={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: "12px",
                        border: "none",
                        minHeight: "280px",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                      cover={
                        <div
                          style={{
                            height: 100,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <Image
                            alt={course.title}
                            src={course.imageUrl || "/api/placeholder/300/100"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            preview={false}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              backgroundColor: "rgba(102, 126, 234, 0.9)",
                              borderRadius: "20px",
                              padding: "4px 12px",
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              {course.progress || 0}% {t("student_dashboard.complete")}
                            </Text>
                          </div>
                        </div>
                      }
                    >
                      <div style={{ padding: "16px 0" }}>
                        <div style={{ marginBottom: 12 }}>
                          <Text
                            strong
                            style={{
                              fontSize: 16,
                              lineHeight: 1.3,
                              display: "block",
                            }}
                          >
                            {course.title?.length > 40
                              ? `${course.title.substring(0, 40)}...`
                              : course.title}
                          </Text>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <Progress
                            percent={course.progress || 0}
                            strokeColor={{
                              "0%": "#667eea",
                              "100%": "#764ba2",
                            }}
                            style={{ marginBottom: 8 }}
                          />
                          <Text style={{ fontSize: 12, color: "#666" }}>
                            Progress: {course.progress || 0}%
                          </Text>
                        </div>

                        <Button
                          type="primary"
                          size="large"
                          block
                          onClick={() =>
                            handleContinueCourse(course.id, course.title)
                          }
                          loading={continuingCourse === course.id}
                          style={{
                            borderRadius: "12px",
                            height: "52px",
                            fontSize: "16px",
                            fontWeight: "600",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                            transition: "all 0.3s ease",
                            transform: "translateY(0)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                          }}
                        >
                          {t("student_dashboard.continue_learning")}
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Card>
      )}

      {/* My Registered Events Section */}
      {registeredEvents.size > 0 && (
        <Card
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            border: "none",
            marginBottom: "24px",
            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          }}
        >
          <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
              <Title level={3} style={{ color: "white", marginBottom: "8px" }}>
                🎪 My Registered Events
              </Title>
              <Text
                style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}
              >
                Your upcoming learning events
              </Text>
            </div>

            <Row gutter={[16, 16]}>
              {[...(eventsTableProps.dataSource || [])]
                .filter((event: any) => registeredEvents.has(event.id))
                .map((event: any) => {
                  const eventDate = event.eventDate
                    ? new Date(event.eventDate)
                    : null;
                  const isUpcoming = eventDate && eventDate > new Date();

                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={event.id}>
                      <Card
                        hoverable
                        style={{
                          backgroundColor: "rgba(255,255,255,0.95)",
                          borderRadius: "12px",
                          border: "none",
                          minHeight: "280px",
                          backdropFilter: "blur(10px)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                        cover={
                          <div
                            style={{
                              height: 100,
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <Image
                              alt={event.title}
                              src={event.imageUrl || "/api/placeholder/300/100"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              preview={false}
                            />
                            {isUpcoming && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  left: 8,
                                  backgroundColor: "#ff4757",
                                  color: "white",
                                  borderRadius: "20px",
                                  padding: "4px 12px",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                }}
                              >
                                UPCOMING
                              </div>
                            )}
                            <div
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                backgroundColor: "rgba(250, 112, 154, 0.9)",
                                borderRadius: "20px",
                                padding: "4px 12px",
                              }}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                }}
                              >
                                REGISTERED
                              </Text>
                            </div>
                          </div>
                        }
                      >
                        <div style={{ padding: "16px 0" }}>
                          <div style={{ marginBottom: 12 }}>
                            <Text
                              strong
                              style={{
                                fontSize: 16,
                                lineHeight: 1.3,
                                display: "block",
                              }}
                            >
                              {event.title?.length > 40
                                ? `${event.title.substring(0, 40)}...`
                                : event.title}
                            </Text>
                          </div>

                          <div style={{ marginBottom: 16 }}>
                            <Space
                              direction="vertical"
                              size="small"
                              style={{ width: "100%" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <CalendarOutlined
                                  style={{ color: "#667eea" }}
                                />
                                <Text style={{ fontSize: 13, color: "#666" }}>
                                  {eventDate
                                    ? eventDate.toLocaleDateString()
                                    : "TBD"}
                                </Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <EnvironmentOutlined
                                  style={{ color: "#52c41a" }}
                                />
                                <Text style={{ fontSize: 13, color: "#666" }}>
                                  {event.location || "Online"}
                                </Text>
                              </div>
                            </Space>
                          </div>

                          <Button
                            type="primary"
                            size="large"
                            block
                            onClick={() => handleViewEvent(event)}
                            style={{
                              borderRadius: "12px",
                              height: "52px",
                              fontSize: "16px",
                              fontWeight: "600",
                              background:
                                "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                              border: "none",
                              boxShadow: "0 6px 20px rgba(250, 112, 154, 0.4)",
                              transition: "all 0.3s ease",
                              transform: "translateY(0)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 8px 25px rgba(250, 112, 154, 0.5)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 6px 20px rgba(250, 112, 154, 0.4)";
                            }}
                          >
                            View Event Details
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          </div>
        </Card>
      )}

      {/* Learning Tabs */}
      <Card
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          border: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
            padding: "24px 24px 0 24px",
            marginBottom: "16px",
          }}
        >
          <Title level={3} style={{ margin: 0, color: "#2c3e50" }}>
            🎓 Explore Learning Opportunities
          </Title>
          <Text style={{ color: "#7f8c8d", fontSize: "16px" }}>
            Discover courses, posts, and events to advance your skills
          </Text>
        </div>
        <Tabs
          defaultActiveKey="courses"
          items={tabItems}
          style={{
            boxShadow: "none",
            padding: "0 24px 24px 24px",
          }}
          size="large"
        />
      </Card>

      {/* Course View Modal */}
      <Modal
        title="Course Details"
        open={courseModalVisible}
        onCancel={() => {
          setCourseModalVisible(false);
          setSelectedItem(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => setCourseModalVisible(false)}
            size="large"
          >
            Close
          </Button>,
          <Button
            key="view-full"
            type="primary"
            onClick={() => {
              handleNavigateToCourse(selectedItem?.id, selectedItem?.slug);
              setCourseModalVisible(false);
            }}
            size="large"
          >
            View Full Course
          </Button>,
        ]}
        width="95%"
        style={{ maxWidth: '900px' }}
      >
        {selectedItem && (
          <Card style={{ backgroundColor: "white", border: "none" }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Image
                  src={selectedItem.imageUrl || "/api/placeholder/300/200"}
                  alt={selectedItem.title}
                  style={{ borderRadius: 8, width: "100%" }}
                />
                {selectedItem.progress > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <Text strong style={{ display: "block", marginBottom: 8 }}>
                      Your Progress
                    </Text>
                    <Progress
                      percent={selectedItem.progress || 0}
                      strokeColor={{
                        "0%": "#108ee9",
                        "100%": "#87d068",
                      }}
                    />
                  </div>
                )}
              </Col>
              <Col xs={24} md={16}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Title level={3} style={{ marginBottom: 8 }}>
                      {selectedItem.title}
                    </Title>
                    <Text type="secondary">by {selectedItem.authorName}</Text>
                  </div>

                  <div>
                    <Space size="large">
                      <div>
                        <Rate
                          disabled
                          defaultValue={4.5}
                          style={{ fontSize: 16 }}
                        />
                        <Text style={{ marginLeft: 8 }}>4.5 (120 reviews)</Text>
                      </div>
                      <Tag color={selectedItem.isFree ? "green" : "blue"}>
                        {selectedItem.isFree
                          ? "Free"
                          : `${selectedItem.price || 0} ${
                              selectedItem.currency || "XAF"
                            }`}
                      </Tag>
                    </Space>
                  </div>

                  <div>
                    <Space>
                      <Text strong>Status: </Text>
                      <Tag
                        color={
                          selectedItem.status === "published"
                            ? "green"
                            : "orange"
                        }
                      >
                        {selectedItem.status}
                      </Tag>
                      {selectedItem.progress >= 100 && (
                        <Tag color="gold" icon={<TrophyOutlined />}>
                          Completed
                        </Tag>
                      )}
                    </Space>
                  </div>
                </Space>
              </Col>
            </Row>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Description">
                {selectedItem.description}
              </Descriptions.Item>
              <Descriptions.Item label="Level">
                {selectedItem.level || "Beginner"}
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                {selectedItem.durationWeeks || 4} weeks
              </Descriptions.Item>
              <Descriptions.Item label="Language">
                {selectedItem.language || "English"}
              </Descriptions.Item>
              <Descriptions.Item label="Students Enrolled">
                {selectedItem.currentStudents || 0} /{" "}
                {selectedItem.maxStudents || "Unlimited"}
              </Descriptions.Item>
              <Descriptions.Item label="Certificate Available">
                {selectedItem.certificateAvailable ? "Yes" : "No"}
              </Descriptions.Item>
              <Descriptions.Item label="Prerequisites">
                {selectedItem.prerequisites || "None"}
              </Descriptions.Item>
              <Descriptions.Item label="Learning Outcomes">
                {selectedItem.learningOutcomes || "Will be provided"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {selectedItem.createdAt
                  ? new Date(selectedItem.createdAt).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
            </Descriptions>

            {/* Course Reviews Section */}
            <div style={{ marginTop: "24px" }}>
              <Title level={5} style={{ marginBottom: "16px" }}>
                <StarOutlined style={{ marginRight: "8px", color: "#faad14" }} />
                Student Reviews
              </Title>
              
              <div style={{ 
                padding: "16px", 
                background: "#f8f9fa", 
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <Text style={{ color: "#666" }}>
                  Reviews are available in the detailed course view and learning interface
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <Button 
                    type="link" 
                    onClick={() => {
                      handleNavigateToCourse(selectedItem?.id, selectedItem?.slug);
                      setCourseModalVisible(false);
                    }}
                    style={{ padding: 0 }}
                  >
                    View Course Details & Reviews →
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </Modal>

      {/* Post View Modal */}
      <Modal
        title="Post Details"
        open={postModalVisible}
        onCancel={() => {
          setPostModalVisible(false);
          setSelectedItem(null);
        }}
        footer={[
          <Button key="close" onClick={() => setPostModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="like"
            type={
              selectedItem && likedPosts.has(selectedItem.id)
                ? "primary"
                : "default"
            }
            icon={
              selectedItem && likedPosts.has(selectedItem.id) ? (
                <HeartFilled />
              ) : (
                <HeartOutlined />
              )
            }
            loading={likingPost === selectedItem?.id}
            disabled={selectedItem && likedPosts.has(selectedItem.id)}
            onClick={() => {
              if (selectedItem) {
                handleLikePost(selectedItem.id, selectedItem.title);
              }
            }}
            style={{
              backgroundColor:
                selectedItem && likedPosts.has(selectedItem.id)
                  ? "#ff4d4f"
                  : undefined,
              borderColor:
                selectedItem && likedPosts.has(selectedItem.id)
                  ? "#ff4d4f"
                  : undefined,
              color:
                selectedItem && likedPosts.has(selectedItem.id)
                  ? "white"
                  : undefined,
            }}
          >
            {selectedItem && likedPosts.has(selectedItem.id)
              ? "Liked"
              : "Like Post"}
          </Button>,
          <Button
            key="read-full"
            type="primary"
            onClick={() => {
              handleNavigateToPost(selectedItem?.id, selectedItem?.slug);
              setPostModalVisible(false);
            }}
          >
            Read Full Post
          </Button>,
        ]}
        width={700}
      >
        {selectedItem && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Image
                  src={selectedItem.imageUrl || "/api/placeholder/300/200"}
                  alt={selectedItem.title}
                  style={{ borderRadius: 8, width: "100%" }}
                />
              </Col>
              <Col xs={24} md={16}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Title level={3} style={{ marginBottom: 8 }}>
                      {selectedItem.title}
                    </Title>
                    <Text type="secondary">
                      by {selectedItem.authorName || "Author"}
                    </Text>
                  </div>

                  <div>
                    <Tag
                      color={
                        selectedItem.status === "published"
                          ? "green"
                          : selectedItem.status === "draft"
                          ? "orange"
                          : "default"
                      }
                    >
                      {selectedItem.status}
                    </Tag>
                  </div>

                  <div>
                    <Text type="secondary">
                      Published:{" "}
                      {selectedItem.publishedAt
                        ? new Date(
                            selectedItem.publishedAt
                          ).toLocaleDateString()
                        : "Draft"}
                    </Text>
                  </div>
                </Space>
              </Col>
            </Row>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Description">
                {selectedItem.description}
              </Descriptions.Item>
              <Descriptions.Item label="Content Preview">
                <div style={{ maxHeight: 200, overflow: "auto" }}>
                  {selectedItem.content ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedItem.content.substring(0, 500) +
                          (selectedItem.content.length > 500 ? "..." : ""),
                      }}
                    />
                  ) : (
                    "No content preview available"
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedItem.categoryId || "Uncategorized"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {selectedItem.createdAt
                  ? new Date(selectedItem.createdAt).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Event View Modal */}
      <Modal
        title="Event Details"
        open={eventModalVisible}
        onCancel={() => {
          setEventModalVisible(false);
          setSelectedItem(null);
        }}
        footer={[
          <Button key="close" onClick={() => setEventModalVisible(false)}>
            Close
          </Button>,
          selectedItem && selectedItem.registrationStatus !== "registered" && (
            <Button
              key="register"
              type="primary"
              loading={registeringEvent === selectedItem?.id}
              onClick={() => {
                if (selectedItem) {
                  handleRegisterEvent(selectedItem.id, selectedItem.title);
                  setEventModalVisible(false);
                }
              }}
            >
              Register Now
            </Button>
          ),
          <Button
            key="view-full"
            type="primary"
            onClick={() => {
              handleNavigateToEvent(selectedItem?.id, selectedItem?.slug);
              setEventModalVisible(false);
            }}
          >
            View Full Event
          </Button>,
        ]}
        width={800}
      >
        {selectedItem && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Image
                  src={selectedItem.imageUrl || "/api/placeholder/300/200"}
                  alt={selectedItem.title}
                  style={{ borderRadius: 8, width: "100%" }}
                />
              </Col>
              <Col xs={24} md={16}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Title level={3} style={{ marginBottom: 8 }}>
                      {selectedItem.title}
                    </Title>
                    <Text type="secondary">
                      Organized by {selectedItem.userId}
                    </Text>
                  </div>

                  <div>
                    <Space>
                      <Tag
                        color={
                          selectedItem.status === "published"
                            ? "green"
                            : selectedItem.status === "cancelled"
                            ? "red"
                            : selectedItem.status === "completed"
                            ? "blue"
                            : "orange"
                        }
                      >
                        {selectedItem.status}
                      </Tag>
                      {selectedItem.isFree ? (
                        <Tag color="green">Free Event</Tag>
                      ) : (
                        <Tag color="blue">
                          {selectedItem.entryFee || 0}{" "}
                          {selectedItem.currency || "XAF"}
                        </Tag>
                      )}
                    </Space>
                  </div>

                  <div>
                    <Space direction="vertical" size="small">
                      <div>
                        <CalendarOutlined
                          style={{ marginRight: 8, color: "#1890ff" }}
                        />
                        <Text strong>Date: </Text>
                        <Text>
                          {selectedItem.eventDate
                            ? new Date(
                                selectedItem.eventDate
                              ).toLocaleDateString()
                            : "TBD"}
                        </Text>
                      </div>
                      <div>
                        <EnvironmentOutlined
                          style={{ marginRight: 8, color: "#52c41a" }}
                        />
                        <Text strong>Location: </Text>
                        <Text>{selectedItem.location || "Online"}</Text>
                      </div>
                    </Space>
                  </div>
                </Space>
              </Col>
            </Row>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Description">
                {selectedItem.description}
              </Descriptions.Item>
              <Descriptions.Item label="Event Duration">
                {selectedItem.eventDate && selectedItem.eventEndDate
                  ? `${new Date(
                      selectedItem.eventDate
                    ).toLocaleString()} - ${new Date(
                      selectedItem.eventEndDate
                    ).toLocaleString()}`
                  : selectedItem.eventDate
                  ? new Date(selectedItem.eventDate).toLocaleString()
                  : "TBD"}
              </Descriptions.Item>
              <Descriptions.Item label="Target Audience">
                {selectedItem.targetAudience || "General Public"}
              </Descriptions.Item>
              <Descriptions.Item label="Language">
                {selectedItem.language || "English"}
              </Descriptions.Item>
              <Descriptions.Item label="Max Attendees">
                {selectedItem.maxAttendees || "Unlimited"}
              </Descriptions.Item>
              <Descriptions.Item label="Current Attendees">
                {selectedItem.currentAttendees || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Registration Required">
                {selectedItem.registrationRequired ? "Yes" : "No"}
              </Descriptions.Item>
              <Descriptions.Item label="Registration Deadline">
                {selectedItem.registrationDeadline
                  ? new Date(
                      selectedItem.registrationDeadline
                    ).toLocaleDateString()
                  : "No deadline"}
              </Descriptions.Item>
              <Descriptions.Item label="Requirements">
                {selectedItem.requirements || "None"}
              </Descriptions.Item>
              <Descriptions.Item label="Contact">
                {selectedItem.contactEmail ||
                  selectedItem.contactPhone ||
                  "Contact organizer"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {selectedItem.createdAt
                  ? new Date(selectedItem.createdAt).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Post View Modal */}
      <Modal
        title="Post Details"
        open={postModalVisible}
        onCancel={() => {
          setPostModalVisible(false);
          setSelectedItem(null);
        }}
        footer={[
          <Button key="close" onClick={() => setPostModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="like"
            type={
              selectedItem && likedPosts.has(selectedItem.id)
                ? "primary"
                : "default"
            }
            icon={
              selectedItem && likedPosts.has(selectedItem.id) ? (
                <HeartFilled />
              ) : (
                <HeartOutlined />
              )
            }
            loading={likingPost === selectedItem?.id}
            disabled={selectedItem && likedPosts.has(selectedItem.id)}
            onClick={() => {
              if (selectedItem) {
                handleLikePost(selectedItem.id, selectedItem.title);
              }
            }}
            style={{
              backgroundColor:
                selectedItem && likedPosts.has(selectedItem.id)
                  ? "#ff4d4f"
                  : undefined,
              borderColor:
                selectedItem && likedPosts.has(selectedItem.id)
                  ? "#ff4d4f"
                  : undefined,
              color:
                selectedItem && likedPosts.has(selectedItem.id)
                  ? "white"
                  : undefined,
            }}
          >
            {selectedItem && likedPosts.has(selectedItem.id)
              ? "Liked"
              : "Like Post"}
          </Button>,
          <Button
            key="read-full"
            type="primary"
            onClick={() => {
              handleNavigateToPost(selectedItem?.id, selectedItem?.slug);
              setPostModalVisible(false);
            }}
          >
            Read Full Post
          </Button>,
        ]}
        width={700}
      >
        {selectedItem && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Image
                  src={selectedItem.imageUrl || "/api/placeholder/300/200"}
                  alt={selectedItem.title}
                  style={{ borderRadius: 8, width: "100%" }}
                />
              </Col>
              <Col xs={24} md={16}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Title level={3} style={{ marginBottom: 8 }}>
                      {selectedItem.title}
                    </Title>
                    <Text type="secondary">
                      by {selectedItem.authorName || "Author"}
                    </Text>
                  </div>

                  <div>
                    <Tag
                      color={
                        selectedItem.status === "published"
                          ? "green"
                          : selectedItem.status === "draft"
                          ? "orange"
                          : "default"
                      }
                    >
                      {selectedItem.status}
                    </Tag>
                  </div>

                  <div>
                    <Text type="secondary">
                      Published:{" "}
                      {selectedItem.publishedAt
                        ? new Date(
                            selectedItem.publishedAt
                          ).toLocaleDateString()
                        : "Draft"}
                    </Text>
                  </div>
                </Space>
              </Col>
            </Row>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Description">
                {selectedItem.description}
              </Descriptions.Item>
              <Descriptions.Item label="Content Preview">
                <div style={{ maxHeight: 200, overflow: "auto" }}>
                  {selectedItem.content ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedItem.content.substring(0, 500) +
                          (selectedItem.content.length > 500 ? "..." : ""),
                      }}
                    />
                  ) : (
                    "No content preview available"
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedItem.categoryId || "Uncategorized"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {selectedItem.createdAt
                  ? new Date(selectedItem.createdAt).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Event View Modal */}
      <Modal
        title="Event Details"
        open={eventModalVisible}
        onCancel={() => {
          setEventModalVisible(false);
          setSelectedItem(null);
        }}
        footer={[
          <Button key="close" onClick={() => setEventModalVisible(false)}>
            Close
          </Button>,
          selectedItem && selectedItem.registrationStatus !== "registered" && (
            <Button
              key="register"
              type="primary"
              loading={registeringEvent === selectedItem?.id}
              onClick={() => {
                if (selectedItem) {
                  handleRegisterEvent(selectedItem.id, selectedItem.title);
                  setEventModalVisible(false);
                }
              }}
            >
              Register Now
            </Button>
          ),
          <Button
            key="view-full"
            type="primary"
            onClick={() => {
              handleNavigateToEvent(selectedItem?.id, selectedItem?.slug);
              setEventModalVisible(false);
            }}
          >
            View Full Event
          </Button>,
        ]}
        width={800}
      >
        {selectedItem && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Image
                  src={selectedItem.imageUrl || "/api/placeholder/300/200"}
                  alt={selectedItem.title}
                  style={{ borderRadius: 8, width: "100%" }}
                />
              </Col>
              <Col xs={24} md={16}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Title level={3} style={{ marginBottom: 8 }}>
                      {selectedItem.title}
                    </Title>
                    <Text type="secondary">
                      Organized by {selectedItem.userId}
                    </Text>
                  </div>

                  <div>
                    <Space>
                      <Tag
                        color={
                          selectedItem.status === "published"
                            ? "green"
                            : selectedItem.status === "cancelled"
                            ? "red"
                            : selectedItem.status === "completed"
                            ? "blue"
                            : "orange"
                        }
                      >
                        {selectedItem.status}
                      </Tag>
                      {selectedItem.isFree ? (
                        <Tag color="green">Free Event</Tag>
                      ) : (
                        <Tag color="blue">
                          {selectedItem.entryFee || 0}{" "}
                          {selectedItem.currency || "XAF"}
                        </Tag>
                      )}
                    </Space>
                  </div>

                  <div>
                    <Space direction="vertical" size="small">
                      <div>
                        <CalendarOutlined
                          style={{ marginRight: 8, color: "#1890ff" }}
                        />
                        <Text strong>Date: </Text>
                        <Text>
                          {selectedItem.eventDate
                            ? new Date(
                                selectedItem.eventDate
                              ).toLocaleDateString()
                            : "TBD"}
                        </Text>
                      </div>
                      <div>
                        <EnvironmentOutlined
                          style={{ marginRight: 8, color: "#52c41a" }}
                        />
                        <Text strong>Location: </Text>
                        <Text>{selectedItem.location || "Online"}</Text>
                      </div>
                    </Space>
                  </div>
                </Space>
              </Col>
            </Row>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Description">
                {selectedItem.description}
              </Descriptions.Item>
              <Descriptions.Item label="Event Duration">
                {selectedItem.eventDate && selectedItem.eventEndDate
                  ? `${new Date(
                      selectedItem.eventDate
                    ).toLocaleString()} - ${new Date(
                      selectedItem.eventEndDate
                    ).toLocaleString()}`
                  : selectedItem.eventDate
                  ? new Date(selectedItem.eventDate).toLocaleString()
                  : "TBD"}
              </Descriptions.Item>
              <Descriptions.Item label="Target Audience">
                {selectedItem.targetAudience || "General Public"}
              </Descriptions.Item>
              <Descriptions.Item label="Language">
                {selectedItem.language || "English"}
              </Descriptions.Item>
              <Descriptions.Item label="Max Attendees">
                {selectedItem.maxAttendees || "Unlimited"}
              </Descriptions.Item>
              <Descriptions.Item label="Current Attendees">
                {selectedItem.currentAttendees || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Registration Required">
                {selectedItem.registrationRequired ? "Yes" : "No"}
              </Descriptions.Item>
              <Descriptions.Item label="Registration Deadline">
                {selectedItem.registrationDeadline
                  ? new Date(
                      selectedItem.registrationDeadline
                    ).toLocaleDateString()
                  : "No deadline"}
              </Descriptions.Item>
              <Descriptions.Item label="Requirements">
                {selectedItem.requirements || "None"}
              </Descriptions.Item>
              <Descriptions.Item label="Contact">
                {selectedItem.contactEmail ||
                  selectedItem.contactPhone ||
                  "Contact organizer"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {selectedItem.createdAt
                  ? new Date(selectedItem.createdAt).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}

