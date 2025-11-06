import { Card, Space, Typography, Button } from "antd";
import React from "react";
import { IPost } from "@domain/models/post.model";
import Link from "next/link";
import { ICategory } from "@domain/models/category";
import { IUser } from "@domain/models/user";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiCalendarDate, CiFolderOn } from "react-icons/ci";
import { format } from "@utils/format";
import useWindowSize from "@hooks/windows-resize/window-resize.hook";
import Image from "next/image";
import { ReadMoreButton } from "@components/shared/modern-button-styles";
import { EyeOutlined } from "@ant-design/icons";
import { useTranslation } from "@contexts/translation.context";

const { Meta } = Card;
const { Title } = Typography;

export interface PostItemProps {
  post: IPost;
  categories: ICategory[] | undefined;
  users: IUser[] | undefined;
}

const BlogPostItem = ({ post, users, categories }: PostItemProps) => {
  const categoryDescription = categories?.find((c) => c.id === post.categoryId);
  const userDescription = users?.find((c) => c.id === post.authorId);
  const { width } = useWindowSize();
  const { t } = useTranslation();
  return (
    <Card
      hoverable
      style={{ width: "100%" }}
      styles={{ header: { overflow: "hidden" } }}
      key={post.id}
      className="bg-white border-0 shadow"
      cover={
        <Link href={`/blog-posts/${post.slug}`}>
          <Image
            alt={post.title}
            src={post.imageUrl}
            height={500}
            width={1200}
            quality={100}
            style={{
              height: 250,
              objectFit: "cover",
              width: "100%",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />
        </Link>
      }
      actions={[
        <ReadMoreButton
          key="read-more"
          icon={<EyeOutlined />}
          onClick={() => window.location.href = `/blog-posts/${post.slug}`}
          style={{
            background: 'transparent',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            color: '#667eea',
            borderRadius: '12px',
            fontWeight: 500,
            fontSize: '14px',
            height: '40px',
            padding: '0 20px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
            e.currentTarget.style.borderColor = '#667eea';
            e.currentTarget.style.color = '#667eea';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
            e.currentTarget.style.color = '#667eea';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {t("blog.read_more")}
        </ReadMoreButton>
      ]}
    >
      <Meta
        title={
          <Link href={`/blog-posts/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Title level={4} style={{ marginBottom: 10, textWrap: "wrap" }}>
              {post.title}
            </Title>
          </Link>
        }
        description={
          <div className="w-100">
            {width > 767 && (
              <Space style={{ marginBottom: 5, flexWrap: "wrap" }}>
                <Typography.Text className="text-secondary">
                  <FaRegCircleUser /> {userDescription?.username}
                </Typography.Text>
                <Typography.Text className="text-secondary">
                  <CiFolderOn /> {categoryDescription?.name}
                </Typography.Text>
                <Typography.Text className="text-secondary">
                  <CiCalendarDate /> {format.date(post?.publishedAt)}
                </Typography.Text>
              </Space>
            )}
            <Typography.Paragraph>{post.description}</Typography.Paragraph>
            {width < 767 && (
              <Space style={{ marginBottom: 5, flexWrap: "wrap" }}>
                <Typography.Text className="text-secondary">
                  <FaRegCircleUser /> {userDescription?.username}
                </Typography.Text>
                <Typography.Text className="text-secondary">
                  <CiCalendarDate /> {format.date(post?.publishedAt)}
                </Typography.Text>
              </Space>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default BlogPostItem;
