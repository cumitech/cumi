// src/data/entities/referral.ts
import { Sequelize } from "sequelize";

const Referral = (sequelizeInstance: Sequelize, DataTypes: any) => {
  const ReferralModel = sequelizeInstance.define(
    "Referral",
    {
      id: {
        type: DataTypes.STRING(20),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM('hosting', 'tools', 'finance', 'marketing', 'education', 'other'),
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      referralUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'referral_url',
      },
      originalUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'original_url',
      },
      discount: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bonus: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'image_url',
      },
      logoUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'logo_url',
      },
      features: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      pros: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      cons: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      priceRange: {
        type: DataTypes.ENUM('free', 'budget', 'mid-range', 'premium'),
        allowNull: false,
        defaultValue: 'free',
        field: 'price_range',
      },
      targetAudience: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        field: 'target_audience',
      },
      useCase: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'use_case',
      },
      personalExperience: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'personal_experience',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_featured',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      clickCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'click_count',
      },
      conversionCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'conversion_count',
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
      tableName: "referrals",
      timestamps: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );

  return ReferralModel;
};

export default Referral;
