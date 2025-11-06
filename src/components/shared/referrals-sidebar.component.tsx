"use client";

import React, { useState } from "react";
import { Card, Typography, Button, Tag, Space, Tooltip, Spin, Row, Col, Divider } from "antd";
import { LinkOutlined, StarOutlined, GiftOutlined, FireOutlined } from "@ant-design/icons";
import { useFetchReferralsQuery, useTrackReferralClickMutation } from "@store/api/referral_api";
import { IReferral } from "@domain/models/referral.model";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

interface ReferralsSidebarProps {
  category?: string;
  limit?: number;
  title?: string;
  style?: React.CSSProperties;
}

export default function ReferralsSidebar({
  category,
  limit = 3,
  title = "Recommended Tools",
  style = {}
}: ReferralsSidebarProps) {
  const { data: referrals = [], isLoading: loading } = useFetchReferralsQuery({
    category,
    limit,
    featured: true,
  });
  
  const [trackClick] = useTrackReferralClickMutation();
  const [clickedIds, setClickedIds] = useState<Set<string>>(new Set());

  const handleReferralClick = async (referralId: string, referralUrl: string) => {
    try {
      const sessionId = `session_${Date.now()}`;
      await trackClick({
        referralId,
        sessionId,
        referrer: window.location.href,
      }).unwrap();

      // Mark as clicked to prevent double clicks
      setClickedIds(prev => new Set(prev).add(referralId));
      
      // Open link in new tab
      window.open(referralUrl, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open(referralUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Card style={{ ...style, textAlign: 'center', padding: '24px 0' }}>
        <Spin size="small" />
        <div style={{ marginTop: 12, fontSize: 13, color: '#999' }}>Loading recommendations...</div>
      </Card>
    );
  }

  if (referrals.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        style={{
          ...style,
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header */}
        <div style={{ 
          padding: '20px 20px 16px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
          borderBottom: '2px solid rgba(34, 197, 94, 0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)',
            }}>
              <GiftOutlined style={{ color: 'white', fontSize: 18 }} />
            </div>
            <div>
              <Text strong style={{ fontSize: 16, color: '#1f2937', display: 'block', lineHeight: 1.2 }}>
                {title}
              </Text>
              <Text style={{ fontSize: 11, color: '#6b7280' }}>
                Curated recommendations for you
              </Text>
            </div>
          </div>
        </div>

        {/* Referrals List */}
        <div style={{ padding: '20px' }}>
          {referrals.map((referral, index) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{ marginBottom: index < referrals.length - 1 ? 20 : 0 }}
            >
              <div
                style={{
                  padding: '16px',
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#22C55E';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Referral Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Text strong style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.3 }}>
                        {referral.name}
                      </Text>
                      {referral.isFeatured && (
                        <Tooltip title="Featured recommendation">
                          <FireOutlined style={{ color: '#ff6b00', fontSize: 14 }} />
                        </Tooltip>
                      )}
                    </div>
                    <Space size={4} wrap style={{ marginBottom: 8 }}>
                      <Tag 
                        color="cyan" 
                        style={{ 
                          fontSize: 11, 
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontWeight: 500,
                        }}
                      >
                        {referral.category}
                      </Tag>
                      {referral.discount && (
                        <Tag 
                          color="success" 
                          style={{ 
                            fontSize: 10, 
                            padding: '2px 6px',
                            borderRadius: 6,
                            fontWeight: 600,
                          }}
                        >
                          {referral.discount}
                        </Tag>
                      )}
                    </Space>
                  </div>
                  
                  {/* Rating */}
                  {referral.rating > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <StarOutlined style={{ color: '#fbbf24', fontSize: 12 }} />
                        <Text strong style={{ fontSize: 13, color: '#1f2937' }}>
                          {referral.rating}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <Paragraph 
                  ellipsis={{ rows: 2 }} 
                  style={{ 
                    marginBottom: 12, 
                    fontSize: 13, 
                    color: '#6b7280',
                    lineHeight: 1.5,
                  }}
                >
                  {referral.description}
                </Paragraph>

                {/* Button */}
                <Button
                  type="primary"
                  size="middle"
                  icon={<LinkOutlined />}
                  onClick={() => handleReferralClick(referral.id, referral.referralUrl)}
                  style={{ 
                    width: '100%',
                    height: 40,
                    borderRadius: 10,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                    border: 'none',
                    boxShadow: clickedIds.has(referral.id) 
                      ? '0 2px 8px rgba(34, 197, 94, 0.3)'
                      : '0 2px 8px rgba(34, 197, 94, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    if (!clickedIds.has(referral.id)) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!clickedIds.has(referral.id)) {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.2)';
                    }
                  }}
                >
                  {referral.discount ? `Get ${referral.discount}` : 'Visit Now'}
                </Button>
              </div>

              {index < referrals.length - 1 && (
                <Divider style={{ margin: 0 }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '12px 20px',
          background: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
          borderRadius: '0 0 16px 16px',
        }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            💡 Affiliate links • I earn a small commission at no extra cost to you
          </Text>
        </div>
      </Card>
    </motion.div>
  );
}

