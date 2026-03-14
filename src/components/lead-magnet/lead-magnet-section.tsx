"use client";

import React, { useState } from "react";
import { Button, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useTranslation } from "@contexts/translation.context";
import { trackCtaClick } from "@lib/analytics";

const { Title, Paragraph } = Typography;

const GUIDE_PDF_URL = "/api/services/guide-pdf";
const PDF_FILENAME = "CUMI-Services-Guide.pdf";

export default function LeadMagnetSection() {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const downloadPdfGuide = async () => {
    trackCtaClick("lead_magnet_guide", GUIDE_PDF_URL);
    setDownloading(true);
    try {
      const res = await fetch(GUIDE_PDF_URL);
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = PDF_FILENAME;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(GUIDE_PDF_URL, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section
      style={{
        padding: "64px 24px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container bg-none" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "rgba(34, 197, 94, 0.15)",
            borderRadius: "50px",
            marginBottom: "20px",
          }}
        >
          <DownloadOutlined style={{ color: "#22C55E", fontSize: "18px" }} />
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#166534" }}>
            {t("lead_magnet.cta")}
          </span>
        </div>
        <Title level={2} style={{ marginBottom: "12px", color: "#1e293b", fontWeight: "700" }}>
          {t("lead_magnet.title")}
        </Title>
        <Paragraph
          style={{
            fontSize: "1.125rem",
            color: "#64748b",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}
        >
          {t("lead_magnet.subtitle")}
        </Paragraph>
        <Button
          type="primary"
          size="large"
          shape="round"
          icon={<DownloadOutlined />}
          onClick={downloadPdfGuide}
          loading={downloading}
          style={{
            background: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
            border: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
          }}
        >
          {t("lead_magnet.cta")}
        </Button>
      </div>
    </section>
  );
}
