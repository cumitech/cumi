"use client";

import React from "react";
import { Row, Col, Layout, Empty, Spin, Typography, Card, Tag } from "antd";
import { BookOutlined, FireOutlined, StarOutlined, TagOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import BlogPostItem from "@components/blog_post/blog_post_item";
import PostSidebar from "@components/blog_post/containers/PostSidebar";
import SpinnerList from "@components/shared/spinner-list";
import { categoryAPI } from "@store/api/category_api";
import { postAPI } from "@store/api/post_api";
import { tagAPI } from "@store/api/tag_api";
import { userAPI } from "@store/api/user_api";
import { useTranslation } from "@contexts/translation.context";

const { Content } = Layout;
const { Title, Text } = Typography;

interface TagDetailPageComponentProps {
  tag: string;
}

export default function TagDetailPageComponent({
  tag,
}: TagDetailPageComponentProps) {
  const { t } = useTranslation();
  const {
    data: posts,
    error,
    isLoading,
    isFetching,
  } = postAPI.useGetPostsByTagQuery(tag);

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

const loading = isLoading || isFetching || isLoadingTag || isFetchTag ||
    isLoadingCategory || isFetchCategory || isLoadingUser || isFetchUser;

return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        {}
        <AppNav logoPath="/" />
      </div>

{loading ? (
        <div style={{ minHeight: "65vh", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
          <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>{t('tag_detail.loading')}</div>
          </Card>
        </div>
      ) : (
        <>
      {}
      <BannerComponent
        breadcrumbs={[
          { label: t('tag_detail.tags'), uri: "tags" },
          { label: tag, uri: "#" },
        ]}
        pageTitle={t('tag_detail.blog-posts')}
      />

<div className="container py-5 mb-5">
        {error && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Title level={4} type="danger">{t('tag_detail.error_loading')}</Title>
            <Text type="secondary">{t('tag_detail.error_message')}</Text>
          </div>
        )}

{}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row gutter={[16, 16]} style={{ marginBottom: '2.5rem' }}>
            <Col xs={24} sm={8}>
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
                <Text style={{ color: '#4b5563', fontSize: '14px', fontWeight: 500 }}>Articles</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
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
            <Col xs={24} sm={8}>
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

<Content>
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
                        background: 'linear-gradient(180deg, #0EA5E9 0%, #14B8A6 100%)',
                        borderRadius: '4px',
                      }} />
                      <Title level={3} style={{ margin: 0, color: '#1f2937', fontWeight: 700 }}>
                        #{tag}
                      </Title>
                    </div>
                    <Tag 
                      style={{ 
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        border: '1px solid rgba(14, 165, 233, 0.2)',
                        color: '#0284c7',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                      icon={<TagOutlined />}
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
                    tags={isFetchTag || isLoadingTag ? [] : tags}
                    posts={isLoading || isFetching ? [] : posts}
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
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
                  border: '2px solid rgba(14, 165, 233, 0.15)',
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
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #14B8A6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(14, 165, 233, 0.3)',
                  }}>
                    <TagOutlined style={{ fontSize: '48px', color: 'white' }} />
                  </div>
                  <Title level={3} style={{ color: "#1f2937", marginBottom: '12px', fontWeight: 700 }}>
                    {t('tag_detail.no_posts')}
                  </Title>
                  <Text style={{ fontSize: '16px', color: '#6b7280' }}>
                    {t('tag_detail.no_posts_desc')}
                  </Text>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </Content>
      </div>
      <AppFooter logoPath="/" />
      <AppFootnote />
        </>
      )}
    </>
  );
}
