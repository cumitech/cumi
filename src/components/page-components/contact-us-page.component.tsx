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
} from "@utils/country-codes";

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
      const countryCode = values.countryCode || "CM";
      const payload = {
        ...values,
        phone: values.phone
          ? normalizePhoneNumber(countryCode, values.phone)
          : values.phone,
        countryCode,
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

      <section className="py-5">
        <div className="container">
          <Row justify="center" gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card
                style={{
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  borderRadius: "16px",
                  border: "none",
                }}
              >
                <div className="text-center mb-5">
                  <Space direction="vertical" size="small">
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        marginBottom: "16px",
                      }}
                    >
                      <MailOutlined
                        style={{ fontSize: "28px", color: "white" }}
                      />
                    </div>
                    <Title
                      level={2}
                      style={{ marginBottom: "8px", color: "#1a1a1a" }}
                    >
                      {t("contact.get_in_touch")}
                    </Title>
                    <Paragraph
                      style={{
                        fontSize: "16px",
                        color: "#666",
                        maxWidth: "500px",
                        margin: "0 auto",
                      }}
                    >
                      {t("contact.contact_description")}
                    </Paragraph>
                  </Space>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  size="large"
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label={t("contact.full_name")}
                        rules={[
                          {
                            required: true,
                            message: t("contact.name_required"),
                          },
                          { min: 2, message: t("contact.name_min_length") },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                          placeholder={t("contact.name_placeholder")}
                          style={{ borderRadius: "8px" }}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label={t("contact.working_mail")}
                        rules={[
                          {
                            required: true,
                            message: t("contact.email_required"),
                          },
                          { type: "email", message: t("contact.email_valid") },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                          placeholder={t("contact.email_placeholder")}
                          style={{ borderRadius: "8px" }}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {}
                  {/* <Form.Item name="countryCode" initialValue="CM" hidden>
                    <Input />
                  </Form.Item> */}

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label={t("contact.phone_number")}
                        rules={[
                          {
                            validator: (_, value) => {
                              // Treat values with only country prefix and no local digits as empty (optional field)
                              const raw = (value || "").toString();
                              const digitsWithoutPrefix = raw
                                .replace(/^\+?\d{1,4}/, "")
                                .replace(/[\s\-\(\)]/g, "");
                              if (!raw || digitsWithoutPrefix.length === 0) {
                                return Promise.resolve();
                              }
                              const countryCode =
                                form.getFieldValue("countryCode") || "CM";
                              if (validatePhoneNumber(countryCode, raw)) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(t("contact.phone_valid"))
                              );
                            },
                          },
                        ]}
                      >
                        <PhoneNumberInput
                          placeholder={t("contact.phone_placeholder")}
                          showMoneyServices={true}
                          countryCode="CM"
                          size="large"
                          onCountryCodeChange={(code) => {
                            form.setFieldValue("countryCode", code);
                          }}
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
                          prefix={
                            <MessageOutlined style={{ color: "#bfbfbf" }} />
                          }
                          placeholder={t("contact.subject_placeholder")}
                          style={{ borderRadius: "8px" }}
                          size="large"
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
                      maxLength={1000}
                      rows={10}
                      style={{ minHeight: "100px", borderRadius: "8px" }}
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    className="text-center"
                    style={{ marginBottom: 0 }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      icon={<SendOutlined />}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderColor: "transparent",
                        borderRadius: "10px",
                        padding: "0 48px",
                        height: "52px",
                        fontSize: "16px",
                        fontWeight: "600",
                        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      {t("contact.send_message")}
                    </Button>
                  </Form.Item>
                </Form>
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
