import { IEmailCampaign } from "@domain/models/email-campaign.model";
import { EmailCampaignRepository } from "@data/repositories/impl/email-campaign.repository";

export class EmailCampaignUseCase {
  constructor(private emailCampaignRepository: EmailCampaignRepository) {}

  async createCampaign(campaign: IEmailCampaign): Promise<IEmailCampaign> {
    return await this.emailCampaignRepository.create(campaign);
  }

  async getAllCampaigns(limit: number = 100): Promise<IEmailCampaign[]> {
    return await this.emailCampaignRepository.findAll(limit);
  }

  async getCampaignById(id: number): Promise<IEmailCampaign | null> {
    return await this.emailCampaignRepository.findById(id);
  }

  async updateCampaign(id: number, campaign: Partial<IEmailCampaign>): Promise<IEmailCampaign> {
    return await this.emailCampaignRepository.update(id, campaign);
  }
}

