'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, Select, message, Space, Divider } from 'antd';
import { SaveOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface MetaData {
  id?: string;
  page: string;
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaType?: string;
  customSchema?: string;
  robots?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MetaManagementProps {
  pageType?: string;
  initialData?: MetaData;
  onSave?: (data: MetaData) => void;
}

export default function MetaManagement({ 
  pageType = 'page', 
  initialData,
  onSave 
}: MetaManagementProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Predefined page types
  const pageTypes = [
    { value: 'home', label: 'Homepage' },
    { value: 'page', label: 'General Page' },
    { value: 'blog', label: 'Blog Post' },
    { value: 'project', label: 'Project' },
    { value: 'service', label: 'Service' },
    { value: 'course', label: 'Course' },
    { value: 'event', label: 'Event' },
    { value: 'category', label: 'Category' },
    { value: 'tag', label: 'Tag' },
  ];
  
  // Schema types
  const schemaTypes = [
    { value: 'WebPage', label: 'WebPage' },
    { value: 'Article', label: 'Article' },
    { value: 'BlogPosting', label: 'Blog Post' },
    { value: 'Product', label: 'Product' },
    { value: 'Service', label: 'Service' },
    { value: 'Course', label: 'Course' },
    { value: 'Event', label: 'Event' },
    { value: 'Organization', label: 'Organization' },
    { value: 'Person', label: 'Person' },
  ];
  
  // Robots options
  const robotsOptions = [
    { value: 'index, follow', label: 'Index, Follow' },
    { value: 'index, nofollow', label: 'Index, No Follow' },
    { value: 'noindex, follow', label: 'No Index, Follow' },
    { value: 'noindex, nofollow', label: 'No Index, No Follow' },
  ];
  
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        keywords: initialData.keywords?.join(', ') || '',
      });
    }
  }, [initialData, form]);
  
  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const metaData: MetaData = {
        ...values,
        keywords: values.keywords?.split(',').map((k: string) => k.trim()).filter(Boolean) || [],
        updatedAt: new Date().toISOString(),
      };
      
      if (onSave) {
        await onSave(metaData);
      } else {
        // Default save logic - you can implement API call here
        console.log('Saving meta data:', metaData);
        message.success('Meta data saved successfully!');
      }
    } catch (error) {
      message.error('Failed to save meta data');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const generatePreview = () => {
    const values = form.getFieldsValue();
    setPreviewMode(!previewMode);
  };
  
  return (
    <Card title="SEO Meta Data Management" className="meta-management-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          pageType: pageType,
          robots: 'index, follow',
          schemaType: 'WebPage',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="page"
              label="Page URL"
              rules={[{ required: true, message: 'Please enter page URL' }]}
            >
              <Input placeholder="/about-us" />
            </Form.Item>
          </Col>
          
          <Col xs={24} lg={12}>
            <Form.Item
              name="pageType"
              label="Page Type"
              rules={[{ required: true, message: 'Please select page type' }]}
            >
              <Select placeholder="Select page type">
                {pageTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Divider orientation="left">Basic Meta Tags</Divider>
        
        <Form.Item
          name="title"
          label="Page Title"
          rules={[{ required: true, message: 'Please enter page title' }]}
        >
          <Input placeholder="Enter page title (50-60 characters)" maxLength={60} />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Meta Description"
          rules={[{ required: true, message: 'Please enter meta description' }]}
        >
          <TextArea 
            placeholder="Enter meta description (150-160 characters)" 
            rows={3} 
            style={{ minHeight: "100px" }}
            maxLength={160}
            showCount
          />
        </Form.Item>
        
        <Form.Item
          name="keywords"
          label="Keywords"
        >
          <Input placeholder="Enter keywords separated by commas" />
        </Form.Item>
        
        <Form.Item
          name="canonical"
          label="Canonical URL"
          rules={[{ required: true, message: 'Please enter canonical URL' }]}
        >
          <Input placeholder="https://cumi.dev/about-us" />
        </Form.Item>
        
        <Form.Item
          name="robots"
          label="Robots Meta Tag"
        >
          <Select placeholder="Select robots directive">
            {robotsOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Divider orientation="left">Open Graph Tags</Divider>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="ogTitle"
              label="OG Title"
            >
              <Input placeholder="Open Graph title" />
            </Form.Item>
          </Col>
          
          <Col xs={24} lg={12}>
            <Form.Item
              name="ogImage"
              label="OG Image URL"
            >
              <Input placeholder="https://cumi.dev/image.jpg" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="ogDescription"
          label="OG Description"
        >
          <TextArea style={{ minHeight: "100px" }} placeholder="Open Graph description" rows={3} />
        </Form.Item>
        
        <Divider orientation="left">Twitter Card Tags</Divider>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="twitterTitle"
              label="Twitter Title"
            >
              <Input placeholder="Twitter title" />
            </Form.Item>
          </Col>
          
          <Col xs={24} lg={12}>
            <Form.Item
              name="twitterImage"
              label="Twitter Image URL"
            >
              <Input placeholder="https://cumi.dev/image.jpg" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="twitterDescription"
          label="Twitter Description"
        >
          <TextArea style={{ minHeight: "100px" }} placeholder="Twitter description" rows={3} />
        </Form.Item>
        
        <Divider orientation="left">Schema Markup</Divider>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="schemaType"
              label="Schema Type"
            >
              <Select placeholder="Select schema type">
                {schemaTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="customSchema"
          label="Custom Schema (JSON-LD)"
        >
          <TextArea 
            placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}' 
            rows={6}
            style={{ minHeight: "100px" }}
          />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={loading}
            >
              Save Meta Data
            </Button>
            
            <Button 
              icon={<EyeOutlined />}
              onClick={generatePreview}
            >
              {previewMode ? 'Hide Preview' : 'Preview'}
            </Button>
            
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => form.resetFields()}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
        
        {previewMode && (
          <Card title="Preview" size="small" className="mt-4">
            <div className="preview-content">
              <h4>Search Engine Preview:</h4>
              <div className="search-preview">
                <div className="title">{form.getFieldValue('title') || 'Page Title'}</div>
                <div className="url">{form.getFieldValue('canonical') || 'https://cumi.dev/page'}</div>
                <div className="description">{form.getFieldValue('description') || 'Meta description'}</div>
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
    </Card>
  );
}
