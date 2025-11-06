"use client";

import Link from "next/link";
import { Card, Space, Tag, Typography } from "antd";

const { Text } = Typography;

interface TutorialSubcategory {
  id: string;
  name: string;
  slug?: string;
}

interface TutorialCategoriesProps {
  subcategories: TutorialSubcategory[];
  allTutorials: Array<{ subcategoryId?: string | null }>;
  title?: string;
  activeSubcategoryId?: string;
  activeSubcategorySlug?: string;
}

export default function TutorialCategories({
  subcategories,
  allTutorials,
  title = "Topics Covered",
  activeSubcategoryId,
  activeSubcategorySlug,
}: TutorialCategoriesProps) {
  return (
    <Card
      style={{
        borderRadius: "16px",
        background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        border: "1px solid #e5e7eb",
      }}
      title={<span>{title}</span>}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {subcategories && subcategories.length > 0 ? (
          subcategories.map((subcat) => {
            const count = allTutorials.filter(
              (t: any) => t.subcategoryId === subcat.id
            ).length;

            const href = subcat.slug
              ? `/tutorials?subcategory=${encodeURIComponent(subcat.slug)}`
              : `/tutorials?subcategoryId=${encodeURIComponent(subcat.id)}`;

            const isActive =
              (!!activeSubcategoryId && activeSubcategoryId === subcat.id) ||
              (!!activeSubcategorySlug && activeSubcategorySlug === subcat.slug);

            return (
              <Link key={subcat.id} href={href} aria-label={`Filter tutorials by ${subcat.name}`}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: isActive ? "#eef2ff" : "transparent",
                    border: isActive ? "1px solid #6366f1" : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Text strong>{subcat.name}</Text>
                  <Tag color={isActive ? "geekblue" : "blue"}>{count}</Tag>
                </div>
              </Link>
            );
          })
        ) : (
          <Text type="secondary">No topics available</Text>
        )}
      </Space>
    </Card>
  );
}


