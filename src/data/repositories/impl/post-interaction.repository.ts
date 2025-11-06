import { IPostInteraction, IPostInteractionStats } from "@domain/models/post-interaction.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IPostInteractionRepository } from "../post-interaction.repository";
import { PostInteraction, User, Post } from "../../entities/index";
import { nanoid } from "nanoid";

export class PostInteractionRepository implements IPostInteractionRepository {
  constructor() {}

  async create(interaction: any, userId: string): Promise<IPostInteraction> {
    try {
      const id = nanoid(10);
      
      const createdInteraction = await PostInteraction.create<InstanceType<typeof PostInteraction>>({
        id,
        ...interaction,
        userId,
      });
      return this.mapToDomain(createdInteraction);
    } catch (error) {
      throw error;
    }
  }

  async findByPostId(postId: string): Promise<IPostInteraction[]> {
    try {
      const interactions = await PostInteraction.findAll({
        where: { postId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return interactions.map((interaction) => this.mapToDomain(interaction));
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<IPostInteraction[]> {
    try {
      const interactions = await PostInteraction.findAll({
        where: { userId },
        include: [
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "slug"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return interactions.map((interaction) => this.mapToDomain(interaction));
    } catch (error) {
      throw error;
    }
  }

  async findByPostAndUser(postId: string, userId: string): Promise<IPostInteraction | null> {
    try {
      const interaction = await PostInteraction.findOne({
        where: { postId, userId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "slug"],
          },
        ],
      });
      return interaction ? this.mapToDomain(interaction) : null;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, interaction: Partial<IPostInteraction>): Promise<IPostInteraction> {
    try {
      const existingInteraction = await PostInteraction.findByPk(id);
      if (!existingInteraction) {
        throw new NotFoundException("Post interaction not found", "POST_INTERACTION_NOT_FOUND");
      }

      await existingInteraction.update(interaction);
      return this.mapToDomain(existingInteraction);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const interaction = await PostInteraction.findByPk(id);
      if (!interaction) {
        throw new NotFoundException("Post interaction not found", "POST_INTERACTION_NOT_FOUND");
      }
      await interaction.destroy();
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<IPostInteraction[]> {
    try {
      const interactions = await PostInteraction.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "slug"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return interactions.map((interaction) => this.mapToDomain(interaction));
    } catch (error) {
      throw error;
    }
  }

  async getStats(postId: string, userId?: string): Promise<IPostInteractionStats> {
    try {
      const likesCount = await PostInteraction.count({
        where: { postId, action: 'like' },
      });

      const dislikesCount = await PostInteraction.count({
        where: { postId, action: 'dislike' },
      });

      let userInteraction: 'like' | 'dislike' | null = null;
      if (userId) {
        const userInteractionRecord = await PostInteraction.findOne({
          where: { postId, userId },
        }) as any;
        userInteraction = userInteractionRecord ? userInteractionRecord.action : null;
      }

      return {
        postId,
        likesCount,
        dislikesCount,
        userInteraction,
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      // Return zeros if query fails (e.g., table doesn't exist)
      return {
        postId,
        likesCount: 0,
        dislikesCount: 0,
        userInteraction: null,
      };
    }
  }

  private mapToDomain(interaction: any): IPostInteraction {
    return {
      id: interaction.id,
      postId: interaction.postId,
      userId: interaction.userId,
      action: interaction.action,
      createdAt: interaction.createdAt,
      updatedAt: interaction.updatedAt,
    };
  }
}

