"use client";

import React from "react";
import {
  Card,
  Typography,
  Button,
  Tag,
  Rate,
  Space,
  Tooltip,
  Badge,
  Spin,
} from "antd";
import {
  LinkOutlined,
  StarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useFetchReferralsQuery } from "@store/api/referral_api";
import { IReferral } from "@domain/models/referral.model";

const { Title, Text, Paragraph } = Typography;

interface RecommendationWidgetProps {
  category?: string;
  limit?: number;
  title?: string;
  style?: React.CSSProperties;
}

export default function RecommendationWidget({
  category,
  limit = 1,
  title = "Recommended Tool",
  style = {}
}: RecommendationWidgetProps) {
  // Use RTK Query to fetch referrals
  const { data: referrals = [], isLoading: loading } = useFetchReferralsQuery({
    category,
    limit,
  });

  const handleReferralClick = async (referralId: string, referralUrl: string) => {
    try {
      await fetch(`/api/referrals/${referralId}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: null, // Sidebar widgets might not have user context
          sessionId: 'sidebar-widget',
          referrer: window.location.href,
        }),
      });

      window.open(referralUrl, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open(referralUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Card style={{ ...style, textAlign: 'center', padding: '20px 0' }}>
        <Spin size="small" />
        <div style={{ marginTop: 8, fontSize: 12 }}>Loading...</div>
      </Card>
    );
  }

  if (referrals.length === 0) {
    return null;
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StarOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
        </div>
      }
      style={{
        ...style,
        borderRadius: 8,
        border: '1px solid #d9d9d9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      size="small"
    >
      {referrals.map((referral) => (
        <div key={referral.id} style={{ marginBottom: referrals.length > 1 ? 16 : 0 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text strong style={{ fontSize: 14 }}>
                {referral.name}
              </Text>
              {referral.isFeatured && (
                <Badge count="★" style={{ backgroundColor: '#1890ff', fontSize: 10 }} />
              )}
            </div>
            
            <div style={{ marginBottom: 8 }}>
              <Space size={4}>
                <Tag color="blue">{referral.category}</Tag>
                <Rate disabled defaultValue={referral.rating} style={{ fontSize: 10 }} />
              </Space>
            </div>

            <Paragraph 
              ellipsis={{ rows: 2 }} 
              style={{ marginBottom: 12, fontSize: 12, color: '#666' }}
            >
              {referral.description}
            </Paragraph>

            {referral.discount && (
              <div style={{ marginBottom: 12 }}>
                <Tag color="green" style={{ fontSize: 11 }}>
                  <DollarOutlined /> {referral.discount}
                </Tag>
              </div>
            )}

            <Tooltip title={referral.personalExperience}>
              <Text type="secondary" style={{ fontSize: 11, fontStyle: 'italic' }}>
                &quot;I use this for...&quot;
              </Text>
            </Tooltip>
          </div>

          <Button
            type="primary"
            size="small"
            icon={<LinkOutlined />}
            onClick={() => handleReferralClick(referral.id, referral.referralUrl)}
            style={{ width: '100%', fontSize: 12 }}
          >
            {referral.discount ? `Get ${referral.discount}` : 'Try Now'}
          </Button>

          {referrals.length > 1 && referral.id !== referrals[referrals.length - 1].id && (
            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 16 }} />
          )}
        </div>
      ))}

      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 10 }}>
          I earn a commission when you sign up
        </Text>
      </div>
    </Card>
  );
}
