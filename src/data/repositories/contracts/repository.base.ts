import { IBanner } from "@domain/models/banner.model";
import { ICategory } from "@domain/models/category";
import { ICourse } from "@domain/models/course";
import { ICourseEnrollment } from "@domain/models/course-enrollment.model";
import { IEvent } from "@domain/models/event.model";
import { ILesson } from "@domain/models/lesson";
import { IOpportunity } from "@domain/models/opportunity.model";
import { IPost } from "@domain/models/post.model";
import { IProject } from "@domain/models/project.model";
import { IQuiz } from "@domain/models/quiz";
import { IRole } from "@domain/models/role.model";
import { IService } from "@domain/models/service.model";
import { ITag } from "@domain/models/tag";
import { IModule } from "@domain/models/module.model";
import { IAssignment } from "@domain/models/assignment.model";
import { ICourseProgress } from "@domain/models/course-progress.model";
import { IReview } from "@domain/models/review.model";
import { IQuizSubmission } from "@domain/models/quiz-submission.model";
import { IAssignmentSubmission } from "@domain/models/assignment-submission.model";
import { IUser } from "@domain/models/user";
import { IMetaData } from "@domain/models/meta-data.model";
import { ITutorialSubcategory } from "@domain/models/tutorial-subcategory.model";
import { ITutorial } from "@domain/models/tutorial.model";

import {
  Banner,
  Category,
  Course,
  CourseEnrollment,
  Event,
  EventTag,
  Lesson,
  Opportunity,
  Post,
  PostTag,
  Project,
  Quiz,
  Role,
  Service,
  User,
  Tag,
  Module,
  Assignment,
  CourseProgress,
  Review,
  QuizSubmission,
  AssignmentSubmission,
  MetaData,
  TutorialSubcategory,
  Tutorial,
} from "../../entities/index";

export interface IRepository<T, U> {
  create(category: T): Promise<U>;
  findById(id: string): Promise<U | null>;
  getAll(): Promise<U[]>;
  update(category: T): Promise<U>;
  delete(id: string): Promise<void>;
}

export interface IPostRepository
  extends IRepository<IPost, InstanceType<typeof Post>> {
  findByTitle(title: string): Promise<InstanceType<typeof Post> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Post> | null>;
  findByCategory(category: string): Promise<InstanceType<typeof Post>[] | null>;
  findByTag(tag: string): Promise<InstanceType<typeof Post>[] | null>;
  findPublished(): Promise<InstanceType<typeof Post>[]>;
}

export interface ICourseRepository
  extends IRepository<ICourse, InstanceType<typeof Course>> {
  findByTitle(title: string): Promise<InstanceType<typeof Course> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Course> | null>;
  findByCategory(
    category: string
  ): Promise<InstanceType<typeof Course>[] | null>;
}

export interface ILessonRepository
  extends IRepository<ILesson, InstanceType<typeof Lesson>> {
  findByTitle(title: string): Promise<InstanceType<typeof Lesson> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Lesson> | null>;
  findByCourseId(courseId: string): Promise<InstanceType<typeof Lesson>[]>;
  findByModuleId(moduleId: string): Promise<InstanceType<typeof Lesson>[]>;
}

export interface IModuleRepository
  extends IRepository<IModule, InstanceType<typeof Module>> {
  findByTitle(title: string): Promise<InstanceType<typeof Module> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Module> | null>;
  findByCourseId(courseId: string): Promise<InstanceType<typeof Module>[]>;
  findByUserId(userId: string): Promise<InstanceType<typeof Module>[]>;
  findByStatus(status: string): Promise<InstanceType<typeof Module>[]>;
  findByCourseIdWithLessons(courseId: string): Promise<InstanceType<typeof Module>[]>;
}

export interface IQuizRepository
  extends IRepository<IQuiz, InstanceType<typeof Quiz>> {
  findByQuestion(question: string): Promise<InstanceType<typeof Quiz> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Quiz> | null>;
  findByLessonId(lessonId: string): Promise<InstanceType<typeof Quiz>[]>;
  findByModuleId(moduleId: string): Promise<InstanceType<typeof Quiz>[]>;
  findByCourseId(courseId: string): Promise<InstanceType<typeof Quiz>[]>;
}

export interface IOpportunityRepository
  extends IRepository<IOpportunity, InstanceType<typeof Opportunity>> {
  findByTitle(title: string): Promise<InstanceType<typeof Opportunity> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Opportunity> | null>;
}

export interface ICategoryRepository
  extends IRepository<ICategory, InstanceType<typeof Category>> {
  findByName(name: string): Promise<InstanceType<typeof Category> | null>;
}

export interface IUserRepository
  extends IRepository<IUser, InstanceType<typeof User>> {
  findByUsername(username: string): Promise<InstanceType<typeof User> | null>;
  findByEmail(email: string): Promise<InstanceType<typeof User> | null>;
  findByResetToken(token: string): Promise<InstanceType<typeof User> | null>;
}
export interface IRoleRepository
  extends IRepository<IRole, InstanceType<typeof Role>> {
  findByName(name: string): Promise<InstanceType<typeof Role> | null>;
}
export interface ITagRepository
  extends IRepository<ITag, InstanceType<typeof Tag>> {
  findByName(name: string): Promise<InstanceType<typeof Tag> | null>;
}
export interface IProjectRepository
  extends IRepository<IProject, InstanceType<typeof Project>> {
  findByTitle(title: string): Promise<InstanceType<typeof Project> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Project> | null>;
}
export interface IServiceRepository
  extends IRepository<IService, InstanceType<typeof Service>> {
  findByTitle(title: string): Promise<InstanceType<typeof Service> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Service> | null>;
}
export interface IEventRepository
  extends IRepository<IEvent, InstanceType<typeof Event>> {
  findByTitle(title: string): Promise<InstanceType<typeof Event> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Event> | null>;
}

export interface IBannerRepository
  extends IRepository<IBanner, InstanceType<typeof Banner>> {
  findByTitle(title: string): Promise<InstanceType<typeof Banner> | null>;
}

export interface ICourseEnrollmentRepository
  extends IRepository<ICourseEnrollment, InstanceType<typeof CourseEnrollment>> {
  findByCourseAndUser(courseId: string, userId: string): Promise<InstanceType<typeof CourseEnrollment> | null>;
  findByCourseId(courseId: string): Promise<InstanceType<typeof CourseEnrollment>[]>;
  findByUserId(userId: string): Promise<InstanceType<typeof CourseEnrollment>[]>;
  updateProgress(id: string, progress: number): Promise<InstanceType<typeof CourseEnrollment> | null>;
  countByCourseId(courseId: string): Promise<number>;
}

export interface IModuleRepository
  extends IRepository<IModule, InstanceType<typeof Module>> {
  findByTitle(title: string): Promise<InstanceType<typeof Module> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Module> | null>;
  findByCourseId(courseId: string): Promise<InstanceType<typeof Module>[]>;
  findByUserId(userId: string): Promise<InstanceType<typeof Module>[]>;
  findByStatus(status: string): Promise<InstanceType<typeof Module>[]>;
}

export interface IAssignmentRepository
  extends IRepository<IAssignment, InstanceType<typeof Assignment>> {
  findByTitle(title: string): Promise<InstanceType<typeof Assignment> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Assignment> | null>;
  findByCourseId(courseId: string): Promise<InstanceType<typeof Assignment>[]>;
  findByModuleId(moduleId: string): Promise<InstanceType<typeof Assignment>[]>;
  findByLessonId(lessonId: string): Promise<InstanceType<typeof Assignment>[]>;
  findByUserId(userId: string): Promise<InstanceType<typeof Assignment>[]>;
  findByStatus(status: string): Promise<InstanceType<typeof Assignment>[]>;
  findByType(type: string): Promise<InstanceType<typeof Assignment>[]>;
}

export interface ICourseProgressRepository
  extends IRepository<ICourseProgress, InstanceType<typeof CourseProgress>> {
  findByEnrollmentId(enrollmentId: string): Promise<InstanceType<typeof CourseProgress>[]>;
  findByCourseId(courseId: string): Promise<InstanceType<typeof CourseProgress>[]>;
  findByUserId(userId: string): Promise<InstanceType<typeof CourseProgress>[]>;
  findByModuleId(moduleId: string): Promise<InstanceType<typeof CourseProgress>[]>;
  findByLessonId(lessonId: string): Promise<InstanceType<typeof CourseProgress>[]>;
  findByQuizId(quizId: string): Promise<InstanceType<typeof CourseProgress>[]>;
  findByAssignmentId(assignmentId: string): Promise<InstanceType<typeof CourseProgress>[]>;
  findByStatus(status: string): Promise<InstanceType<typeof CourseProgress>[]>;
  findByProgressType(progressType: string): Promise<InstanceType<typeof CourseProgress>[]>;
  updateProgress(id: string, progress: number): Promise<InstanceType<typeof CourseProgress> | null>;
  updateStatus(id: string, status: string): Promise<InstanceType<typeof CourseProgress> | null>;
}

export interface IReviewRepository
  extends IRepository<IReview, InstanceType<typeof Review>> {
  findByCourseId(courseId: string): Promise<InstanceType<typeof Review>[]>;
  findByUserId(userId: string): Promise<InstanceType<typeof Review>[]>;
  findByUserAndCourse(userId: string, courseId: string): Promise<InstanceType<typeof Review> | null>;
  findByStatus(status: string): Promise<InstanceType<typeof Review>[]>;
  findByRating(rating: number): Promise<InstanceType<typeof Review>[]>;
  findApprovedByCourseId(courseId: string): Promise<InstanceType<typeof Review>[]>;
  updateStatus(id: string, status: string, moderatorNotes?: string): Promise<InstanceType<typeof Review> | null>;
  incrementHelpfulVotes(id: string): Promise<InstanceType<typeof Review> | null>;
  getAverageRatingByCourseId(courseId: string): Promise<number>;
  getReviewStatsByCourseId(courseId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }>;
}

export interface IQuizSubmissionRepository
  extends IRepository<IQuizSubmission, InstanceType<typeof QuizSubmission>> {
  findByUserId(userId: string): Promise<InstanceType<typeof QuizSubmission>[]>;
  findByQuizId(quizId: string): Promise<InstanceType<typeof QuizSubmission>[]>;
  findByUserAndQuiz(userId: string, quizId: string): Promise<InstanceType<typeof QuizSubmission>[]>;
  findByCourseId(courseId: string): Promise<InstanceType<typeof QuizSubmission>[]>;
  findByUserAndCourse(userId: string, courseId: string): Promise<InstanceType<typeof QuizSubmission>[]>;
  findByLessonId(lessonId: string): Promise<InstanceType<typeof QuizSubmission>[]>;
  findByStatus(status: string): Promise<InstanceType<typeof QuizSubmission>[]>;
  getLatestAttempt(userId: string, quizId: string): Promise<InstanceType<typeof QuizSubmission> | null>;
  getUserQuizPerformance(userId: string, courseId: string): Promise<InstanceType<typeof QuizSubmission>[]>;
  getQuizStatistics(quizId: string): Promise<{
    totalSubmissions: number;
    averageScore: number;
    passRate: number;
  }>;
}

export interface IAssignmentSubmissionRepository
  extends IRepository<IAssignmentSubmission, InstanceType<typeof AssignmentSubmission>> {
  findByUserId(userId: string): Promise<InstanceType<typeof AssignmentSubmission>[]>;
  findByAssignmentId(assignmentId: string): Promise<InstanceType<typeof AssignmentSubmission>[]>;
  findByUserAndAssignment(userId: string, assignmentId: string): Promise<InstanceType<typeof AssignmentSubmission>[]>;
  findByCourseId(courseId: string): Promise<InstanceType<typeof AssignmentSubmission>[]>;
  findByUserAndCourse(userId: string, courseId: string): Promise<InstanceType<typeof AssignmentSubmission>[]>;
  findByStatus(status: string): Promise<InstanceType<typeof AssignmentSubmission>[]>;
  findByGrader(graderId: string): Promise<InstanceType<typeof AssignmentSubmission>[]>;
  getLatestAttempt(userId: string, assignmentId: string): Promise<InstanceType<typeof AssignmentSubmission> | null>;
  getUserAssignmentPerformance(userId: string, courseId: string): Promise<InstanceType<typeof AssignmentSubmission>[]>;
  getAssignmentStatistics(assignmentId: string): Promise<{
    totalSubmissions: number;
    averageScore: number;
    passRate: number;
  }>;
  updateGrade(id: string, score: number, feedback?: string, gradedBy?: string): Promise<InstanceType<typeof AssignmentSubmission> | null>;
}

export interface IMetaDataRepository
  extends IRepository<IMetaData, InstanceType<typeof MetaData>> {
  findByPage(page: string): Promise<InstanceType<typeof MetaData> | null>;
  findBySchemaType(schemaType: string): Promise<InstanceType<typeof MetaData>[]>;
  findByRobots(robots: string): Promise<InstanceType<typeof MetaData>[]>;
  findByAuthor(author: string): Promise<InstanceType<typeof MetaData>[]>;
  searchMetaData(searchTerm: string): Promise<InstanceType<typeof MetaData>[]>;
  findPublished(): Promise<InstanceType<typeof MetaData>[]>;
  findRecent(limit?: number): Promise<InstanceType<typeof MetaData>[]>;
  findOrCreate(metaData: IMetaData): Promise<[InstanceType<typeof MetaData>, boolean]>;
}

export interface ITutorialSubcategoryRepository
  extends IRepository<ITutorialSubcategory, InstanceType<typeof TutorialSubcategory>> {
  findBySlug(slug: string): Promise<InstanceType<typeof TutorialSubcategory> | null>;
  findByName(name: string): Promise<InstanceType<typeof TutorialSubcategory> | null>;
}

export interface ITutorialRepository
  extends IRepository<ITutorial, InstanceType<typeof Tutorial>> {
  findByTitle(title: string): Promise<InstanceType<typeof Tutorial> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Tutorial> | null>;
  findBySubcategory(subcategoryId: string): Promise<InstanceType<typeof Tutorial>[] | null>;
  findByAuthor(authorId: string): Promise<InstanceType<typeof Tutorial>[] | null>;
  findPublished(): Promise<InstanceType<typeof Tutorial>[]>;
}

