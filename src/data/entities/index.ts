import sequelize from "@database/db-sequelize.config";
import { DataTypes } from "sequelize";

import defineBanner from "./banner";
import defineCategory from "./category";
import defineComment from "./comment";
import defineCommentInteraction from "./comment-interaction.entity";
import definePostInteraction from "./post-interaction.entity";
import defineCourse from "./course";
import defineTag from "./tag";
import defineEvent from "./event";
import defineEventTag from "./event_tag";
import defineEventRegistration from "./event-registration";
import defineLesson from "./lesson";
import defineOpportunity from "./opportunity";
import definePost from "./post";
import definePostTag from "./post_tag";
import defineProfessional from "./professional";
import defineProject from "./project";
import defineQuiz from "./quiz";
import defineRole from "./role";
import defineService from "./service";
import defineUser from "./user";
import defineSubscriber from "./subscriber";
import defineContactMessage from "./contact-message";
import definePartner from "./partner";
import defineCourseEnrollment from "./course-enrollment";
import defineModule from "./module.entity";
import defineAssignment from "./assignment.entity";
import defineCourseProgress from "./course-progress.entity";
import defineReview from "./review";
import defineQuizSubmission from "./quiz-submission";
import defineAssignmentSubmission from "./assignment-submission";
import defineMetaData from "./meta-data";
import defineReferral from "./referral";
import defineReferralClick from "./referral-click";
import defineTutorialSubcategory from "./tutorial-subcategory";
import defineTutorial from "./tutorial";

const Banner = defineBanner(sequelize, DataTypes);
const Category = defineCategory(sequelize, DataTypes);
const Comment = defineComment(sequelize, DataTypes);
const CommentInteraction = defineCommentInteraction(sequelize, DataTypes);
const PostInteraction = definePostInteraction(sequelize, DataTypes);
const Tag = defineTag(sequelize, DataTypes);
const Course = defineCourse(sequelize, DataTypes);
const Event = defineEvent(sequelize, DataTypes);
const EventTag = defineEventTag(sequelize, DataTypes);
const EventRegistration = defineEventRegistration(sequelize, DataTypes);
const Post = definePost(sequelize, DataTypes);
const Lesson = defineLesson(sequelize, DataTypes);
const Opportunity = defineOpportunity(sequelize, DataTypes);
const PostTag = definePostTag(sequelize, DataTypes);
const Professional = defineProfessional(sequelize, DataTypes);
const Project = defineProject(sequelize, DataTypes);
const Quiz = defineQuiz(sequelize, DataTypes);
const Role = defineRole(sequelize, DataTypes);
const Service = defineService(sequelize, DataTypes);
const User = defineUser(sequelize, DataTypes);
const Subscriber = defineSubscriber(sequelize, DataTypes);
const ContactMessage = defineContactMessage(sequelize, DataTypes);
const Partner = definePartner(sequelize, DataTypes);
const CourseEnrollment = defineCourseEnrollment(sequelize, DataTypes);
const Module = defineModule(sequelize, DataTypes);
const Assignment = defineAssignment(sequelize, DataTypes);
const CourseProgress = defineCourseProgress(sequelize, DataTypes);
const Review = defineReview(sequelize, DataTypes);
const QuizSubmission = defineQuizSubmission(sequelize, DataTypes);
const AssignmentSubmission = defineAssignmentSubmission(sequelize, DataTypes);
const MetaData = defineMetaData(sequelize, DataTypes);
const Referral = defineReferral(sequelize, DataTypes);
const ReferralClick = defineReferralClick(sequelize, DataTypes);
const TutorialSubcategory = defineTutorialSubcategory(sequelize, DataTypes);
const Tutorial = defineTutorial(sequelize, DataTypes);

Event.belongsToMany(Tag, {
  through: {
    model: "event_tags",
    unique: false,
  },
  foreignKey: "eventId",
  otherKey: "tagId",
  timestamps: false,
}); // Many-to-many relationship
Tag.belongsToMany(Event, {
  through: {
    model: "event_tags",
    unique: false,
  },
  foreignKey: "tagId",
  otherKey: "eventId",
  timestamps: false,
});

Post.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Post, { foreignKey: "categoryId", as: "posts" });

Course.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Course, { foreignKey: "categoryId", as: "courses" });

Post.belongsToMany(Tag, {
  through: {
    model: "post_tags",
    unique: false,
  },
  foreignKey: "postId",
  otherKey: "tagId",
  timestamps: false,
  as: "tags",
}); // Many-to-many relationship
Tag.belongsToMany(Post, {
  through: {
    model: "post_tags",
    unique: false,
  },
  foreignKey: "tagId",
  otherKey: "postId",
  timestamps: false,
  as: "posts",
});

User.hasMany(Banner, { foreignKey: "userId" });
Banner.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

User.hasMany(Service, { foreignKey: "userId" });
Service.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Project, { foreignKey: "userId" });
Project.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Event, { foreignKey: "userId" });
Event.belongsTo(User, { foreignKey: "userId" });

// Comment associations
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" });
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" });

// Comment Interaction associations
User.hasMany(CommentInteraction, { foreignKey: "userId", as: "commentInteractions" });
CommentInteraction.belongsTo(User, { foreignKey: "userId", as: "user" });

Comment.hasMany(CommentInteraction, { foreignKey: "commentId", as: "interactions" });
CommentInteraction.belongsTo(Comment, { foreignKey: "commentId", as: "comment" });

// Post Interaction associations
User.hasMany(PostInteraction, { foreignKey: "userId", as: "postInteractions" });
PostInteraction.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.hasMany(PostInteraction, { foreignKey: "postId", as: "interactions" });
PostInteraction.belongsTo(Post, { foreignKey: "postId", as: "post" });

// Tutorial associations
User.hasMany(Tutorial, { foreignKey: "authorId", as: "tutorials" });
Tutorial.belongsTo(User, { foreignKey: "authorId", as: "User" });

TutorialSubcategory.hasMany(Tutorial, { foreignKey: "subcategoryId", as: "tutorials" });
Tutorial.belongsTo(TutorialSubcategory, { foreignKey: "subcategoryId", as: "Subcategory" });

// Course associations
User.hasMany(Course, { foreignKey: "userId", as: "courses" });
Course.belongsTo(User, { foreignKey: "userId", as: "instructor" });

// Module associations
Course.hasMany(Module, { foreignKey: "courseId", as: "modules" });
Module.belongsTo(Course, { foreignKey: "courseId", as: "moduleCourse" });

User.hasMany(Module, { foreignKey: "userId", as: "modules" });
Module.belongsTo(User, { foreignKey: "userId", as: "instructor" });

// Module-Lesson associations
Module.hasMany(Lesson, { foreignKey: "moduleId", as: "lessons" });
Lesson.belongsTo(Module, { foreignKey: "moduleId", as: "module" });

// Assignment associations
Course.hasMany(Assignment, { foreignKey: "courseId", as: "assignments" });
Assignment.belongsTo(Course, { foreignKey: "courseId", as: "assignmentCourse" });

Module.hasMany(Assignment, { foreignKey: "moduleId", as: "assignments" });
Assignment.belongsTo(Module, { foreignKey: "moduleId", as: "module" });

Lesson.hasMany(Assignment, { foreignKey: "lessonId", as: "assignments" });
Assignment.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

User.hasMany(Assignment, { foreignKey: "userId", as: "assignments" });
Assignment.belongsTo(User, { foreignKey: "userId", as: "instructor" });

// Lesson-Quiz associations
Lesson.hasMany(Quiz, { foreignKey: "lessonId", as: "quizzes" });
Quiz.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

// Course Progress associations
CourseEnrollment.hasMany(CourseProgress, { foreignKey: "enrollmentId", as: "courseProgress" });
CourseProgress.belongsTo(CourseEnrollment, { foreignKey: "enrollmentId", as: "enrollment" });

Course.hasMany(CourseProgress, { foreignKey: "courseId", as: "courseProgress" });
CourseProgress.belongsTo(Course, { foreignKey: "courseId", as: "progressCourse" });

User.hasMany(CourseProgress, { foreignKey: "userId", as: "courseProgress" });
CourseProgress.belongsTo(User, { foreignKey: "userId", as: "user" });

Module.hasMany(CourseProgress, { foreignKey: "moduleId", as: "courseProgress" });
CourseProgress.belongsTo(Module, { foreignKey: "moduleId", as: "module" });

Lesson.hasMany(CourseProgress, { foreignKey: "lessonId", as: "courseProgress" });
CourseProgress.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

Quiz.hasMany(CourseProgress, { foreignKey: "quizId", as: "courseProgress" });
CourseProgress.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

Assignment.hasMany(CourseProgress, { foreignKey: "assignmentId", as: "courseProgress" });
CourseProgress.belongsTo(Assignment, { foreignKey: "assignmentId", as: "assignment" });

// Event Registration associations
Event.hasMany(EventRegistration, { foreignKey: "eventId", as: "registrations" });
EventRegistration.belongsTo(Event, { foreignKey: "eventId", as: "event" });

User.hasMany(EventRegistration, { foreignKey: "userId", as: "eventRegistrations" });
EventRegistration.belongsTo(User, { foreignKey: "userId", as: "user" });

// Review associations
Course.hasMany(Review, { foreignKey: "courseId", as: "reviews" });
Review.belongsTo(Course, { foreignKey: "courseId", as: "reviewCourse" });

User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// Quiz Submission associations
User.hasMany(QuizSubmission, { foreignKey: "userId", as: "quizSubmissions" });
QuizSubmission.belongsTo(User, { foreignKey: "userId", as: "user" });

Quiz.hasMany(QuizSubmission, { foreignKey: "quizId", as: "submissions" });
QuizSubmission.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

Lesson.hasMany(QuizSubmission, { foreignKey: "lessonId", as: "quizSubmissions" });
QuizSubmission.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

Course.hasMany(QuizSubmission, { foreignKey: "courseId", as: "quizSubmissions" });
QuizSubmission.belongsTo(Course, { foreignKey: "courseId", as: "quizSubmissionCourse" });

Module.hasMany(QuizSubmission, { foreignKey: "moduleId", as: "quizSubmissions" });
QuizSubmission.belongsTo(Module, { foreignKey: "moduleId", as: "module" });

// Assignment Submission associations
User.hasMany(AssignmentSubmission, { foreignKey: "userId", as: "assignmentSubmissions" });
AssignmentSubmission.belongsTo(User, { foreignKey: "userId", as: "user" });

Assignment.hasMany(AssignmentSubmission, { foreignKey: "assignmentId", as: "submissions" });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: "assignmentId", as: "assignment" });

Course.hasMany(AssignmentSubmission, { foreignKey: "courseId", as: "assignmentSubmissions" });
AssignmentSubmission.belongsTo(Course, { foreignKey: "courseId", as: "assignmentSubmissionCourse" });

// Referral associations
Referral.hasMany(ReferralClick, { foreignKey: "referralId", as: "clicks" });
ReferralClick.belongsTo(Referral, { foreignKey: "referralId", as: "referral" });

User.hasMany(ReferralClick, { foreignKey: "userId", as: "referralClicks" });
ReferralClick.belongsTo(User, { foreignKey: "userId", as: "user" });

Module.hasMany(AssignmentSubmission, { foreignKey: "moduleId", as: "assignmentSubmissions" });
AssignmentSubmission.belongsTo(Module, { foreignKey: "moduleId", as: "module" });

Lesson.hasMany(AssignmentSubmission, { foreignKey: "lessonId", as: "assignmentSubmissions" });
AssignmentSubmission.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

// Grader association for assignment submissions
AssignmentSubmission.belongsTo(User, { foreignKey: "gradedBy", as: "grader" });

export {
  Banner,
  Category,
  Comment,
  CommentInteraction,
  PostInteraction,
  Course,
  Event,
  EventTag,
  EventRegistration,
  Lesson,
  Opportunity,
  PostTag,
  Post,
  Professional,
  Project,
  Quiz,
  Role,
  Service,
  User,
  Tag,
  Subscriber,
  ContactMessage,
  Partner,
  CourseEnrollment,
  Module,
  Assignment,
  CourseProgress,
  Review,
  QuizSubmission,
  AssignmentSubmission,
  MetaData,
  Referral,
  ReferralClick,
  TutorialSubcategory,
  Tutorial
};

