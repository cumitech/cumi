import { DataTypes, Sequelize } from "sequelize";

const Testimonial = (sequelize: Sequelize, DataTypes: any) => {
  const TestimonialModel = sequelize.define(
    "Testimonial",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quote: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      authorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authorRole: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
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
      tableName: "testimonials",
      timestamps: true,
    }
  );

  return TestimonialModel;
};

export default Testimonial;
