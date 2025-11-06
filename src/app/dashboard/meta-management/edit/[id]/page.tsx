"use client";

import { Edit, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Space,
  DatePicker,
  Typography,
} from "antd";
import { SaveOutlined, EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useTranslation } from "@contexts/translation.context";
import dayjs from "dayjs";
import { JsonLdSchemaBuilder } from "@components/admin/meta-management/json-ld-schema-builder";
import { ImageUploadField } from "@components/shared/image-upload-field.component";

const { Text, Title } = Typography;

const { TextArea } = Input;
const { Option } = Select;

export default function MetaManagementEdit() {
  const { t } = useTranslation();
  const [previewMode, setPreviewMode] = useState(false);

  // Helper function to render SEO field with character count and warnings
  const renderSEOField = (
    name: string,
    label: string,
    placeholder: string,
    maxLength: number,
    optimalRange: { min: number; max: number },
    fieldType: "input" | "textarea" = "input",
    rows?: number
  ) => {
    return (
      <Form.Item
        name={name}
        label={label}
        rules={
          name === "title" || name === "description"
            ? [
                {
                  required: true,
                  message: `Please enter ${label.toLowerCase()}`,
                },
              ]
            : []
        }
        help={
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const value = getFieldValue(name) || "";
              const length = value.length;
              const isOptimal =
                length >= optimalRange.min && length <= optimalRange.max;
              const isTooShort = length > 0 && length < optimalRange.min;
              const isTooLong = length > optimalRange.max;

              let helpText = "";
              let helpType: "success" | "warning" | "error" | undefined =
                undefined;

              if (length === 0) {
                helpText = `Recommended: ${optimalRange.min}-${optimalRange.max} characters`;
              } else if (isOptimal) {
                helpText = `${length} characters - Optimal length ✓`;
                helpType = "success";
              } else if (isTooShort) {
                helpText = `${length} characters - Too short (recommended: ${optimalRange.min}-${optimalRange.max})`;
                helpType = "warning";
              } else if (isTooLong) {
                helpText = `${length} characters - Exceeds recommended length (max: ${optimalRange.max})`;
                helpType = "error";
              }

              return (
                <Space
                  direction="vertical"
                  size={4}
                  style={{ width: "100%", marginTop: 4 }}
                >
                  <Text
                    type={
                      helpType === "error"
                        ? "danger"
                        : helpType === "warning"
                        ? "warning"
                        : "secondary"
                    }
                    style={{ fontSize: 12 }}
                  >
                    {helpText}
                  </Text>
                </Space>
              );
            }}
          </Form.Item>
        }
      >
        {fieldType === "textarea" ? (
          <TextArea
            size="large"
            placeholder={placeholder}
            rows={rows || 6}
            style={{ minHeight: "100px" }}
            maxLength={maxLength}
            showCount
            // styles={{ textarea: { height: "3rem", resize: "vertical" } }}
          />
        ) : (
          <Input
            size="large"
            placeholder={placeholder}
            maxLength={maxLength}
            showCount
          />
        )}
      </Form.Item>
    );
  };

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "meta-data",
    redirect: "list",
  });

  // Transform image URLs before form submission
  const handleFinish = (values: any) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://cumi.dev");

    const transformed = { ...values };

    // Ensure keywords is an array for backend validation
    if (typeof transformed.keywords === "string") {
      transformed.keywords = transformed.keywords
        .split(",")
        .map((k: string) => k.trim())
        .filter((k: string) => k.length > 0);
    }

    // Convert dates to ISO strings or remove if empty
    if (transformed.publishedTime) {
      transformed.publishedTime = dayjs(transformed.publishedTime).isValid()
        ? dayjs(transformed.publishedTime).toISOString()
        : undefined;
    }
    if (transformed.modifiedTime) {
      transformed.modifiedTime = dayjs(transformed.modifiedTime).isValid()
        ? dayjs(transformed.modifiedTime).toISOString()
        : undefined;
    }

    // Ensure ogImage is a full URL (Cloudinary URLs are already full, but handle relative paths)
    if (
      transformed.ogImage &&
      !transformed.ogImage.startsWith("http://") &&
      !transformed.ogImage.startsWith("https://")
    ) {
      transformed.ogImage = transformed.ogImage.startsWith("/")
        ? `${baseUrl}${transformed.ogImage}`
        : `${baseUrl}/${transformed.ogImage}`;
    }

    // Ensure twitterImage is a full URL
    if (
      transformed.twitterImage &&
      !transformed.twitterImage.startsWith("http://") &&
      !transformed.twitterImage.startsWith("https://")
    ) {
      transformed.twitterImage = transformed.twitterImage.startsWith("/")
        ? `${baseUrl}${transformed.twitterImage}`
        : `${baseUrl}/${transformed.twitterImage}`;
    }

    // Ensure canonical and ogUrl are absolute URLs
    if (transformed.canonical && !/^https?:\/\//i.test(transformed.canonical)) {
      transformed.canonical = transformed.canonical.startsWith("/")
        ? `${baseUrl}${transformed.canonical}`
        : `${baseUrl}/${transformed.canonical}`;
    }
    if (transformed.ogUrl && !/^https?:\/\//i.test(transformed.ogUrl)) {
      transformed.ogUrl = transformed.ogUrl.startsWith("/")
        ? `${baseUrl}${transformed.ogUrl}`
        : `${baseUrl}/${transformed.ogUrl}`;
    }

    // Call the original formProps.onFinish with transformed values
    return formProps.onFinish?.(transformed);
  };

  const metaData = queryResult?.data?.data;

  // Transform date fields when data loads
  useEffect(() => {
    if (metaData && formProps.form) {
      const initialValues: any = { ...metaData };

      // Transform date fields to dayjs format
      if (metaData.publishedTime) {
        initialValues.publishedTime = dayjs(metaData.publishedTime);
      }
      if (metaData.modifiedTime) {
        initialValues.modifiedTime = dayjs(metaData.modifiedTime);
      }

      // Transform keywords if it's a string (comma-separated)
      if (metaData.keywords && typeof metaData.keywords === "string") {
        initialValues.keywords = metaData.keywords;
      }

      // Parse keywords array to string if needed
      if (metaData.keywords && Array.isArray(metaData.keywords)) {
        initialValues.keywords = metaData.keywords.join(", ");
      }

      // Handle customSchema - ensure it's a JSON string
      if (metaData.customSchema) {
        if (typeof metaData.customSchema === "string") {
          // Validate it's valid JSON
          try {
            JSON.parse(metaData.customSchema);
            initialValues.customSchema = metaData.customSchema;
          } catch {
            initialValues.customSchema = "";
          }
        } else if (typeof metaData.customSchema === "object") {
          initialValues.customSchema = JSON.stringify(
            metaData.customSchema,
            null,
            2
          );
        }
      } else {
        initialValues.customSchema = "";
      }

      formProps.form.setFieldsValue(initialValues);
    }
  }, [metaData, formProps.form]);

  const generatePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <Edit
      title={t("meta_management.edit_title")}
      saveButtonProps={saveButtonProps}
      headerButtons={[
        <Button key="preview" icon={<EyeOutlined />} onClick={generatePreview}>
          {previewMode ? "Hide Preview" : "Preview"}
        </Button>,
        <Button
          key="reset"
          icon={<ReloadOutlined />}
          onClick={() => formProps.form?.resetFields()}
        >
          Reset
        </Button>,
      ]}
    >
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="page"
              label="Page URL"
              rules={[{ required: true, message: "Please enter page URL" }]}
            >
              <Input size="large" placeholder="/about-us" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              name="pageType"
              label="Page Type"
              rules={[{ required: true, message: "Please select page type" }]}
            >
              <Select size="large" placeholder="Select page type">
                <Option value="home">Homepage</Option>
                <Option value="page">General Page</Option>
                <Option value="blog">Blog Post</Option>
                <Option value="project">Project</Option>
                <Option value="service">Service</Option>
                <Option value="course">Course</Option>
                <Option value="event">Event</Option>
                <Option value="category">Category</Option>
                <Option value="tag">Tag</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Basic Meta Tags</Divider>

        {renderSEOField(
          "title",
          "Page Title",
          "Enter page title (50-60 characters recommended)",
          60,
          { min: 50, max: 60 },
          "input"
        )}

        {renderSEOField(
          "description",
          "Meta Description",
          "Enter meta description (150-160 characters recommended)",
          160,
          { min: 150, max: 160 },
          "textarea",
          8
        )}

        <Form.Item name="keywords" label="Keywords">
          <Input
            size="large"
            placeholder="Enter keywords separated by commas"
          />
        </Form.Item>

        <Form.Item
          name="canonical"
          label="Canonical URL"
          rules={[{ required: true, message: "Please enter canonical URL" }]}
        >
          <Input size="large" placeholder="https://cumi.dev/about-us" />
        </Form.Item>

        <Form.Item name="robots" label="Robots Meta Tag">
          <Select size="large" placeholder="Select robots directive">
            <Option value="index, follow">Index, Follow</Option>
            <Option value="index, nofollow">Index, No Follow</Option>
            <Option value="noindex, follow">No Index, Follow</Option>
            <Option value="noindex, nofollow">No Index, No Follow</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">Open Graph Tags</Divider>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            {renderSEOField(
              "ogTitle",
              "OG Title",
              "Open Graph title (60 characters recommended)",
              60,
              { min: 40, max: 60 },
              "input"
            )}
          </Col>

          <Col xs={24} lg={12}>
            <ImageUploadField
              name="ogImage"
              label="OG Image"
              form={formProps.form}
              fieldName="ogImage"
              initialImageUrl={metaData?.ogImage}
              maxSize={5 * 1024 * 1024}
              dragger={false}
              listType="picture-card"
            />
          </Col>
        </Row>

        {renderSEOField(
          "ogDescription",
          "OG Description",
          "Open Graph description (110-200 characters recommended)",
          300,
          { min: 110, max: 200 },
          "textarea",
          6
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Form.Item name="ogUrl" label="OG URL">
              <Input size="large" placeholder="https://cumi.dev/page-url" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item name="ogType" label="OG Type">
              <Select size="large" placeholder="Select OG type">
                <Option value="website">Website</Option>
                <Option value="article">Article</Option>
                <Option value="blog">Blog</Option>
                <Option value="product">Product</Option>
                <Option value="book">Book</Option>
                <Option value="profile">Profile</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Twitter Card Tags</Divider>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            {renderSEOField(
              "twitterTitle",
              "Twitter Title",
              "Twitter title (70 characters recommended)",
              70,
              { min: 50, max: 70 },
              "input"
            )}
          </Col>

          <Col xs={24} lg={12}>
            <ImageUploadField
              name="twitterImage"
              label="Twitter Image"
              form={formProps.form}
              fieldName="twitterImage"
              initialImageUrl={metaData?.twitterImage}
              maxSize={5 * 1024 * 1024}
              dragger={false}
              listType="picture-card"
            />
          </Col>
        </Row>

        {renderSEOField(
          "twitterDescription",
          "Twitter Description",
          "Twitter description (70-200 characters recommended)",
          200,
          { min: 70, max: 200 },
          "textarea",
          6
        )}

        <Form.Item name="twitterCard" label="Twitter Card Type">
          <Select size="large" placeholder="Select Twitter card type">
            <Option value="summary">Summary</Option>
            <Option value="summary_large_image">Summary Large Image</Option>
            <Option value="app">App</Option>
            <Option value="player">Player</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">Schema Markup</Divider>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Form.Item name="schemaType" label="Schema Type">
              <Select size="large" placeholder="Select schema type">
                <Option value="WebPage">WebPage</Option>
                <Option value="Article">Article</Option>
                <Option value="BlogPosting">Blog Post</Option>
                <Option value="Product">Product</Option>
                <Option value="Service">Service</Option>
                <Option value="Course">Course</Option>
                <Option value="Event">Event</Option>
                <Option value="Organization">Organization</Option>
                <Option value="Person">Person</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Additional Information</Divider>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Form.Item name="author" label="Author">
              <Input size="large" placeholder="Page author" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="publishedTime" label="Published Date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Select published date"
                showTime
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="modifiedTime" label="Modified Date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Select modified date"
                showTime
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="customSchema"
          label="Custom Schema (JSON-LD)"
          tooltip="Build structured JSON-LD schema using the form builder or edit raw JSON directly"
          getValueFromEvent={(value) => value}
          getValueProps={(value) => ({ value: value || "" })}
        >
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.schemaType !== currentValues.schemaType
            }
          >
            {({ getFieldValue }) => (
              <JsonLdSchemaBuilder
                schemaType={
                  getFieldValue("schemaType") ||
                  metaData?.schemaType ||
                  "WebPage"
                }
              />
            )}
          </Form.Item>
        </Form.Item>

        {previewMode && (
          <Card title="SEO Preview" size="small" style={{ marginTop: 16 }}>
            <div className="preview-content">
              <Title level={4} style={{ marginBottom: 16 }}>
                Search Engine Result Preview
              </Title>
              <div className="search-preview">
                <div className="title">
                  {formProps.form?.getFieldValue("title") || "Page Title"}
                </div>
                <div className="url">
                  {formProps.form?.getFieldValue("canonical") ||
                    "https://cumi.dev/page"}
                </div>
                <div className="description">
                  {formProps.form?.getFieldValue("description") ||
                    "Meta description appears here. This is how your page will appear in search results."}
                </div>
              </div>

              <Divider style={{ margin: "16px 0" }}>Open Graph Preview</Divider>
              <div className="og-preview">
                <div
                  className="og-image"
                  style={{
                    background: "#f0f0f0",
                    height: "200px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  {formProps.form?.getFieldValue("ogImage") ? (
                    <img
                      src={formProps.form?.getFieldValue("ogImage")}
                      alt="OG Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    "Image Preview"
                  )}
                </div>
                <div
                  className="og-title"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {formProps.form?.getFieldValue("ogTitle") ||
                    formProps.form?.getFieldValue("title") ||
                    "Title"}
                </div>
                <div
                  className="og-description"
                  style={{ color: "#666", marginBottom: "8px" }}
                >
                  {formProps.form?.getFieldValue("ogDescription") ||
                    formProps.form?.getFieldValue("description") ||
                    "Description"}
                </div>
                <div
                  className="og-url"
                  style={{ color: "#999", fontSize: "12px" }}
                >
                  {formProps.form?.getFieldValue("ogUrl") ||
                    formProps.form?.getFieldValue("canonical") ||
                    "https://cumi.dev"}
                </div>
              </div>
            </div>
          </Card>
        )}
      </Form>

      <style jsx>{`
        .search-preview {
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 4px;
          margin-top: 8px;
        }
        .search-preview .title {
          color: #1a0dab;
          font-size: 16px;
          font-weight: normal;
          margin-bottom: 4px;
        }
        .search-preview .url {
          color: #006621;
          font-size: 14px;
          margin-bottom: 4px;
        }
        .search-preview .description {
          color: #545454;
          font-size: 14px;
          line-height: 1.4;
        }
      `}</style>
    </Edit>
  );
}
