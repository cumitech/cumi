import {
  Banner,
  Category,
  Comment,
  Course,
  Event,
  EventTag,
  Lesson,
  Opportunity,
  Post,
  Project,
  Quiz,
  Role,
  Service,
  Tag,
  User,
  Professional,
  Partner,
  Module,
  Assignment,
  CourseProgress,
  Review,
  QuizSubmission,
  AssignmentSubmission,
  Referral,
  ReferralClick,
  MetaData,
} from "@data/entities/index";

import { IBanner } from "@domain/models/banner.model";
import { ICategory } from "@domain/models/category";
import { IComment } from "@domain/models/comment.model";
import { ICourse } from "@domain/models/course";
import { IEvent } from "@domain/models/event.model";
import { ILesson } from "@domain/models/lesson";
import { IOpportunity } from "@domain/models/opportunity.model";
import { IPost } from "@domain/models/post.model";
import { IProfessional } from "@domain/models/professional.model";
import { IProject } from "@domain/models/project.model";
import { IQuiz } from "@domain/models/quiz";
import { IRole } from "@domain/models/role.model";
import { IService } from "@domain/models/service.model";
import { ITag } from "@domain/models/tag";
import { IUser } from "@domain/models/user";
import { IPartner } from "@domain/models/partner.model";
import { IModule } from "@domain/models/module.model";
import { IAssignment } from "@domain/models/assignment.model";
import { ICourseProgress } from "@domain/models/course-progress.model";
import { IReview } from "@domain/models/review.model";
import { IQuizSubmission } from "@domain/models/quiz-submission.model";
import { IAssignmentSubmission } from "@domain/models/assignment-submission.model";
import { IReferral, IReferralClick } from "@domain/models/referral.model";
import { IMetaData } from "@domain/models/meta-data.model";

export class CategoryMapper {
  toDTO(category: InstanceType<typeof Category>): ICategory {
    const entity = category.toJSON<ICategory>();
    return entity;
  }
  toDTOs(categories: InstanceType<typeof Category>[]): ICategory[] {
    const _categories = categories.map((category) => {
      const entity = category.toJSON<ICategory>();
      return entity;
    });
    return _categories;
  }
}

export class PostMapper {
  toDTO(post: InstanceType<typeof Post>): IPost {
    const entity = post.toJSON<IPost>();
    return entity;
  }
  toDTOs(posts: InstanceType<typeof Post>[]): IPost[] {
    const _posts = posts.map((post) => {
      const entity = post.toJSON<IPost>();
      return entity;
    });
    return _posts;
  }
}

export class OpportunityMapper {
  toDTO(opportunity: InstanceType<typeof Opportunity>): IOpportunity {
    const entity = opportunity.toJSON<IOpportunity>();
    return entity;
  }
  toDTOs(opportunities: InstanceType<typeof Opportunity>[]): IOpportunity[] {
    const _opportunities = opportunities.map((opportunity) => {
      const entity = opportunity.toJSON<IOpportunity>();
      return entity;
    });
    return _opportunities;
  }
}

export class TagMapper {
  toDTO(tag: InstanceType<typeof Tag>): ITag {
    const entity = tag.toJSON<ITag>();
    return entity;
  }
  toDTOs(tags: InstanceType<typeof Tag>[]): ITag[] {
    const _tags = tags.map((tag) => {
      const entity = tag.toJSON<ITag>();
      return entity;
    });
    return _tags;
  }
}

export class UserMapper {
  toDTO(user: InstanceType<typeof User>): IUser {
    const entity = user.toJSON<IUser>();
    return entity;
  }
  toDTOs(users: InstanceType<typeof User>[]): IUser[] {
    const _users = users.map((user) => {
      const entity = user.toJSON<IUser>();
      return entity;
    });
    return _users;
  }
}

export class RoleMapper {
  toDTO(role: InstanceType<typeof Role>): IRole {
    const entity = role.toJSON<IRole>();
    return entity;
  }
  toDTOs(roles: InstanceType<typeof Role>[]): IRole[] {
    const _roles = roles.map((role) => {
      const entity = role.toJSON<IRole>();
      return entity;
    });
    return _roles;
  }
}
export class ProjectMapper {
  toDTO(project: InstanceType<typeof Project>): IProject {
    const entity = project.toJSON<IProject>();
    return entity;
  }
  toDTOs(projects: InstanceType<typeof Project>[]): IProject[] {
    const _projects = projects.map((project) => {
      const entity = project.toJSON<IProject>();
      return entity;
    });
    return _projects;
  }
}
export class BannerMapper {
  toDTO(banner: InstanceType<typeof Banner>): IBanner {
    const entity = banner.toJSON<IBanner>();
    return entity;
  }
  toDTOs(banners: InstanceType<typeof Banner>[]): IBanner[] {
    const _banners = banners.map((banner) => {
      const entity = banner.toJSON<IBanner>();
      return entity;
    });
    return _banners;
  }
}

export class EventMapper {
  toDTO(event: InstanceType<typeof Event>): IEvent {
    const entity = event.toJSON<IEvent>();
    return entity;
  }
  toDTOs(events: InstanceType<typeof Event>[]): IEvent[] {
    const _events = events.map((event) => {
      const entity = event.toJSON<IEvent>();
      return entity;
    });
    return _events;
  }
}

export class ServiceMapper {
  toDTO(service: InstanceType<typeof Service>): IService {
    const entity = service.toJSON<IService>();
    return {
      ...entity,
      items: JSON.parse(JSON.stringify((service as any).items as any)),
    };
  }
  toDTOs(services: InstanceType<typeof Service>[]): IService[] {
    const _services = services.map((service) => {
      const entity = service.toJSON<IService>();
      return {
        ...entity,
        items: JSON.parse(JSON.stringify((service as any).items as any)),
      }
    });
    return _services;
  }
}

export class CourseMapper {
  toDTO(course: InstanceType<typeof Course>): ICourse {
    const entity = JSON.parse(JSON.stringify(course.get()));
    return entity;
  }
  toDTOs(courses: InstanceType<typeof Course>[]): ICourse[] {
    const _courses = courses.map((course) => {
      const entity = JSON.parse(JSON.stringify(course.get()));
      return entity;
    });
    return _courses;
  }
}

export class LessonMapper {
  toDTO(lesson: InstanceType<typeof Lesson>): ILesson {
    const entity = lesson.toJSON<ILesson>();
    return entity;
  }
  toDTOs(lessons: InstanceType<typeof Lesson>[]): ILesson[] {
    const _lessons = lessons.map((lesson) => {
      const entity = lesson.toJSON<ILesson>();
      return entity;
    });
    return _lessons;
  }
}

export class QuizMapper {
  toDTO(quiz: InstanceType<typeof Quiz>): IQuiz {
    const entity = quiz.toJSON<IQuiz>();
    return entity;
  }
  toDTOs(quizes: InstanceType<typeof Quiz>[]): IQuiz[] {
    const _quizes = quizes.map((quiz) => {
      const entity = quiz.toJSON<IQuiz>();
      return entity;
    });
    return _quizes;
  }
}

export class ProfessionalMapper {
  toDTO(professional: InstanceType<typeof Professional>): IProfessional {
    const entity = professional.toJSON<IProfessional>();
    return entity;
  }
  toDTOs(professionals: InstanceType<typeof Professional>[]): IProfessional[] {
    const _professionals = professionals.map((professional) => {
      const entity = professional.toJSON<IProfessional>();
      return entity;
    });
    return _professionals;
  }
}

export class PartnerMapper {
  toDTO(partner: InstanceType<typeof Partner>): IPartner {
    const entity = partner.toJSON<IPartner>();
    return entity;
  }
  toDTOs(partners: InstanceType<typeof Partner>[]): IPartner[] {
    const _partners = partners.map((partner) => {
      const entity = partner.toJSON<IPartner>();
      return entity;
    });
    return _partners;
  }
}

export class CommentMapper {
  toDTO(comment: InstanceType<typeof Comment>): IComment {
    const entity = comment.toJSON<IComment>();
    return entity;
  }
  toDTOs(comments: InstanceType<typeof Comment>[]): IComment[] {
    const _comments = comments.map((comment) => {
      const entity = comment.toJSON<IComment>();
      return entity;
    });
    return _comments;
  }
}

export class ModuleMapper {
  toDTO(module: InstanceType<typeof Module>): IModule {
    const entity = JSON.parse(JSON.stringify(module.get()));
    return entity;
  }
  toDTOs(modules: InstanceType<typeof Module>[]): IModule[] {
    const _modules = modules.map((module) => {
      const entity = JSON.parse(JSON.stringify(module.get()));
      return entity;
    });
    return _modules;
  }
}

export class AssignmentMapper {
  toDTO(assignment: InstanceType<typeof Assignment>): IAssignment {
    const entity = JSON.parse(JSON.stringify(assignment.get()));
    return entity;
  }
  toDTOs(assignments: InstanceType<typeof Assignment>[]): IAssignment[] {
    const _assignments = assignments.map((assignment) => {
      const entity = JSON.parse(JSON.stringify(assignment.get()));
      return entity;
    });
    return _assignments;
  }
}

export class CourseProgressMapper {
  toDTO(progress: InstanceType<typeof CourseProgress>): ICourseProgress {
    const entity = JSON.parse(JSON.stringify(progress.get()));
    return entity;
  }
  toDTOs(progresses: InstanceType<typeof CourseProgress>[]): ICourseProgress[] {
    const _progresses = progresses.map((progress) => {
      const entity = JSON.parse(JSON.stringify(progress.get()));
      return entity;
    });
    return _progresses;
  }
}

export class ReviewMapper {
  toDTO(review: InstanceType<typeof Review>): IReview {
    const entity = JSON.parse(JSON.stringify(review.get()));
    return entity;
  }

  toDTOs(reviews: InstanceType<typeof Review>[]): IReview[] {
    const _reviews = reviews.map((review) => {
      const entity = JSON.parse(JSON.stringify(review.get()));
      return entity;
    });
    return _reviews;
  }
}

export class QuizSubmissionMapper {
  toDTO(submission: InstanceType<typeof QuizSubmission>): IQuizSubmission {
    const entity = submission.toJSON<IQuizSubmission>();
    return entity;
  }

  toDTOs(submissions: InstanceType<typeof QuizSubmission>[]): IQuizSubmission[] {
    const _submissions = submissions.map((submission) => {
      const entity = submission.toJSON<IQuizSubmission>();
      return entity;
    });
    return _submissions;
  }
}

export class AssignmentSubmissionMapper {
  toDTO(submission: InstanceType<typeof AssignmentSubmission>): IAssignmentSubmission {
    const entity = submission.toJSON<IAssignmentSubmission>();
    return entity;
  }

  toDTOs(submissions: InstanceType<typeof AssignmentSubmission>[]): IAssignmentSubmission[] {
    const _submissions = submissions.map((submission) => {
      const entity = submission.toJSON<IAssignmentSubmission>();
      return entity;
    });
    return _submissions;
  }
}

export class ReferralMapper {
  toDTO(referral: InstanceType<typeof Referral>): IReferral {
    const entity = referral.toJSON<IReferral>();
    return entity;
  }

  toDTOs(referrals: InstanceType<typeof Referral>[]): IReferral[] {
    const _referrals = referrals.map((referral) => {
      const entity = referral.toJSON<IReferral>();
      return entity;
    });
    return _referrals;
  }
}

export class ReferralClickMapper {
  toDTO(click: InstanceType<typeof ReferralClick>): IReferralClick {
    const entity = click.toJSON<IReferralClick>();
    return entity;
  }

  toDTOs(clicks: InstanceType<typeof ReferralClick>[]): IReferralClick[] {
    const _clicks = clicks.map((click) => {
      const entity = click.toJSON<IReferralClick>();
      return entity;
    });
    return _clicks;
  }
}

export class MetaDataMapper {
  toDTO(metaData: InstanceType<typeof MetaData>): IMetaData {
    const entity = metaData.toJSON() as any;
    
    // Convert keywords string to array if needed
    if (entity.keywords && typeof entity.keywords === 'string') {
      try {
        entity.keywords = JSON.parse(entity.keywords);
      } catch {
        entity.keywords = entity.keywords.split(',').map((k: string) => k.trim());
      }
    } else if (!entity.keywords) {
      entity.keywords = [];
    }
    
    // Parse customSchema if it's a string
    if (entity.customSchema && typeof entity.customSchema === 'string') {
      try {
        entity.customSchema = JSON.parse(entity.customSchema);
      } catch {
        // Keep as string if parsing fails
      }
    }
    
    return entity;
  }

  toDTOs(metaDataList: InstanceType<typeof MetaData>[]): IMetaData[] {
    const _metaDataList = metaDataList.map((metaData) => this.toDTO(metaData));
    return _metaDataList;
  }
}

