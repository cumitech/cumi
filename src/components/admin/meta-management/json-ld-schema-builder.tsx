"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Switch,
  Divider,
  Typography,
  Tabs,
  message,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CodeOutlined,
  FormOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface JsonLdSchemaBuilderProps {
  value?: string;
  onChange?: (value: string) => void;
  schemaType?: string;
}

// Common fields for different schema types
const schemaFields = {
  WebPage: [
    "name",
    "description",
    "url",
    "inLanguage",
    "isPartOf",
    "breadcrumb",
  ],
  Article: [
    "headline",
    "description",
    "image",
    "author",
    "datePublished",
    "dateModified",
    "publisher",
  ],
  BlogPosting: [
    "headline",
    "description",
    "image",
    "author",
    "datePublished",
    "dateModified",
    "publisher",
  ],
  Product: [
    "name",
    "description",
    "image",
    "brand",
    "offers",
    "aggregateRating",
    "sku",
    "price",
    "priceCurrency",
  ],
  Service: [
    "name",
    "description",
    "image",
    "provider",
    "areaServed",
    "serviceType",
  ],
  Course: [
    "name",
    "description",
    "image",
    "provider",
    "courseCode",
    "educationalLevel",
    "teaches",
  ],
  Event: [
    "name",
    "description",
    "image",
    "startDate",
    "endDate",
    "location",
    "organizer",
    "eventStatus",
  ],
  Organization: [
    "name",
    "description",
    "logo",
    "url",
    "contactPoint",
    "address",
    "sameAs",
  ],
  Person: [
    "name",
    "description",
    "image",
    "jobTitle",
    "worksFor",
    "email",
    "url",
    "sameAs",
  ],
};

export const JsonLdSchemaBuilder: React.FC<JsonLdSchemaBuilderProps> = ({
  value = "",
  onChange,
  schemaType = "WebPage",
}) => {
  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [customFields, setCustomFields] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [jsonError, setJsonError] = useState<string>("");
  const previousValueRef = useRef<string>("");
  const previousSchemaTypeRef = useRef<string>(schemaType);

  // Memoize onChange to prevent unnecessary re-renders
  const handleChange = useCallback(
    (newValue: string) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  // Initialize form data from value and schema type
  useEffect(() => {
    // Only update if schemaType changed or value changed externally
    const valueChanged = value !== previousValueRef.current;
    const schemaTypeChanged = schemaType !== previousSchemaTypeRef.current;

    if (!valueChanged && !schemaTypeChanged) {
      return;
    }

    previousValueRef.current = value || "";
    previousSchemaTypeRef.current = schemaType;

    if (value && value.trim()) {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        // Update @type if schemaType changed
        if (parsed["@type"] !== schemaType) {
          parsed["@type"] = schemaType;
        }
        setFormData(parsed);

        // Extract custom fields (not in standard schema)
        const standardFields =
          schemaFields[schemaType as keyof typeof schemaFields] || [];
        const custom: Array<{ key: string; value: string }> = [];

        Object.entries(parsed).forEach(([key, val]) => {
          if (
            !key.startsWith("@") &&
            !standardFields.includes(key) &&
            key !== "schemaType"
          ) {
            custom.push({
              key,
              value: typeof val === "string" ? val : JSON.stringify(val),
            });
          }
        });

        setCustomFields(custom);
        setJsonError("");
      } catch (e) {
        // If parsing fails, keep the error but don't break the form
        setJsonError("Invalid JSON format");
      }
    } else {
      // Initialize with default structure
      const defaultData: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": schemaType,
      };
      setFormData(defaultData);
      setCustomFields([]);
      setJsonError("");
      // Generate initial JSON
      const initialJson = JSON.stringify(defaultData, null, 2);
      handleChange(initialJson);
    }
  }, [schemaType, value, handleChange]);

  // Generate JSON from form data
  const generateJson = () => {
    try {
      const json: Record<string, any> = {
        "@context": formData["@context"] || "https://schema.org",
        "@type": formData["@type"] || schemaType,
      };

      // Add standard fields
      const fields =
        schemaFields[schemaType as keyof typeof schemaFields] || [];
      fields.forEach((field) => {
        if (formData[field] !== undefined && formData[field] !== "") {
          json[field] = formData[field];
        }
      });

      // Add custom fields
      customFields.forEach(({ key, value }) => {
        if (key && value) {
          try {
            // Try to parse as JSON first
            json[key] = JSON.parse(value);
          } catch {
            // If not JSON, use as string
            json[key] = value;
          }
        }
      });

      const jsonString = JSON.stringify(json, null, 2);
      handleChange(jsonString);
      setJsonError("");
      return jsonString;
    } catch (error: any) {
      setJsonError(error.message);
      return "";
    }
  };

  // Update form data and regenerate JSON
  const handleFieldChange = (field: string, newValue: any) => {
    const updated = { ...formData, [field]: newValue };
    // If @type changed, update it to match schemaType
    if (field === "@type" && newValue !== schemaType) {
      updated["@type"] = schemaType;
    }
    setFormData(updated);

    // Generate JSON automatically
    const json: Record<string, any> = {
      "@context": updated["@context"] || "https://schema.org",
      "@type": updated["@type"] || schemaType,
    };

    const fields = schemaFields[schemaType as keyof typeof schemaFields] || [];
    fields.forEach((f) => {
      if (f === field && newValue !== undefined && newValue !== "") {
        json[f] = newValue;
      } else if (f !== field && updated[f] !== undefined && updated[f] !== "") {
        json[f] = updated[f];
      }
    });

    customFields.forEach(({ key, value }) => {
      if (key && value) {
        try {
          json[key] = JSON.parse(value);
        } catch {
          json[key] = value;
        }
      }
    });

    handleChange(JSON.stringify(json, null, 2));
  };

  const handleCustomFieldChange = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [field]: newValue };
    setCustomFields(updated);
    generateJson();
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
    generateJson();
  };

  const handleJsonChange = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setFormData(parsed);
      handleChange(jsonString);
      setJsonError("");

      // Update custom fields from parsed JSON
      const standardFields =
        schemaFields[schemaType as keyof typeof schemaFields] || [];
      const custom: Array<{ key: string; value: string }> = [];

      Object.entries(parsed).forEach(([key, val]) => {
        if (
          !key.startsWith("@") &&
          !standardFields.includes(key) &&
          key !== "schemaType"
        ) {
          custom.push({
            key,
            value: typeof val === "string" ? val : JSON.stringify(val),
          });
        }
      });

      setCustomFields(custom);
    } catch (error: any) {
      setJsonError(error.message);
      // Still update the value even if there's an error (for partial JSON editing)
      handleChange(jsonString);
    }
  };

  // Sync value prop changes to form data (when external changes occur)
  useEffect(() => {
    if (value && value.trim()) {
      try {
        const currentJson = JSON.stringify(formData, null, 2);
        if (value !== currentJson) {
          const parsed = typeof value === "string" ? JSON.parse(value) : value;
          setFormData(parsed);
          setJsonError("");

          // Update custom fields
          const standardFields =
            schemaFields[schemaType as keyof typeof schemaFields] || [];
          const custom: Array<{ key: string; value: string }> = [];

          Object.entries(parsed).forEach(([key, val]) => {
            if (
              !key.startsWith("@") &&
              !standardFields.includes(key) &&
              key !== "schemaType"
            ) {
              custom.push({
                key,
                value: typeof val === "string" ? val : JSON.stringify(val),
              });
            }
          });

          setCustomFields(custom);
        }
      } catch (e) {
        // Ignore parsing errors from external updates
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, schemaType]);

  const fields = schemaFields[schemaType as keyof typeof schemaFields] || [];

  return (
    <Card size="small" style={{ marginTop: 8 }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "form",
            label: (
              <Space>
                <FormOutlined />
                Form Builder
              </Space>
            ),
            children: (
              <div style={{ marginTop: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Context" required>
                      <Input
                        value={formData["@context"] || "https://schema.org"}
                        onChange={(e) =>
                          handleFieldChange("@context", e.target.value)
                        }
                        placeholder="https://schema.org"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Schema Type" required>
                      <Input
                        value={formData["@type"] || schemaType}
                        onChange={(e) =>
                          handleFieldChange("@type", e.target.value)
                        }
                        placeholder="WebPage"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider orientation="left">Standard Fields</Divider>

                {fields.map((field) => (
                  <Form.Item
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                  >
                    <Input
                      value={formData[field] || ""}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={`Enter ${field}`}
                      size="large"
                    />
                  </Form.Item>
                ))}

                {customFields.length > 0 && (
                  <>
                    <Divider orientation="left">Custom Fields</Divider>
                    {customFields.map((field, index) => (
                      <Space
                        key={index}
                        style={{ width: "100%", marginBottom: 8 }}
                        align="start"
                      >
                        <Input
                          placeholder="Field name"
                          value={field.key}
                          onChange={(e) =>
                            handleCustomFieldChange(
                              index,
                              "key",
                              e.target.value
                            )
                          }
                          style={{ width: 150 }}
                          size="large"
                        />
                        <Input
                          placeholder="Field value"
                          value={field.value}
                          onChange={(e) =>
                            handleCustomFieldChange(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                          style={{ flex: 1 }}
                          size="large"
                        />
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => removeCustomField(index)}
                        />
                      </Space>
                    ))}
                  </>
                )}

                <Button
                  type="dashed"
                  onClick={addCustomField}
                  icon={<PlusOutlined />}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  Add Custom Field
                </Button>
              </div>
            ),
          },
          {
            key: "json",
            label: (
              <Space>
                <CodeOutlined />
                Raw JSON
              </Space>
            ),
            children: (
              <div style={{ marginTop: 16 }}>
                <TextArea
                  value={value || ""}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  rows={10}
                  style={{ minHeight: "100px", fontFamily: "monospace" }}
                  placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                />
                {jsonError && (
                  <Text
                    type="danger"
                    style={{ display: "block", marginTop: 8 }}
                  >
                    JSON Error: {jsonError}
                  </Text>
                )}
                <Button
                  type="primary"
                  onClick={generateJson}
                  style={{ marginTop: 8 }}
                >
                  Validate & Update
                </Button>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};
