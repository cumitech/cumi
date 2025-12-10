import { emailService } from "@services/email.service";
import { UserUseCase } from "@domain/usecases/user.usecase";
import { UserRepository } from "@data/repositories/impl/user.repository";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://cumi.dev';
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/http:\/\/localhost:3000/gi, 'https://cumi.dev');
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/http:\/\/localhost:3000/gi, 'https://cumi.dev');
  }
  return 'https://cumi.dev';
};

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  actionUrl?: string;
  type?: 'general' | 'course' | 'event' | 'system' | 'security';
}

export interface BulkNotificationData {
  userIds: string[];
  title: string;
  message: string;
  actionUrl?: string;
  type?: 'general' | 'course' | 'event' | 'system' | 'security';
}

class NotificationService {
  async sendEmailNotification(data: NotificationData): Promise<boolean> {
    try {
      const user = await userUseCase.getUserById(data.userId) as any;
      if (!user) {
        console.error(`User not found: ${data.userId}`);
        return false;
      }

      if (!user.emailNotifications) {
        return false;
      }

      await emailService.sendNotificationEmail(
        user.email,
        user.fullName || user.username,
        data.title,
        data.message,
        data.actionUrl
      );

      return true;
    } catch (error) {
      console.error(`Failed to send email notification to user ${data.userId}:`, error);
      return false;
    }
  }

  async sendBulkEmailNotification(data: BulkNotificationData): Promise<{
    successCount: number;
    failureCount: number;
    results: Array<{ userId: string; success: boolean; error?: string }>;
  }> {
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const userId of data.userIds) {
      try {
        const success = await this.sendEmailNotification({
          ...data,
          userId
        });
        
        results.push({
          userId,
          success,
          error: success ? undefined : 'Failed to send notification'
        });

        if (success) {
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        results.push({
          userId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        failureCount++;
      }
    }

    return {
      successCount,
      failureCount,
      results
    };
  }

  async notifyCourseEnrollment(userId: string, courseTitle: string, courseUrl?: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Course Enrollment Confirmed",
      message: `You have successfully enrolled in the course "${courseTitle}". You can now access all course materials and start learning!`,
      actionUrl: courseUrl,
      type: 'course'
    });
  }

  async notifyCourseCompletion(userId: string, courseTitle: string, certificateUrl?: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Course Completed!",
      message: `Congratulations! You have successfully completed the course "${courseTitle}". Your certificate is now available for download.`,
      actionUrl: certificateUrl,
      type: 'course'
    });
  }

  async notifyNewCourseLesson(userId: string, courseTitle: string, lessonTitle: string, lessonUrl?: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "New Lesson Available",
      message: `A new lesson "${lessonTitle}" has been added to the course "${courseTitle}". Check it out now!`,
      actionUrl: lessonUrl,
      type: 'course'
    });
  }

  async notifyEventRegistration(userId: string, eventTitle: string, eventUrl?: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Event Registration Confirmed",
      message: `You have successfully registered for the event "${eventTitle}". We look forward to seeing you there!`,
      actionUrl: eventUrl,
      type: 'event'
    });
  }

  async notifyEventReminder(userId: string, eventTitle: string, eventDate: string, eventUrl?: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Event Reminder",
      message: `This is a reminder that you have an upcoming event "${eventTitle}" on ${eventDate}. Don't miss it!`,
      actionUrl: eventUrl,
      type: 'event'
    });
  }

  async notifySystemMaintenance(userId: string, maintenanceDate: string, duration: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Scheduled System Maintenance",
      message: `We will be performing scheduled maintenance on ${maintenanceDate} for approximately ${duration}. The system may be temporarily unavailable during this time.`,
      type: 'system'
    });
  }

  async notifySecurityAlert(userId: string, alertType: string, details: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Security Alert",
      message: `Security Alert: ${alertType}. ${details}. If this was not you, please contact support immediately.`,
      type: 'security'
    });
  }

  async notifyWelcome(userId: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Welcome to Our Platform!",
      message: "Welcome to our platform! We're excited to have you on board. Explore our courses, events, and connect with other learners.",
      actionUrl: '/dashboard',
      type: 'general'
    });
  }

  async notifyNewsletterSubscription(email: string, name: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId: '',
      title: "Welcome to CUMI Newsletter!",
      message: `Thank you for subscribing to our newsletter! You'll now receive updates about our latest courses, events, and educational content. We're excited to have you as part of our learning community.`,
      actionUrl: `${getBaseUrl()}/dashboard`,
      type: 'general'
    });
  }

  async notifyContactSubmission(email: string, name: string, subject: string, message: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId: '',
      title: "Thank You for Contacting CUMI",
      message: `Thank you for reaching out to us! We have received your message regarding "${subject}" and our team will get back to you within 24 hours. We appreciate your interest in our services and look forward to assisting you.`,
      actionUrl: `${getBaseUrl()}/contact`,
      type: 'general'
    });
  }

  async notifyAdminContactMessage(name: string, email: string, subject: string, message: string, phone?: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId: '',
      title: "New Contact Message Received",
      message: `A new contact message has been received from ${name} (${email}).\n\nSubject: ${subject || 'No subject'}\nMessage: ${message}\n\nPhone: ${phone || 'Not provided'}`,
      actionUrl: `${getBaseUrl()}/dashboard/contact-messages`,
      type: 'system'
    });
  }

  async notifyLessonCompletion(userId: string, lessonTitle: string, courseTitle: string, nextLessonUrl?: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Lesson Completed!",
      message: `Great job! You've completed the lesson "${lessonTitle}" in the course "${courseTitle}". ${nextLessonUrl ? 'Ready for the next lesson?' : 'You\'re making great progress!'}`,
      actionUrl: nextLessonUrl,
      type: 'course'
    });
  }

  async notifyAssignmentSubmission(userId: string, assignmentTitle: string, courseTitle: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Assignment Submitted",
      message: `Your assignment "${assignmentTitle}" for the course "${courseTitle}" has been submitted successfully. You'll receive feedback soon!`,
      actionUrl: `${getBaseUrl()}/dashboard`,
      type: 'course'
    });
  }

  async notifyQuizCompletion(userId: string, quizTitle: string, score: number, courseTitle: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Quiz Completed!",
      message: `You've completed the quiz "${quizTitle}" in "${courseTitle}" with a score of ${score}%. ${score >= 80 ? 'Excellent work!' : 'Keep studying to improve your score!'}`,
      actionUrl: `${getBaseUrl()}/dashboard`,
      type: 'course'
    });
  }

  async notifyPaymentSuccess(userId: string, amount: number, itemName: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Payment Successful",
      message: `Your payment of $${amount} for "${itemName}" has been processed successfully. Thank you for your purchase!`,
      actionUrl: `${getBaseUrl()}/dashboard`,
      type: 'system'
    });
  }

  async notifyAccountStatusChange(userId: string, status: string, reason?: string): Promise<boolean> {
    return this.sendEmailNotification({
      userId,
      title: "Account Status Update",
      message: `Your account status has been updated to "${status}". ${reason ? `Reason: ${reason}` : 'Please contact support if you have any questions.'}`,
      actionUrl: `${getBaseUrl()}/dashboard/settings`,
      type: 'security'
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;

