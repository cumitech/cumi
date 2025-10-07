import { IQuiz } from "@domain/models/quiz";
import { IQuizRepository } from "../contracts/repository.base";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { Quiz } from "../../entities/index";

export class QuizRepository implements IQuizRepository {
  /**
   *
   */
  constructor() {}

  /**
   * Receives a Quiz as parameter
   * @quiz
   * returns void
   */
  async create(quiz: IQuiz): Promise<InstanceType<typeof Quiz>> {
    try {
      return await Quiz.create<InstanceType<typeof Quiz>>({ ...quiz });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Quiz
   */
  async findById(id: string): Promise<InstanceType<typeof Quiz> | null> {
    try {
      const quizItem = await Quiz.findByPk(id);

      if (!quizItem) {
        throw new NotFoundException("Quiz", id);
      }
      return quizItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns Quiz
   */
  async findByQuestion(question: string): Promise<InstanceType<typeof Quiz> | null> {
    try {
      const quizItem = await Quiz.findOne({ where: { question } });
      return quizItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Quiz> | null> {
    try {
      const quiz = await Quiz.findOne({
        where: { slug },
      });
      return quiz;
    } catch (error) {
      throw error;
    }
  }

  async findByLessonId(lessonId: string): Promise<InstanceType<typeof Quiz>[]> {
    try {
      const quizes = await Quiz.findAll({
        where: { lessonId },
        order: [['quiz_order', 'ASC']],
      });
      return quizes;
    } catch (error) {
      throw error;
    }
  }

  async findByModuleId(moduleId: string): Promise<InstanceType<typeof Quiz>[]> {
    try {
      // Quizzes are linked to lessons, not directly to modules
      // We need to get all lessons for this module first, then get quizzes for those lessons
      const { Lesson } = require('../../entities/index');
      const lessons = await Lesson.findAll({
        where: { moduleId },
        attributes: ['id'],
      });
      
      if (!lessons || lessons.length === 0) {
        return [];
      }
      
      const lessonIds = lessons.map((lesson: any) => lesson.id);
      const quizes = await Quiz.findAll({
        where: { 
          lessonId: lessonIds 
        },
        order: [['quiz_order', 'ASC']],
      });
      return quizes;
    } catch (error) {
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<InstanceType<typeof Quiz>[]> {
    try {
      // Quizzes are linked to lessons, not directly to courses
      // We need to get all lessons for this course first, then get quizzes for those lessons
      const { Lesson } = require('../../entities/index');
      const lessons = await Lesson.findAll({
        where: { courseId },
        attributes: ['id'],
      });
      
      if (!lessons || lessons.length === 0) {
        return [];
      }
      
      const lessonIds = lessons.map((lesson: any) => lesson.id);
      const quizes = await Quiz.findAll({
        where: { 
          lessonId: lessonIds 
        },
        order: [['quiz_order', 'ASC']],
      });
      return quizes;
    } catch (error) {
      throw error;
    }
  }
  /*
   * Returns an array of Quiz
   */
  async getAll(): Promise<InstanceType<typeof Quiz>[]> {
    try {
      const categories = await Quiz.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Quiz as parameter
   * @quiz
   * returns void
   */
  async update(quiz: IQuiz): Promise<InstanceType<typeof Quiz>> {
    const { id } = quiz;
    try {
      const quizItem: any = await Quiz.findByPk(id);

      if (!quizItem) {
        throw new NotFoundException("Quiz", id.toString());
      }

      return await quizItem.update({ ...quiz });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a string as parameter
   * @id
   * returns void
   */
  async delete(id: string): Promise<void> {
    try {
      const quizItem = await Quiz.findByPk(id);

      if (!quizItem) {
        throw new NotFoundException("Quiz", id);
      }

      await quizItem.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

