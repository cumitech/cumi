"use client";
import PageContent from "@components/shared/page-content/index";
import BlogPostItem from "@components/blog_post/blog_post_item";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import CommentSection from "@components/comment/CommentSection";
import ImageFallback from "@components/shared/image-fallback";
import Share from "@components/shared/share";
import ReferralsSidebar from "@components/shared/referrals-sidebar.component";
import { renderContent } from "@utils/content-renderer";
import { ITag } from "@domain/models/tag";
import { bannerAPI } from "@store/api/banner_api";
import { categoryAPI } from "@store/api/category_api";
import { postAPI } from "@store/api/post_api";
import { tagAPI } from "@store/api/tag_api";
import { userAPI } from "@store/api/user_api";
import { format } from "@utils/format";
import { postInteractionAPI } from "@store/api/post-interaction_api";
import slugify from "slugify";
import { useSession } from "next-auth/react";
import { Layout, Spin, Card, Row, Col, Typography, Avatar, Tag, Space, Divider, Button, notification } from "antd";
import Link from "next/link";
import { FaRegClock, FaRegFolder, FaRegUserCircle, FaEye, FaHeart, FaShareAlt } from "react-icons/fa";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@contexts/translation.context";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface BlogPostDetailPageComponentProps {
  slug: string;
}

export default function BlogPostDetailPageComponent({ slug }: BlogPostDetailPageComponentProps) {
  const { data: session } = useSession();
  const [api, contextHolder] = notification.useNotification();
  const { t } = useTranslation();
  const {
    data: post,
    isLoading,
    isFetching,
  } = postAPI.useGetSinglePostBySlugQuery(slug);

const {
    data: posts,
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
  } = postAPI.useFetchAllPostsQuery({
    searchTitle: "",
  });
  const {
    data: banners,
    isLoading: isLoadingBaner,
    isFetching: isFetchBaner,
  } = bannerAPI.useFetchAllBannersQuery(1);

const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchCategory,
  } = categoryAPI.useFetchAllCategoriesQuery(1);

const { data: users } = userAPI.useFetchAllUsersQuery(1);

const {
    data: user,
    isLoading: isLoadingUser,
    isFetching: isFetchUser,
  } = userAPI.useGetSingleUserQuery(post ? post.authorId : "");

const {
    data: tags,
    isLoading: isLoadingTag,
    isFetching: isFetchingTag,
  } = tagAPI.useFetchAllTagsQuery(1);
  const similarPosts = post
    ? posts?.filter((p) => p.categoryId === post.categoryId)
    : [];

const category = categories?.find((c) => c.id === post?.categoryId);

// Redux Toolkit Query hooks for post interactions
  const {
    data: postStatsData,
    isLoading: loadingStats,
    refetch: refetchPostStats,
  } = postInteractionAPI.useGetPostStatsQuery(
    { postId: post?.id || '', userId: session?.user?.id },
    { 
      skip: !post?.id,
      pollingInterval: 15000, // Poll every 15 seconds for updated stats
    }
  );

// Provide default values for postStats with proper null/undefined handling
  const postStats = {
    likesCount: postStatsData?.likesCount ?? 0,
    dislikesCount: postStatsData?.dislikesCount ?? 0,
    userInteraction: postStatsData?.userInteraction ?? null as 'like' | 'dislike' | null
  };

const [handlePostInteraction] = postInteractionAPI.useHandlePostInteractionMutation();

// Handle post like/dislike
  const handlePostLikeDislike = async (action: 'like' | 'dislike') => {
    if (!session?.user?.id) {
      api.warning({
        message: t('blog_detail.auth_required'),
        description: t('blog_detail.login_to_interact'),
        placement: 'topRight',
      });
      return;
    }

if (!post?.id) return;

// Prevent duplicate interactions
    if (postStats.userInteraction === action) {
      api.info({
        message: t('blog_detail.already_interacted'),
        description: t(`blog_detail.already_${action}`),
        placement: 'topRight',
        duration: 2,
      });
      return;
    }

try {
      const result = await handlePostInteraction({ postId: post.id, action }).unwrap();
      
      api.success({
        message: t('common.success'),
        description: t(action === 'like' ? 'blog_detail.liked_success' : 'blog_detail.disliked_success'),
        placement: 'topRight',
        duration: 2,
      });
      
      // Stats will be automatically refetched by RTK Query due to invalidation
    } catch (error: any) {
      // Handle duplicate interaction gracefully
      if (error?.data?.isDuplicate) {
        // Don't show notification for duplicates when button is already disabled
        // The UI already prevents this, so silent fail
        return;
      } else {
        api.error({
          message: t('common.error'),
          description: error?.data?.message || t('blog_detail.interaction_failed'),
          placement: 'topRight',
        });
      }
    }
  };

const loading = isLoadingCategory || isFetchCategory || isLoading || isFetching || 
    isLoadingUser || isFetchUser || isFetchBaner || isLoadingBaner ||
    isLoadingPosts || isFetchingPosts || isLoadingTag || isFetchingTag;

return (
    <>
      {contextHolder}
      <div className="container-fluid" style={{ width: "100%" }}>
        {}
        <AppNav logoPath="/" />
      </div>

{loading ? (
        <div style={{ minHeight: "65vh", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
          <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>{t("blog_detail.loading")}</div>
          </Card>
        </div>
      ) : (
        <>
        <PageContent
          title={post?.title}
          banner={banners ? (banners.length > 0 ? banners[0].image : "") : ""}
          breadcrumb={[
            {
              title: t('nav.blog-posts'),
              link: "/blog-posts",
            },
            {
              title: t('blog_detail.details'),
            },
          ]}
        />
        <Content>
          <section className="section pt-4">
            <div className="container">
              <Row justify="center" gutter={[32, 0]}>
                <Col xs={24} lg={17}>
                  {post && (
                    <Card
                      style={{
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        border: "none",
                        overflow: "hidden",
                      }}
                      styles={{ body: { padding: 0 } }}
                    >
                      {}
                      <div style={{ position: "relative", overflow: "hidden", height: "450px" }}>
                        <ImageFallback
                          src={post.imageUrl}
                          height={450}
                          width={1200}
                          alt={post?.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          onMouseEnter={(e: React.MouseEvent<HTMLImageElement>) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e: React.MouseEvent<HTMLImageElement>) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)",
                          }}
                        />
                      </div>

{}
                      <div style={{ padding: "clamp(1.5rem, 4vw, 3rem)" }}>
                        {}
                        <div style={{ 
                          marginBottom: "2rem",
                          padding: "16px 20px",
                          background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
                          borderRadius: "12px",
                          border: "1px solid rgba(34, 197, 94, 0.15)",
                        }}>
                          <Space wrap size="large">
                            <Space>
                              <Avatar
                                src={user?.profileImage}
                                icon={<FaRegUserCircle />}
                                size={44}
                                style={{ 
                                  border: "2px solid white",
                                  boxShadow: "0 2px 8px rgba(34, 197, 94, 0.2)"
                                }}
                              />
                              <div>
                                <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Written by</Text>
                                <Link href={`/authors/${slugify(`${user?.username}`)}`}>
                                  <Text strong style={{ color: "#22C55E", fontSize: '15px', fontWeight: 600 }}>
                                    {user?.username}
                                  </Text>
                                </Link>
                              </div>
                            </Space>

<Divider type="vertical" style={{ height: '40px', borderColor: 'rgba(34, 197, 94, 0.2)' }} />

<Space>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <FaRegFolder style={{ color: "white", fontSize: '16px' }} />
                              </div>
                              <div>
                                <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Category</Text>
                                <Link href={`/categories/${category?.slug}`}>
                                  <Text strong style={{ color: "#22C55E", fontSize: '15px', fontWeight: 600 }}>
                                    {category?.name}
                                  </Text>
                                </Link>
                              </div>
                            </Space>

<Divider type="vertical" style={{ height: '40px', borderColor: 'rgba(34, 197, 94, 0.2)' }} />

<Space>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <FaRegClock style={{ color: "white", fontSize: '16px' }} />
                              </div>
                              <div>
                                <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Published</Text>
                                <Text strong style={{ color: "#4b5563", fontSize: '15px', fontWeight: 600 }}>
                                  {format.date(post.publishedAt)}
                                </Text>
                              </div>
                            </Space>
                          </Space>
                        </div>

{}
                        <Title level={1} style={{ 
                          marginBottom: "1.5rem",
                          fontSize: "clamp(1.8rem, 4vw, 3rem)",
                          fontWeight: "800",
                          lineHeight: "1.2",
                          color: "#1f2937",
                          letterSpacing: "-0.02em"
                        }}>
                          {post?.title}
                        </Title>

{}
                        {post?.description && (
                          <Paragraph
                            style={{
                              fontSize: "clamp(1.1rem, 2vw, 1.25rem)",
                              color: "#6b7280",
                              marginBottom: "2.5rem",
                              lineHeight: "1.75",
                              fontWeight: 400,
                              padding: "20px",
                              background: "linear-gradient(135deg, #f9fafb 0%, #f0f9ff 100%)",
                              borderLeft: "4px solid #22C55E",
                              borderRadius: "0 12px 12px 0",
                            }}
                          >
                            {post.description}
                          </Paragraph>
                        )}

<Divider style={{ margin: "2rem 0" }} />

{}
                        <div
                          style={{
                            fontSize: "1.1rem",
                            lineHeight: "1.8",
                            color: "#333",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: post?.content ? renderContent(post.content) : '',
                          }}
                        />

<Divider style={{ margin: "2rem 0" }} />

{}
                        <Card 
                          className="interactions-card"
                          style={{ 
                            marginBottom: "2rem", 
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
                            border: "1px solid rgba(34, 197, 94, 0.15)",
                            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.08)",
                          }}
                          styles={{ body: { padding: '24px' } }}
                        >
                          <Row justify="space-between" align="middle" gutter={[16, 16]}>
                            <Col xs={24} sm={16}>
                              <Space size="middle" wrap>
                                <Button
                                  size="large"
                                  icon={<LikeOutlined />}
                                  style={{ 
                                    color: postStats.userInteraction === 'like' ? "white" : "#22C55E",
                                    background: postStats.userInteraction === 'like' 
                                      ? "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)" 
                                      : "white",
                                    border: `2px solid ${postStats.userInteraction === 'like' ? "transparent" : "#22C55E"}`,
                                    borderRadius: "12px",
                                    fontWeight: 600,
                                    height: "44px",
                                    padding: "0 24px",
                                    boxShadow: postStats.userInteraction === 'like' 
                                      ? "0 4px 12px rgba(34, 197, 94, 0.3)" 
                                      : "0 2px 8px rgba(0, 0, 0, 0.05)",
                                    transition: "all 0.3s ease",
                                  }}
                                  onClick={() => handlePostLikeDislike('like')}
                                  disabled={!session?.user?.id || postStats.userInteraction === 'like'}
                                  onMouseEnter={(e) => {
                                    if (postStats.userInteraction !== 'like') {
                                      e.currentTarget.style.transform = "translateY(-2px)";
                                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(34, 197, 94, 0.2)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (postStats.userInteraction !== 'like') {
                                      e.currentTarget.style.transform = "translateY(0)";
                                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                                    }
                                  }}
                                >
                                  {postStats.likesCount || 0} {t('blog_detail.likes')}
                                </Button>
                                <Button
                                  size="large"
                                  icon={<DislikeOutlined />}
                                  style={{ 
                                    color: postStats.userInteraction === 'dislike' ? "white" : "#ef4444",
                                    background: postStats.userInteraction === 'dislike' 
                                      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
                                      : "white",
                                    border: `2px solid ${postStats.userInteraction === 'dislike' ? "transparent" : "#ef4444"}`,
                                    borderRadius: "12px",
                                    fontWeight: 600,
                                    height: "44px",
                                    padding: "0 24px",
                                    boxShadow: postStats.userInteraction === 'dislike' 
                                      ? "0 4px 12px rgba(239, 68, 68, 0.3)" 
                                      : "0 2px 8px rgba(0, 0, 0, 0.05)",
                                    transition: "all 0.3s ease",
                                  }}
                                  onClick={() => handlePostLikeDislike('dislike')}
                                  disabled={!session?.user?.id || postStats.userInteraction === 'dislike'}
                                  onMouseEnter={(e) => {
                                    if (postStats.userInteraction !== 'dislike') {
                                      e.currentTarget.style.transform = "translateY(-2px)";
                                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.2)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (postStats.userInteraction !== 'dislike') {
                                      e.currentTarget.style.transform = "translateY(0)";
                                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                                    }
                                  }}
                                >
                                  {postStats.dislikesCount || 0} {t('blog_detail.dislikes')}
                                </Button>
                              </Space>
                            </Col>
                            <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
                              <div style={{
                                padding: '12px 20px',
                                background: 'white',
                                borderRadius: '12px',
                                border: '1px solid rgba(14, 165, 233, 0.15)',
                              }}>
                                <Text style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                  Total Engagements
                                </Text>
                                <Text strong style={{ fontSize: '20px', color: '#0EA5E9', fontWeight: 700 }}>
                                  {(postStats.likesCount || 0) + (postStats.dislikesCount || 0)}
                                </Text>
                              </div>
                            </Col>
                          </Row>
                        </Card>

{}
                        <div style={{ marginBottom: "2rem" }}>
                          <Text style={{ 
                            display: 'block', 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#4b5563', 
                            marginBottom: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Article Tags
                          </Text>
                          <Space wrap size="middle">
                            {tags?.map((tag: ITag) => (
                              <Tag
                                key={tag.id}
                                style={{
                                  borderRadius: "24px",
                                  padding: "8px 18px",
                                  fontSize: "14px",
                                  border: "1.5px solid rgba(14, 165, 233, 0.2)",
                                  background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                  fontWeight: 600,
                                  transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(14, 165, 233, 0.2)";
                                  e.currentTarget.style.borderColor = "#0EA5E9";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = "translateY(0)";
                                  e.currentTarget.style.boxShadow = "none";
                                  e.currentTarget.style.borderColor = "rgba(14, 165, 233, 0.2)";
                                }}
                              >
                                <Link
                                  href={`/tags/${slugify(tag.name)}`}
                                  style={{ color: "#0EA5E9", textDecoration: 'none' }}
                                >
                                  #{tag.name}
                                </Link>
                              </Tag>
                            ))}
                          </Space>
                        </div>

<Divider style={{ margin: "2rem 0", borderColor: "rgba(34, 197, 94, 0.15)" }} />

{}
                        <Share
                          title={post?.title as any}
                          description={post?.description}
                          slug={post?.slug!}
                          type="blog-posts"
                          showModern={true}
                        />
                      </div>
                    </Card>
                  )}

{}
                  {post && (
                    <div style={{ marginTop: "2rem" }}>
                      <CommentSection 
                        postId={post.id} 
                        postTitle={post.title}
                        postSlug={post.slug}
                      />
                    </div>
                  )}
                </Col>

                {/* Referrals Sidebar */}
                <Col xs={24} lg={7}>
                  <div style={{ position: 'sticky', top: 20 }}>
                    <ReferralsSidebar 
                      category="tools" 
                      limit={3}
                      title="Recommended Tools"
                    />
                  </div>
                </Col>
              </Row>

{}
              {similarPosts && similarPosts.length > 0 && (
                <section style={{ margin: "4rem 0", padding: "0 1rem" }}>
                  <Row justify="center">
                    <Col xs={24} lg={20}>
                      <div style={{ 
                        textAlign: "center", 
                        marginBottom: "3rem",
                        position: "relative",
                      }}>
                        <div style={{ 
                          display: 'inline-block',
                          padding: '8px 20px',
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                          borderRadius: '24px',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          marginBottom: '16px',
                        }}>
                          <Text style={{ color: '#22C55E', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            You Might Also Like
                          </Text>
                        </div>
                        <Title level={2} style={{ 
                          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                          fontWeight: "800",
                          color: "#1f2937",
                          marginBottom: "12px",
                          letterSpacing: "-0.02em"
                        }}>
                          {t('blog_detail.related_articles')}
                        </Title>
                        <Text style={{ fontSize: "1.1rem", color: "#6b7280", fontWeight: 400 }}>
                          {t('blog_detail.discover_more')}
                        </Text>
                      </div>

<Row gutter={[24, 24]}>
                        {similarPosts?.slice(0, 3).map((post, index) => (
                          <Col xs={24} md={12} lg={8} key={post.slug}>
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              whileHover={{ y: -8 }}
                            >
                              <BlogPostItem
                                users={isFetchUser || isLoadingUser ? [] : users}
                                categories={
                                  isFetchCategory || isLoadingCategory ? [] : categories || []
                                }
                                post={post}
                              />
                            </motion.div>
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                </section>
              )}
            </div>
          </section>
        </Content>

<AppFooter logoPath="/" />
        <AppFootnote />
        </>
      )}
    </>
  );
}
