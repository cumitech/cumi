import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";

// Create a single base API instance
export const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    credentials: 'include',
  }),
  // Cache configuration
  keepUnusedDataFor: 60, // Keep cache for 60 seconds
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  refetchOnFocus: false, // Don't refetch when window regains focus
  refetchOnReconnect: true, // Refetch when reconnecting
  tagTypes: [
    "Post",
    "Tutorial",
    "TutorialSubcategory",
    "Course",
    "Event",
    "User",
    "Category",
    "Tag",
    "Assignment",
    "Quiz",
    "Module",
    "Lesson",
    "CourseEnrollment",
    "CourseProgress",
    "Comment",
    "Review",
    "Partner",
    "Service",
    "Banner",
    "PublicStats",
    "Stats",
    "Project",
    "Opportunity",
    "Professional",
    "EventRegistration",
    "CommentInteraction",
    "PostInteraction",
    "AssignmentSubmission",
    "QuizSubmission",
    "UserAssignmentSubmissions",
    "CourseAssignmentSubmissions",
    "UserQuizSubmissions",
    "CourseQuizSubmissions",
    "CourseModules",
    "LessonProgress",
    "CourseReviews",
    "UserReviews",
    "Referral",
  ],
  endpoints: () => ({}), // Endpoints will be injected
});


