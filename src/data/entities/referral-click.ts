// src/data/entities/referral-click.ts
import { Sequelize } from "sequelize";

const ReferralClick = (sequelizeInstance: Sequelize, DataTypes: any) => {
  const ReferralClickModel = sequelizeInstance.define(
    "ReferralClick",
    {
      id: {
        type: DataTypes.STRING(20),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      referralId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'referrals',
          key: 'id',
        },
        field: 'referral_id',
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'user_id',
      },
      sessionId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'session_id',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'user_agent',
      },
      referrer: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      clickedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'clicked_at',
      },
      converted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      conversionValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'conversion_value',
      },
    },
    {
      tableName: "referral_clicks",
      timestamps: false,
    }
  );

  return ReferralClickModel;
};

export default ReferralClick;
