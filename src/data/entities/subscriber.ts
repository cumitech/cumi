import { Model, Sequelize } from "sequelize";

interface ISubscriberAttributes {
  id: number;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const Subscriber = (sequelize: Sequelize, DataTypes: any) => {
  const SubscriberModel = sequelize.define(
    "Subscriber",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      subscribedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "subscribed_at",
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
      tableName: "subscribers",
      timestamps: true,
    }
  );

  return SubscriberModel;
};

export default Subscriber;

