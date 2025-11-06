"use client";
import { useState } from "react";
import { Col, Empty, Layout, Row, Spin, Card, Typography, Input, Select, Space, Tag, Button, Badge, Divider } from "antd";
import { motion } from "framer-motion";
import { postAPI } from "@store/api/post_api";
import { SortPostsType } from "@domain/models/shared/sort.model";
import BlogPostItem from "@components/blog_post/blog_post_item";
import PostSidebar from "@components/blog_post/containers/PostSidebar";
import { categoryAPI } from "@store/api/category_api";
import { tagAPI } from "@store/api/tag_api";
import { userAPI } from "@store/api/user_api";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  FireOutlined,
  StarOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { 
  PageLayout, 
  LoadingSpinner, 
  SearchAndFilterBar 
} from "@components/shared";
import { useTranslation } from "@contexts/translation.context";
import Breadcrumb from "@components/breadcrumb/breadcrumb.component";
import Pagination from "@components/pagination/pagination.component";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function BlogPostsPageComponent() {
  const { t } = useTranslation();
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortPostsType>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

const {
    data: postsResponse,
    error,
    isLoading,
    isFetching,
  } = postAPI.useFetchAllPostsQuery({
    searchTitle: searchTitle,
    sortBy: sortOrder,
    page: currentPage,
    limit: pageSize,
  });

const posts = postsResponse || [];

const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchCategory,
  } = categoryAPI.useFetchAllCategoriesQuery(1);

const {
    data: tags,
    isLoading: isLoadingTag,
    isFetching: isFetchTag,
  } = tagAPI.useFetchAllTagsQuery(1);

const {
    data: users,
    isLoading: isLoadingUser,
    isFetching: isFetchUser,
  } = userAPI.useFetchAllUsersQuery(1);

const loading = isLoadingCategory || isFetchCategory || isLoadingTag || isFetchTag || isLoadingUser || isFetchUser;

return (
      <PageLayout
        showBanner={true}
        bannerTitle={t("blog.title")}
        bannerBreadcrumbs={[{ label: t("blog.breadcrumb"), uri: "blog-posts" }]}
      >
        {/* SEO Breadcrumb with Schema Markup */}
        <div className="container py-3">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog Posts', href: '/blog-posts' }
            ]}
          />
        </div>

<div className="container py-5 mb-5">
        {error && <h1>{t("blog.something_wrong")}</h1>}

{loading ? (
          <div style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
            <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>{t("blog.loading_content")}</div>
            </Card>
          </div>
        ) : (
          <>
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row gutter={[16, 16]} style={{ marginBottom: '2rem' }}>
            <Col xs={12} sm={8}>
              <Card
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)',
                  textAlign: 'center',
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <BookOutlined style={{ fontSize: '32px', color: '#22C55E', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px', color: '#16a34a', fontWeight: 700 }}>
                  {posts?.length || 0}
                </Title>
                <Text style={{ color: '#4b5563', fontSize: '14px', fontWeight: 500 }}>Total Articles</Text>
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
                  border: '1px solid rgba(20, 184, 166, 0.15)',
                  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)',
                  textAlign: 'center',
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <FireOutlined style={{ fontSize: '32px', color: '#14B8A6', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px', color: '#0d9488', fontWeight: 700 }}>
                  {categories?.length || 0}
                </Title>
                <Text style={{ color: '#4b5563', fontSize: '14px', fontWeight: 500 }}>Categories</Text>
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  border: '1px solid rgba(14, 165, 233, 0.15)',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.1)',
                  textAlign: 'center',
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <StarOutlined style={{ fontSize: '32px', color: '#0EA5E9', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px', color: '#0284c7', fontWeight: 700 }}>
                  {tags?.length || 0}
                </Title>
                <Text style={{ color: '#4b5563', fontSize: '14px', fontWeight: 500 }}>Tags</Text>
              </Card>
            </Col>
          </Row>
        </motion.div>

{}
        <Card 
          className="search-filter-card"
          style={{ 
            marginBottom: '2.5rem',
            borderRadius: '20px',
            border: '1px solid rgba(34, 197, 94, 0.1)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          }}
          styles={{ body: { padding: '32px' } }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Text style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <SearchOutlined style={{ marginRight: '6px', color: '#22C55E' }} />
                  Search Articles
                </Text>
                <Input
                  placeholder={t("blog.search_placeholder")}
                  prefix={<SearchOutlined style={{ color: '#22C55E' }} />}
                  size="large"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  allowClear
                  style={{
                    borderRadius: '12px',
                    border: '1.5px solid #e5e7eb',
                    height: '48px',
                    fontSize: '15px',
                  }}
                />
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Text style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <SortAscendingOutlined style={{ marginRight: '6px', color: '#14B8A6' }} />
                  Sort By
                </Text>
                <Select
                  size="large"
                  placeholder={t("blog.sort_by")}
                  value={sortOrder || undefined}
                  onChange={(value: string) => setSortOrder(value as SortPostsType)}
                  style={{ width: '100%' }}
                  options={[
                    { label: t("blog.title_sort"), value: "title" },
                    { label: t("blog.date_sort"), value: "createdAt" },
                    { label: t("blog.published_date_sort"), value: "publishedAt" }
                  ]}
                  suffixIcon={<FilterOutlined style={{ color: '#14B8A6' }} />}
                />
              </Space>
            </Col>
          </Row>

{}
          <Divider style={{ margin: '20px 0', borderColor: 'rgba(34, 197, 94, 0.15)' }} />
          <div style={{ textAlign: 'center' }}>
            <Badge 
              count={posts?.length || 0} 
              showZero
              style={{ 
                background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              <Text style={{ fontSize: '15px', fontWeight: 500, color: '#4b5563', marginRight: '8px' }}>
                {t("blog.articles_found")}
              </Text>
            </Badge>
          </div>
        </Card>

<div style={{ 
          borderRadius: '20px',
          padding: '0',
        }}>
          {posts && posts.length ? (
            <div className="row justify-content-center align-items-start" style={{ gap: '0' }}>
              <div className="col-12 col-md-8" style={{ paddingRight: '24px' }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {}
                  <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '4px', 
                        height: '32px', 
                        background: 'linear-gradient(180deg, #22C55E 0%, #14B8A6 100%)',
                        borderRadius: '4px',
                      }} />
                      <Title level={3} style={{ margin: 0, color: '#1f2937', fontWeight: 700 }}>
                        Latest Articles
                      </Title>
                    </div>
                    <Tag 
                      style={{ 
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        color: '#16a34a',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      {posts?.length} {posts?.length === 1 ? 'Article' : 'Articles'}
                    </Tag>
                  </div>

<Row gutter={[24, 24]}>
                    {posts?.map((post, index) => (
                      <Col
                        className="gutter-row"
                        xs={{ span: 24 }}
                        sm={{ span: 12 }}
                        lg={{ span: 12 }}
                        key={post.id}
                      >
                        <motion.div
                          className="box"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.6) }}
                          whileHover={{ y: -8 }}
                        >
                          <BlogPostItem
                            users={isFetchUser || isLoadingUser ? [] : users}
                            categories={
                              isFetchCategory || isLoadingCategory
                                ? []
                                : categories || []
                            }
                            post={post}
                          />
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                  
                  {/* SEO Pagination with proper attributes */}
                  {posts && posts.length > 0 && (
                    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil((posts.length || 0) / pageSize)}
                        baseUrl="/blog-posts"
                        searchParams={{
                          search: searchTitle,
                          sort: sortOrder || '',
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              </div>
              <div className="col-12 col-md-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ position: "sticky", top: "100px" }}
                >
                  <PostSidebar
                    posts={isLoading || isFetching ? [] : posts}
                    tags={isFetchTag || isLoadingTag ? [] : tags}
                    categories={
                      isFetchCategory || isLoadingCategory ? [] : categories || []
                    }
                  />
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                style={{
                  borderRadius: "24px",
                  textAlign: "center",
                  padding: "4rem 2rem",
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
                  border: '2px solid rgba(34, 197, 94, 0.15)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)'
                }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
                  }}>
                    <BookOutlined style={{ fontSize: '48px', color: 'white' }} />
                  </div>
                  <Title level={3} style={{ color: "#1f2937", marginBottom: '12px', fontWeight: 700 }}>
                    {t("blog.no_articles_title")}
                  </Title>
                  <Text style={{ fontSize: '16px', color: '#6b7280', display: 'block', marginBottom: '24px' }}>
                    {t("blog.no_articles_desc")}
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    onClick={() => setSearchTitle("")}
                    style={{
                      background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      height: '48px',
                      padding: '0 32px',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    Clear Search
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </div>
          </>
        )}
      </div>
        </PageLayout>
  );
}
