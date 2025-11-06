"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { 
  Typography, 
  Tag, 
  Space, 
  Card, 
  Row, 
  Col, 
  Statistic,
  Rate,
  Button,
  Divider
} from "antd";
import { 
  StarOutlined, 
  DollarOutlined, 
  BarChartOutlined,
  LinkOutlined,
  EditOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

export default function ReferralShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const router = useRouter();

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      hosting: 'blue',
      tools: 'green',
      finance: 'gold',
      marketing: 'purple',
      education: 'cyan',
      other: 'default'
    };
    return colors[category] || 'default';
  };

  const getPriceRangeColor = (priceRange: string) => {
    const colors: { [key: string]: string } = {
      free: 'green',
      budget: 'blue',
      'mid-range': 'orange',
      premium: 'red'
    };
    return colors[priceRange] || 'default';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarOutlined
        key={index}
        style={{
          color: index < rating ? '#faad14' : '#d9d9d9',
          fontSize: '16px'
        }}
      />
    ));
  };

  return (
    <>
      <PageBreadCrumbs items={["Referrals", "Lists", "Show"]} />
      <Show 
        isLoading={isLoading}
        headerButtons={[
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/referrals/edit/${record?.id}`)}
          >
            Edit Referral
          </Button>
        ]}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Basic Information" style={{ marginBottom: 16 }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    {record?.name}
                    {record?.isFeatured && (
                      <Tag color="green" icon={<StarOutlined />} style={{ marginLeft: 8 }}>
                        Featured
                      </Tag>
                    )}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>
                    by {record?.company}
                  </Text>
                </div>

                <div>
                  <Space wrap>
                    <Tag color={getCategoryColor(record?.category)}>
                      {record?.category}
                    </Tag>
                    <Tag color={getPriceRangeColor(record?.priceRange)}>
                      {record?.priceRange}
                    </Tag>
                    <Tag color={record?.isActive ? 'green' : 'red'}>
                      {record?.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                  </Space>
                </div>

                <div>
                  <Title level={5}>Description</Title>
                  <Paragraph>{record?.description}</Paragraph>
                </div>

                {record?.useCase && (
                  <div>
                    <Title level={5}>Use Case</Title>
                    <Paragraph>{record?.useCase}</Paragraph>
                  </div>
                )}

                {record?.personalExperience && (
                  <div>
                    <Title level={5}>Personal Experience</Title>
                    <Paragraph>{record?.personalExperience}</Paragraph>
                  </div>
                )}
              </Space>
            </Card>

            <Card title="URLs & Links" style={{ marginBottom: 16 }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Referral URL:</Text>
                  <br />
                  <Text code style={{ wordBreak: 'break-all' }}>
                    {record?.referralUrl}
                  </Text>
                  <br />
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    onClick={() => window.open(record?.referralUrl, '_blank')}
                    style={{ padding: 0, marginTop: 4 }}
                  >
                    Open Link
                  </Button>
                </div>

                <div>
                  <Text strong>Original URL:</Text>
                  <br />
                  <Text code style={{ wordBreak: 'break-all' }}>
                    {record?.originalUrl}
                  </Text>
                  <br />
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    onClick={() => window.open(record?.originalUrl, '_blank')}
                    style={{ padding: 0, marginTop: 4 }}
                  >
                    Open Link
                  </Button>
                </div>

                {record?.imageUrl && (
                  <div>
                    <Text strong>Image URL:</Text>
                    <br />
                    <Text code style={{ wordBreak: 'break-all' }}>
                      {record?.imageUrl}
                    </Text>
                  </div>
                )}

                {record?.logoUrl && (
                  <div>
                    <Text strong>Logo URL:</Text>
                    <br />
                    <Text code style={{ wordBreak: 'break-all' }}>
                      {record?.logoUrl}
                    </Text>
                  </div>
                )}
              </Space>
            </Card>

            <Card title="Additional Information">
              <Row gutter={[16, 16]}>
                {(() => {
                  // Parse features from JSON string or object
                  const parseField = (field: any): Record<string, string> => {
                    if (!field) return {};
                    if (typeof field === 'string') {
                      try { return JSON.parse(field); } catch { return {}; }
                    }
                    if (typeof field === 'object' && !Array.isArray(field)) return field;
                    return {};
                  };
                  
                  const features = parseField(record?.features);
                  const pros = parseField(record?.pros);
                  const cons = parseField(record?.cons);
                  
                  // Parse target audience (boolean object)
                  const parseAudience = (field: any): Record<string, boolean> => {
                    if (!field) return {};
                    if (typeof field === 'string') {
                      try { return JSON.parse(field); } catch { return {}; }
                    }
                    if (typeof field === 'object' && !Array.isArray(field)) return field;
                    return {};
                  };
                  
                  const targetAudience = parseAudience(record?.targetAudience);
                  
                  return (
                    <>
                      {Object.keys(features).length > 0 && (
                        <Col xs={24} md={12}>
                          <Title level={5}>Features</Title>
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {Object.entries(features).map(([key, value]) => (
                              <div key={key}>
                                <Text strong>{key}:</Text> <Text>{value as string}</Text>
                              </div>
                            ))}
                          </Space>
                        </Col>
                      )}

                      {Object.keys(pros).length > 0 && (
                        <Col xs={24} md={12}>
                          <Title level={5}>Pros</Title>
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {Object.entries(pros).map(([key, value]) => (
                              <div key={key}>
                                <Text strong>{key}:</Text> <Text>{value as string}</Text>
                              </div>
                            ))}
                          </Space>
                        </Col>
                      )}

                      {Object.keys(cons).length > 0 && (
                        <Col xs={24} md={12}>
                          <Title level={5}>Cons</Title>
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {Object.entries(cons).map(([key, value]) => (
                              <div key={key}>
                                <Text strong>{key}:</Text> <Text>{value as string}</Text>
                              </div>
                            ))}
                          </Space>
                        </Col>
                      )}

                      {Object.keys(targetAudience).filter(key => targetAudience[key] === true).length > 0 && (
                        <Col xs={24} md={12}>
                          <Title level={5}>Target Audience</Title>
                          <Space wrap>
                            {Object.entries(targetAudience)
                              .filter(([_, value]) => value === true)
                              .map(([key]) => (
                                <Tag key={key} color="purple">{key}</Tag>
                              ))}
                          </Space>
                        </Col>
                      )}
                    </>
                  );
                })()}
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Statistics" style={{ marginBottom: 16 }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Statistic
                  title="Rating"
                  value={record?.rating || 0}
                  suffix="/5"
                  prefix={
                    <Space>
                      {renderStars(record?.rating || 0)}
                    </Space>
                  }
                />

                <Statistic
                  title="Priority"
                  value={record?.priority || 0}
                  suffix="/100"
                />

                <Statistic
                  title="Total Clicks"
                  value={record?.clickCount || 0}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />

                <Statistic
                  title="Conversions"
                  value={record?.conversionCount || 0}
                  prefix={<StarOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />

                {record?.clickCount > 0 && (
                  <Statistic
                    title="Conversion Rate"
                    value={((record?.conversionCount || 0) / record?.clickCount * 100)}
                    suffix="%"
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                  />
                )}
              </Space>
            </Card>

            <Card title="Promotional Information">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {record?.discount && (
                  <div>
                    <Text strong>Discount:</Text>
                    <br />
                    <Tag color="red" style={{ marginTop: 4 }}>
                      {record?.discount}
                    </Tag>
                  </div>
                )}

                {record?.bonus && (
                  <div>
                    <Text strong>Bonus:</Text>
                    <br />
                    <Tag color="blue" style={{ marginTop: 4 }}>
                      {record?.bonus}
                    </Tag>
                  </div>
                )}

                <Divider />

                <div>
                  <Text strong>Created:</Text>
                  <br />
                  <Text type="secondary">
                    {record?.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}
                  </Text>
                </div>

                <div>
                  <Text strong>Last Updated:</Text>
                  <br />
                  <Text type="secondary">
                    {record?.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : 'N/A'}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Show>
    </>
  );
}
