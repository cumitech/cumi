"use client";

import { Card, Typography, Space } from "antd";
import ImageFallback from "@components/shared/image-fallback";
import Link from "next/link";

const { Title, Text } = Typography;

interface TutorialDetailSidebarProps {
  related: Array<{ id: string; title: string; slug: string; imageUrl?: string; createdAt?: string }>;
}

export default function TutorialDetailSidebar({ related = [] }: TutorialDetailSidebarProps) {
  if (!related || related.length === 0) return null;
  return (
    <Card title={<span>Related Tutorials</span>} style={{ borderRadius: 16 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {related.map((t) => (
          <Link key={t.id} href={`/tutorials/${t.slug}`}>
            <Card hoverable size="small" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {t.imageUrl && (
                  <ImageFallback src={t.imageUrl} alt={t.title} width={64} height={64} style={{ borderRadius: 8, objectFit: 'cover' }} />
                )}
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ margin: 0, fontSize: 14 }}>{t.title}</Title>
                  {t.createdAt && (
                    <Text type="secondary" style={{ fontSize: 12 }}>{new Date(t.createdAt).toLocaleDateString()}</Text>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </Space>
    </Card>
  );
}


