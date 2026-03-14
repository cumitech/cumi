"use client";

import React from "react";
import { Typography } from "antd";
import { useTranslation } from "@contexts/translation.context";
import styles from "./process-flow-section.module.css";

const { Title, Paragraph, Text } = Typography;

const STEPS = [
  { key: "discovery", num: "1", titleKey: "process.discovery", descKey: "process.discovery_desc" },
  { key: "design", num: "2", titleKey: "process.design", descKey: "process.design_desc" },
  { key: "development", num: "3", titleKey: "process.development", descKey: "process.development_desc" },
  { key: "review", num: "4", titleKey: "process.review", descKey: "process.review_desc" },
  { key: "launch", num: "5", titleKey: "process.launch", descKey: "process.launch_desc" },
];

export default function ProcessFlowSection() {
  const { t } = useTranslation();

  return (
    <section
      style={{
        padding: "80px 24px",
        background: "#ffffff",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <Title level={2} style={{ marginBottom: "12px", color: "#1e293b", fontWeight: "700", fontSize: "1.75rem" }}>
            {t("process.title")}
          </Title>
          <Paragraph style={{ fontSize: "1.0625rem", color: "#64748b", margin: 0, maxWidth: "520px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            {t("process.subtitle")}
          </Paragraph>
        </div>

        {/* Desktop: horizontal timeline with connector */}
        <div
          className={styles.processFlowDesktop}
          style={{
            display: "none",
            alignItems: "flex-start",
            justifyContent: "space-between",
            position: "relative",
            gap: "0",
          }}
        >
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.key}>
              <div
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    border: "2px solid #22C55E",
                    color: "#22C55E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "1.25rem",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(34, 197, 94, 0.15)",
                  }}
                >
                  {step.num}
                </div>
                <div style={{ marginTop: "20px", textAlign: "center", padding: "0 8px" }}>
                  <Text strong style={{ fontSize: "1rem", color: "#1e293b", display: "block", marginBottom: "6px" }}>
                    {t(step.titleKey)}
                  </Text>
                  <Paragraph style={{ margin: 0, color: "#64748b", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                    {t(step.descKey)}
                  </Paragraph>
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  style={{
                    flex: "0 0 24px",
                    alignSelf: "flex-start",
                    marginTop: "26px",
                    height: "2px",
                    background: "linear-gradient(90deg, #22C55E 0%, #94a3b8 100%)",
                    opacity: 0.4,
                  }}
                  aria-hidden
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile / tablet: vertical timeline */}
        <div
          className={styles.processFlowVertical}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            position: "relative",
          }}
        >
          {STEPS.map((step, idx) => (
            <div
              key={step.key}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                position: "relative",
                paddingBottom: idx < STEPS.length - 1 ? "8px" : 0,
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  border: "2px solid #22C55E",
                  color: "#22C55E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "1.125rem",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(34, 197, 94, 0.12)",
                }}
              >
                {step.num}
              </div>
              <div style={{ flex: 1, paddingBottom: "32px" }}>
                <Text strong style={{ fontSize: "1.0625rem", color: "#1e293b", display: "block", marginBottom: "4px" }}>
                  {t(step.titleKey)}
                </Text>
                <Paragraph style={{ margin: 0, color: "#64748b", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  {t(step.descKey)}
                </Paragraph>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: "21px",
                    top: "48px",
                    bottom: 0,
                    width: "2px",
                    background: "#e2e8f0",
                  }}
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
