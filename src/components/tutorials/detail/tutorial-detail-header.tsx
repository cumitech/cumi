"use client";

import { Typography, Tag, Space, Avatar } from "antd";
import ImageFallback from "@components/shared/image-fallback";
import { BookOutlined, UserOutlined } from "@ant-design/icons";
import { format } from "@utils/format";

const { Title, Text, Paragraph } = Typography;

interface TutorialDetailHeaderProps {
  title: string;
  description?: string;
  imageUrl?: string;
  author?: { fullName?: string; username?: string; profileImage?: string };
  subcategoryName?: string;
  publishedAt?: string;
}

export default function TutorialDetailHeader({ title, description, imageUrl, author, subcategoryName, publishedAt }: TutorialDetailHeaderProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: 16,
          padding: 24,
          color: 'white',
          marginBottom: 16,
        }}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Space size={8} wrap>
            <Tag icon={<BookOutlined />} color="#22c55e" style={{ borderRadius: 12, color: '#052e16' }}>Tutorial</Tag>
            {subcategoryName && (
              <Tag color="#38bdf8" style={{ borderRadius: 12, color: '#082f49' }}>{subcategoryName}</Tag>
            )}
          </Space>
          <Title level={1} style={{ color: 'white', margin: 0 }}>{title}</Title>
          {description && (
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>{description}</Paragraph>
          )}
          <Space size={16} wrap>
            {author && (
              <Space>
                <Avatar src={author.profileImage} icon={<UserOutlined />} />
                <Text style={{ color: 'white' }}>{author.fullName || author.username}</Text>
              </Space>
            )}
            {publishedAt && (
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                {format.date(new Date(publishedAt))}
              </Text>
            )}
          </Space>
        </Space>
      </div>

      {imageUrl && (
        <div style={{ position: 'relative', width: '100%', height: 420, borderRadius: 16, overflow: 'hidden' }}>
          <ImageFallback src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} />
        </div>
      )}
    </div>
  );
}


