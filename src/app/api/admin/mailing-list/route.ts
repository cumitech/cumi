import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@services/email.service";
import { UserUseCase } from "@domain/usecases/user.usecase";
import { UserRepository } from "@data/repositories/impl/user.repository";
import { EmailCampaignUseCase } from "@domain/usecases/email-campaign.usecase";
import { EmailCampaignRepository } from "@data/repositories/impl/email-campaign.repository";
import { SubscriberUseCase } from "@domain/usecases/subscriber.usecase";
import { SubscriberRepository } from "@data/repositories/impl/subscriber.repository";
import authOptions from "@lib/options";
import { getServerSession } from "next-auth";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const emailCampaignRepository = new EmailCampaignRepository();
const emailCampaignUseCase = new EmailCampaignUseCase(emailCampaignRepository);
const subscriberRepository = new SubscriberRepository();
const subscriberUseCase = new SubscriberUseCase(subscriberRepository);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const currentUser = await userUseCase.getUserByEmail(session.user.email!) as any;
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { subject, html, text, recipientType, recipientIds, attachments } = await request.json();

    if (!subject || !html || !text) {
      return NextResponse.json(
        { error: "Subject, HTML, and text content are required" },
        { status: 400 }
      );
    }

    let recipients: Array<{ email: string; name: string }> = [];

    if (recipientType === 'all') {
      // Get all users
      const allUsers = await userUseCase.getAll();
      recipients = allUsers.map((user: any) => ({
        email: user.email,
        name: user.fullName || user.username
      }));
    } else if (recipientType === 'specific' && recipientIds && recipientIds.length > 0) {
      // Get specific users
      for (const userId of recipientIds) {
        const user = await userUseCase.getUserById(userId) as any;
        if (user) {
          recipients.push({
            email: user.email,
            name: user.fullName || user.username
          });
        }
      }
    } else if (recipientType === 'subscribed') {
      // Get all active subscribers
      const allSubscribers = await subscriberUseCase.getAll();
      recipients = allSubscribers
        .filter((sub: any) => sub.isActive !== false)
        .map((sub: any) => ({
          email: sub.email,
          name: sub.name || sub.email
        }));
    } else {
      return NextResponse.json(
        { error: "Invalid recipient selection" },
        { status: 400 }
      );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients found" },
        { status: 400 }
      );
    }

    // Build branded HTML similar to password reset template
    // This now returns both HTML and inline attachments for images
    const { html: brandedHtml, attachments: imageAttachments } = emailService['getEmailTemplate']({
      title: subject,
      subtitle: 'A message from CUMI',
      content: html,
      showLogo: true,
    });

    // Process file attachments from client
    let fileAttachments: Array<{
      filename: string;
      data: Buffer | string;
      contentType?: string;
      cid?: string;
    }> = [];

    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      fileAttachments = attachments.map((att: any) => {
        // Convert base64 string to Buffer
        const buffer = Buffer.from(att.data, 'base64');
        return {
          filename: att.name,
          data: buffer,
          contentType: att.type || 'application/octet-stream',
        };
      });
    }

    // Combine image attachments (inline) with file attachments (regular)
    const allAttachments = [
      ...imageAttachments, // Inline image attachments with CID
      ...fileAttachments, // Regular file attachments
    ];

    // Send bulk email with all attachments and map results to recipient-level status
    const settledResults = await emailService.sendBulkEmail(recipients, subject, brandedHtml, text, allAttachments);
    const results = settledResults.map((r: any, index: number) => ({
      recipient: recipients[index]?.email,
      success: r?.status === 'fulfilled',
      error: r?.status === 'rejected' ? (r?.reason?.message || String(r?.reason || 'Unknown error')) : null,
    }));

    const successCount = results.filter((r: any) => r.success).length;
    const failureCount = results.filter((r: any) => !r.success).length;

    // Save campaign to database
    try {
      await emailCampaignUseCase.createCampaign({
        subject,
        htmlContent: brandedHtml,
        textContent: text || '',
        recipientType: recipientType,
        recipientIds: JSON.stringify(recipientType === 'specific' ? recipientIds : []),
        totalRecipients: recipients.length,
        successCount,
        failureCount,
        resultsSummary: JSON.stringify(results),
        status: 'completed',
        createdBy: currentUser.id || session.user.email || '',
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (dbError) {
      console.error("Failed to save campaign:", dbError);
      // Don't fail the request if saving fails
    }

    return NextResponse.json({
      message: `Email campaign sent successfully`,
      totalRecipients: recipients.length,
      successCount,
      failureCount,
      results
    });

  } catch (error) {
    console.error("Error sending bulk email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const currentUser = await userUseCase.getUserByEmail(session.user.email!) as any;
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all users for mailing list
    const users = await userUseCase.getAll();
    const mailingList = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.fullName || user.username,
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt
    }));

    return NextResponse.json({
      mailingList,
      totalUsers: mailingList.length
    });

  } catch (error) {
    console.error("Error fetching mailing list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

