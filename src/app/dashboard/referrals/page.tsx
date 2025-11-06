"use client";

import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import { Space, Table, Tag, Button, Card, Row, Col, Statistic } from "antd";
import { PlusOutlined, StarOutlined, DollarOutlined, BarChartOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ReferralList() {
  const router = useRouter();
  const resource = "referrals";
  const { tableProps } = useTable({
    resource,
    syncWithLocation: true,
  });

  const [stats, setStats] = useState({
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/referrals/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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

  return (
    <>
      <EnhancedBreadcrumb
        items={[
          { title: "Referrals" },
          { title: "Lists" }
        ]}
        showBackButton={false}
      />
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Clicks"
              value={stats.totalClicks}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Conversions"
              value={stats.totalConversions}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={stats.conversionRate}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Earnings"
              value={stats.totalEarnings}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <List
        title="Referrals List"
        headerButtons={[
          <Button
            key="create-referral"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/dashboard/referrals/create')}
          >
            Create Referral
          </Button>
        ]}
      >
        <Table 
          {...tableProps} 
          rowKey="id"
          scroll={{ x: true }}
        >
          <Table.Column
            dataIndex="name"
            title="Name"
            render={(value, record: BaseRecord) => (
              <Space>
                <strong>{value}</strong>
                {record.isFeatured && (
                  <Tag color="green" icon={<StarOutlined />}>
                    Featured
                  </Tag>
                )}
              </Space>
            )}
          />
          <Table.Column
            dataIndex="company"
            title="Company"
          />
          <Table.Column
            dataIndex="category"
            title="Category"
            render={(value: string) => (
              <Tag color={getCategoryColor(value)}>
                {value}
              </Tag>
            )}
          />
          <Table.Column
            dataIndex="priceRange"
            title="Price Range"
            render={(value: string) => (
              <Tag color={getPriceRangeColor(value)}>
                {value}
              </Tag>
            )}
          />
          <Table.Column
            dataIndex="rating"
            title="Rating"
            render={(value: number) => (
              <Space>
                {Array.from({ length: 5 }, (_, index) => (
                  <StarOutlined
                    key={index}
                    style={{
                      color: index < value ? '#faad14' : '#d9d9d9',
                      fontSize: '12px'
                    }}
                  />
                ))}
                <span>({value}/5)</span>
              </Space>
            )}
          />
          <Table.Column
            dataIndex="clickCount"
            title="Clicks"
            render={(value: number) => (
              <Tag color="blue">{value}</Tag>
            )}
          />
          <Table.Column
            dataIndex="conversionCount"
            title="Conversions"
            render={(value: number) => (
              <Tag color="green">{value}</Tag>
            )}
          />
          <Table.Column
            dataIndex="isActive"
            title="Status"
            render={(value: boolean) => (
              <Tag color={value ? 'green' : 'red'}>
                {value ? 'Active' : 'Inactive'}
              </Tag>
            )}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <EditButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
    </>
  );
}