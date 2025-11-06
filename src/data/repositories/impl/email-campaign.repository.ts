import sequelize from "@database/db-sequelize.config";
import { IEmailCampaign } from "@domain/models/email-campaign.model";

export class EmailCampaignRepository {
  async create(campaign: IEmailCampaign): Promise<IEmailCampaign> {
    const [results] = await sequelize.query(`
      INSERT INTO email_campaigns (
        subject, html_content, text_content, recipient_type, 
        recipient_ids, total_recipients, success_count, 
        failure_count, results_summary, status, created_by, sent_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, {
      replacements: [
        campaign.subject,
        campaign.htmlContent,
        campaign.textContent || '',
        campaign.recipientType,
        campaign.recipientIds,
        campaign.totalRecipients,
        campaign.successCount,
        campaign.failureCount,
        campaign.resultsSummary,
        campaign.status,
        campaign.createdBy
      ]
    });

    const insertResult = results as any;
    campaign.id = insertResult.insertId;

    return campaign;
  }

  async findAll(limit: number = 100): Promise<IEmailCampaign[]> {
    const [results] = await sequelize.query(`
      SELECT * FROM email_campaigns 
      ORDER BY created_at DESC 
      LIMIT ?
    `, {
      replacements: [limit]
    });

    return this.mapToDomain(results as any[]);
  }

  async findById(id: number): Promise<IEmailCampaign | null> {
    const [results] = await sequelize.query(`
      SELECT * FROM email_campaigns WHERE id = ?
    `, {
      replacements: [id]
    });

    const rows = results as any[];
    if (rows.length === 0) return null;
    
    return this.mapToDomain([rows[0]])[0];
  }

  async update(id: number, campaign: Partial<IEmailCampaign>): Promise<IEmailCampaign> {
    const updateFields: string[] = [];
    const values: any[] = [];

    if (campaign.successCount !== undefined) {
      updateFields.push('success_count = ?');
      values.push(campaign.successCount);
    }
    if (campaign.failureCount !== undefined) {
      updateFields.push('failure_count = ?');
      values.push(campaign.failureCount);
    }
    if (campaign.status) {
      updateFields.push('status = ?');
      values.push(campaign.status);
    }
    if (campaign.resultsSummary !== undefined) {
      updateFields.push('results_summary = ?');
      values.push(campaign.resultsSummary);
    }
    if (campaign.sentAt !== undefined) {
      updateFields.push('sent_at = ?');
      values.push(campaign.sentAt);
    }

    updateFields.push('updated_at = NOW()');
    values.push(id);

    await sequelize.query(`
      UPDATE email_campaigns 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `, {
      replacements: values
    });

    return this.findById(id) as Promise<IEmailCampaign>;
  }

  private mapToDomain(rows: any[]): IEmailCampaign[] {
    return rows.map(row => ({
      id: row.id,
      subject: row.subject,
      htmlContent: row.html_content,
      textContent: row.text_content,
      recipientType: row.recipient_type,
      recipientIds: row.recipient_ids,
      totalRecipients: row.total_recipients,
      successCount: row.success_count,
      failureCount: row.failure_count,
      resultsSummary: row.results_summary,
      status: row.status,
      createdBy: row.created_by,
      sentAt: row.sent_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
}

