/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Layout,
  Card,
  Typography,
  Button,
  Row,
  Col,
  Collapse,
  List,
  Avatar,
  Tag,
  Progress,
  Space,
  Tabs,
  Divider,
  Tooltip,
  Badge,
  Drawer,
  Empty,
  Spin,
  Alert,
  Modal,
  Form,
  Input,
  Rate,
  Select,
  Checkbox,
  notification,
  Splitter,
} from "antd";
import {
  PlayCircleOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  LinkOutlined,
  DownloadOutlined,
  MenuOutlined,
  LeftOutlined,
  RightOutlined,
  VideoCameraOutlined,
  ReadOutlined,
  TrophyOutlined,
  StarOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserOutlined,
  SoundOutlined,
  PauseCircleOutlined,
  ToolOutlined,
  BulbOutlined,
} from "@ant-design/icons";
// import { EnhancedBreadcrumb } from "@/components/enhanced-breadcrumb";
import styles from "./page.module.css";
import {
  useGetCourseModulesQuery,
  useGetUserCourseProgressQuery,
  useUpdateLessonProgressMutation,
  useGetLastAccessedLessonQuery,
  IModule,
  ILesson,
  ILessonProgress,
} from "@/store/api/learning_api";
import { courseEnrollmentAPI } from "@/store/api/course-enrollment_api";
import {
  reviewAPI,
  IReviewRequest,
  IReviewResponse,
  ICourseReviewsResponse,
} from "@/store/api/review_api";
import {
  quizSubmissionAPI,
  IQuizSubmissionRequest,
  IQuizSubmissionResponse,
} from "@/store/api/quiz-submission_api";
import { assignmentSubmissionAPI } from "@/store/api/assignment-submission_api";
import { assignmentAPI } from "@/store/api/assignment_api";
import { quizAPI } from "@/store/api/quiz_api";

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// Custom Audio Player Component with brand colors
interface CustomAudioPlayerProps {
  audioUrl: string;
  title: string;
  onProgress: (percentage: number) => void;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
  audioUrl,
  title,
  onProgress,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(total);

      if (total > 0) {
        const percentage = (current / total) * 100;
        onProgress(percentage);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "none",
        borderRadius: "12px",
        color: "white",
      }}
    >
      <div style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <SoundOutlined style={{ fontSize: "24px", marginRight: "12px" }} />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            {title}
          </Title>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
            onProgress(100);
          }}
        />

        <div style={{ marginBottom: "16px" }}>
          <Button
            type="primary"
            size="large"
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={handlePlayPause}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              marginRight: "16px",
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>

          <Text style={{ color: "white", fontSize: "14px" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <input
            type="range"
            min="0"
            max="100"
            value={duration > 0 ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            style={{
              width: "100%",
              height: "6px",
              background: "rgba(255, 255, 255, 0.3)",
              outline: "none",
              borderRadius: "3px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <span>0:00</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </Card>
  );
};

// Custom Video Player Component with brand colors
interface CustomVideoPlayerProps {
  videoUrl: string;
  title: string;
  onProgress: (percentage: number) => void;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrl,
  title,
  onProgress,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeVideoId(videoUrl);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);

      if (total > 0) {
        const percentage = Math.round((current / total) * 100);
        onProgress(percentage);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  if (youtubeId) {
    // Custom YouTube embed with no branding
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "12px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        }}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3&theme=dark&controls=1&disablekb=1`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />

        {/* Custom overlay with brand colors */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            zIndex: 10,
          }}
        />
      </div>
    );
  }

  // Custom video player for non-YouTube videos
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#000",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%" }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Custom progress bar with brand colors */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "rgba(255,255,255,0.3)",
          cursor: "pointer",
        }}
        onClick={handleSeek}
      >
        <div
          style={{
            height: "100%",
            width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

interface LearningPageProps {}

const LearningPage: React.FC<LearningPageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [api, contextHolder] = notification.useNotification();

  const courseId = params.courseId as string;

  // Define all hooks before any early returns
  const shouldSkipAPICalls = status !== "authenticated" || !session?.user?.id;

  const {
    data: modules,
    isLoading: modulesLoading,
    error: modulesError,
    refetch: refetchModules,
  } = useGetCourseModulesQuery(courseId, {
    skip: shouldSkipAPICalls,
    refetchOnMountOrArgChange: true,
  });

  const { data: progressData, refetch: refetchProgress } =
    useGetUserCourseProgressQuery(courseId, {
      skip: shouldSkipAPICalls,
      refetchOnMountOrArgChange: true,
    });

  const { data: userEnrollments, refetch: refetchEnrollments } =
    courseEnrollmentAPI.useGetCourseEnrollmentsByUserQuery(
      session?.user?.id || "",
      {
        skip: shouldSkipAPICalls,
        refetchOnMountOrArgChange: true,
      }
    );

  // Review API calls
  const { data: courseReviews, refetch: refetchReviews } =
    reviewAPI.useGetCourseReviewsQuery(
      {
        courseId,
        userId: session?.user?.id,
        includeStats: true,
      },
      {
        skip: shouldSkipAPICalls,
      }
    );

  const [createReview] = reviewAPI.useCreateReviewMutation();
  const [updateReview] = reviewAPI.useUpdateReviewMutation();
  const [deleteReview] = reviewAPI.useDeleteReviewMutation();
  const [markHelpful] = reviewAPI.useMarkReviewHelpfulMutation();

  // Submission API calls
  const { data: userQuizSubmissions } =
    quizSubmissionAPI.useGetUserQuizSubmissionsQuery(
      {
        userId: session?.user?.id || "",
        courseId,
      },
      {
        skip: shouldSkipAPICalls,
      }
    );

  const { data: userAssignmentSubmissions } =
    assignmentSubmissionAPI.useGetUserAssignmentSubmissionsQuery(
      {
        userId: session?.user?.id || "",
        courseId,
      },
      {
        skip: shouldSkipAPICalls,
      }
    );

  const [submitQuiz] = quizSubmissionAPI.useSubmitQuizMutation();
  const [submitAssignment] =
    assignmentSubmissionAPI.useSubmitAssignmentMutation();
  const [updateLessonProgress] = useUpdateLessonProgressMutation();

  // Get last accessed lesson for continue functionality
  const { data: lastAccessedLesson } = useGetLastAccessedLessonQuery(courseId, {
    skip: shouldSkipAPICalls,
  });

  // State management
  const [currentLesson, setCurrentLesson] = useState<ILesson | null>(null);
  const [activeTab, setActiveTab] = useState("media");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );
  const [enrollmentId, setEnrollmentId] = useState<string>("");
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizResultsVisible, setQuizResultsVisible] = useState(false);
  const [currentQuizResults, setCurrentQuizResults] = useState<any>(null);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewForm] = Form.useForm();

  // Get assignments and quizzes for the current lesson
  const {
    data: lessonAssignments,
    isLoading: assignmentsLoading,
    error: assignmentsError,
    refetch: refetchAssignments,
  } = assignmentAPI.useGetAssignmentsByLessonQuery(currentLesson?.id || "", {
    skip: !currentLesson?.id || shouldSkipAPICalls,
  });

  const {
    data: lessonQuizzes,
    isLoading: quizzesLoading,
    refetch: refetchQuizzes,
  } = quizAPI.useGetQuizzesByLessonQuery(currentLesson?.id || "", {
    skip: !currentLesson?.id || shouldSkipAPICalls,
  });

  // Authentication check
  React.useEffect(() => {
    if (status === "loading") return; // Still loading session

    if (status === "unauthenticated" || !session) {
      // Redirect to login page with callback URL
      const callbackUrl =
        typeof window !== "undefined"
          ? encodeURIComponent(window.location.href)
          : encodeURIComponent(`/dashboard/student/courses/${courseId}/learn`);
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    // Optional: Check if user has student role
    if (session.user && !session.user.id) {
      api.error({
        message: "Access Denied",
        description: "Unable to verify your identity. Please log in again.",
        style: {
          backgroundColor: "#fff2f0",
          border: "1px solid #ff4d4f",
        },
      });
      router.push("/login");
      return;
    }
  }, [status, session, router, api]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Spin size="large" style={{ marginBottom: "24px" }} />
          <div
            style={{ color: "white", fontSize: "18px", textAlign: "center" }}
          >
            <div style={{ marginBottom: "8px" }}>
              🔐 Verifying Authentication
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>
              Please wait while we verify your access...
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show access denied if not authenticated
  if (status === "unauthenticated" || !session) {
    return (
      <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: "24px",
          }}
        >
          <Alert
            message="Authentication Required"
            description="You must be logged in to access this learning content. You will be redirected to the login page."
            type="warning"
            showIcon
            style={{
              maxWidth: "500px",
              marginBottom: "24px",
              borderRadius: "12px",
            }}
            action={
              <Button
                type="primary"
                onClick={() => {
                  const callbackUrl =
                    typeof window !== "undefined"
                      ? encodeURIComponent(window.location.href)
                      : encodeURIComponent(
                          `/dashboard/student/courses/${courseId}/learn`
                        );
                  router.push(`/login?callbackUrl=${callbackUrl}`);
                }}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                Go to Login
              </Button>
            }
          />
        </div>
      </Layout>
    );
  }

  // Compute course data from modules with defensive coding
  const courseData = React.useMemo(() => {
    if (!modules || !Array.isArray(modules) || modules.length === 0) {
      return null;
    }

    // Create defensive copies and add null checks
    const safeModules = [...modules].filter(Boolean);

    const totalLessons = safeModules.reduce((acc, module) => {
      const lessons = module?.totalLessons || 0;
      return acc + (typeof lessons === "number" ? lessons : 0);
    }, 0);

    const completedLessonsCount = safeModules.reduce((acc, module) => {
      const completed = module?.completedLessons || 0;
      return acc + (typeof completed === "number" ? completed : 0);
    }, 0);

    const progress =
      totalLessons > 0
        ? Math.round((completedLessonsCount / totalLessons) * 100)
        : 0;

    const courseTitle =
      safeModules[0]?.title || safeModules[0]?.courseId || "Course";

    const result = {
      id: courseId,
      title: courseTitle,
      totalModules: safeModules.length,
      completedModules: safeModules.filter((m) => m?.isCompleted === true)
        .length,
      totalLessons,
      completedLessons: completedLessonsCount,
      progress,
      modules: safeModules.sort((a, b) => {
        const orderA = a?.moduleOrder || 0;
        const orderB = b?.moduleOrder || 0;
        return (
          (typeof orderA === "number" ? orderA : 0) -
          (typeof orderB === "number" ? orderB : 0)
        );
      }),
    };

    return result;
  }, [modules, courseId]);

  // Debug logging
  React.useEffect(() => {
    if (modulesError) {
      console.error("Modules Error:", modulesError);
      console.error("Modules Error Details:", {
        error: modulesError,
        status: (modulesError as any)?.status,
        data: (modulesError as any)?.data,
        message: (modulesError as any)?.message,
      });
    }
  }, [
    courseId,
    status,
    session,
    modules,
    modulesLoading,
    modulesError,
    progressData,
    userEnrollments,
  ]);

  // Initialize completed lessons from progress data with defensive coding
  React.useEffect(() => {
    if (progressData && Array.isArray(progressData)) {
      try {
        const completedLessonIds = [...progressData]
          .filter(
            (progress: ILessonProgress) =>
              progress &&
              progress.status === "completed" &&
              progress.progressType === "lesson" &&
              progress.lessonId
          )
          .map((progress: ILessonProgress) => progress.lessonId)
          .filter(Boolean); // Remove any null/undefined values

        setCompletedLessons(new Set(completedLessonIds));
      } catch (error) {
        console.error("Error processing progress data:", error);
        setCompletedLessons(new Set());
      }
    }
  }, [progressData]);

  // Initialize enrollment ID with defensive coding
  React.useEffect(() => {
    if (userEnrollments && session?.user?.id) {
      try {
        const enrollments = Array.isArray(userEnrollments)
          ? [...userEnrollments]
          : (userEnrollments as any)?.data || [];

        if (Array.isArray(enrollments)) {
          const currentEnrollment = enrollments.find(
            (enrollment: any) =>
              enrollment && enrollment.courseId === courseId && enrollment.id
          );

          if (currentEnrollment?.id) {
            setEnrollmentId(currentEnrollment.id);
          }
        }
      } catch (error) {
        console.error("Error processing enrollment data:", error);
        setEnrollmentId("");
      }
    }
  }, [userEnrollments, courseId, session?.user?.id]);

  // Course enrollment verification
  React.useEffect(() => {
    // Skip if still loading or no data
    if (!userEnrollments || !session?.user?.id) return;

    try {
      const enrollments = Array.isArray(userEnrollments)
        ? [...userEnrollments]
        : (userEnrollments as any)?.data || [];

      if (Array.isArray(enrollments)) {
        const isEnrolled = enrollments.some(
          (enrollment: any) =>
            enrollment &&
            enrollment.courseId === courseId &&
            (enrollment.status === "active" ||
              enrollment.status === "completed")
        );

        if (!isEnrolled) {
          api.warning({
            message: "Course Access Required",
            description:
              "You need to enroll in this course to access the learning content.",
            placement: "topRight",
            duration: 5,
            style: {
              backgroundColor: "#fffbe6",
              border: "1px solid #faad14",
            },
          });

          // Redirect to course details page or dashboard after a delay
          setTimeout(() => {
            router.push(
              `/dashboard/student?message=enrollment-required&courseId=${courseId}`
            );
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error verifying course enrollment:", error);
      api.error({
        message: "Access Verification Failed",
        description:
          "Unable to verify your course enrollment. Please try again.",
        style: {
          backgroundColor: "#fff2f0",
          border: "1px solid #ff4d4f",
        },
      });
    }
  }, [userEnrollments, courseId, session?.user?.id, api, router]);

  // Handle API authentication errors
  React.useEffect(() => {
    if (modulesError) {
      const isAuthError = (modulesError as any)?.status === 401;
      const isSessionError = (modulesError as any)?.data?.message?.includes?.(
        "Session error"
      );

      if (isAuthError || isSessionError) {
        console.warn(
          "Authentication error detected, attempting to refresh session..."
        );

        // Show user-friendly error message
        api.warning({
          message: "Session Issue Detected",
          description: isSessionError
            ? "Your session has expired. Please refresh the page or clear cookies and log in again."
            : "Authentication required. Please log in to continue.",
          placement: "topRight",
          duration: 8,
          style: {
            backgroundColor: "#fffbe6",
            border: "1px solid #faad14",
          },
          btn: (
            <Space>
              <Button size="small" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  // Clear cookies and redirect to login
                  document.cookie.split(";").forEach((cookie) => {
                    const eqPos = cookie.indexOf("=");
                    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                  });

                  const callbackUrl =
                    typeof window !== "undefined"
                      ? encodeURIComponent(window.location.href)
                      : encodeURIComponent(
                          `/dashboard/student/courses/${courseId}/learn`
                        );
                  router.push(`/login?callbackUrl=${callbackUrl}`);
                }}
              >
                Clear & Login
              </Button>
            </Space>
          ),
        });
      }
    }
  }, [modulesError, api, router, courseId]);

  // Initialize with last accessed lesson or first lesson with defensive coding
  React.useEffect(() => {
    console.log("Lesson initialization effect running:", {
      hasCourseData: !!courseData,
      modulesLength: courseData?.modules?.length || 0,
      hasCurrentLesson: !!currentLesson,
      currentLessonId: currentLesson?.id,
    });

    if (
      courseData &&
      Array.isArray(courseData.modules) &&
      courseData.modules.length > 0 &&
      !currentLesson
    ) {
      console.log("Initializing lesson - no current lesson exists");
      try {
        // First, try to find the last accessed lesson
        let targetLesson = null;

        if (lastAccessedLesson?.lessonId) {
          // Find the last accessed lesson in the course modules
          for (const moduleItem of courseData.modules) {
            if (Array.isArray(moduleItem.lessons)) {
              const foundLesson = moduleItem.lessons.find(
                (lesson) => lesson.id === lastAccessedLesson.lessonId
              );
              if (foundLesson) {
                targetLesson = foundLesson;
                console.log(
                  "Continuing from last accessed lesson:",
                  foundLesson.title,
                  "Completion:",
                  lastAccessedLesson.completionPercentage + "%"
                );
                break;
              }
            }
          }
        }

        // If no last accessed lesson found, use the first lesson by order
        if (!targetLesson) {
          // Get all lessons sorted by lessonOrder and find the first one
          const allLessons = courseData.modules
            .flatMap((module) => module.lessons || [])
            .sort((a, b) => (a.lessonOrder || 0) - (b.lessonOrder || 0));

          if (allLessons.length > 0) {
            targetLesson = allLessons[0];
            console.log(
              "Starting with first lesson by order:",
              targetLesson.title,
              "Order:",
              targetLesson.lessonOrder
            );
          }
        }

        // Set the lesson and appropriate tab
        if (targetLesson) {
          setCurrentLesson(targetLesson);
          // Set the appropriate tab based on lesson type
          if (targetLesson.lessonType === "video" && targetLesson.videoUrl) {
            setActiveTab("media");
          } else if (
            targetLesson.lessonType === "audio" &&
            targetLesson.audioUrl
          ) {
            setActiveTab("media");
          } else {
            setActiveTab("content");
          }
        }
      } catch (error) {
        console.error("Error initializing lesson:", error);
        setCurrentLesson(null);
      }
    }
  }, [courseData]);

  // Refetch assignments and quizzes when lesson changes
  React.useEffect(() => {
    if (currentLesson?.id && !shouldSkipAPICalls) {
      refetchAssignments();
      refetchQuizzes();
    }
  }, [
    currentLesson?.id,
    shouldSkipAPICalls,
    refetchAssignments,
    refetchQuizzes,
  ]);

  // Handle lesson selection with loading and progress tracking
  const handleLessonSelect = async (lesson: any) => {
    console.log(
      "handleLessonSelect called with:",
      lesson?.title,
      "ID:",
      lesson?.id
    );
    console.log(
      "Current lesson:",
      currentLesson?.title,
      "ID:",
      currentLesson?.id
    );

    if (!lesson) {
      console.log("No lesson provided, returning");
      return;
    }

    if (lesson.id === currentLesson?.id) {
      console.log("Same lesson ID, returning early");
      return;
    }

    console.log(
      "Proceeding with lesson selection:",
      lesson.title,
      "ID:",
      lesson.id
    );
    setLessonLoading(true);
    try {
      // Track lesson view and update last accessed time
      if (enrollmentId) {
        await updateLessonProgress({
          lessonId: lesson.id,
          courseId,
          enrollmentId,
          isCompleted: false,
          completionPercentage: 5, // Started viewing
          lastAccessedAt: new Date().toISOString(),
        }).unwrap();
      }

      console.log("Setting current lesson to:", lesson.title);
      setCurrentLesson(lesson);

      // Set the appropriate tab based on lesson type
      if (lesson.lessonType === "video" && lesson.videoUrl) {
        setActiveTab("media");
      } else if (lesson.lessonType === "audio" && lesson.audioUrl) {
        setActiveTab("media");
      } else {
        setActiveTab("content");
      }

      setSidebarVisible(false);

      // Small delay for UX
      setTimeout(() => setLessonLoading(false), 500);
    } catch (error) {
      console.error("Error selecting lesson:", error);
      setLessonLoading(false);
    }
  };

  // Handle lesson completion
  const handleCompleteLesson = async (lessonId: string) => {
    if (!enrollmentId) {
      api.error({
        message: "Error",
        description: "Enrollment information not found.",
        style: {
          backgroundColor: "#fff2f0",
          border: "1px solid #ff4d4f",
        },
      });
      return;
    }

    setLoading(true);
    try {
      await updateLessonProgress({
        lessonId,
        courseId,
        enrollmentId,
        isCompleted: true,
        completionPercentage: 100,
        lastAccessedAt: new Date().toISOString(),
      }).unwrap();

      setCompletedLessons((prev) => new Set([...prev, lessonId]));
      api.success({
        message: "Lesson Completed! 🎉",
        description: "Great job! You've completed this lesson.",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #52c41a",
        },
      });
    } catch (error) {
      api.error({
        message: "Error",
        description: "Failed to mark lesson as complete.",
        style: {
          backgroundColor: "#fff2f0",
          border: "1px solid #ff4d4f",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle video progress tracking
  const handleVideoProgress = async (percentage: number) => {
    if (!currentLesson || !enrollmentId) return;

    try {
      await updateLessonProgress({
        lessonId: currentLesson.id,
        courseId,
        enrollmentId,
        isCompleted: percentage >= 90,
        completionPercentage: Math.max(percentage, 5),
        lastAccessedAt: new Date().toISOString(),
      }).unwrap();

      if (percentage >= 90 && !completedLessons.has(currentLesson.id)) {
        setCompletedLessons((prev) => new Set([...prev, currentLesson.id]));
        api.success({
          message: "Lesson Completed! 🎉",
          description: "You've watched the entire video lesson.",
          placement: "topRight",
          style: {
            backgroundColor: "#f6ffed",
            border: "1px solid #52c41a",
          },
        });
      }
    } catch (error) {
      console.error("Error tracking video progress:", error);
    }
  };

  // Handle quiz functionality
  const handleStartQuiz = (quiz: any) => {
    setCurrentQuiz(quiz);
    setQuizAnswers({});
    setQuizVisible(true);
  };

  const handleViewQuizResults = (quiz: any) => {
    const submission = getQuizSubmissionStatus(quiz.id);
    if (submission) {
      setCurrentQuiz(quiz);
      setCurrentQuizResults(submission);
      setQuizResultsVisible(true);
    }
  };

  const handleQuizSubmit = async () => {
    if (!currentQuiz || !currentLesson || !enrollmentId) return;

    setLoading(true);
    try {
      // Get user's answer for this quiz
      const userAnswer = quizAnswers[currentQuiz.id];

      if (!userAnswer) {
        api.warning({
          message: "Please select an answer",
          description: "You must select an answer before submitting the quiz.",
          style: {
            backgroundColor: "#fffbe6",
            border: "1px solid #faad14",
          },
        });
        setLoading(false);
        return;
      }

      // Parse answers and determine if correct
      const answers =
        typeof currentQuiz.answers === "string"
          ? JSON.parse(currentQuiz.answers)
          : currentQuiz.answers || [];

      const correctAnswerIndex = currentQuiz.correctAnswerIndex;
      const correctAnswer = answers[correctAnswerIndex];
      const isCorrect = userAnswer === correctAnswer;
      const score = isCorrect ? currentQuiz.points || 10 : 0;
      const maxScore = currentQuiz.points || 10;
      const percentage = (score / maxScore) * 100;

      // Check if this is a retry attempt
      const previousSubmission = getQuizSubmissionStatus(currentQuiz.id);
      const attemptNumber = previousSubmission
        ? (previousSubmission.attemptNumber || 1) + 1
        : 1;

      // Submit quiz submission
      await submitQuiz({
        quizId: currentQuiz.id,
        lessonId: currentLesson.id,
        courseId,
        moduleId: currentLesson.moduleId,
        score,
        maxScore,
        percentage,
        answers: JSON.stringify([userAnswer]),
        correctAnswers: JSON.stringify([correctAnswer]),
        timeSpentSeconds: Math.floor(Date.now() / 1000), // Simple time tracking
        attemptNumber: attemptNumber,
        isPassed: isCorrect,
      }).unwrap();

      // Track lesson progress
      await updateLessonProgress({
        lessonId: currentLesson.id,
        courseId,
        enrollmentId,
        isCompleted: isCorrect,
        completionPercentage: Math.max(percentage, 25),
        lastAccessedAt: new Date().toISOString(),
        notes: `Quiz "${
          currentQuiz.title
        }" completed. Score: ${score}/${maxScore} (${percentage.toFixed(
          1
        )}%). Answer: "${userAnswer}" (${isCorrect ? "Correct" : "Incorrect"})`,
      }).unwrap();

      // Show result with explanation
      const isRetry = attemptNumber > 1;
      if (isCorrect) {
        api.success({
          message: `🎉 ${
            isRetry ? "Retry" : "Quiz"
          } Completed! Score: ${score}/${maxScore} (${percentage.toFixed(1)}%)`,
          description: isRetry
            ? `Great improvement! Attempt ${attemptNumber}. ${
                currentQuiz.explanation || "You got the right answer!"
              }`
            : currentQuiz.explanation || "Great job! You got the right answer.",
          placement: "topRight",
          duration: 5,
          style: {
            backgroundColor: "#f6ffed",
            border: "1px solid #52c41a",
          },
        });
      } else {
        api.error({
          message: `❌ ${
            isRetry ? "Retry" : "Quiz"
          } Incorrect. Score: ${score}/${maxScore} (${percentage.toFixed(1)}%)`,
          description: currentQuiz.explanation
            ? `Attempt ${attemptNumber}. The correct answer was "${correctAnswer}". ${currentQuiz.explanation}`
            : `Attempt ${attemptNumber}. The correct answer was "${correctAnswer}". You can retake the quiz to improve your score.`,
          placement: "topRight",
          duration: 8,
          style: {
            backgroundColor: "#fff2f0",
            border: "1px solid #ff4d4f",
          },
        });
      }

      setQuizVisible(false);
      setCurrentQuiz(null);
      setQuizAnswers({});
    } catch (error) {
      console.error("Error submitting quiz:", error);
      api.error({
        message: "Error submitting quiz",
        description: "Please try again later.",
        style: {
          backgroundColor: "#fff2f0",
          border: "1px solid #ff4d4f",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Review handlers
  const handleSubmitReview = async (values: any) => {
    if (!session?.user?.id) {
      api.error({
        message: "Unable to submit review",
        description: "Please ensure you're logged in.",
        style: {
          backgroundColor: "#fff2f0",
          border: "1px solid #ff4d4f",
        },
      });
      return;
    }

    console.log("Submitting review with courseId:", courseId);
    console.log("Review data:", values);

    setLoading(true);
    try {
      const reviewData: IReviewRequest = {
        courseId,
        rating: values.rating,
        comment: values.comment,
        wouldRecommend: values.wouldRecommend ?? true,
        difficulty: values.difficulty,
        isAnonymous: values.isAnonymous ?? false,
        language: values.language || "english",
      };

      if (courseReviews?.userReview) {
        // Update existing review
        await updateReview({
          ...reviewData,
          id: courseReviews.userReview.id,
        }).unwrap();
        api.success({
          message: "Review Updated! ⭐",
          description:
            "Your review has been updated and will be reviewed by our team.",
          placement: "topRight",
          style: {
            backgroundColor: "#f6ffed",
            border: "1px solid #52c41a",
          },
        });
      } else {
        // Create new review
        await createReview(reviewData).unwrap();
        api.success({
          message: "Review Submitted! ⭐",
          description:
            "Thank you for your feedback! Your review will be published after moderation.",
          placement: "topRight",
          style: {
            backgroundColor: "#f6ffed",
            border: "1px solid #52c41a",
          },
        });
      }

      setReviewVisible(false);
      reviewForm.resetFields();
      refetchReviews();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      api.error({
        message: "Failed to submit review",
        description: error.data?.message || "Please try again later.",
        style: {
          backgroundColor: "#fff2f0",
          border: "1px solid #ff4d4f",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!courseReviews?.userReview) return;

    setLoading(true);
    try {
      await deleteReview({
        id: courseReviews.userReview.id,
        courseId,
      }).unwrap();

      api.success({
        message: "Review Deleted",
        description: "Your review has been removed successfully.",
        placement: "topRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #52c41a",
        },
      });

      refetchReviews();
    } catch (error: any) {
      console.error("Error deleting review:", error);
      api.error({
        message: "Failed to delete review",
        description: error.data?.message || "Please try again later.",
        style: {
          backgroundColor: "#fff2f0",
          border: "1px solid #ff4d4f",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markHelpful(reviewId).unwrap();
      api.success({
        message: "Thank you!",
        description: "Your feedback helps other students.",
        placement: "topRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #52c41a",
        },
      });
      refetchReviews();
    } catch (error: any) {
      console.error("Error marking review helpful:", error);
      api.error({
        message: "Action failed",
        description: "Please try again later.",
        style: {
          backgroundColor: "#fff2f0",
          border: "1px solid #ff4d4f",
        },
      });
    }
  };

  // Navigation handlers with loading and progress tracking
  const handleNextLesson = async () => {
    if (!currentLesson || !courseData) return;

    try {
      console.log(
        "Current lesson:",
        currentLesson.title,
        "ID:",
        currentLesson.id
      );
      // Get all lessons sorted by lessonOrder
      const allLessons = courseData.modules
        .flatMap((module) => module.lessons || [])
        .sort((a, b) => (a.lessonOrder || 0) - (b.lessonOrder || 0));

      console.log(
        "All lessons (sorted by order):",
        allLessons.map((l) => ({
          id: l.id,
          title: l.title,
          order: l.lessonOrder,
        }))
      );

      const currentIndex = allLessons.findIndex(
        (lesson) => lesson.id === currentLesson.id
      );
      console.log(
        "Current index:",
        currentIndex,
        "Total lessons:",
        allLessons.length
      );

      if (currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        console.log(
          "Next lesson:",
          nextLesson.title,
          "ID:",
          nextLesson.id,
          "Order:",
          nextLesson.lessonOrder
        );
        console.log("Next lesson object reference:", nextLesson);
        console.log("Current lesson object reference:", currentLesson);
        console.log("Are they the same object?", nextLesson === currentLesson);
        await handleLessonSelect(nextLesson);
      } else {
        console.log("Already at last lesson");
      }
    } catch (error) {
      console.error("Error navigating to next lesson:", error);
    }
  };

  const handlePreviousLesson = async () => {
    if (!currentLesson || !courseData) return;

    try {
      console.log(
        "Current lesson:",
        currentLesson.title,
        "ID:",
        currentLesson.id
      );
      // Get all lessons sorted by lessonOrder
      const allLessons = courseData.modules
        .flatMap((module) => module.lessons || [])
        .sort((a, b) => (a.lessonOrder || 0) - (b.lessonOrder || 0));

      console.log(
        "All lessons (sorted by order):",
        allLessons.map((l) => ({
          id: l.id,
          title: l.title,
          order: l.lessonOrder,
        }))
      );

      const currentIndex = allLessons.findIndex(
        (lesson) => lesson.id === currentLesson.id
      );
      console.log(
        "Current index:",
        currentIndex,
        "Total lessons:",
        allLessons.length
      );

      if (currentIndex > 0) {
        const prevLesson = allLessons[currentIndex - 1];
        console.log(
          "Previous lesson:",
          prevLesson.title,
          "ID:",
          prevLesson.id,
          "Order:",
          prevLesson.lessonOrder
        );
        await handleLessonSelect(prevLesson);
      } else {
        console.log("Already at first lesson");
      }
    } catch (error) {
      console.error("Error navigating to previous lesson:", error);
    }
  };

  // Render lesson content based on type
  const renderLessonContent = () => {
    if (!currentLesson) {
      return (
        <Empty
          description="Select a lesson to start learning"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <div style={{ height: "100%" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: "media",
              label: (
                <span>
                  <VideoCameraOutlined />
                  Media Content
                </span>
              ),
              children: (
                <div
                  style={{
                    padding: lessonLoading ? "24px" : "0",
                    position: "relative",
                    minHeight: "400px",
                  }}
                >
                  {lessonLoading ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "400px",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "12px",
                        color: "white",
                      }}
                    >
                      <Spin size="large" style={{ marginBottom: "16px" }} />
                      <Text style={{ color: "white", fontSize: "16px" }}>
                        Loading lesson content...
                      </Text>
                    </div>
                  ) : currentLesson.lessonType === "video" &&
                    currentLesson.videoUrl ? (
                    <CustomVideoPlayer
                      videoUrl={currentLesson.videoUrl}
                      title={currentLesson.title}
                      onProgress={(percentage) =>
                        handleVideoProgress(percentage)
                      }
                    />
                  ) : currentLesson.lessonType === "audio" &&
                    currentLesson.audioUrl ? (
                    <CustomAudioPlayer
                      audioUrl={currentLesson.audioUrl}
                      title={currentLesson.title}
                      onProgress={(percentage) =>
                        handleVideoProgress(percentage)
                      }
                    />
                  ) : (
                    <Card
                      style={{
                        textAlign: "center",
                        padding: "60px",
                        background:
                          "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        border: "none",
                      }}
                    >
                      <VideoCameraOutlined
                        style={{
                          fontSize: "64px",
                          color: "#667eea",
                          marginBottom: "16px",
                        }}
                      />
                      <Title level={4} style={{ color: "#667eea" }}>
                        No video available
                      </Title>
                      <Text style={{ color: "#8892b0" }}>
                        This lesson is text-based. Switch to the Content tab.
                      </Text>
                    </Card>
                  )}
                </div>
              ),
            },
            {
              key: "content",
              label: (
                <span>
                  <ReadOutlined />
                  Text Content
                </span>
              ),
              children: (
                <Card style={{ minHeight: "400px", padding: "32px" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        currentLesson.content || "<p>No content available</p>",
                    }}
                    style={{
                      lineHeight: 1.8,
                      fontSize: "16px",
                      color: "#333",
                    }}
                  />

                  {currentLesson.objectives && (
                    <>
                      <Divider />
                      <Title level={4}>Learning Objectives</Title>
                      <ul style={{ paddingLeft: "20px" }}>
                        {(currentLesson.objectives || []).map(
                          (objective: string, index: number) => (
                            <li
                              key={index}
                              style={{ marginBottom: "8px", fontSize: "15px" }}
                            >
                              {objective}
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}

                  {currentLesson.practicalExamples && (
                    <>
                      <Divider />
                      <Title level={4}>
                        <BulbOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        Practical Examples
                      </Title>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentLesson.practicalExamples,
                        }}
                        style={{
                          lineHeight: 1.8,
                          fontSize: "15px",
                          color: "#555",
                          background: "#f8f9fa",
                          padding: "16px",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef",
                        }}
                      />
                    </>
                  )}

                  {currentLesson.resourcesNeeded && (
                    <>
                      <Divider />
                      <Title level={4}>
                        <ToolOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        Resources Needed
                      </Title>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentLesson.resourcesNeeded,
                        }}
                        style={{
                          lineHeight: 1.8,
                          fontSize: "15px",
                          color: "#555",
                          background: "#fff3cd",
                          padding: "16px",
                          borderRadius: "8px",
                          border: "1px solid #ffeaa7",
                        }}
                      />
                    </>
                  )}

                  {currentLesson.estimatedCompletionTime && (
                    <>
                      <Divider />
                      <Title level={4}>
                        <ClockCircleOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        Estimated Completion Time
                      </Title>
                      <Text style={{ fontSize: "16px", color: "#666" }}>
                        {currentLesson.estimatedCompletionTime} minutes
                      </Text>
                    </>
                  )}

                  {currentLesson.downloadMaterials && (
                    <>
                      <Divider />
                      <Title level={4}>
                        <DownloadOutlined
                          style={{ marginRight: "8px", color: "#667eea" }}
                        />
                        Download Materials
                      </Title>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        href={currentLesson.downloadMaterials}
                        target="_blank"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }}
                      >
                        Download Resources
                      </Button>
                    </>
                  )}
                </Card>
              ),
            },
            {
              key: "resources",
              label: (
                <span>
                  <LinkOutlined />
                  Resources
                </span>
              ),
              children: (
                <Card style={{ minHeight: "400px" }}>
                  <Title level={4} style={{ marginBottom: "24px" }}>
                    Course Resources
                  </Title>

                  {currentLesson.resources &&
                  currentLesson.resources.length > 0 ? (
                    <List
                      dataSource={currentLesson.resources}
                      renderItem={(resource: any) => (
                        <List.Item
                          actions={[
                            <Button
                              key="action"
                              type="primary"
                              icon={
                                resource.type === "pdf" ? (
                                  <DownloadOutlined />
                                ) : (
                                  <LinkOutlined />
                                )
                              }
                              href={resource.url}
                              target="_blank"
                            >
                              {resource.type === "pdf" ? "Download" : "Open"}
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                icon={
                                  resource.type === "pdf" ? (
                                    <FileTextOutlined />
                                  ) : (
                                    <LinkOutlined />
                                  )
                                }
                              />
                            }
                            title={resource.title}
                            description={`Type: ${resource.type.toUpperCase()}`}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="No resources available for this lesson" />
                  )}
                </Card>
              ),
            },
            {
              key: "reviews",
              label: (
                <span>
                  <StarOutlined />
                  Reviews ({courseReviews?.stats?.totalReviews || 0})
                </span>
              ),
              children: (
                <Card style={{ minHeight: "400px" }}>
                  <div
                    style={{
                      marginBottom: "24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Title level={4} style={{ margin: 0 }}>
                        Course Reviews
                      </Title>
                      {courseReviews?.stats && (
                        <div style={{ marginTop: "8px" }}>
                          <Rate
                            disabled
                            value={courseReviews.stats.averageRating}
                            allowHalf
                            style={{ fontSize: "16px" }}
                          />
                          <Text style={{ marginLeft: "8px", color: "#666" }}>
                            {courseReviews.stats.averageRating.toFixed(1)} (
                            {courseReviews.stats.totalReviews} reviews)
                          </Text>
                        </div>
                      )}
                    </div>
                    <Button
                      type="primary"
                      icon={<StarOutlined />}
                      onClick={() => setReviewVisible(true)}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      {courseReviews?.userReview
                        ? "Update Review"
                        : "Write Review"}
                    </Button>
                  </div>

                  {courseReviews?.userReview && (
                    <Card
                      style={{
                        marginBottom: "24px",
                        border: "2px solid #667eea",
                        borderRadius: "12px",
                      }}
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Avatar icon={<UserOutlined />} />
                          <span>Your Review</span>
                          <Tag color="blue">
                            {courseReviews.userReview.status
                              .charAt(0)
                              .toUpperCase() +
                              courseReviews.userReview.status.slice(1)}
                          </Tag>
                        </div>
                      }
                    >
                      <div style={{ marginBottom: "12px" }}>
                        <Rate
                          disabled
                          value={courseReviews.userReview.rating}
                          style={{ fontSize: "16px" }}
                        />
                      </div>
                      <Text style={{ display: "block", marginBottom: "12px" }}>
                        {courseReviews.userReview.comment}
                      </Text>
                      <div
                        style={{
                          marginTop: "12px",
                          fontSize: "12px",
                          color: "#999",
                        }}
                      >
                        Submitted on{" "}
                        {new Date(
                          courseReviews.userReview.createdAt
                        ).toLocaleDateString()}
                      </div>
                    </Card>
                  )}

                  {courseReviews?.reviews &&
                  courseReviews.reviews.length > 0 ? (
                    <List
                      dataSource={courseReviews.reviews.filter(
                        (review) => review.id !== courseReviews?.userReview?.id
                      )}
                      renderItem={(review: IReviewResponse) => (
                        <List.Item
                          style={{
                            padding: "16px",
                            border: "1px solid #f0f0f0",
                            borderRadius: "8px",
                            marginBottom: "16px",
                          }}
                          actions={[
                            <Button
                              key="helpful"
                              type="text"
                              icon={<TeamOutlined />}
                              onClick={() => handleMarkHelpful(review.id)}
                              style={{ color: "#667eea" }}
                            >
                              Helpful ({review.helpfulVotes})
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                icon={<UserOutlined />}
                                style={{ backgroundColor: "#667eea" }}
                              />
                            }
                            title={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <Text strong>
                                  {review.isAnonymous
                                    ? "Anonymous Student"
                                    : review.user?.fullname || "Student"}
                                </Text>
                                <Rate
                                  disabled
                                  value={review.rating}
                                  style={{ fontSize: "14px" }}
                                />
                                {review.wouldRecommend && (
                                  <Tag
                                    color="green"
                                    style={{ fontSize: "11px" }}
                                  >
                                    Recommends
                                  </Tag>
                                )}
                              </div>
                            }
                            description={
                              <div>
                                <Text
                                  style={{
                                    display: "block",
                                    marginBottom: "8px",
                                  }}
                                >
                                  {review.comment}
                                </Text>
                                <div
                                  style={{
                                    marginTop: "8px",
                                    fontSize: "11px",
                                    color: "#999",
                                  }}
                                >
                                  <Space>
                                    <span>
                                      Difficulty:{" "}
                                      {review.difficulty?.replace("_", " ") ||
                                        "Not specified"}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </Space>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty
                      description="No reviews yet. Be the first to share your experience!"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Card>
              ),
            },
          ]}
        />
      </div>
    );
  };

  // Render assignments and quizzes sidebar
  // Helper functions to check submission status
  const getQuizSubmissionStatus = (quizId: string) => {
    if (!userQuizSubmissions || !Array.isArray(userQuizSubmissions))
      return null;

    const submissions = userQuizSubmissions
      .filter((submission: any) => submission.quizId === quizId)
      .sort(
        (a: any, b: any) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

    return submissions.length > 0 ? submissions[0] : null;
  };

  const getAssignmentSubmissionStatus = (assignmentId: string) => {
    if (!userAssignmentSubmissions || !Array.isArray(userAssignmentSubmissions))
      return null;

    const submissions = userAssignmentSubmissions
      .filter((submission: any) => submission.assignmentId === assignmentId)
      .sort(
        (a: any, b: any) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

    return submissions.length > 0 ? submissions[0] : null;
  };

  const getSubmissionStatusTag = (
    submission: any,
    type: "quiz" | "assignment"
  ) => {
    if (!submission) return null;

    const isPassed = submission.isPassed;
    const score = submission.score;
    const maxScore = type === "quiz" ? 1 : submission.maxScore || 100;
    const percentage = type === "quiz" ? score * 100 : (score / maxScore) * 100;

    return (
      <Tag color={isPassed ? "green" : "red"} style={{ marginLeft: "8px" }}>
        {isPassed ? "✅ Passed" : "❌ Failed"} ({percentage.toFixed(0)}%)
      </Tag>
    );
  };

  const renderAssignmentsQuizzes = () => {
    if (!currentLesson) return null;

    // Use API data instead of lesson data
    const assignments = lessonAssignments || [];
    const quizzes = lessonQuizzes || [];
    const hasAssignments = assignments && assignments.length > 0;
    const hasQuizzes = quizzes && quizzes.length > 0;

    // Debug logging for assignments and quizzes
    console.log("Current lesson activities data:", {
      lessonId: currentLesson.id,
      lessonTitle: currentLesson.title,
      assignmentsFromAPI: assignments,
      assignmentsLength: assignments.length,
      quizzesFromAPI: quizzes,
      quizzesLength: quizzes.length,
      assignmentsLoading,
      quizzesLoading,
      hasAssignments,
      hasQuizzes,
      lessonAssignments: currentLesson.assignments,
      lessonQuizzes: currentLesson.quizzes,
    });

    // Show empty state only when not loading and no activities found
    if (
      !assignmentsLoading &&
      !quizzesLoading &&
      !hasAssignments &&
      !hasQuizzes
    ) {
      return (
        <Card
          style={{
            height: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
          }}
          styles={{ body: { padding: "20px" } }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              margin: "-20px -20px 20px -20px",
              padding: "16px 20px",
              borderRadius: "12px 12px 0 0",
              textAlign: "center",
            }}
          >
            <Title level={4} style={{ margin: 0, color: "white" }}>
              <TrophyOutlined style={{ marginRight: "8px" }} />
              Activities
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
              Quizzes & Assignments for this lesson
            </Text>
          </div>
          <Empty
            description={
              <div style={{ textAlign: "center" }}>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#999",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  No activities available
                </Text>
                <Text style={{ fontSize: "14px", color: "#666" }}>
                  This lesson doesn&apos;t have any quizzes or assignments yet.
                </Text>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      );
    }

    return (
      <Card
        style={{
          height: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
        }}
        styles={{ body: { padding: "20px" } }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            margin: "-20px -20px 20px -20px",
            padding: "16px 20px",
            borderRadius: "12px 12px 0 0",
            textAlign: "center",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "white" }}>
            <TrophyOutlined style={{ marginRight: "8px" }} />
            Activities
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
            Quizzes & Assignments for this lesson
          </Text>
        </div>

        <div
          style={{
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          {(assignmentsLoading || quizzesLoading) && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="small" />
              <Text style={{ marginLeft: "8px", color: "#666" }}>
                Loading activities...
              </Text>
            </div>
          )}

          {!assignmentsLoading && hasAssignments && (
            <>
              <Title
                level={5}
                style={{
                  color: "#1890ff",
                  marginBottom: "16px",
                  fontSize: "16px",
                }}
              >
                📝 Assignments
              </Title>
              <List
                size="small"
                dataSource={assignments}
                renderItem={(assignment: any) => {
                  const submission = getAssignmentSubmissionStatus(
                    assignment.id
                  );
                  const hasSubmission = !!submission;

                  return (
                    <List.Item
                      style={{
                        padding: "16px",
                        border: "1px solid #e8e8e8",
                        borderRadius: "12px",
                        marginBottom: "12px",
                        backgroundColor: hasSubmission ? "#f8f9ff" : "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <div style={{ marginBottom: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Text
                                strong
                                style={{
                                  fontSize: "15px",
                                  display: "block",
                                  lineHeight: "1.4",
                                }}
                              >
                                {assignment.title}
                              </Text>
                              {getSubmissionStatusTag(submission, "assignment")}
                            </div>
                            <div style={{ marginLeft: "8px" }}>
                              <Tag
                                color={
                                  assignment.status === "completed"
                                    ? "green"
                                    : "orange"
                                }
                              >
                                {assignment.status}
                              </Tag>
                            </div>
                          </div>
                          <Text
                            style={{
                              fontSize: "13px",
                              color: "#666",
                              display: "block",
                              marginBottom: "12px",
                              lineHeight: "1.5",
                            }}
                          >
                            {assignment.description}
                          </Text>
                        </div>
                        {hasSubmission && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginBottom: "8px",
                            }}
                          >
                            <Text style={{ color: "#52c41a" }}>
                              📝 Submitted:{" "}
                              {new Date(
                                submission.submittedAt
                              ).toLocaleDateString()}
                            </Text>
                            {submission.instructorFeedback && (
                              <div
                                style={{
                                  marginTop: "4px",
                                  fontStyle: "italic",
                                }}
                              >
                                💬 Feedback: {submission.instructorFeedback}
                              </div>
                            )}
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: "12px", color: "#999" }}>
                            Due: {assignment.dueDate}
                          </Text>
                          <Space>
                            {hasSubmission && (
                              <Button
                                size="small"
                                type="default"
                                ghost
                                style={{
                                  borderColor: "#1890ff",
                                  color: "#1890ff",
                                }}
                              >
                                View Submission
                              </Button>
                            )}
                            <Button
                              size="small"
                              type="primary"
                              style={{
                                backgroundColor: hasSubmission
                                  ? "#faad14"
                                  : "#1890ff",
                                borderColor: hasSubmission
                                  ? "#faad14"
                                  : "#1890ff",
                              }}
                            >
                              {hasSubmission
                                ? "Retry Assignment"
                                : "Start Assignment"}
                            </Button>
                          </Space>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </>
          )}

          {!quizzesLoading && hasQuizzes && (
            <>
              <Title
                level={5}
                style={{
                  color: "#52c41a",
                  marginTop: hasAssignments ? "24px" : "0",
                  marginBottom: "16px",
                  fontSize: "16px",
                }}
              >
                🧠 Quizzes
              </Title>
              <List
                size="small"
                dataSource={quizzes}
                renderItem={(quiz: any) => {
                  const submission = getQuizSubmissionStatus(quiz.id);
                  const hasSubmission = !!submission;

                  return (
                    <List.Item
                      style={{
                        padding: "16px",
                        border: "1px solid #e8e8e8",
                        borderRadius: "12px",
                        marginBottom: "12px",
                        backgroundColor: hasSubmission ? "#f0f8ff" : "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <div style={{ marginBottom: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Text
                                strong
                                style={{
                                  fontSize: "15px",
                                  display: "block",
                                  lineHeight: "1.4",
                                }}
                              >
                                {quiz.title}
                              </Text>
                              {getSubmissionStatusTag(submission, "quiz")}
                            </div>
                            <div style={{ marginLeft: "8px" }}>
                              <Tag color="blue">{quiz.status}</Tag>
                            </div>
                          </div>
                        </div>
                        {hasSubmission && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginBottom: "8px",
                            }}
                          >
                            <Text style={{ color: "#52c41a" }}>
                              🎯 Completed:{" "}
                              {new Date(
                                submission.submittedAt
                              ).toLocaleDateString()}
                            </Text>
                            <div style={{ marginTop: "4px" }}>
                              <Text style={{ color: "#1890ff" }}>
                                📊 Attempts: {submission.attemptNumber || 1}
                              </Text>
                            </div>
                          </div>
                        )}
                        <Space
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontSize: "12px", color: "#666" }}>
                            1 question •{" "}
                            {quiz.timeLimitMinutes || quiz.timeLimit || 30} min
                          </Text>
                          <Space>
                            {hasSubmission && (
                              <Button
                                size="small"
                                type="default"
                                ghost
                                onClick={() => handleViewQuizResults(quiz)}
                                style={{
                                  borderColor: "#52c41a",
                                  color: "#52c41a",
                                }}
                              >
                                View Result
                              </Button>
                            )}
                            <Button
                              size="small"
                              type="primary"
                              ghost
                              onClick={() => handleStartQuiz(quiz)}
                              style={{
                                borderColor: hasSubmission
                                  ? "#faad14"
                                  : "#667eea",
                                color: hasSubmission ? "#faad14" : "#667eea",
                              }}
                            >
                              {hasSubmission ? "Retake Quiz" : "Take Quiz"}
                            </Button>
                          </Space>
                        </Space>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </>
          )}
        </div>
      </Card>
    );
  };

  // Render course modules sidebar
  const renderCourseModules = () => {
    if (!courseData) return null;

    return (
      <div style={{ height: "100%", overflow: "auto" }}>
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Title level={4} style={{ color: "white", margin: 0 }}>
            {courseData.title}
          </Title>

          {courseReviews?.stats && courseReviews.stats.totalReviews > 0 && (
            <div style={{ marginTop: "12px" }}>
              <Rate
                disabled
                value={courseReviews.stats.averageRating}
                allowHalf
                style={{ fontSize: "16px" }}
              />
              <Text
                style={{ color: "rgba(255,255,255,0.9)", marginLeft: "8px" }}
              >
                {courseReviews.stats.averageRating.toFixed(1)} (
                {courseReviews.stats.totalReviews} reviews)
              </Text>
            </div>
          )}

          <Progress
            percent={courseData.progress}
            strokeColor="#52c41a"
            trailColor="rgba(255,255,255,0.3)"
            style={{ marginTop: "16px" }}
          />
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
            {courseData.completedLessons} of {courseData.totalLessons} lessons
            completed
          </Text>

          {courseData.progress >= 50 && (
            <div style={{ marginTop: "16px" }}>
              <Button
                type="default"
                icon={<StarOutlined />}
                onClick={() => setReviewVisible(true)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  borderRadius: "8px",
                }}
                size="small"
                block
              >
                {courseReviews?.userReview ? "Update Review" : "Write Review"}
              </Button>
            </div>
          )}
        </div>

        <div style={{ padding: "16px" }}>
          <Collapse
            defaultActiveKey={
              courseData.modules
                ? [...courseData.modules]
                    .filter((m) => !m.isCompleted)
                    .map((m) => m.id)
                : []
            }
            ghost
          >
            {(courseData.modules ? [...courseData.modules] : [])
              .sort((a, b) => (a.moduleOrder || 0) - (b.moduleOrder || 0))
              .map((module) => (
                <Panel
                  key={module.id}
                  header={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <div>
                        <Text
                          strong
                          style={{
                            color: module.isCompleted ? "#52c41a" : "#333",
                          }}
                        >
                          {module.title}
                        </Text>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            marginTop: "4px",
                          }}
                        >
                          {module.completedLessons}/{module.totalLessons}{" "}
                          lessons • {module.estimatedDurationHours}h
                        </div>
                      </div>
                      <div>
                        {module.isCompleted && (
                          <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        )}
                        {module.isLocked && <Tag color="red">Locked</Tag>}
                      </div>
                    </div>
                  }
                  style={{
                    marginBottom: "8px",
                    backgroundColor: module.isCompleted ? "#f6ffed" : "white",
                    border: `1px solid ${
                      module.isCompleted ? "#b7eb8f" : "#f0f0f0"
                    }`,
                    borderRadius: "8px",
                  }}
                >
                  <List
                    size="small"
                    dataSource={
                      module.lessons
                        ? [...module.lessons].sort(
                            (a, b) =>
                              (a.lessonOrder || 0) - (b.lessonOrder || 0)
                          )
                        : []
                    }
                    renderItem={(lesson) => (
                      <List.Item
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          backgroundColor:
                            currentLesson?.id === lesson.id
                              ? "#e6f7ff"
                              : "transparent",
                          borderRadius: "6px",
                          marginBottom: "4px",
                          border:
                            currentLesson?.id === lesson.id
                              ? "1px solid #91d5ff"
                              : "1px solid transparent",
                        }}
                        onClick={() => handleLessonSelect(lesson)}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size="small"
                              icon={
                                lesson.lessonType === "video" ? (
                                  <VideoCameraOutlined />
                                ) : lesson.lessonType === "audio" ? (
                                  <SoundOutlined />
                                ) : (
                                  <BookOutlined />
                                )
                              }
                              style={{
                                backgroundColor: completedLessons.has(lesson.id)
                                  ? "#52c41a"
                                  : "#1890ff",
                              }}
                            />
                          }
                          title={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: "14px",
                                  fontWeight:
                                    currentLesson?.id === lesson.id
                                      ? "600"
                                      : "normal",
                                }}
                              >
                                {lesson.title}
                              </Text>
                              <Space>
                                {completedLessons.has(lesson.id) && (
                                  <CheckCircleOutlined
                                    style={{ color: "#52c41a" }}
                                  />
                                )}
                                {lesson.isFreePreview && (
                                  <Tag color="green">Free</Tag>
                                )}
                              </Space>
                            </div>
                          }
                          description={
                            <Space>
                              <Text style={{ fontSize: "12px", color: "#999" }}>
                                <ClockCircleOutlined /> {lesson.durationMinutes}{" "}
                                min
                              </Text>
                              <Text style={{ fontSize: "12px", color: "#999" }}>
                                {lesson.lessonType}
                              </Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
          </Collapse>
        </div>
      </div>
    );
  };

  // Debug what's causing the error (moved to top level)
  React.useEffect(() => {
    if (modulesError) {
      console.error("Modules Error Details:", {
        error: modulesError,
        status: (modulesError as any)?.status,
        data: (modulesError as any)?.data,
        message: (modulesError as any)?.message,
      });
    }
  }, [modulesError]);

  // Loading and error states
  if (modulesLoading) {
    return (
      <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
          <Text style={{ marginLeft: "16px", fontSize: "16px" }}>
            Loading course content...
          </Text>
        </div>
      </Layout>
    );
  }

  if (modulesError) {
    const isSessionError =
      (modulesError as any)?.data?.message?.includes?.("Session error") ||
      (modulesError as any)?.status === 401;

    return (
      <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: "24px",
          }}
        >
          <Alert
            message={
              isSessionError ? "Session Expired" : "Unable to load course"
            }
            description={
              isSessionError
                ? "Your session has expired. Please clear your browser cookies and log in again."
                : `Error loading course content: ${
                    (modulesError as any)?.data?.message ||
                    (modulesError as any)?.message ||
                    "Unknown error"
                  }`
            }
            type="error"
            showIcon
            action={
              <Space>
                {isSessionError && (
                  <Button
                    type="primary"
                    onClick={() => {
                      // Clear all cookies and redirect to login
                      document.cookie.split(";").forEach((cookie) => {
                        const eqPos = cookie.indexOf("=");
                        const name =
                          eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                      });
                      const callbackUrl =
                        typeof window !== "undefined"
                          ? encodeURIComponent(window.location.href)
                          : encodeURIComponent(
                              `/dashboard/student/courses/${courseId}/learn`
                            );
                      router.push(`/login?callbackUrl=${callbackUrl}`);
                    }}
                  >
                    Clear Cookies & Login
                  </Button>
                )}
                <Button
                  onClick={async () => {
                    try {
                      await refetchModules();
                      await refetchProgress();
                      await refetchEnrollments();
                    } catch (error) {
                      console.error("Retry failed:", error);
                      window.location.reload();
                    }
                  }}
                >
                  Retry
                </Button>
                <Button onClick={() => router.back()}>Back to Dashboard</Button>
              </Space>
            }
          />
        </div>
      </Layout>
    );
  }

  if (!courseData) {
    return (
      <Layout style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: "24px",
          }}
        >
          <Card
            style={{
              maxWidth: "600px",
              width: "100%",
              textAlign: "center",
              borderRadius: "20px",
              border: "none",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              overflow: "hidden",
            }}
          >
            {/* Hero Section */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "48px 32px",
                margin: "-24px -24px 32px -24px",
                color: "white",
              }}
            >
              <div
                style={{
                  fontSize: "72px",
                  marginBottom: "16px",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
              >
                📚
              </div>
              <Title
                level={2}
                style={{
                  color: "white",
                  marginBottom: "8px",
                  fontWeight: "700",
                }}
              >
                Course Content Unavailable
              </Title>
              <Text
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "18px",
                  lineHeight: "1.6",
                }}
              >
                We couldn&apos;t find any learning modules for this course
              </Text>
            </div>

            {/* Content Section */}
            <div style={{ padding: "0 32px 32px 32px" }}>
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {/* Possible Reasons */}
                <div>
                  <Title
                    level={4}
                    style={{ color: "#2c3e50", marginBottom: "16px" }}
                  >
                    This might happen because:
                  </Title>
                  <div style={{ textAlign: "left" }}>
                    <Space
                      direction="vertical"
                      size={16}
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                          }}
                        >
                          🚧
                        </div>
                        <Text style={{ fontSize: "16px", color: "#5a6c7d" }}>
                          The course content is still being prepared
                        </Text>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                          }}
                        >
                          🔒
                        </div>
                        <Text style={{ fontSize: "16px", color: "#5a6c7d" }}>
                          You may not have access to this course content
                        </Text>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                          }}
                        >
                          ⏳
                        </div>
                        <Text style={{ fontSize: "16px", color: "#5a6c7d" }}>
                          The modules haven&apos;t been published yet
                        </Text>
                      </div>
                    </Space>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: "32px" }}>
                  <Space size={24}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => window.location.reload()}
                      style={{
                        borderRadius: "12px",
                        height: "48px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 28px rgba(102, 126, 234, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px rgba(102, 126, 234, 0.4)";
                      }}
                    >
                      🔄 Try Again
                    </Button>

                    <Button
                      size="large"
                      onClick={() => router.back()}
                      style={{
                        borderRadius: "12px",
                        height: "48px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        border: "2px solid #e2e8f0",
                        color: "#64748b",
                        background: "white",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#667eea";
                        e.currentTarget.style.color = "#667eea";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.color = "#64748b";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      ← Back to Dashboard
                    </Button>
                  </Space>
                </div>

                {/* Help Text */}
                <div
                  style={{
                    marginTop: "24px",
                    padding: "20px",
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      lineHeight: "1.6",
                    }}
                  >
                    💡 <strong>Need help?</strong> Contact your instructor or
                    check back later. Course content is regularly updated and
                    new modules may be added soon.
                  </Text>
                </div>
              </Space>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {contextHolder}

      {/* Quiz Modal */}
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              padding: "16px 0",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              margin: "-24px -24px 24px -24px",
              color: "white",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <QuestionCircleOutlined
              style={{ marginRight: "8px", fontSize: "20px" }}
            />
            {currentQuiz?.title || "Quiz"}
          </div>
        }
        open={quizVisible}
        onCancel={() => setQuizVisible(false)}
        width="95%"
        style={{ maxWidth: "900px" }}
        footer={[
          <Button
            key="cancel"
            onClick={() => setQuizVisible(false)}
            size="large"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleQuizSubmit}
            size="large"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
            }}
          >
            Submit Quiz
          </Button>,
        ]}
      >
        {currentQuiz && (
          <div
            style={{ maxHeight: "60vh", overflowY: "auto", padding: "16px 0" }}
          >
            {/* Previous Submission History */}
            {(() => {
              const submission = getQuizSubmissionStatus(currentQuiz.id);
              if (submission) {
                return (
                  <div
                    style={{
                      marginBottom: "24px",
                      padding: "16px",
                      background:
                        "linear-gradient(135deg, #f6f8ff 0%, #e8f4fd 100%)",
                      borderRadius: "12px",
                      border: "1px solid #d9e7ff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "16px", color: "#1890ff" }}
                      >
                        📊 Previous Attempt
                      </Text>
                      {getSubmissionStatusTag(submission, "quiz")}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <Text style={{ fontSize: "14px", color: "#666" }}>
                          📅 Submitted:{" "}
                          {new Date(
                            submission.submittedAt
                          ).toLocaleDateString()}
                        </Text>
                        <br />
                        <Text style={{ fontSize: "14px", color: "#666" }}>
                          🎯 Score: {(submission.score * 100).toFixed(0)}%
                        </Text>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            display: "block",
                          }}
                        >
                          Attempts: {submission.attemptNumber || 1}
                        </Text>
                        <Text
                          style={{
                            fontSize: "14px",
                            color: "#faad14",
                            fontWeight: "bold",
                          }}
                        >
                          🔄 Retaking Quiz
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div style={{ marginBottom: "24px", textAlign: "center" }}>
              <Text style={{ fontSize: "16px", color: "#666" }}>
                1 Question • {currentQuiz.timeLimitMinutes || 30} Minutes
              </Text>
              {currentQuiz.instructions && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <Text style={{ fontSize: "14px", color: "#666" }}>
                    <strong>Instructions:</strong> {currentQuiz.instructions}
                  </Text>
                </div>
              )}
            </div>

            <Card
              style={{
                marginBottom: "20px",
                border: "1px solid #e8e8e8",
                borderRadius: "12px",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <Text strong style={{ fontSize: "16px" }}>
                  {currentQuiz.question}
                </Text>
                {currentQuiz.difficulty && (
                  <Tag
                    color={
                      currentQuiz.difficulty === "easy"
                        ? "green"
                        : currentQuiz.difficulty === "medium"
                        ? "orange"
                        : "red"
                    }
                    style={{ marginLeft: "12px" }}
                  >
                    {currentQuiz.difficulty.toUpperCase()}
                  </Tag>
                )}
              </div>

              <Space direction="vertical" style={{ width: "100%" }}>
                {(() => {
                  try {
                    const answers =
                      typeof currentQuiz.answers === "string"
                        ? JSON.parse(currentQuiz.answers)
                        : currentQuiz.answers || [];

                    return answers.map((option: string, optIndex: number) => (
                      <Button
                        key={optIndex}
                        type={
                          quizAnswers[currentQuiz.id] === option
                            ? "primary"
                            : "default"
                        }
                        block
                        style={{
                          textAlign: "left",
                          height: "auto",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          ...(quizAnswers[currentQuiz.id] === option
                            ? {
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                border: "none",
                              }
                            : {}),
                        }}
                        onClick={() =>
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [currentQuiz.id]: option,
                          }))
                        }
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </Button>
                    ));
                  } catch (error) {
                    console.error("Error parsing quiz answers:", error);
                    return (
                      <Alert
                        message="Quiz Data Error"
                        description="Unable to load quiz options. Please contact support."
                        type="error"
                        showIcon
                      />
                    );
                  }
                })()}
              </Space>

              {currentQuiz.localExample && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "#e6f7ff",
                    borderRadius: "8px",
                    borderLeft: "4px solid #1890ff",
                  }}
                >
                  <Text style={{ fontSize: "14px", color: "#0050b3" }}>
                    <strong>🇨🇲 Local Example:</strong>{" "}
                    {currentQuiz.localExample}
                  </Text>
                </div>
              )}

              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "#999",
                }}
              >
                <span>Points: {currentQuiz.points || 1}</span>
                <span>
                  Type:{" "}
                  {currentQuiz.quizType?.replace("_", " ").toUpperCase() ||
                    "MULTIPLE CHOICE"}
                </span>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* Quiz Results Modal */}
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              padding: "16px 0",
              background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
              margin: "-24px -24px 24px -24px",
              color: "white",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <TrophyOutlined style={{ marginRight: "8px", fontSize: "20px" }} />
            Quiz Results
          </div>
        }
        open={quizResultsVisible}
        onCancel={() => setQuizResultsVisible(false)}
        width="95%"
        style={{ maxWidth: "900px" }}
        footer={[
          <Button
            key="close"
            onClick={() => setQuizResultsVisible(false)}
            size="large"
          >
            Close
          </Button>,
          <Button
            key="retake"
            type="primary"
            onClick={() => {
              setQuizResultsVisible(false);
              handleStartQuiz(currentQuiz);
            }}
            size="large"
            style={{
              background: "linear-gradient(135deg, #faad14 0%, #d48806 100%)",
              border: "none",
            }}
          >
            Retake Quiz
          </Button>,
        ]}
      >
        {currentQuiz && currentQuizResults && (
          <div
            style={{ maxHeight: "60vh", overflowY: "auto", padding: "16px 0" }}
          >
            {/* Quiz Info Header */}
            <div
              style={{
                marginBottom: "24px",
                padding: "20px",
                background: "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
                borderRadius: "12px",
                border: "1px solid #b7eb8f",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <Title level={4} style={{ margin: 0, color: "#389e0d" }}>
                  {currentQuiz.title}
                </Title>
                <Text style={{ color: "#666", fontSize: "14px" }}>
                  Quiz Results Summary
                </Text>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: currentQuizResults.isPassed
                        ? "#52c41a"
                        : "#ff4d4f",
                    }}
                  >
                    {currentQuizResults.isPassed ? "✅" : "❌"}
                  </div>
                  <Text style={{ fontSize: "12px", color: "#666" }}>
                    Status
                  </Text>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: currentQuizResults.isPassed
                        ? "#52c41a"
                        : "#ff4d4f",
                    }}
                  >
                    {currentQuizResults.isPassed ? "PASSED" : "FAILED"}
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {(currentQuizResults.score * 100).toFixed(0)}%
                  </div>
                  <Text style={{ fontSize: "12px", color: "#666" }}>Score</Text>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    {currentQuizResults.score}/
                    {currentQuizResults.maxScore || 1}
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#722ed1",
                    }}
                  >
                    {currentQuizResults.attemptNumber || 1}
                  </div>
                  <Text style={{ fontSize: "12px", color: "#666" }}>
                    Attempt
                  </Text>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    {new Date(
                      currentQuizResults.submittedAt
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Question and Answer */}
            <Card style={{ marginBottom: "16px" }}>
              <Title level={5} style={{ marginBottom: "16px" }}>
                Question
              </Title>
              <Text
                style={{
                  fontSize: "16px",
                  marginBottom: "20px",
                  display: "block",
                }}
              >
                {currentQuiz.question}
              </Text>

              <Title level={5} style={{ marginBottom: "12px" }}>
                Answer Options
              </Title>
              {(() => {
                try {
                  const answers =
                    typeof currentQuiz.answers === "string"
                      ? JSON.parse(currentQuiz.answers)
                      : currentQuiz.answers || [];

                  return answers.map((option: string, optIndex: number) => {
                    const isCorrect =
                      optIndex === currentQuiz.correctAnswerIndex;
                    const isUserAnswer =
                      option === currentQuizResults.userAnswer;

                    let buttonStyle: React.CSSProperties = {
                      width: "100%",
                      marginBottom: "8px",
                      textAlign: "left" as const,
                      height: "auto",
                      padding: "12px 16px",
                      border: "1px solid #d9d9d9",
                      background: "#fff",
                      color: "#000",
                    };

                    if (isCorrect) {
                      buttonStyle.border = "2px solid #52c41a";
                      buttonStyle.background = "#f6ffed";
                      buttonStyle.color = "#389e0d";
                    } else if (isUserAnswer && !isCorrect) {
                      buttonStyle.border = "2px solid #ff4d4f";
                      buttonStyle.background = "#fff2f0";
                      buttonStyle.color = "#cf1322";
                    }

                    return (
                      <div key={optIndex} style={{ marginBottom: "8px" }}>
                        <Button style={buttonStyle} disabled>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <span>
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </span>
                            <div>
                              {isCorrect && (
                                <span
                                  style={{
                                    color: "#52c41a",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✓ Correct
                                </span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span
                                  style={{
                                    color: "#ff4d4f",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✗ Your Answer
                                </span>
                              )}
                              {isUserAnswer && isCorrect && (
                                <span
                                  style={{
                                    color: "#52c41a",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✓ Your Answer
                                </span>
                              )}
                            </div>
                          </div>
                        </Button>
                      </div>
                    );
                  });
                } catch (error) {
                  console.error("Error parsing quiz answers:", error);
                  return (
                    <Alert
                      message="Quiz Data Error"
                      description="Unable to load quiz options. Please contact support."
                      type="error"
                      showIcon
                    />
                  );
                }
              })()}
            </Card>

            {/* Explanation */}
            {currentQuiz.explanation && (
              <Card style={{ marginBottom: "16px" }}>
                <Title level={5} style={{ marginBottom: "12px" }}>
                  <BulbOutlined
                    style={{ marginRight: "8px", color: "#faad14" }}
                  />
                  Explanation
                </Title>
                <Text style={{ fontSize: "14px", lineHeight: 1.6 }}>
                  {currentQuiz.explanation}
                </Text>
              </Card>
            )}

            {/* Local Example */}
            {currentQuiz.localExample && (
              <Card style={{ marginBottom: "16px" }}>
                <Title level={5} style={{ marginBottom: "12px" }}>
                  <GlobalOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  Local Example
                </Title>
                <Text style={{ fontSize: "14px", lineHeight: 1.6 }}>
                  {currentQuiz.localExample}
                </Text>
              </Card>
            )}

            {/* Quiz Details */}
            <Card>
              <Title level={5} style={{ marginBottom: "12px" }}>
                Quiz Details
              </Title>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <Text strong>Quiz Type:</Text>
                  <br />
                  <Text style={{ fontSize: "14px", color: "#666" }}>
                    {currentQuiz.quizType?.replace("_", " ").toUpperCase() ||
                      "MULTIPLE CHOICE"}
                  </Text>
                </div>
                <div>
                  <Text strong>Points:</Text>
                  <br />
                  <Text style={{ fontSize: "14px", color: "#666" }}>
                    {currentQuiz.points || 1} point
                    {currentQuiz.points !== 1 ? "s" : ""}
                  </Text>
                </div>
                <div>
                  <Text strong>Time Limit:</Text>
                  <br />
                  <Text style={{ fontSize: "14px", color: "#666" }}>
                    {currentQuiz.timeLimitMinutes || 30} minutes
                  </Text>
                </div>
                <div>
                  <Text strong>Difficulty:</Text>
                  <br />
                  <Text style={{ fontSize: "14px", color: "#666" }}>
                    {currentQuiz.difficulty?.toUpperCase() || "MEDIUM"}
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              padding: "16px 0",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              margin: "-24px -24px 24px -24px",
              color: "white",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <StarOutlined style={{ marginRight: "8px", fontSize: "20px" }} />
            {courseReviews?.userReview
              ? "Update Your Review"
              : "Write a Review"}
          </div>
        }
        open={reviewVisible}
        onCancel={() => {
          setReviewVisible(false);
          reviewForm.resetFields();
        }}
        width="95%"
        style={{ maxWidth: "900px" }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setReviewVisible(false);
              reviewForm.resetFields();
            }}
            size="large"
          >
            Cancel
          </Button>,
          courseReviews?.userReview && (
            <Button
              key="delete"
              danger
              loading={loading}
              onClick={handleDeleteReview}
              size="large"
            >
              Delete Review
            </Button>
          ),
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => reviewForm.submit()}
            size="large"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
            }}
          >
            {courseReviews?.userReview ? "Update Review" : "Submit Review"}
          </Button>,
        ].filter(Boolean)}
      >
        <Form
          form={reviewForm}
          layout="vertical"
          onFinish={handleSubmitReview}
          initialValues={{
            rating: courseReviews?.userReview?.rating || 5,
            comment: courseReviews?.userReview?.comment || "",
            wouldRecommend: courseReviews?.userReview?.wouldRecommend ?? true,
            difficulty: courseReviews?.userReview?.difficulty || "medium",
            isAnonymous: courseReviews?.userReview?.isAnonymous || false,
            language: courseReviews?.userReview?.language || "english",
          }}
          size="large"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Overall Rating"
                name="rating"
                rules={[{ required: true, message: "Please rate the course" }]}
              >
                <Rate allowHalf style={{ fontSize: "24px" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Would you recommend this course?"
                name="wouldRecommend"
                valuePropName="checked"
              >
                <Checkbox>Yes, I would recommend this course</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Your Review"
            name="comment"
            rules={[
              { required: true, message: "Please write your review" },
              { min: 10, message: "Review must be at least 10 characters" },
              {
                max: 2000,
                message: "Review must be less than 2000 characters",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Share your detailed experience with this course..."
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Course Difficulty" name="difficulty">
                <Select placeholder="How difficult was this course?">
                  <Select.Option value="very_easy">Very Easy</Select.Option>
                  <Select.Option value="easy">Easy</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="hard">Hard</Select.Option>
                  <Select.Option value="very_hard">Very Hard</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Review Language" name="language">
                <Select>
                  <Select.Option value="english">English</Select.Option>
                  <Select.Option value="french">French</Select.Option>
                  <Select.Option value="both">Both</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Privacy"
                name="isAnonymous"
                valuePropName="checked"
              >
                <Checkbox>Post anonymously</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Header */}
      <div
        style={{
          background: "white",
          padding: "8px 12px",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Mobile Header */}
        <div className={styles["lg:hidden"]}>
          <Row
            align="middle"
            justify="space-between"
            style={{ marginBottom: "8px" }}
          >
            <Col>
              <Space size="small">
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setSidebarVisible(true)}
                  size="middle"
                  type="text"
                />
                <Button
                  icon={<LeftOutlined />}
                  onClick={() => router.back()}
                  type="text"
                  size="middle"
                />
              </Space>
            </Col>

            <Col flex="auto" style={{ textAlign: "center", padding: "0 8px" }}>
              <Text strong style={{ fontSize: "14px", color: "#333" }} ellipsis>
                {currentLesson?.title || "Select a Lesson"}
              </Text>
            </Col>

            <Col>
              <Space size="small">
                <Button
                  icon={<LeftOutlined />}
                  onClick={handlePreviousLesson}
                  disabled={!currentLesson}
                  size="small"
                  type="text"
                />
                <Button
                  icon={<RightOutlined />}
                  onClick={handleNextLesson}
                  disabled={!currentLesson}
                  type="primary"
                  size="small"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                  }}
                />
              </Space>
            </Col>
          </Row>

          {/* Mobile Action Bar */}
          <Row gutter={8}>
            <Col span={24}>
              <Button
                type="primary"
                onClick={() =>
                  currentLesson && handleCompleteLesson(currentLesson.id)
                }
                loading={loading}
                disabled={
                  !currentLesson || completedLessons.has(currentLesson.id)
                }
                block
                size="large"
                style={{
                  background: completedLessons.has(currentLesson?.id || "")
                    ? "#52c41a"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                {completedLessons.has(currentLesson?.id || "")
                  ? "✓ Completed"
                  : "Mark Complete"}
              </Button>
            </Col>
          </Row>
        </div>

        {/* Desktop Header */}
        <div className={styles["desktop-only"]}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space>
                <Button
                  icon={<LeftOutlined />}
                  onClick={() => router.back()}
                  type="text"
                  size="large"
                >
                  Back to Dashboard
                </Button>
              </Space>
            </Col>

            <Col>
              <Title level={4} style={{ margin: 0, color: "#333" }}>
                {currentLesson?.title || "Select a Lesson"}
              </Title>
            </Col>

            <Col>
              <Space>
                <Button
                  icon={<LeftOutlined />}
                  onClick={handlePreviousLesson}
                  disabled={!currentLesson}
                  size="large"
                >
                  Previous
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    currentLesson && handleCompleteLesson(currentLesson.id)
                  }
                  loading={loading}
                  disabled={
                    !currentLesson || completedLessons.has(currentLesson.id)
                  }
                  size="large"
                  style={{
                    background: completedLessons.has(currentLesson?.id || "")
                      ? "#52c41a"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                  }}
                >
                  {completedLessons.has(currentLesson?.id || "")
                    ? "✓ Completed"
                    : "Mark Complete"}
                </Button>
                <Button
                  icon={<RightOutlined />}
                  onClick={handleNextLesson}
                  disabled={!currentLesson}
                  type="primary"
                  ghost
                  size="large"
                  style={{
                    borderColor: "#667eea",
                    color: "#667eea",
                  }}
                >
                  Next
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <Layout style={{ backgroundColor: "#f5f5f5" }}>
        {/* Mobile Drawer */}
        <Drawer
          title="Course Content"
          placement="left"
          onClose={() => setSidebarVisible(false)}
          open={sidebarVisible}
          width={350}
        >
          {renderCourseModules()}
        </Drawer>

        {/* Desktop: Splitter with 3 resizable panels */}
        <div
          className={styles["desktop-only"]}
          style={{ height: "calc(100vh - 80px)" }}
        >
          <Splitter style={{ height: "100%", backgroundColor: "#f5f5f5" }}>
            {/* Panel 1: Lessons Column */}
            <Splitter.Panel
              defaultSize="20%"
              min="15%"
              max="40%"
              style={{
                backgroundColor: "white",
                overflow: "auto",
              }}
            >
              {renderCourseModules()}
            </Splitter.Panel>

            {/* Panel 2: Lesson Content Column */}
            <Splitter.Panel
              defaultSize="50%"
              min="30%"
              style={{
                overflow: "auto",
                padding: "8px",
              }}
            >
              <Card
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  minHeight: "400px",
                }}
                styles={{ body: { padding: 0, height: "100%" } }}
              >
                {renderLessonContent()}
              </Card>
            </Splitter.Panel>

            {/* Panel 3: Activities Column */}
            <Splitter.Panel
              defaultSize="30%"
              min="20%"
              max="50%"
              style={{
                overflow: "auto",
                padding: "8px",
              }}
            >
              <div className={styles["assignments-panel"]}>
                {renderAssignmentsQuizzes()}
              </div>
            </Splitter.Panel>
          </Splitter>
        </div>

        {/* Mobile: Original responsive layout */}
        <Layout
          style={{ backgroundColor: "#f5f5f5" }}
          className={styles["mobile-only"]}
        >
          <Content
            style={{
              margin: "8px",
              minHeight: "calc(100vh - 120px)",
            }}
            className={styles["responsive-content"]}
          >
            <Row gutter={[16, 16]} style={{ height: "100%" }}>
              {/* Lesson Content */}
              <Col xs={24} lg={14}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    minHeight: "400px",
                  }}
                  styles={{ body: { padding: 0, height: "100%" } }}
                >
                  {renderLessonContent()}
                </Card>
              </Col>

              {/* Activities Panel - Assignments & Quizzes */}
              <Col xs={24} lg={10}>
                <div className={styles["assignments-panel"]}>
                  {renderAssignmentsQuizzes()}
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LearningPage;
