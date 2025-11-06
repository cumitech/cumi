// models/TutorialSubcategory.ts
import { Sequelize } from "sequelize";

const TutorialSubcategory = (sequelize: Sequelize, DataTypes: any) => {
  const TutorialSubcategoryModel = sequelize.define(
    "TutorialSubcategory",
    {
      id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING(7), // Hex color code
        allowNull: true,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "sort_order",
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
      tableName: "tutorial_subcategories",
      timestamps: true,
    }
  );

  TutorialSubcategoryModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return TutorialSubcategoryModel;
};

export default TutorialSubcategory;

