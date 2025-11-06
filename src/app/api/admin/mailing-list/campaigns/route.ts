import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { EmailCampaignUseCase } from "@domain/usecases/email-campaign.usecase";
import { EmailCampaignRepository } from "@data/repositories/impl/email-campaign.repository";

const emailCampaignRepository = new EmailCampaignRepository();
const emailCampaignUseCase = new EmailCampaignUseCase(emailCampaignRepository);

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all campaigns
    const campaigns = await emailCampaignUseCase.getAllCampaigns(100);

    return NextResponse.json({
      campaigns: campaigns,
      total: campaigns.length
    });

  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

