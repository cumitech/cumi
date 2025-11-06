"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { KeyValueList } from "@components/subscribe/key-value-pair.component";
import { Edit, useForm } from "@refinedev/antd";
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  InputNumber,
  Rate,
  Card,
  Space,
  Typography,
  Tag,
  Radio,
  Alert,
} from "antd";
import { useMemo, useEffect, useState } from "react";

const { TextArea } = Input;
const { Title, Text } = Typography;

//

export default function ReferralEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  const { data } = queryResult || {};
  const record = data?.data;
  const [editMode, setEditMode] = useState<'form' | 'json'>('form');

  const handleFinish = (values: any) => {
    const transformed: any = { ...values };

    // Ensure URLs include protocol and handle empty strings
    const ensureUrl = (u?: string) => {
      if (!u || u.trim() === '') return undefined;
      const trimmed = u.trim();
      return !/^https?:\/\//i.test(trimmed) ? `https://${trimmed}` : trimmed;
    };
    transformed.referralUrl = ensureUrl(transformed.referralUrl);
    transformed.originalUrl = ensureUrl(transformed.originalUrl);
    transformed.imageUrl = ensureUrl(transformed.imageUrl);
    transformed.logoUrl = ensureUrl(transformed.logoUrl);

    // Ensure required objects; parse JSON strings if provided in JSON mode
    const parseMaybeJson = (v: any) => {
      if (!v) return {};
      if (typeof v === 'string') {
        const trimmed = v.trim();
        if (trimmed === '' || trimmed === '{}') return {};
        try { 
          const parsed = JSON.parse(trimmed);
          return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch { 
          return {}; 
        }
      }
      if (typeof v === 'object' && !Array.isArray(v)) return v;
      return {};
    };
    transformed.features = parseMaybeJson(transformed.features);
    transformed.pros = parseMaybeJson(transformed.pros);
    transformed.cons = parseMaybeJson(transformed.cons);
    transformed.targetAudience = transformed.targetAudience ?? {};

    // Ensure priceRange is valid
    const validPriceRanges = ['free', 'budget', 'mid-range', 'premium'];
    if (!transformed.priceRange || !validPriceRanges.includes(transformed.priceRange)) {
      transformed.priceRange = 'free';
    }

    // Coerce rating to number within 0-5
    if (typeof transformed.rating !== 'number') {
      transformed.rating = Number(transformed.rating) || 0;
    }
    if (transformed.rating < 0) transformed.rating = 0;
    if (transformed.rating > 5) transformed.rating = 5;

    // Coerce priority to integer
    if (typeof transformed.priority !== 'number') {
      const p = Number(transformed.priority);
      transformed.priority = Number.isFinite(p) ? Math.max(0, Math.floor(p)) : 0;
    }

    return formProps.onFinish?.(transformed);
  };

  // Initialize Additional Information with structured values
  useEffect(() => {
    if (!record || !formProps.form) return;
    const parseKeyValue = (v: any): Record<string, string> => {
      if (!v) return {};
      if (typeof v === 'string') {
        try { const p = JSON.parse(v); return parseKeyValue(p); } catch { return {}; }
      }
      if (Array.isArray(v)) {
        // Convert ["key: value", ...] or ["item1", ...] to object
        const out: Record<string, string> = {};
        v.forEach((item: any, idx: number) => {
          if (typeof item === 'string') {
            const m = item.match(/^([^:]+):\s*(.+)$/);
            if (m) out[m[1].trim()] = m[2].trim(); else out[`item_${idx}`] = item;
          } else if (item && typeof item === 'object') {
            Object.entries(item).forEach(([k, val]) => { out[k] = String(val); });
          }
        });
        return out;
      }
      if (typeof v === 'object') {
        const out: Record<string, string> = {};
        Object.entries(v).forEach(([k, val]) => { out[k] = String(val as any); });
        return out;
      }
      return {};
    };
    const parseAudience = (v: any): Record<string, boolean> => {
      if (!v) return {};
      if (typeof v === 'string') {
        try { const p = JSON.parse(v); return parseAudience(p); } catch { return {}; }
      }
      if (Array.isArray(v)) {
        const out: Record<string, boolean> = {};
        v.forEach((s: any) => { if (typeof s === 'string') out[s] = true; });
        return out;
      }
      if (typeof v === 'object') {
        const out: Record<string, boolean> = {};
        Object.entries(v).forEach(([k, val]) => { out[k] = Boolean(val); });
        return out;
      }
      return {};
    };

    formProps.form.setFieldsValue({
      features: parseKeyValue(record.features),
      pros: parseKeyValue(record.pros),
      cons: parseKeyValue(record.cons),
      targetAudience: parseAudience(record.targetAudience || record.target_audience),
    });
  }, [record, formProps.form]);

  const categories = [
    { value: "hosting", label: "Web Hosting" },
    { value: "tools", label: "Tools & Software" },
    { value: "finance", label: "Finance & Banking" },
    { value: "marketing", label: "Marketing" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" },
  ];

  const priceRanges = [
    { value: "free", label: "Free" },
    { value: "budget", label: "Budget" },
    { value: "mid-range", label: "Mid-Range" },
    { value: "premium", label: "Premium" },
  ];

  // Component for target audience checkboxes
  const TARGET_AUDIENCES = [
    { key: "productivity", label: "Productivity" },
    { key: "teams", label: "Teams" },
    { key: "students", label: "Students" },
    { key: "creators", label: "Creators" },
    { key: "developers", label: "Developers" },
    { key: "businesses", label: "Businesses" },
    { key: "enterprises", label: "Enterprises" },
    { key: "freelancers", label: "Freelancers" },
  ];

  const TargetAudienceSelector: React.FC<{
    value?: Record<string, boolean>;
    onChange?: (value: Record<string, boolean>) => void;
  }> = ({ value = {}, onChange }) => {
    const handleChange = (key: string, checked: boolean) => {
      onChange?.({ ...value, [key]: checked });
    };

    return (
      <Space wrap>
        {TARGET_AUDIENCES.map(({ key, label }) => (
          <Tag.CheckableTag
            key={key}
            checked={value[key] === true}
            onChange={(checked) => handleChange(key, checked)}
          >
            {label}
          </Tag.CheckableTag>
        ))}
      </Space>
    );
  };

  return (
    <>
      <PageBreadCrumbs items={["Referrals", "Lists", "Edit"]} />
      <Edit title="Edit Referral" saveButtonProps={saveButtonProps}>
        <Form
          {...formProps}
          layout="vertical"
          form={formProps.form}
          size="large"
          onFinish={handleFinish}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Basic Information" style={{ marginBottom: 16 }}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Name is required",
                    },
                  ]}
                >
                  <Input placeholder="Enter referral name" />
                </Form.Item>

                <Form.Item
                  label="Company"
                  name="company"
                  rules={[
                    {
                      required: true,
                      message: "Company is required",
                    },
                  ]}
                >
                  <Input placeholder="Enter company name" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Description is required",
                    },
                  ]}
                >
                  <TextArea style={{ minHeight: "100px" }} rows={4} placeholder="Enter detailed description" />
                </Form.Item>

                <Form.Item
                  label="Category"
                  name="category"
                  rules={[
                    {
                      required: true,
                      message: "Category is required",
                    },
                  ]}
                >
                  <Select placeholder="Select category">
                    {categories.map((cat) => (
                      <Select.Option key={cat.value} value={cat.value}>
                        {cat.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Price Range"
                  name="priceRange"
                  rules={[
                    {
                      required: true,
                      message: "Price range is required",
                    },
                  ]}
                >
                  <Select placeholder="Select price range">
                    {priceRanges.map((price) => (
                      <Select.Option key={price.value} value={price.value}>
                        {price.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="URLs & Links" style={{ marginBottom: 16 }}>
                <Form.Item
                  label="Referral URL"
                  name="referralUrl"
                  rules={[
                    {
                      required: true,
                      message: "Referral URL is required",
                    },
                    {
                      type: "url",
                      message: "Please enter a valid URL",
                    },
                  ]}
                >
                  <Input placeholder="https://example.com/ref=yourcode" />
                </Form.Item>

                <Form.Item
                  label="Original URL"
                  name="originalUrl"
                  rules={[
                    {
                      required: true,
                      message: "Original URL is required",
                    },
                    {
                      type: "url",
                      message: "Please enter a valid URL",
                    },
                  ]}
                >
                  <Input placeholder="https://example.com" />
                </Form.Item>

                <Form.Item
                  label="Image URL"
                  name="imageUrl"
                  rules={[
                    {
                      type: "url",
                      message: "Please enter a valid URL",
                    },
                  ]}
                >
                  <Input placeholder="https://example.com/image.jpg" />
                </Form.Item>

                <Form.Item
                  label="Logo URL"
                  name="logoUrl"
                  rules={[
                    {
                      type: "url",
                      message: "Please enter a valid URL",
                    },
                  ]}
                >
                  <Input placeholder="https://example.com/logo.png" />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                title="Promotional Information"
                style={{ marginBottom: 16 }}
              >
                <Form.Item label="Discount" name="discount">
                  <Input placeholder="e.g., 20% OFF, $50 discount" />
                </Form.Item>

                <Form.Item label="Bonus" name="bonus">
                  <Input placeholder="e.g., Free trial, Extra features" />
                </Form.Item>

                <Form.Item label="Rating" name="rating">
                  <Rate allowHalf />
                </Form.Item>

                <Form.Item label="Priority" name="priority">
                  <InputNumber
                    min={0}
                    max={100}
                    placeholder="Priority (0-100)"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="Settings" style={{ marginBottom: 16 }}>
                <Form.Item
                  label="Active"
                  name="isActive"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  label="Featured"
                  name="isFeatured"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item label="Use Case" name="useCase">
                  <TextArea
                    rows={3}
                    style={{ minHeight: "100px" }}
                    placeholder="Describe when to use this service"
                  />
                </Form.Item>

                <Form.Item
                  label="Personal Experience"
                  name="personalExperience"
                >
                  <TextArea
                    rows={3}
                    style={{ minHeight: "100px" }}
                    placeholder="Share your personal experience with this service"
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card 
                title="Additional Information"
                extra={
                  <Radio.Group 
                    value={editMode} 
                    onChange={(e) => setEditMode(e.target.value)}
                    size="small"
                  >
                    <Radio.Button value="form">Form Mode</Radio.Button>
                    <Radio.Button value="json">JSON Mode</Radio.Button>
                  </Radio.Group>
                }
              >
                {editMode === 'json' && (
                  <Alert
                    message="JSON Editor Mode"
                    description="Edit the JSON directly. Make sure the format is valid JSON objects for features, pros, and cons."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                {editMode === 'form' ? (
                  <>
                    <Form.Item
                      label="Features"
                      name="features"
                      tooltip="Add key-value pairs for features"
                      getValueFromEvent={(value) => value}
                      getValueProps={(value) => ({ value })}
                    >
                      <KeyValueList
                        placeholder={{ key: "Feature", value: "Description" }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Pros"
                      name="pros"
                      tooltip="Add key-value pairs for pros"
                      getValueFromEvent={(value) => value}
                      getValueProps={(value) => ({ value })}
                    >
                      <KeyValueList
                        placeholder={{ key: "Aspect", value: "Benefit" }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Cons"
                      name="cons"
                      tooltip="Add key-value pairs for cons"
                      getValueFromEvent={(value) => value}
                      getValueProps={(value) => ({ value })}
                    >
                      <KeyValueList
                        placeholder={{ key: "Aspect", value: "Drawback" }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Target Audience"
                      name="targetAudience"
                      tooltip="Select target audience categories"
                      getValueFromEvent={(value) => value}
                      getValueProps={(value) => ({ value })}
                    >
                      <TargetAudienceSelector />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      label="Features (JSON)"
                      name="features"
                      tooltip="Enter JSON object: { 'key': 'value', ... }"
                      getValueFromEvent={(e) => e?.target?.value}
                      getValueProps={(value) => ({
                        value: typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2)
                      })}
                    >
                      <TextArea
                        rows={6}
                        placeholder='{"Feature 1": "Description 1", "Feature 2": "Description 2"}'
                        style={{ fontFamily: 'monospace' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Pros (JSON)"
                      name="pros"
                      tooltip="Enter JSON object: { 'key': 'value', ... }"
                      getValueFromEvent={(e) => e?.target?.value}
                      getValueProps={(value) => ({
                        value: typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2)
                      })}
                    >
                      <TextArea
                        rows={6}
                        placeholder='{"Aspect 1": "Benefit 1", "Aspect 2": "Benefit 2"}'
                        style={{ fontFamily: 'monospace' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Cons (JSON)"
                      name="cons"
                      tooltip="Enter JSON object: { 'key': 'value', ... }"
                      getValueFromEvent={(e) => e?.target?.value}
                      getValueProps={(value) => ({
                        value: typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2)
                      })}
                    >
                      <TextArea
                        rows={6}
                        placeholder='{"Aspect 1": "Drawback 1", "Aspect 2": "Drawback 2"}'
                        style={{ fontFamily: 'monospace' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Target Audience"
                      name="targetAudience"
                      tooltip="Select target audience categories"
                      getValueFromEvent={(value) => value}
                      getValueProps={(value) => ({ value })}
                    >
                      <TargetAudienceSelector />
                    </Form.Item>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Form>
      </Edit>
    </>
  );
}
