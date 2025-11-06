// models/EmailCampaign.ts
import { Sequelize } from "sequelize";

const EmailCampaign = (sequelizeInstance: Sequelize, DataTypes: any) => {
  const EmailCampaignModel = sequelizeInstance.define(
    "EmailCampaign",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      htmlContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'html_content',
      },
      textContent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'text_content',
      },
      recipientType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'recipient_type',
      },
      recipientIds: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'recipient_ids',
      },
      totalRecipients: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_recipients',
      },
      successCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'success_count',
      },
      failureCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'failure_count',
      },
      resultsSummary: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'results_summary',
      },
      status: {
        type: DataTypes.ENUM('sending', 'completed', 'failed'),
        defaultValue: 'sending',
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'created_by',
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'sent_at',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      tableName: "email_campaigns",
      timestamps: true,
    }
  );

  return EmailCampaignModel;
};

export default EmailCampaign;

