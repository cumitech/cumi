"use client";

import { Card, Typography } from "antd";
import { useTranslation } from "@contexts/translation.context";

const { Title, Paragraph } = Typography;

export default function TutorialsHeader() {
  const { t } = useTranslation();
  return (
    <Card
      className="tutorials-header-card"
      style={{
        borderRadius: 16,
        background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
        border: "1px solid rgba(148, 163, 184, 0.7)",
        marginBottom: 24,
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Title level={2} style={{ margin: 0, color: "#3730a3" }}>
        {t('tutorials.title')}
      </Title>
      <Paragraph style={{ marginTop: 8, color: "#4b5563" }}>
        {t('tutorials.subtitle') || 'Explore step-by-step guides crafted to help you learn efficiently.'}
      </Paragraph>
    </Card>
  );
}


