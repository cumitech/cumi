/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { notification, Form } from "antd";
import { ILesson } from "@domain/models/lesson";
import { useGetCourseModulesQuery, useGetUserCourseProgressQuery, useUpdateLessonProgressMutation, useGetLastAccessedLessonQuery } from "@store/api/learning_api";
import { courseEnrollmentAPI } from "@store/api/course-enrollment_api";
import { reviewAPI } from "@store/api/review_api";
import { quizSubmissionAPI } from "@store/api/quiz-submission_api";
import { assignmentSubmissionAPI } from "@store/api/assignment-submission_api";
import { assignmentAPI } from "@store/api/assignment_api";
import { quizAPI } from "@store/api/quiz_api";

export const useLearningPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [api, contextHolder] = notification.useNotification();
  
  const courseId = params.courseId as string;

  // Define all hooks before any early returns
  const shouldSkipAPICalls = status !== "authenticated" || !session?.user?.id;
  
  const { data: modules, isLoading: modulesLoading, error: modulesError, refetch: refetchModules } = useGetCourseModulesQuery(courseId, {
    skip: shouldSkipAPICalls,
    refetchOnMountOrArgChange: true,
  });
  
  const { data: progressData, refetch: refetchProgress } = useGetUserCourseProgressQuery(courseId, {
    skip: shouldSkipAPICalls,
    refetchOnMountOrArgChange: true,
  });
  
  const { data: userEnrollments, refetch: refetchEnrollments } = courseEnrollmentAPI.useGetCourseEnrollmentsByUserQuery(session?.user?.id || "", {
    skip: shouldSkipAPICalls,
    refetchOnMountOrArgChange: true,
  });

  // Review API calls
  const { data: courseReviews, refetch: refetchReviews } = reviewAPI.useGetCourseReviewsQuery({
    courseId,
    userId: session?.user?.id,
    includeStats: true,
  }, {
    skip: shouldSkipAPICalls,
  });

  const [createReview] = reviewAPI.useCreateReviewMutation();
  const [updateReview] = reviewAPI.useUpdateReviewMutation();
  const [deleteReview] = reviewAPI.useDeleteReviewMutation();
  const [markHelpful] = reviewAPI.useMarkReviewHelpfulMutation();

  // Submission API calls
  const { data: userQuizSubmissions } = quizSubmissionAPI.useGetUserQuizSubmissionsQuery({
    userId: session?.user?.id || "",
    courseId,
  }, {
    skip: shouldSkipAPICalls,
  });

  const { data: userAssignmentSubmissions } = assignmentSubmissionAPI.useGetUserAssignmentSubmissionsQuery({
    userId: session?.user?.id || "",
    courseId,
  }, {
    skip: shouldSkipAPICalls,
  });

  const [submitQuiz] = quizSubmissionAPI.useSubmitQuizMutation();
  const [submitAssignment] = assignmentSubmissionAPI.useSubmitAssignmentMutation();
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
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [enrollmentId, setEnrollmentId] = useState<string>("");
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: string}>({});
  const [quizResultsVisible, setQuizResultsVisible] = useState(false);
  const [currentQuizResults, setCurrentQuizResults] = useState<any>(null);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewForm] = Form.useForm();

  // Get assignments and quizzes for the current lesson
  const { 
    data: lessonAssignments, 
    isLoading: assignmentsLoading, 
    error: assignmentsError,
    refetch: refetchAssignments 
  } = assignmentAPI.useGetAssignmentsByLessonQuery(
    currentLesson?.id || "", 
    {
      skip: !currentLesson?.id || shouldSkipAPICalls,
    }
  );

  const { 
    data: lessonQuizzes, 
    isLoading: quizzesLoading, 
    refetch: refetchQuizzes 
  } = quizAPI.useGetQuizzesByLessonQuery(
    currentLesson?.id || "", 
    {
      skip: !currentLesson?.id || shouldSkipAPICalls,
    }
  );

  // Compute course data from modules with defensive coding
  const courseData = useMemo(() => {
    if (!modules || !Array.isArray(modules) || modules.length === 0) {
      return null;
    }
    
    // Create defensive copies and add null checks
    const safeModules = [...modules].filter(Boolean);
    
    const totalLessons = safeModules.reduce((acc, module) => {
      const lessons = module?.totalLessons || 0;
      return acc + (typeof lessons === 'number' ? lessons : 0);
    }, 0);
    
    const completedLessonsCount = safeModules.reduce((acc, module) => {
      const completed = module?.completedLessons || 0;
      return acc + (typeof completed === 'number' ? completed : 0);
    }, 0);
    
    const progress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
    
    const courseTitle = safeModules[0]?.title || safeModules[0]?.courseId || "Course";
    
    const result = {
      id: courseId,
      title: courseTitle,
      totalModules: safeModules.length,
      completedModules: safeModules.filter(m => m?.isCompleted === true).length,
      totalLessons,
      completedLessons: completedLessonsCount,
      progress,
      modules: safeModules.sort((a, b) => {
        const orderA = a?.moduleOrder || 0;
        const orderB = b?.moduleOrder || 0;
        return (typeof orderA === 'number' ? orderA : 0) - (typeof orderB === 'number' ? orderB : 0);
      })
    };
    
    return result;
  }, [modules, courseId]);

  // Authentication check
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated" || !session) {
      const callbackUrl = typeof window !== 'undefined' 
        ? encodeURIComponent(window.location.href)
        : encodeURIComponent(`/dashboard/student/courses/${courseId}/learn`);
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    if (session.user && !session.user.id) {
      api.error({
        message: "Access Denied",
        description: "Unable to verify your identity. Please log in again.",
        style: {
          backgroundColor: '#fff2f0',
          border: '1px solid #ff4d4f',
        }
      });
      router.push("/login");
      return;
    }
  }, [status, session, router, api]);

  // Initialize with last accessed lesson or first lesson
  useEffect(() => {
    if (courseData && Array.isArray(courseData.modules) && courseData.modules.length > 0 && !currentLesson) {
      try {
        let targetLesson = null;
        
        if (lastAccessedLesson?.lessonId) {
          for (const moduleItem of courseData.modules) {
            if (Array.isArray(moduleItem.lessons)) {
              const foundLesson = moduleItem.lessons.find(lesson => lesson.id === lastAccessedLesson.lessonId);
              if (foundLesson) {
                targetLesson = foundLesson;
                break;
              }
            }
          }
        }
        
        if (!targetLesson) {
          const allLessons = courseData.modules
            .flatMap(moduleItem => moduleItem.lessons || [])
            .sort((a, b) => (a.lessonOrder || 0) - (b.lessonOrder || 0));
          
          if (allLessons.length > 0) {
            targetLesson = allLessons[0];
          }
        }
        
        if (targetLesson) {
          setCurrentLesson(targetLesson);
          if (targetLesson.lessonType === 'video' && targetLesson.videoUrl) {
            setActiveTab("media");
          } else if (targetLesson.lessonType === 'audio' && targetLesson.audioUrl) {
            setActiveTab("media");
          } else {
            setActiveTab("content");
          }
        }
      } catch (error) {
        setCurrentLesson(null);
      }
    }
  }, [courseData, lastAccessedLesson]);

  // Refetch assignments and quizzes when lesson changes
  useEffect(() => {
    if (currentLesson?.id && !shouldSkipAPICalls) {
      refetchAssignments();
      refetchQuizzes();
    }
  }, [currentLesson?.id, shouldSkipAPICalls, refetchAssignments, refetchQuizzes]);

  // Initialize completed lessons from progress data
  useEffect(() => {
    if (progressData && Array.isArray(progressData)) {
      try {
        const completedLessonIds = [...progressData]
          .filter((progress: any) => progress.status === 'completed')
          .map((progress: any) => progress.lessonId);
        
        setCompletedLessons(new Set(completedLessonIds));
      } catch (error) {
        setCompletedLessons(new Set());
      }
    }
  }, [progressData]);

  // Initialize enrollment ID
  useEffect(() => {
    if (userEnrollments && Array.isArray(userEnrollments)) {
      const enrollment = userEnrollments.find((enrollment: any) => enrollment.courseId === courseId);
      if (enrollment?.id) {
        setEnrollmentId(enrollment.id);
      }
    }
  }, [userEnrollments, courseId]);

  // Handle lesson selection
  const handleLessonSelect = async (lesson: any) => {
    if (!lesson || lesson.id === currentLesson?.id) return;
    
    setLessonLoading(true);
    try {
      if (enrollmentId) {
        await updateLessonProgress({
          lessonId: lesson.id,
          courseId,
          enrollmentId,
          isCompleted: false,
          completionPercentage: 5,
          lastAccessedAt: new Date().toISOString(),
        }).unwrap();
      }
      
      setCurrentLesson(lesson);
      
      if (lesson.lessonType === 'video' && lesson.videoUrl) {
        setActiveTab("media");
      } else if (lesson.lessonType === 'audio' && lesson.audioUrl) {
        setActiveTab("media");
      } else {
        setActiveTab("content");
      }
      
      setSidebarVisible(false);
      
      setTimeout(() => setLessonLoading(false), 500);
    } catch (error) {
      setLessonLoading(false);
    }
  };

  // Handle lesson completion
  const handleCompleteLesson = async (lessonId: string) => {
    if (!enrollmentId) {
      api.error({
        message: "Enrollment Required",
        description: "You need to be enrolled in this course to mark lessons as complete.",
        style: {
          backgroundColor: '#fff2f0',
          border: '1px solid #ff4d4f',
        }
      });
      return;
    }

    try {
      await updateLessonProgress({
        lessonId,
        courseId,
        enrollmentId,
        isCompleted: true,
        completionPercentage: 100,
        lastAccessedAt: new Date().toISOString(),
      }).unwrap();

      setCompletedLessons(prev => new Set([...prev, lessonId]));
      
      api.success({
        message: "Lesson Completed! 🎉",
        description: "Great job! You've completed this lesson.",
        style: {
          backgroundColor: '#f6ffed',
          border: '1px solid #52c41a',
        }
      });
    } catch (error) {
      api.error({
        message: "Error",
        description: "Failed to mark lesson as complete. Please try again.",
        style: {
          backgroundColor: '#fff2f0',
          border: '1px solid #ff4d4f',
        }
      });
    }
  };

  // Navigation handlers
  const handleNextLesson = async () => {
    if (!currentLesson || !courseData) return;
    
    try {
      const allLessons = courseData.modules
        .flatMap(module => module.lessons || [])
        .sort((a, b) => (a.lessonOrder || 0) - (b.lessonOrder || 0));
      
      const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
      
      if (currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        await handleLessonSelect(nextLesson);
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const handlePreviousLesson = async () => {
    if (!currentLesson || !courseData) return;
    
    try {
      const allLessons = courseData.modules
        .flatMap(module => module.lessons || [])
        .sort((a, b) => (a.lessonOrder || 0) - (b.lessonOrder || 0));
      
      const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
      
      if (currentIndex > 0) {
        const prevLesson = allLessons[currentIndex - 1];
        await handleLessonSelect(prevLesson);
      }
    } catch (error) {
      // Handle error silently
    }
  };

  // Quiz handlers
  const handleQuizSubmit = async () => {
    if (!currentQuiz || !enrollmentId) return;

    try {
      const submission = await submitQuiz({
        quizId: currentQuiz.id,
        courseId,
        lessonId: currentLesson?.id || "",
        answers: JSON.stringify(quizAnswers),
        score: 0,
        maxScore: currentQuiz.questions?.length || 0,
        percentage: 0,
        correctAnswers: "0",
      }).unwrap();

      setQuizVisible(false);
      setQuizAnswers({});
      
      api.success({
        message: "Quiz Submitted! 🎉",
        description: "Your quiz has been submitted successfully.",
        style: {
          backgroundColor: '#f6ffed',
          border: '1px solid #52c41a',
        }
      });
    } catch (error) {
      api.error({
        message: "Submission Failed",
        description: "Failed to submit quiz. Please try again.",
        style: {
          backgroundColor: '#fff2f0',
          border: '1px solid #ff4d4f',
        }
      });
    }
  };

  const handleViewQuizResults = (quiz: any) => {
    const submission = userQuizSubmissions?.find((sub: any) => sub.quizId === quiz.id);
    if (submission) {
      setCurrentQuizResults({ quiz, submission });
      setQuizResultsVisible(true);
    }
  };

  // Assignment handlers
  const handleAssignmentSubmit = async (assignmentId: string, submissionData: any) => {
    if (!enrollmentId) return;

    try {
      await submitAssignment({
        assignmentId,
        courseId,
        maxScore: 100,
      }).unwrap();

      api.success({
        message: "Assignment Submitted! 🎉",
        description: "Your assignment has been submitted successfully.",
        style: {
          backgroundColor: '#f6ffed',
          border: '1px solid #52c41a',
        }
      });
    } catch (error) {
      api.error({
        message: "Submission Failed",
        description: "Failed to submit assignment. Please try again.",
        style: {
          backgroundColor: '#fff2f0',
          border: '1px solid #ff4d4f',
        }
      });
    }
  };

  // Review handlers
  const handleReviewSubmit = async (values: any) => {
    try {
      if (values.id) {
        await updateReview({
          id: values.id,
          ...values,
        }).unwrap();
      } else {
        await createReview({
          courseId,
          userId: session?.user?.id,
          ...values,
        }).unwrap();
      }

      setReviewVisible(false);
      reviewForm.resetFields();
      refetchReviews();
      
      api.success({
        message: "Review Submitted! 🎉",
        description: "Thank you for your review.",
        style: {
          backgroundColor: '#f6ffed',
          border: '1px solid #52c41a',
        }
      });
    } catch (error) {
      api.error({
        message: "Submission Failed",
        description: "Failed to submit review. Please try again.",
        style: {
          backgroundColor: '#fff2f0',
          border: '1px solid #ff4d4f',
        }
      });
    }
  };

  return {
    // State
    currentLesson,
    activeTab,
    sidebarVisible,
    loading,
    lessonLoading,
    completedLessons,
    enrollmentId,
    quizVisible,
    currentQuiz,
    quizAnswers,
    quizResultsVisible,
    currentQuizResults,
    reviewVisible,
    reviewForm,
    
    // Data
    courseData,
    modules,
    modulesLoading,
    modulesError,
    progressData,
    userEnrollments,
    courseReviews,
    lessonAssignments,
    assignmentsLoading,
    assignmentsError,
    lessonQuizzes,
    quizzesLoading,
    userQuizSubmissions,
    userAssignmentSubmissions,
    
    // Handlers
    handleLessonSelect,
    handleCompleteLesson,
    handleNextLesson,
    handlePreviousLesson,
    handleQuizSubmit,
    handleViewQuizResults,
    handleAssignmentSubmit,
    handleReviewSubmit,
    
    // Setters
    setActiveTab,
    setSidebarVisible,
    setQuizVisible,
    setCurrentQuiz,
    setQuizAnswers,
    setQuizResultsVisible,
    setCurrentQuizResults,
    setReviewVisible,
    
    // Context
    contextHolder,
    api,
    
    // Status
    status,
    session,
    shouldSkipAPICalls,
  };
};

