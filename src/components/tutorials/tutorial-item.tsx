"use client";

import Link from "next/link";
import ImageFallback from "@components/shared/image-fallback";
import { Card, Typography, Tag, Avatar } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { format } from "@utils/format";

const { Title, Text, Paragraph } = Typography;

interface TutorialItemProps {
  tutorial: any;
  subcategories?: Array<{ id: string; name: string }>;
  users?: any[];
}

export default function TutorialItem({
  tutorial,
  subcategories = [],
  users = [],
}: TutorialItemProps) {
  const subcatName =
    tutorial?.Subcategory?.name ||
    subcategories.find((s) => s.id === tutorial?.subcategoryId)?.name;
  // Otherwise, fall back to finding it in the users array prop
  const author = tutorial?.User || users?.find((u: any) => u.id === tutorial?.authorId);
  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      aria-label={`Open tutorial ${tutorial.title}`}
    >
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(-8px)";
          el.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.12)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
        }}
      >
        <Card
          hoverable={false}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "none",
            height: "100%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
          bodyStyle={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
          cover={
            tutorial.imageUrl ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%",
                  overflow: "hidden",
                  background: "#f0f0f0",
                }}
              >
                <ImageFallback
                  src={tutorial.imageUrl}
                  fallback="/favicon.svg"
                  alt={tutorial.title}
                  fill
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />
            )
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              padding: "16px",
              flex: 1,
            }}
          >
            {/* Tags - Category and Tutorial */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {subcatName && (
                <Tag
                  color="blue"
                  style={{
                    borderRadius: 6,
                    margin: 0,
                    fontSize: "12px",
                    fontWeight: 500,
                    border: "none",
                  }}
                >
                  {subcatName}
                </Tag>
              )}
              <Tag
                color="green"
                style={{
                  borderRadius: 6,
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 500,
                  border: "none",
                }}
              >
                Tutorial
              </Tag>
            </div>

            {/* Title */}
            <Title
              level={4}
              style={{
                margin: 0,
                padding: 0,
                lineHeight: 1.4,
                fontSize: "18px",
                fontWeight: 600,
                color: "#1f2937",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {tutorial.title}
            </Title>

            {/* Description - Sliced/Truncated */}
            {tutorial.description && (
              <Paragraph
                type="secondary"
                style={{
                  margin: 0,
                  padding: 0,
                  fontSize: "14px",
                  lineHeight: 1.5,
                  color: "#6b7280",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {tutorial.description}
              </Paragraph>
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Date Published */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "8px",
              }}
            >
              <CalendarOutlined
                style={{ color: "#9ca3af", fontSize: "13px" }}
              />
              <Text
                type="secondary"
                style={{ fontSize: "12px", margin: 0, color: "#9ca3af" }}
              >
                {format.date(tutorial.publishedAt || tutorial.createdAt)}
              </Text>
            </div>

            {/* Author */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <Avatar
                size={24}
                src={author?.profileImage}
                icon={<UserOutlined />}
                style={{ flexShrink: 0 }}
              />
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  margin: 0,
                  color: "#6b7280",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {author?.fullname || author?.username || "Unknown Author"}
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  );
}
