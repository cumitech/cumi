'use client';

import { Show } from '@refinedev/antd';
import { useShow } from '@refinedev/core';
import { Typography, Card, Row, Col, Tag, Space, Divider, Descriptions } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { EditButton, DeleteButton, ListButton } from '@refinedev/antd';
import { useTranslation } from '@contexts/translation.context';

const { Title, Paragraph, Text } = Typography;

export default function MetaManagementShow() {
  const { t } = useTranslation();
  const { queryResult } = useShow({
    resource: 'meta-data',
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!record) {
    return <div>Record not found</div>;
  }

  const getRobotsTags = (robots: string) => {
    const isIndexed = robots.includes('index');
    const isFollowed = robots.includes('follow');
    return (
      <Space>
        <Tag color={isIndexed ? 'green' : 'red'}>
          {isIndexed ? 'Index' : 'No Index'}
        </Tag>
        <Tag color={isFollowed ? 'green' : 'red'}>
          {isFollowed ? 'Follow' : 'No Follow'}
        </Tag>
      </Space>
    );
  };

  return (
    <Show
      title="SEO Meta Data Details"
      headerButtons={[
        <EditButton key="edit" recordItemId={record.id} resource="meta-data" />,
        <DeleteButton key="delete" recordItemId={record.id} resource="meta-data" />,
        <ListButton key="list" resource="meta-data" />,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Basic Information" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Page URL">
                <Text code>{record.page}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Page Type">
                <Tag color="blue">{record.pageType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Schema Type">
                <Tag color="purple">{record.schemaType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Robots">
                {getRobotsTags(record.robots)}
              </Descriptions.Item>
              <Descriptions.Item label="Canonical URL">
                <Text copyable>{record.canonical}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Timestamps" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Created At">
                <Text type="secondary">
                  {new Date(record.createdAt).toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                <Text type="secondary">
                  {new Date(record.updatedAt).toLocaleString()}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Meta Tags" size="small">
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>Page Title</Title>
              <Paragraph>{record.title}</Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>Meta Description</Title>
              <Paragraph>{record.description}</Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>Keywords</Title>
              <div>
                {record.keywords?.map((keyword: string, index: number) => (
                  <Tag key={index} color="cyan">{keyword}</Tag>
                ))}
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Open Graph Tags" size="small">
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>OG Title</Title>
              <Paragraph>{record.ogTitle || 'Not set'}</Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>OG Description</Title>
              <Paragraph>{record.ogDescription || 'Not set'}</Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>OG Image</Title>
              <Paragraph copyable={!!record.ogImage}>
                {record.ogImage || 'Not set'}
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Twitter Card Tags" size="small">
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>Twitter Title</Title>
              <Paragraph>{record.twitterTitle || 'Not set'}</Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>Twitter Description</Title>
              <Paragraph>{record.twitterDescription || 'Not set'}</Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>Twitter Image</Title>
              <Paragraph copyable={!!record.twitterImage}>
                {record.twitterImage || 'Not set'}
              </Paragraph>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Custom Schema" size="small">
            <Title level={5}>JSON-LD Schema</Title>
            <Paragraph>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                fontSize: '12px',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {record.customSchema || 'No custom schema defined'}
              </pre>
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Card title="Search Engine Preview" size="small" style={{ marginTop: 16 }}>
        <div className="search-preview">
          <div className="title">{record.title}</div>
          <div className="url">{record.canonical}</div>
          <div className="description">{record.description}</div>
        </div>
      </Card>

      <style jsx>{`
        .search-preview {
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 4px;
          margin-top: 8px;
          max-width: 600px;
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
    </Show>
  );
}
