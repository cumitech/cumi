// models/PostInteraction.ts
import { Sequelize } from "sequelize";

const PostInteraction = (sequelizeInstance: Sequelize, DataTypes: any) => {
  const PostInteractionModel = sequelizeInstance.define(
    "PostInteraction",
    {
      id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
      postId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'postId', // Explicit field mapping
        references: {
          model: 'posts',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'userId', // Explicit field mapping
        references: {
          model: 'users',
          key: 'id',
        },
      },
      action: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
        field: 'action', // Explicit field mapping
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at', // Map to snake_case column name
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at', // Map to snake_case column name
      },
    },
    {
      tableName: "post_interactions",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['postId', 'userId'],
          name: 'unique_post_user_interaction',
        },
        {
          fields: ['postId'],
        },
        {
          fields: ['userId'],
        },
      ],
    }
  );

  return PostInteractionModel;
};

export default PostInteraction;

