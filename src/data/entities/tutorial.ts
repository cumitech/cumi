enum TUTORIAL_STATUS {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}

// models/Tutorial.ts
import { Model, Sequelize } from "sequelize";

const Tutorial = (sequelize: Sequelize, DataTypes: any) => {
  const TutorialModel = sequelize.define(
    "Tutorial",
    {
      id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      subcategoryId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "subcategory_id",
      },
      status: {
        type: DataTypes.ENUM("DRAFT", "PUBLISHED", "REJECTED"),
        allowNull: false,
        defaultValue: "DRAFT",
      },
      viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "view_count",
      },
      difficulty: {
        type: DataTypes.ENUM("BEGINNER", "INTERMEDIATE", "ADVANCED"),
        allowNull: true,
      },
      estimatedTime: {
        type: DataTypes.INTEGER, // in minutes
        allowNull: true,
        field: "estimated_time",
      },
      publishedAt: {
        type: DataTypes.DATE,
        field: "published_at",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      tableName: "tutorials",
      timestamps: true,
    }
  );

  // Add toJSON method to ensure proper serialization including associations
  TutorialModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return TutorialModel;
};

export default Tutorial;
