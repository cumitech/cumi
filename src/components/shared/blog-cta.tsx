"use client";

import React from "react";
import {
  Card,
  Typography,
  Button,
  Tag,
  Rate,
  Space,
  Divider,
  Alert,
} from "antd";
import {
  LinkOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  useFetchReferralsQuery,
  useTrackReferralClickMutation,
} from "@store/api/referral_api";

const { Title, Text, Paragraph } = Typography;

interface BlogCTAProps {
  category?: string;
  title?: string;
  description?: string;
  style?: React.CSSProperties;
}

export default function BlogCTA({
  category,
  title = "Ready to Take the Next Step?",
  description = "If you found this helpful, here's a tool I recommend for implementing what we discussed:",
  style = {}
}: BlogCTAProps) {
  // Use RTK Query to fetch referrals
  const { data: referrals = [], isLoading: loading } = useFetchReferralsQuery({
    category,
    limit: 1,
  });

  // Use RTK Query mutation for tracking clicks
  const [trackClick] = useTrackReferralClickMutation();

  const referral = referrals.length > 0 ? referrals[0] : null;

  const handleReferralClick = async (referralId: string, referralUrl: string) => {
    try {
      // Track click using RTK Query mutation
      await trackClick({
        referralId,
        sessionId: 'blog-cta',
        referrer: window.location.href,
      }).unwrap();

      window.open(referralUrl, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
      // Still open the link even if tracking fails
      window.open(referralUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Card style={{ ...style, textAlign: 'center', padding: '20px 0' }}>
        <Text type="secondary">Loading recommendation...</Text>
      </Card>
    );
  }

  if (!referral) {
    return null;
  }

  return (
    <Card
      style={{
        ...style,
        borderRadius: 12,
        border: '2px solid #1890ff',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        marginTop: 32,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ color: '#1890ff', marginBottom: 8 }}>
          {title}
        </Title>
        <Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 0 }}>
          {description}
        </Paragraph>
      </div>

      <Card
        style={{
          borderRadius: 8,
          border: '1px solid #d9d9d9',
          background: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                {referral.name}
              </Title>
              {referral.isFeatured && (
                <Tag color="blue" style={{ fontSize: 10 }}>Featured</Tag>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <Space size={8}>
                <Tag color="blue">{referral.category}</Tag>
                <Rate disabled defaultValue={referral.rating} style={{ fontSize: 12 }} />
              </Space>
            </div>

            <Paragraph 
              ellipsis={{ rows: 2 }} 
              style={{ marginBottom: 12, fontSize: 14 }}
            >
              {referral.description}
            </Paragraph>

            <div style={{ marginBottom: 12 }}>
              <Text strong style={{ fontSize: 13, color: '#666' }}>Perfect for: </Text>
              <Text style={{ fontSize: 13 }}>{referral.useCase}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontStyle: 'italic', color: '#666' }}>
                &quot;{referral.personalExperience}&quot;
              </Text>
            </div>

            {referral.discount && (
              <Alert
                message={`Special Offer: ${referral.discount}`}
                type="success"
                showIcon
                style={{ marginBottom: 16, fontSize: 12 }}
              />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Button
              type="primary"
              size="large"
              icon={<LinkOutlined />}
              onClick={() => handleReferralClick(referral.id, referral.referralUrl)}
              style={{
                minWidth: 140,
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              {referral.discount ? `Get ${referral.discount}` : 'Try Now'}
            </Button>

            <Text type="secondary" style={{ fontSize: 11, textAlign: 'center' }}>
              I earn a commission when you sign up
            </Text>
          </div>
        </div>
      </Card>

      <Divider style={{ margin: '16px 0' }} />

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
          This is a tool I personally use and recommend. Your support helps me continue creating valuable content.
        </Text>
      </div>
    </Card>
  );
}
