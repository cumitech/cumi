"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Table,
  message,
  Modal,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  Spin,
  Alert,
  Tabs,
  Statistic,
  Tooltip,
  Upload,
} from "antd";
import {
  MailOutlined,
  SendOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  EyeOutlined,
  CheckOutlined,
  PaperClipOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import RichTextEditor from "@components/shared/rich-text-editor";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  accountStatus: string;
  createdAt: string;
}

interface EmailResult {
  recipient: string;
  success: boolean;
  result?: any;
  error?: string;
}

interface EmailCampaign {
  id: number;
  subject: string;
  html_content: string;
  text_content: string;
  recipient_type: string;
  total_recipients: number;
  success_count: number;
  failure_count: number;
  status: string;
  created_by: string;
  sent_at: string;
  created_at: string;
}

export default function MailingListPage() {
  const [form] = Form.useForm();
  const [mailingList, setMailingList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [emailResults, setEmailResults] = useState<EmailResult[]>([]);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [selectedCampaign, setSelectedCampaign] =
    useState<EmailCampaign | null>(null);
  const [campaignDetailVisible, setCampaignDetailVisible] = useState(false);
  const [previewHtmlContent, setPreviewHtmlContent] = useState<string>("");
  const [previewRecipients, setPreviewRecipients] = useState<User[]>([]);
  const [subscribers, setSubscribers] = useState<Array<{ id: number; email: string; name?: string; isActive: boolean }>>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ name: string; data: string; type: string; size: number }>>([]);

  useEffect(() => {
    loadMailingList();
    loadCampaignHistory();
    loadSubscribers();
  }, []);

  const loadMailingList = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/mailing-list");
      const data = await response.json();

      if (response.ok) {
        setMailingList(data.mailingList);
      } else {
        message.error(data.error || "Failed to load mailing list");
      }
    } catch (error) {
      message.error("Failed to load mailing list");
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignHistory = async () => {
    setLoadingCampaigns(true);
    try {
      const response = await fetch("/api/admin/mailing-list/campaigns");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error("Failed to load campaign history:", error);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const loadSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const response = await fetch("/api/subscribers");
      if (response.ok) {
        const data = await response.json();
        // Filter only active subscribers
        const activeSubscribers = (data || []).filter((sub: any) => sub.isActive !== false);
        setSubscribers(activeSubscribers);
      }
    } catch (error) {
      console.error("Failed to load subscribers:", error);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const stripHtmlTags = (html: string): string => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const wrapEmailTemplate = (html: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .email-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
          .email-header h1 { color: #ffffff; font-size: 28px; margin: 0; font-weight: 600; }
          .email-body { padding: 40px 30px; color: #333333; }
          .email-content { font-size: 16px; line-height: 1.8; }
          .email-footer { background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; }
          .email-footer p { color: #6c757d; font-size: 14px; margin: 5px 0; }
          @media only screen and (max-width: 600px) {
            .email-body { padding: 30px 20px; }
          }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table class="email-wrapper" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                  <td class="email-header">
                    <h1>CUMI</h1>
                  </td>
                </tr>
                <tr>
                  <td class="email-body">
                    <div class="email-content">
                      ${html}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="email-footer">
                    <p><strong>CUMI Software Development</strong></p>
                    <p>Building Tomorrow's Software Today</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #adb5bd;">
                      &copy; ${new Date().getFullYear()} CUMI. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  const handleSendEmail = async (values: any) => {
    setSending(true);
    try {
      // Extract plain text; server applies branded template wrapper
      const plainText = stripHtmlTags(values.html);
      
      const emailData = {
        ...values,
        html: values.html,
        text: plainText,
        attachments: attachments, // Include file attachments
      };

      const response = await fetch("/api/admin/mailing-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(
          `Email sent to ${data.successCount} recipients successfully`
        );
        setEmailResults(data.results);
        setResultsModalVisible(true);
        form.resetFields();
        setAttachments([]); // Clear attachments after sending
        // Reload campaign history
        await loadCampaignHistory();
      } else {
        message.error(data.error || "Failed to send email");
      }
    } catch (error) {
      message.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const viewCampaignDetails = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setCampaignDetailVisible(true);
  };

  const handlePreview = () => {
    const values = form.getFieldsValue();
    if (!values.subject || !values.html) {
      message.warning("Please fill in subject and content before previewing");
      return;
    }
    // Store raw HTML content for preview (no header/footer)
    setPreviewHtmlContent(values.html || "");
    
    // Calculate recipients based on recipient type
    let recipients: User[] = [];
    if (values.recipientType === "all") {
      recipients = mailingList;
    } else if (values.recipientType === "specific" && values.recipientIds) {
      recipients = mailingList.filter((user) =>
        values.recipientIds.includes(user.id)
      );
    } else if (values.recipientType === "subscribed") {
      // Convert subscribers to User format for preview
      recipients = subscribers.map((sub) => ({
        id: sub.id.toString(),
        email: sub.email,
        name: sub.name || sub.email,
        role: "subscriber",
        accountStatus: "active",
        createdAt: new Date().toISOString(),
      }));
    }
    setPreviewRecipients(recipients);
    
    setPreviewModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: User) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const getRecipientCount = (recipientType: string, recipientIds: string[]) => {
    if (recipientType === "all") {
      return mailingList.length;
    } else if (recipientType === "specific") {
      return recipientIds?.length || 0;
    } else if (recipientType === "subscribed") {
      return subscribers.length;
    }
    return 0;
  };

  const campaignColumns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text: string) => (
        <Text strong ellipsis style={{ maxWidth: 300 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Recipients",
      dataIndex: "total_recipients",
      key: "total_recipients",
      render: (count: number, record: EmailCampaign) => (
        <Space>
          <UserOutlined />
          {count} {
            record.recipient_type === "all" 
              ? "(All)" 
              : record.recipient_type === "subscribed"
              ? "(Subscribed)"
              : "(Specific)"
          }
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "completed"
              ? "green"
              : status === "sending"
              ? "blue"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Success/Failed",
      key: "results",
      render: (_: any, record: EmailCampaign) => (
        <Space>
          <Text style={{ color: "#52c41a" }}>{record.success_count}</Text>/
          <Text style={{ color: "#ff4d4f" }}>{record.failure_count}</Text>
        </Space>
      ),
    },
    {
      title: "Sent At",
      dataIndex: "sent_at",
      key: "sent_at",
      render: (date: string) =>
        date ? dayjs(date).format("MMM DD, YYYY HH:mm") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: EmailCampaign) => (
        <Tooltip title="View Campaign Details">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => viewCampaignDetails(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const tabItems = [
    {
      key: "compose",
      label: (
        <Space>
          <SendOutlined />
          Send Email
        </Space>
      ),
      children: (
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="Compose Email" style={{ marginBottom: 24 }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSendEmail}
                initialValues={{
                  recipientType: "all",
                }}
              >
                <Form.Item
                  name="recipientType"
                  label="Recipients"
                  rules={[
                    { required: true, message: "Please select recipients" },
                  ]}
                >
                  <Select placeholder="Select recipients">
                    <Option value="all">
                      <Space>
                        <TeamOutlined />
                        All Users ({mailingList.length})
                      </Space>
                    </Option>
                    <Option value="specific">
                      <Space>
                        <UserOutlined />
                        Specific Users
                      </Space>
                    </Option>
                    <Option value="subscribed">
                      <Space>
                        <MailOutlined />
                        Subscribed Users ({subscribers.length})
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.recipientType !== currentValues.recipientType
                  }
                >
                  {({ getFieldValue }) => {
                    const recipientType = getFieldValue("recipientType");

                    if (recipientType === "specific") {
                      return (
                        <Form.Item
                          name="recipientIds"
                          label="Select Users"
                          rules={[
                            { required: true, message: "Please select users" },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Select users to send email to"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              String(option?.children || "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {mailingList.map((user) => (
                              <Option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      );
                    }
                    return null;
                  }}
                </Form.Item>

                <Form.Item
                  name="subject"
                  label="Email Subject"
                  rules={[
                    { required: true, message: "Please enter email subject" },
                  ]}
                >
                  <Input 
                    size="large" 
                    placeholder="Enter email subject" 
                    prefix={<MailOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="html"
                  label="Email Content"
                  rules={[
                    { required: true, message: "Please enter email content" },
                  ]}
                  getValueFromEvent={(value) => value}
                  getValueProps={(value) => ({ value: value || '' })}
                >
                  <RichTextEditor
                    placeholder="Compose your email content here..."
                    height={400}
                  />
                </Form.Item>

                <Form.Item
                  label="Attachments"
                  help="Attach files (documents, zips, images, etc.) to your email"
                >
                  <Upload
                    beforeUpload={(file) => {
                      // Convert file to base64 for storage
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result as string;
                        if (result) {
                          const base64Data = result.split(',')[1]; // Remove data:type;base64, prefix
                          setAttachments((prev) => [
                            ...prev,
                            {
                              name: file.name,
                              data: base64Data,
                              type: file.type || 'application/octet-stream',
                              size: file.size,
                            },
                          ]);
                        }
                      };
                      reader.readAsDataURL(file);
                      return false; // Prevent auto upload
                    }}
                    multiple
                    showUploadList={false}
                    accept="*/*"
                  >
                    <Button icon={<PaperClipOutlined />} type="dashed">
                      Add Attachments
                    </Button>
                  </Upload>
                  {attachments.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <Space direction="vertical" style={{ width: "100%" }} size="small">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 12px",
                              border: "1px solid #d9d9d9",
                              borderRadius: "6px",
                              backgroundColor: "#fafafa",
                            }}
                          >
                            <Space>
                              <PaperClipOutlined />
                              <Text>
                                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                              </Text>
                            </Space>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              size="small"
                              onClick={() => {
                                setAttachments((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </Space>
                    </div>
                  )}
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SendOutlined />}
                      loading={sending}
                      disabled={sending}
                    >
                      Send Email
                    </Button>
                    <Button onClick={handlePreview} icon={<MailOutlined />}>
                      Preview
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Mailing List Statistics">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Total Users:</Text> {mailingList.length}
                </div>
                <div>
                  <Text strong>Active Users:</Text>{" "}
                  {
                    mailingList.filter((u) => u.accountStatus === "active")
                      .length
                  }
                </div>
                <div>
                  <Text strong>Admin Users:</Text>{" "}
                  {mailingList.filter((u) => u.role === "admin").length}
                </div>
                <Divider />
                <Alert
                  message="Email Guidelines"
                  description="Make sure your email content is professional and follows best practices for bulk email sending."
                  type="info"
                  showIcon
                />
              </Space>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "history",
      label: (
        <Space>
          <HistoryOutlined />
          Campaign History
          <Tag color="blue">{campaigns.length}</Tag>
        </Space>
      ),
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Campaigns"
                  value={campaigns.length}
                  prefix={<MailOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Recipients"
                  value={campaigns.reduce(
                    (sum, c) => sum + (Number(c.total_recipients) || 0),
                    0
                  )}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Success Rate"
                  value={
                    campaigns.length > 0
                      ? (() => {
                          const totalRecipients = campaigns.reduce(
                            (sum, c) => sum + (Number(c.total_recipients) || 0),
                            0
                          );
                          const totalSuccess = campaigns.reduce(
                            (sum, c) => sum + (Number(c.success_count) || 0),
                            0
                          );
                          return totalRecipients > 0
                            ? Math.round((totalSuccess / totalRecipients) * 100)
                            : 0;
                        })()
                      : 0
                  }
                  suffix="%"
                  prefix={<CheckOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>

          <Card>
            <Table
              columns={campaignColumns}
              dataSource={campaigns}
              rowKey="id"
              loading={loadingCampaigns}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `${total} campaigns`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: "users",
      label: (
        <Space>
          <UserOutlined />
          User List
        </Space>
      ),
      children: (
        <Card>
          <Table
            columns={columns}
            dataSource={mailingList}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
            }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card bordered={false}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <MailOutlined style={{ marginRight: 8 }} />
            Mailing List Management
          </Title>
          <Text type="secondary">
            Send bulk emails and manage your email campaigns
          </Text>
        </div>

        <Tabs defaultActiveKey="compose" items={tabItems} />

        {/* Campaign Detail Modal */}
        <Modal
          title="Campaign Details"
          open={campaignDetailVisible}
          onCancel={() => setCampaignDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setCampaignDetailVisible(false)}>
              Close
            </Button>,
          ]}
          width={900}
          styles={{ body: { maxHeight: '70vh', overflowY: 'auto', padding: '24px' } }}
          maskClosable={false}
        >
          {selectedCampaign && (
            <div>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>Subject:</Text>
                  <div>{selectedCampaign.subject}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Status:</Text>
                  <div>
                    <Tag
                      color={
                        selectedCampaign.status === "completed"
                          ? "green"
                          : "blue"
                      }
                    >
                      {selectedCampaign.status.toUpperCase()}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <Text strong>Total Recipients:</Text>
                  <div>{selectedCampaign.total_recipients}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Recipient Type:</Text>
                  <div>
                    <Tag>
                      {selectedCampaign.recipient_type === "all"
                        ? "All Users"
                        : selectedCampaign.recipient_type === "subscribed"
                        ? "Subscribed Users"
                        : "Specific Users"}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <Text strong>Success:</Text>
                  <div style={{ color: "#52c41a", fontWeight: 600 }}>
                    {selectedCampaign.success_count}
                  </div>
                </Col>
                <Col span={12}>
                  <Text strong>Failed:</Text>
                  <div style={{ color: "#ff4d4f", fontWeight: 600 }}>
                    {selectedCampaign.failure_count}
                  </div>
                </Col>
                <Col span={12}>
                  <Text strong>Sent At:</Text>
                  <div>
                    {dayjs(selectedCampaign.sent_at).format(
                      "MMMM DD, YYYY HH:mm:ss"
                    )}
                  </div>
                </Col>
              </Row>
              <Divider />
              <Text strong>Content Preview:</Text>
              <div style={{ marginTop: 16 }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedCampaign.html_content,
                  }}
                  style={{
                    border: "1px solid #d9d9d9",
                    padding: "16px",
                    borderRadius: "6px",
                    backgroundColor: "#fafafa",
                    maxHeight: "400px",
                    overflow: "auto",
                  }}
                />
              </div>
            </div>
          )}
        </Modal>

        {/* Preview Modal */}
        <Modal
          title="Email Preview"
          open={previewModalVisible}
          onCancel={() => setPreviewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setPreviewModalVisible(false)}>
              Close
            </Button>,
          ]}
          width="95%"
          style={{ maxWidth: "900px" }}
          styles={{ body: { maxHeight: '70vh', overflowY: 'auto', padding: '24px' } }}
          maskClosable
          destroyOnClose
          centered
          afterClose={() => {
            // Ensure no leftover overlays block interactions
          }}
        >
          <div>
            <Title level={4}>Subject: {form.getFieldValue("subject")}</Title>
            <Divider />
            
            {/* Recipients Section */}
            <div style={{ marginBottom: 24 }}>
              <Text strong>
                <TeamOutlined style={{ marginRight: 8 }} />
                Recipients ({previewRecipients.length}):
              </Text>
              <div
                style={{
                  marginTop: 12,
                  maxHeight: "150px",
                  overflowY: "auto",
                  border: "1px solid #d9d9d9",
                  padding: "12px",
                  borderRadius: "6px",
                  backgroundColor: "#fafafa",
                }}
              >
                {previewRecipients.length > 0 ? (
                  <Space direction="vertical" style={{ width: "100%" }} size="small">
                    {previewRecipients.map((user) => (
                      <div key={user.id}>
                        <MailOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                        <Text>
                          {user.name} ({user.email})
                        </Text>
                      </div>
                    ))}
                  </Space>
                ) : (
                  <Text type="secondary">No recipients selected</Text>
                )}
              </div>
            </div>
            
            <Divider />
            
            {/* Email Content Preview */}
            <div>
              <Text strong style={{ display: "block", marginBottom: 12 }}>
                Content Preview:
              </Text>
              <div
                dangerouslySetInnerHTML={{
                  __html: previewHtmlContent || "No content",
                }}
                style={{
                  border: "1px solid #d9d9d9",
                  padding: "16px",
                  borderRadius: "6px",
                  backgroundColor: "#fafafa",
                  minHeight: "100px",
                }}
              />
            </div>
          </div>
        </Modal>

        {/* Results Modal */}
        <Modal
          title="Email Send Results"
          open={resultsModalVisible}
          onCancel={() => setResultsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setResultsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width="95%"
          style={{ maxWidth: "900px" }}
          styles={{ body: { maxHeight: '70vh', overflowY: 'auto', padding: '24px' } }}
          maskClosable
          destroyOnClose
          centered
        >
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: "center" }}>
                    <CheckCircleOutlined
                      style={{ fontSize: 24, color: "#52c41a" }}
                    />
                    <div>Successful</div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#52c41a",
                      }}
                    >
                      {emailResults.filter((r) => r.success).length}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: "center" }}>
                    <CloseCircleOutlined
                      style={{ fontSize: 24, color: "#ff4d4f" }}
                    />
                    <div>Failed</div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#ff4d4f",
                      }}
                    >
                      {emailResults.filter((r) => !r.success).length}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: "center" }}>
                    <TeamOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                    <div>Total</div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#1890ff",
                      }}
                    >
                      {emailResults.length}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Table
              dataSource={emailResults}
              columns={[
                {
                  title: "Recipient",
                  dataIndex: "recipient",
                  key: "recipient",
                },
                {
                  title: "Status",
                  dataIndex: "success",
                  key: "success",
                  render: (success: boolean) => (
                    <Tag color={success ? "green" : "red"}>
                      {success ? "Success" : "Failed"}
                    </Tag>
                  ),
                },
                {
                  title: "Error",
                  dataIndex: "error",
                  key: "error",
                  render: (error: string) => error || "-",
                },
              ]}
              pagination={false}
              size="small"
            />
          </div>
        </Modal>
      </Card>
    </div>
  );
}
