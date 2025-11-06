export interface IEmailCampaign {
  id?: number;
  subject: string;
  htmlContent: string;
  textContent?: string;
  recipientType: 'all' | 'specific' | 'subscribed';
  recipientIds?: string;
  totalRecipients: number;
  successCount: number;
  failureCount: number;
  resultsSummary?: string;
  status: 'sending' | 'completed' | 'failed';
  createdBy?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

