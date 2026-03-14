"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  notification,
  Card,
  Row,
  Col,
  Space,
  Typography,
} from "antd";
import {
  SendOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  MessageOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { useTranslation } from "@contexts/translation.context";
import PhoneNumberInput from "@components/shared/phone-number-input.component";
import {
  validatePhoneNumber,
  normalizePhoneNumber,
  getCountryByPhonePrefix,
} from "@utils/country-codes";
import { trackFormGoal } from "@lib/analytics";

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

export default function ContactUsPageComponent() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const recaptchaToken = await (await import("@lib/recaptcha-client")).getRecaptchaToken("CONTACT_FORM");
      const countryCode = values.countryCode || "CM";
      const payload = {
        ...values,
        phone: values.phone
          ? normalizePhoneNumber(countryCode, values.phone)
          : values.phone,
        countryCode,
        recaptchaToken,
        recaptchaAction: "CONTACT_FORM",
      };
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to send message");
      }

      api.success({
        message: t("contact.success_title"),
        description: t("contact.success_message"),
        placement: "topRight",
        duration: 4,
      });
      trackFormGoal("contact_form", { page: "contact-us" });
      form.resetFields();
    } catch (error) {
      console.error("Error sending message:", error);
      api.error({
        message: t("contact.error_title"),
        description:
          error instanceof Error ? error.message : t("contact.error_message"),
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className="container-fluid"
        style={{ width: "100%", backgroundColor: "white" }}
      >
        <AppNav logoPath="/" />
      </div>

      {}
      <BannerComponent
        breadcrumbs={[{ label: t("nav.contact-us"), uri: "contact-us" }]}
        pageTitle={t("nav.contact-us")}
      />

      <section id="page-content" className="py-5 contact-page-section">
        <div className="container">
          <Row justify="center" gutter={[24, 24]}>
            <Col xs={24} xl={18}>
              <Card
                className="contact-form-card"
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}
                styles={{ body: { padding: 0 } }}
              >
                <div
                  style={{
                    padding: "40px 32px 32px",
                    textAlign: "center",
                    background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
                    borderBottom: "1px solid rgba(34, 197, 94, 0.12)",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                      marginBottom: "20px",
                      boxShadow: "0 8px 24px rgba(34, 197, 94, 0.25)",
                    }}
                  >
                    <MailOutlined style={{ fontSize: "28px", color: "white" }} />
                  </div>
                  <Title level={2} style={{ marginBottom: "8px", color: "#1e293b", fontWeight: "700", fontSize: "1.75rem" }}>
                    {t("contact.get_in_touch")}
                  </Title>
                  <Paragraph style={{ fontSize: "15px", color: "#64748b", maxWidth: "480px", margin: "0 auto 24px", lineHeight: 1.6 }}>
                    {t("contact.contact_description")}
                  </Paragraph>
                  <Space size="middle" wrap style={{ justifyContent: "center", gap: "12px" }}>
                    <Button
                      type="primary"
                      icon={<WhatsAppOutlined />}
                      href="https://wa.me/237681289411"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-quick-btn contact-quick-whatsapp"
                    >
                      {t("contact.whatsapp_us")}
                    </Button>
                    <Button
                      icon={<MailOutlined />}
                      href="mailto:info@cumi.dev"
                      className="contact-quick-btn"
                    >
                      {t("contact.email_us")}
                    </Button>
                    <Button
                      icon={<CalendarOutlined />}
                      href="https://calendly.com/ayeahchanser"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-quick-btn"
                    >
                      {t("contact.book_consultation")}
                    </Button>
                  </Space>
                </div>

                <div id="project-inquiry-form" className="contact-form-inner" style={{ padding: "32px 32px 40px" }}>
                  <div style={{ marginBottom: "24px" }}>
                    <Title level={5} style={{ color: "#1e293b", fontWeight: "600", marginBottom: "4px" }}>
                      {t("contact.project_inquiry_heading")}
                    </Title>
                    <Paragraph style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                      {t("contact.project_inquiry_subtext")}
                    </Paragraph>
                  </div>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  size="large"
                  className="contact-form-fields"
                  initialValues={{ countryCode: "CM" }}
                >
                  <Row gutter={[20, 20]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label={t("contact.full_name")}
                        rules={[
                          { required: true, message: t("contact.name_required") },
                          { min: 2, message: t("contact.name_min_length") },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined className="contact-input-icon" />}
                          placeholder={t("contact.name_placeholder")}
                          className="contact-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label={t("contact.working_mail")}
                        rules={[
                          { required: true, message: t("contact.email_required") },
                          { type: "email", message: t("contact.email_valid") },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="contact-input-icon" />}
                          placeholder={t("contact.email_placeholder")}
                          className="contact-input"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[20, 20]}>
                    <Col xs={24} md={12}>
                      <Form.Item name="countryCode" hidden>
                        <Input type="hidden" />
                      </Form.Item>
                      <Form.Item
                        name="phone"
                        label={t("contact.phone_number")}
                        rules={[
                          {
                            validator: (_, value) => {
                              const raw = (value || "").toString().trim();
                              if (!raw) return Promise.resolve();
                              const digitsWithoutPrefix = raw
                                .replace(/^\+?\d{1,4}/, "")
                                .replace(/[\s\-\(\)\.]/g, "");
                              if (digitsWithoutPrefix.length === 0) return Promise.resolve();
                              let countryCode = form.getFieldValue("countryCode");
                              if (!countryCode && raw.startsWith("+")) {
                                const prefix = raw.match(/^\+\d{1,4}/)?.[0];
                                const country = prefix ? getCountryByPhonePrefix(prefix) : null;
                                countryCode = country?.code ?? "CM";
                              }
                              countryCode = countryCode || "CM";
                              if (validatePhoneNumber(countryCode, raw)) return Promise.resolve();
                              return Promise.reject(new Error(t("contact.phone_valid")));
                            },
                          },
                        ]}
                      >
                        <PhoneNumberInput
                          placeholder={t("contact.phone_placeholder")}
                          showMoneyServices={true}
                          countryCode="CM"
                          size="large"
                          onCountryCodeChange={(code) => form.setFieldValue("countryCode", code)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="subject"
                        label={t("contact.subject")}
                        rules={[
                          {
                            required: true,
                            message: t("contact.subject_required"),
                          },
                          { min: 5, message: t("contact.subject_min_length") },
                        ]}
                      >
                        <Input
                          prefix={<MessageOutlined className="contact-input-icon" />}
                          placeholder={t("contact.subject_placeholder")}
                          className="contact-input"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="message"
                    label={t("contact.message")}
                    rules={[
                      {
                        required: true,
                        message: t("contact.message_required"),
                      },
                      { min: 10, message: t("contact.message_min_length") },
                    ]}
                  >
                    <TextArea
                      placeholder={t("contact.message_placeholder")}
                      showCount
                      maxLength={2000}
                      rows={12}
                      className="contact-textarea"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0, marginTop: "8px" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      icon={<SendOutlined />}
                      className="contact-submit-btn"
                    >
                      {t("contact.send_message")}
                    </Button>
                  </Form.Item>
                </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
