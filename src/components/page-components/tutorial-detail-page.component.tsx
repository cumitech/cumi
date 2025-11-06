"use client";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import CommentSection from "@components/comment/CommentSection";
import ImageFallback from "@components/shared/image-fallback";
import Share from "@components/shared/share";
import { renderContent } from "@utils/content-renderer";
import { ITag } from "@domain/models/tag";
import { bannerAPI } from "@store/api/banner_api";
import { categoryAPI } from "@store/api/category_api";
import { tutorialAPI } from "@store/api/tutorial_api";
import { tagAPI } from "@store/api/tag_api";
import { userAPI } from "@store/api/user_api";
import { format } from "@utils/format";
import { postInteractionAPI } from "@store/api/post-interaction_api";
import slugify from "slugify";
import { useSession } from "next-auth/react";
import {
  Layout,
  Spin,
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Tag,
  Space,
  Divider,
  Button,
  notification,
  Breadcrumb as AntBreadcrumb,
} from "antd";
import Link from "next/link";
import {
  FaRegClock,
  FaRegFolder,
  FaRegUserCircle,
  FaEye,
  FaHeart,
} from "react-icons/fa";
import {
  LikeOutlined,
  DislikeOutlined,
  BookOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@contexts/translation.context";
import Breadcrumb from "@components/breadcrumb/breadcrumb.component";
import ReferralsSidebar from "@components/shared/referrals-sidebar.component";
import TutorialDetailHeader from "@components/tutorials/detail/tutorial-detail-header";
import TutorialDetailSidebar from "@components/tutorials/detail/tutorial-detail-sidebar";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface TutorialDetailPageComponentProps {
  slug: string;
}

export default function TutorialDetailPageComponent({
  slug,
}: TutorialDetailPageComponentProps) {
  const { data: session } = useSession();
  const [api, contextHolder] = notification.useNotification();
  const { t } = useTranslation();

  const {
    data: tutorial,
    isLoading,
    isFetching,
  } = tutorialAPI.useGetTutorialBySlugQuery(slug);

  // Fetch related tutorials from same subcategory
  const {
    data: allTutorials,
    isLoading: isLoadingTutorials,
    isFetching: isFetchingTutorials,
  } = tutorialAPI.useFetchAllTutorialsQuery({
    subcategoryId: tutorial?.subcategoryId,
  });

  // Filter for other tutorials (same subcategory)
  const otherTutorials =
    allTutorials
      ?.filter((t: any) => t.id !== tutorial?.id && t.status === "PUBLISHED")
      .slice(0, 4) || [];

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
  } = userAPI.useGetSingleUserQuery(tutorial ? tutorial.authorId : "", {
    skip: !tutorial?.authorId,
  });

  const {
    data: tags,
    isLoading: isLoadingTag,
    isFetching: isFetchingTag,
  } = tagAPI.useFetchAllTagsQuery(1);

  // Get subcategory from tutorial
  const subcategory = tutorial?.Subcategory;

  // Redux Toolkit Query hooks for post interactions (tutorials use post interactions)
  const {
    data: postStatsData,
    isLoading: loadingStats,
    refetch: refetchPostStats,
  } = postInteractionAPI.useGetPostStatsQuery(
    { postId: tutorial?.id || "", userId: session?.user?.id },
    {
      skip: !tutorial?.id,
      pollingInterval: 15000,
    }
  );

  const postStats = {
    likesCount: postStatsData?.likesCount ?? 0,
    dislikesCount: postStatsData?.dislikesCount ?? 0,
    userInteraction:
      postStatsData?.userInteraction ?? (null as "like" | "dislike" | null),
  };

  const [handlePostInteraction] =
    postInteractionAPI.useHandlePostInteractionMutation();

  const handlePostLikeDislike = async (action: "like" | "dislike") => {
    if (!session?.user?.id || !tutorial?.id) {
      api.info({
        message: "Authentication Required",
        description: "Please log in to interact with tutorials.",
        placement: "topRight",
      });
      return;
    }

    // Client-side check: prevent duplicate interactions
    if (postStats.userInteraction === action) {
      api.info({
        message: "Already Done",
        description: `You have already ${action}d this tutorial.`,
        placement: "topRight",
      });
      return;
    }

    try {
      const result = await handlePostInteraction({
        postId: tutorial.id,
        action,
      }).unwrap();

      api.success({
        message: "Success",
        description:
          action === "like"
            ? "Tutorial liked successfully"
            : "Dislike recorded",
        placement: "topRight",
        duration: 2,
      });
    } catch (error: any) {
      if (!error?.data?.isDuplicate) {
        console.error("Error updating tutorial interaction:", error);
      }
      if (error?.data?.isDuplicate) {
        return;
      } else {
        api.error({
          message: "Error",
          description: error?.data?.message || "Failed to update interaction",
          placement: "topRight",
        });
      }
    }
  };

  const loading =
    isLoadingCategory ||
    isFetchCategory ||
    isLoading ||
    isFetching ||
    isLoadingUser ||
    isFetchUser ||
    isFetchBaner ||
    isLoadingBaner ||
    isLoadingTutorials ||
    isFetchingTutorials ||
    isLoadingTag ||
    isFetchingTag;

  return (
    <>
      {contextHolder}
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>
      <Content style={{ background: "#f8fafc", minHeight: "100vh" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, color: "#666" }}>
              Loading tutorial...
            </div>
          </div>
        ) : tutorial ? (
          <div className="container-fluid py-5">
            <div
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 20px",
              }}
            >
              <div className="container py-3">
                <div
                  style={{
                    borderRadius: 12,
                    padding: "10px 14px",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <Breadcrumb
                    items={[
                      { label: t("tutorials.title"), href: "/tutorials" },
                      {
                        label: tutorial.title,
                        href: `/tutorials/${tutorial.slug}`,
                      },
                    ]}
                    showHome={false}
                  />
                </div>
              </div>

              {/* Main Content Grid */}
              <Row gutter={[32, 32]}>
                <Col xs={24} lg={17}>
                  {/* Featured Image with Overlay */}
                  {tutorial.imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      style={{ marginBottom: "40px" }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: 480,
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <ImageFallback
                          src={tutorial.imageUrl}
                          alt={tutorial.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, 850px"
                        />
                        {/* Overlay with gradient */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "120px",
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
                            borderRadius: "0 0 20px 20px",
                          }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Header Section with Title and Meta */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{ marginBottom: "40px" }}
                  >
                    <div
                      style={{
                        marginBottom: "20px",
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {subcategory?.name && (
                        <Tag
                          color="blue"
                          style={{
                            borderRadius: "8px",
                            margin: 0,
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "6px 14px",
                            border: "none",
                          }}
                        >
                          {subcategory.name}
                        </Tag>
                      )}
                      <Tag
                        color="green"
                        style={{
                          borderRadius: "8px",
                          margin: 0,
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "6px 14px",
                          border: "none",
                        }}
                      >
                        Tutorial
                      </Tag>
                    </div>

                    <Title
                      level={1}
                      style={{
                        margin: "16px 0",
                        fontSize: "42px",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: "#0f172a",
                      }}
                    >
                      {tutorial.title}
                    </Title>

                    {tutorial.description && (
                      <Paragraph
                        style={{
                          fontSize: "18px",
                          lineHeight: 1.6,
                          color: "#64748b",
                          margin: "16px 0 24px 0",
                        }}
                      >
                        {tutorial.description}
                      </Paragraph>
                    )}

                    {/* Author & Meta Info */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        paddingBottom: "24px",
                        borderBottom: "1px solid #e2e8f0",
                        flexWrap: "wrap",
                      }}
                    >
                      {user && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <Avatar
                            size={40}
                            src={user?.profileImage}
                            style={{ background: "#0EA5E9" }}
                          />
                          <div>
                            <Text
                              strong
                              style={{
                                display: "block",
                                fontSize: "14px",
                                color: "#0f172a",
                              }}
                            >
                              {user?.fullName || user?.username}
                            </Text>
                            <Text
                              style={{ fontSize: "12px", color: "#94a3b8" }}
                            >
                              Author
                            </Text>
                          </div>
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <FaRegClock
                          style={{ color: "#64748b", fontSize: "14px" }}
                        />
                        <Text style={{ fontSize: "14px", color: "#64748b" }}>
                          {format.date(
                            tutorial.publishedAt || tutorial.createdAt
                          )}
                        </Text>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <FaEye style={{ color: "#64748b", fontSize: "14px" }} />
                        <Text style={{ fontSize: "14px", color: "#64748b" }}>
                          {tutorial.views || 0} views
                        </Text>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ marginBottom: "40px" }}
                  >
                    <Card
                      style={{
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        background: "#ffffff",
                      }}
                      bodyStyle={{ padding: "48px" }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderContent(tutorial.content) || "",
                        }}
                        style={{
                          fontSize: "16px",
                          lineHeight: "1.8",
                          color: "#475569",
                        }}
                        className="prose prose-lg max-w-none"
                      />
                    </Card>
                  </motion.div>

                  {/* Interaction Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ marginBottom: "40px" }}
                  >
                    <Card
                      style={{
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #f0fdf4 0%, #ecfef5 50%, #f0f9ff 100%)",
                        border: "1px solid rgba(34, 197, 94, 0.15)",
                        boxShadow: "0 4px 20px rgba(34, 197, 94, 0.08)",
                      }}
                      bodyStyle={{ padding: "28px" }}
                    >
                      <Row
                        justify="space-between"
                        align="middle"
                        gutter={[20, 20]}
                      >
                        <Col xs={24} sm="auto" style={{ flex: 1 }}>
                          <Space size="middle" wrap style={{ width: "100%" }}>
                            <Button
                              size="large"
                              icon={
                                <LikeOutlined style={{ fontSize: "16px" }} />
                              }
                              style={{
                                color:
                                  postStats.userInteraction === "like"
                                    ? "white"
                                    : "#22C55E",
                                background:
                                  postStats.userInteraction === "like"
                                    ? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
                                    : "white",
                                border: `2px solid ${
                                  postStats.userInteraction === "like"
                                    ? "transparent"
                                    : "#22C55E"
                                }`,
                                borderRadius: "12px",
                                fontWeight: 600,
                                height: "48px",
                                padding: "0 28px",
                                boxShadow:
                                  postStats.userInteraction === "like"
                                    ? "0 6px 16px rgba(34, 197, 94, 0.35)"
                                    : "0 2px 8px rgba(0, 0, 0, 0.05)",
                                transition: "all 0.3s ease",
                              }}
                              onClick={() => handlePostLikeDislike("like")}
                              disabled={
                                !session?.user?.id ||
                                postStats.userInteraction === "like"
                              }
                              aria-label="like-tutorial"
                            >
                              <span style={{ marginLeft: "8px" }}>
                                {postStats.likesCount || 0}{" "}
                                {t("common.likes") || "Likes"}
                              </span>
                            </Button>
                            <Button
                              size="large"
                              icon={
                                <DislikeOutlined style={{ fontSize: "16px" }} />
                              }
                              style={{
                                color:
                                  postStats.userInteraction === "dislike"
                                    ? "white"
                                    : "#ef4444",
                                background:
                                  postStats.userInteraction === "dislike"
                                    ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                    : "white",
                                border: `2px solid ${
                                  postStats.userInteraction === "dislike"
                                    ? "transparent"
                                    : "#ef4444"
                                }`,
                                borderRadius: "12px",
                                fontWeight: 600,
                                height: "48px",
                                padding: "0 28px",
                                boxShadow:
                                  postStats.userInteraction === "dislike"
                                    ? "0 6px 16px rgba(239, 68, 68, 0.35)"
                                    : "0 2px 8px rgba(0, 0, 0, 0.05)",
                                transition: "all 0.3s ease",
                              }}
                              onClick={() => handlePostLikeDislike("dislike")}
                              disabled={
                                !session?.user?.id ||
                                postStats.userInteraction === "dislike"
                              }
                              aria-label="dislike-tutorial"
                            >
                              <span style={{ marginLeft: "8px" }}>
                                {postStats.dislikesCount || 0}{" "}
                                {t("common.dislikes") || "Dislikes"}
                              </span>
                            </Button>
                          </Space>
                        </Col>
                        <Col xs={24} sm="auto">
                          <div
                            style={{
                              padding: "16px 24px",
                              background: "white",
                              borderRadius: "12px",
                              border: "1px solid rgba(14, 165, 233, 0.2)",
                              textAlign: "center",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                            }}
                          >
                            <Text
                              style={{
                                display: "block",
                                fontSize: "12px",
                                color: "#6b7280",
                                marginBottom: "6px",
                                fontWeight: 500,
                              }}
                            >
                              Total Engagements
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: "24px",
                                color: "#0EA5E9",
                                fontWeight: 700,
                              }}
                            >
                              {(postStats.likesCount || 0) +
                                (postStats.dislikesCount || 0)}
                            </Text>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </motion.div>

                  {/* Tags */}
                  {tutorial.tags && tutorial.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      style={{ marginBottom: "40px" }}
                    >
                      <Card
                        style={{
                          borderRadius: "16px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                        bodyStyle={{ padding: "28px" }}
                      >
                        <Title
                          level={4}
                          style={{ marginBottom: "20px", color: "#0f172a" }}
                        >
                          <BookOutlined
                            style={{ marginRight: "8px", color: "#0EA5E9" }}
                          />
                          Tags
                        </Title>
                        <Space size={[12, 12]} wrap>
                          {tutorial.tags.map((tag: ITag) => (
                            <Link key={tag.id} href={`/tags/${tag.slug}`}>
                              <Tag
                                style={{
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  fontSize: "13px",
                                  cursor: "pointer",
                                  transition:
                                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  background:
                                    "linear-gradient(135deg, #f0fdf4 0%, #ecfef5 100%)",
                                  border: "1px solid rgba(34, 197, 94, 0.2)",
                                  fontWeight: 500,
                                  color: "#16a34a",
                                }}
                                onMouseEnter={(e) => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.background =
                                    "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)";
                                  el.style.color = "white";
                                  el.style.boxShadow =
                                    "0 4px 12px rgba(34, 197, 94, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.background =
                                    "linear-gradient(135deg, #f0fdf4 0%, #ecfef5 100%)";
                                  el.style.color = "#16a34a";
                                  el.style.boxShadow = "none";
                                }}
                              >
                                {tag.name}
                              </Tag>
                            </Link>
                          ))}
                        </Space>
                      </Card>
                    </motion.div>
                  )}

                  {/* Share */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{ marginBottom: "40px" }}
                  >
                    <Share
                      title={tutorial.title}
                      slug={tutorial.slug}
                      type="blog-posts"
                      showModern={true}
                    />
                  </motion.div>

                  {/* Divider */}
                  <Divider
                    style={{ margin: "40px 0", borderColor: "#e2e8f0" }}
                  />

                  {/* Comments */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <CommentSection
                      postId={tutorial.id}
                      postTitle={tutorial.title}
                    />
                  </motion.div>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={7}>
                  <div style={{ position: "sticky", top: "100px", display: "grid", gap: 16 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <ReferralsSidebar />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <TutorialDetailSidebar related={otherTutorials} />
                    </motion.div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <Title level={2} style={{ color: "#0f172a", marginBottom: "16px" }}>
              Tutorial Not Found
            </Title>
            <Text style={{ fontSize: "16px", color: "#64748b" }}>
              The tutorial you&apos;re looking for doesn&apos;t exist. Please check the
              URL or go back to the tutorials page.
            </Text>
          </div>
        )}
      </Content>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
