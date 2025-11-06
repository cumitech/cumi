"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Button,
  Input,
  Form,
  Space,
  Typography,
  Divider,
  Spin,
  Empty,
  Dropdown,
  Modal,
  Badge,
  notification,
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  LikeOutlined,
  DislikeOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  CopyOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { commentAPI } from "@store/api/comment_api";
import { commentInteractionAPI } from "@store/api/comment-interaction_api";
import { IComment } from "@domain/models/comment.model";
import { useTranslation } from "@contexts/translation.context";

interface CommentWithStats extends IComment {
  likesCount?: number;
  dislikesCount?: number;
  userInteraction?: 'like' | 'dislike' | null;
  replies?: CommentWithStats[];
}

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

interface CommentSectionProps {
  postId: string;
  postTitle?: string;
  postSlug?: string;
}

export default function CommentSection({ postId, postTitle, postSlug }: CommentSectionProps) {
  const { data: session } = useSession();
  const [api, contextHolder] = notification.useNotification();
  const { t } = useTranslation();
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToUsername, setReplyingToUsername] = useState<string | null>(null);
  const [form] = Form.useForm();

// Redux Toolkit Query hooks
  const {
    data: commentsData,
    isLoading: loading,
    refetch: refetchComments,
  } = commentAPI.useGetCommentsByPostIdQuery(postId, {
    pollingInterval: 30000, // Poll every 30 seconds for new comments
  });

  const [createComment, { isLoading: submitting }] = commentAPI.useCreateCommentMutation();
  const [handleCommentInteraction] = commentInteractionAPI.useHandleCommentInteractionMutation();

// Get current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = postTitle || 'Check out this post';
  const shareText = `Read "${postTitle}" on CUMI`;

// Share functions
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      api.success({
        message: t('comments.copy_success'),
        description: t('comments.link_copied'),
        placement: 'topRight',
      });
    } catch (err) {
      api.error({
        message: t('common.error'),
        description: t('comments.copy_failed'),
        placement: 'topRight',
      });
    }
  };

const shareMenuItems = [
    {
      key: 'facebook',
      label: t('comments.share_facebook'),
      icon: <FacebookOutlined style={{ color: '#1877F2' }} />,
      onClick: shareToFacebook,
    },
    {
      key: 'twitter',
      label: t('comments.share_twitter'),
      icon: <TwitterOutlined style={{ color: '#1DA1F2' }} />,
      onClick: shareToTwitter,
    },
    {
      key: 'linkedin',
      label: t('comments.share_linkedin'),
      icon: <LinkedinOutlined style={{ color: '#0077B5' }} />,
      onClick: shareToLinkedIn,
    },
    {
      key: 'copy',
      label: t('comments.copy_link'),
      icon: <CopyOutlined />,
      onClick: copyToClipboard,
    },
  ];

// Extract all comment IDs to fetch stats for them
  const extractCommentIds = React.useCallback((comments: any[]): string[] => {
    const ids: string[] = [];
    comments.forEach(comment => {
      ids.push(comment.id);
      if (comment.replies && comment.replies.length > 0) {
        ids.push(...extractCommentIds(comment.replies));
      }
    });
    return ids;
  }, []);

  const allCommentIds = React.useMemo(() => {
    if (!commentsData) return [];
    const commentsArray = Array.isArray(commentsData) 
      ? commentsData 
      : (commentsData as any)?.data || [];
    if (!Array.isArray(commentsArray)) return [];
    return extractCommentIds(commentsArray);
  }, [commentsData, extractCommentIds]);

  // Fetch stats for ALL comments at once when data changes
  const [commentStatsMap, setCommentStatsMap] = React.useState<Record<string, { likesCount: number; dislikesCount: number; userInteraction: 'like' | 'dislike' | null }>>({});

  const idsKey = React.useMemo(() => allCommentIds.join(','), [allCommentIds]);

  React.useEffect(() => {
    const fetchAllStats = async () => {
      if (allCommentIds.length === 0) return;
      
      const statsMap: Record<string, { likesCount: number; dislikesCount: number; userInteraction: 'like' | 'dislike' | null }> = {};
      
      // Fetch stats for each comment
      await Promise.all(
        allCommentIds.map(async (id) => {
          try {
            const response = await fetch(`/api/comments/interactions/stats?commentId=${id}&userId=${session?.user?.id || ''}`);
            const data = await response.json();
            if (data.success && data.data) {
              statsMap[id] = {
                likesCount: data.data.likesCount ?? 0,
                dislikesCount: data.data.dislikesCount ?? 0,
                userInteraction: data.data.userInteraction ?? null,
              };
            } else {
              statsMap[id] = { likesCount: 0, dislikesCount: 0, userInteraction: null };
            }
          } catch (error) {
            console.error(`Failed to fetch stats for comment ${id}:`, error);
            statsMap[id] = { likesCount: 0, dislikesCount: 0, userInteraction: null };
          }
        })
      );
      
      setCommentStatsMap(statsMap);
    };

    fetchAllStats();
  }, [idsKey, allCommentIds, allCommentIds.length, session?.user?.id]);

// Process comments with stats - backend already provides tree structure
  const comments: CommentWithStats[] = React.useMemo(() => {
    if (!commentsData) return [];

// Handle both array response and object response with data property
    const commentsArray = Array.isArray(commentsData) 
      ? commentsData 
      : (commentsData as any)?.data || [];

if (!Array.isArray(commentsArray)) {
      console.warn('Comments data is not an array:', commentsData);
      return [];
    }

    // Recursively add stats to comments and their replies
    const addStatsToComment = (comment: IComment): CommentWithStats => {
      const stats = commentStatsMap[comment.id] || { likesCount: 0, dislikesCount: 0, userInteraction: null };
      const withStats = {
        ...comment,
        likesCount: stats.likesCount,
        dislikesCount: stats.dislikesCount,
        userInteraction: stats.userInteraction,
        // Recursively process replies if they exist
        replies: comment.replies 
          ? comment.replies.map((reply: any) => addStatsToComment(reply))
          : undefined,
      };

      return withStats;
    };

    // Backend returns comments already in tree structure with replies nested
    // We just need to add stats to each comment and its replies
    const processedComments = commentsArray.map(comment => addStatsToComment(comment));

    return processedComments;
  }, [commentsData, commentStatsMap]);

// Handle like/dislike
  const handleLikeDislike = async (commentId: string, action: 'like' | 'dislike') => {
    if (!session?.user?.id) {
      api.warning({
        message: t('comments.auth_required'),
        description: t('comments.login_to_interact'),
        placement: 'topRight',
      });
      return;
    }

// Find the comment to check if user already interacted
    const findComment = (comments: CommentWithStats[]): CommentWithStats | undefined => {
      for (const comment of comments) {
        if (comment.id === commentId) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies);
          if (found) return found;
        }
      }
      return undefined;
    };

    const comment = findComment(comments);
    
    // Prevent duplicate interactions
    if (comment && comment.userInteraction === action) {
      api.info({
        message: t('comments.already_interacted'),
        description: t(`comments.already_${action}`),
        placement: 'topRight',
        duration: 2,
      });
      return;
    }

try {
      await handleCommentInteraction({ commentId, action }).unwrap();
      
      // Refetch the specific comment's stats
      try {
        const response = await fetch(`/api/comments/interactions/stats?commentId=${commentId}&userId=${session?.user?.id || ''}`);
        const data = await response.json();
        if (data.success && data.data) {
          setCommentStatsMap(prev => ({
            ...prev,
            [commentId]: {
              likesCount: data.data.likesCount ?? 0,
              dislikesCount: data.data.dislikesCount ?? 0,
              userInteraction: data.data.userInteraction ?? null,
            }
          }));
        }
      } catch (fetchError) {
        console.error('Failed to refetch stats:', fetchError);
      }
      
      api.success({
        message: t('common.success'),
        description: t(`comments.${action}_success`),
        placement: 'topRight',
        duration: 2,
      });
    } catch (error: any) {
      // Only log unexpected errors, not duplicate interactions
      if (!error?.data?.isDuplicate) {
        console.error("Error updating interaction:", error);
      }
      
      // Handle duplicate interaction gracefully
      if (error?.data?.isDuplicate) {
        // Don't show notification for duplicates when button is already disabled
        // The UI already prevents this, so silent fail
        return;
      } else {
        api.error({
          message: t('common.error'),
          description: error?.data?.message || t('comments.interaction_failed'),
          placement: 'topRight',
        });
      }
    }
  };

// Submit comment or reply
  const handleSubmit = async (values: { content: string }) => {
    if (!session?.user?.id) {
      api.warning({
        message: t('comments.auth_required'),
        description: t('comments.login_to_comment'),
        placement: 'topRight',
      });
      return;
    }

const isReply = replyingTo !== null;
    const parentId = isReply ? replyingTo : undefined;

try {
      await createComment({
        content: values.content,
        postId: postId,
        parentId: parentId,
      }).unwrap();

api.success({
        message: t('common.success'),
        description: t(isReply ? 'comments.reply_success' : 'comments.comment_success'),
        placement: 'topRight',
        duration: 3,
      });
      form.resetFields();
      setReplyingTo(null);
      setReplyingToUsername(null);
    } catch (error: any) {
      console.error(`Error posting ${isReply ? 'reply' : 'comment'}:`, error);

if (error?.data?.message?.includes("not available yet")) {
        api.info({
          message: t('comments.coming_soon_title'),
          description: t('comments.coming_soon'),
          placement: 'topRight',
          duration: 4,
        });
      } else {
        api.error({
          message: t('common.error'),
          description: error?.data?.message || t(isReply ? 'comments.reply_failed' : 'comments.comment_failed'),
          placement: 'topRight',
        });
      }
    }
  };

// Calculate total comment count including replies
  const getTotalCommentCount = (comments: CommentWithStats[]): number => {
    return comments.reduce((total, comment) => {
      let count = 1; // Count the comment itself
      if (comment.replies && comment.replies.length > 0) {
        count += getTotalCommentCount(comment.replies);
      }
      return total + count;
    }, 0);
  };

const totalCommentCount = getTotalCommentCount(comments);

// Render comment item with proper nesting
  const renderComment = (comment: CommentWithStats, depth: number = 0, isLastReply: boolean = false) => {
    const maxDepth = 3; // Limit nesting depth for better UX
    const effectiveDepth = Math.min(depth, maxDepth);
    const replyCount = comment.replies?.length || 0;

return (
      <div
        key={comment.id}
        style={{ 
          marginBottom: depth === 0 ? "20px" : "12px",
          paddingBottom: depth === 0 ? "20px" : "0",
          borderBottom: depth === 0 ? "1px solid #f0f0f0" : "none",
        }}
      >
        <div style={{ 
          display: "flex",
          gap: "12px",
          opacity: comment.id.startsWith('temp-') ? 0.7 : 1,
          padding: depth > 0 ? "12px" : "0",
          backgroundColor: depth > 0 ? (depth % 2 === 1 ? "#fafafa" : "#f5f5f5") : "transparent",
          borderRadius: depth > 0 ? "8px" : "0",
          transition: "all 0.2s ease",
        }}>
          <div style={{ flexShrink: 0 }}>
            <Avatar
              src={comment.user?.image}
              icon={<UserOutlined />}
              size={effectiveDepth === 0 ? 40 : effectiveDepth === 1 ? 32 : 28}
            />
          </div>

<div style={{ flex: 1, minWidth: 0 }}>
            {}
            <div style={{ marginBottom: "8px" }}>
              <Space size={4} wrap>
                <Text strong style={{ fontSize: effectiveDepth > 1 ? "13px" : "14px" }}>
                  {comment.user?.name || t('comments.anonymous')}
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  •
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </Text>
                {depth > 0 && (
                  <>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      •
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px", fontStyle: "italic" }}>
                      {t('comments.reply')}
                    </Text>
                  </>
                )}
              </Space>
            </div>

{}
            <div style={{ 
              marginBottom: "10px",
              fontSize: effectiveDepth > 1 ? "13px" : "14px",
              lineHeight: "1.6",
              wordBreak: "break-word"
            }}>
              <Text style={{ whiteSpace: "pre-wrap" }}>{comment.content}</Text>
            </div>

{comment.id.startsWith('temp-') && (
              <div style={{ marginBottom: "8px" }}>
                <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                  {t('comments.posting')}
                </Text>
              </div>
            )}

{}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Button
                type="text"
                size="small"
                icon={<LikeOutlined />}
                style={{ 
                  color: comment.userInteraction === 'like' ? "#1890ff" : "#666",
                  backgroundColor: comment.userInteraction === 'like' ? "#e6f7ff" : "transparent",
                  border: comment.userInteraction === 'like' ? '1px solid #91d5ff' : 'none',
                  padding: "0 8px",
                  height: "28px",
                  borderRadius: "4px",
                  fontSize: "12px"
                }}
                onClick={() => handleLikeDislike(comment.id, 'like')}
                disabled={!session?.user?.id || comment.userInteraction === 'like'}
              >
                {comment.likesCount || 0}
              </Button>

<Button
                type="text"
                size="small"
                icon={<DislikeOutlined />}
                style={{ 
                  color: comment.userInteraction === 'dislike' ? "#ff4d4f" : "#666",
                  backgroundColor: comment.userInteraction === 'dislike' ? "#fff2f0" : "transparent",
                  border: comment.userInteraction === 'dislike' ? '1px solid #ffccc7' : 'none',
                  padding: "0 8px",
                  height: "28px",
                  borderRadius: "4px",
                  fontSize: "12px"
                }}
                onClick={() => handleLikeDislike(comment.id, 'dislike')}
                disabled={!session?.user?.id || comment.userInteraction === 'dislike'}
              >
                {comment.dislikesCount || 0}
              </Button>

{depth < maxDepth && (
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  style={{ 
                    color: "#1890ff",
                    padding: "0 8px",
                    height: "28px",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}
                  onClick={() => {
                    setReplyingTo(comment.id);
                    setReplyingToUsername(comment.user?.name || t('comments.anonymous'));
                  }}
                  disabled={!session?.user?.id}
                >
                  {t('comments.reply')} {replyCount > 0 && `(${replyCount})`}
                </Button>
              )}
            </div>
          </div>
        </div>

{}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ 
            marginLeft: effectiveDepth === 0 ? "clamp(32px, 52px, 52px)" : effectiveDepth === 1 ? "clamp(24px, 44px, 44px)" : "clamp(20px, 40px, 40px)",
            marginTop: "12px",
            paddingLeft: "12px",
            borderLeft: `2px solid ${effectiveDepth === 0 ? "#d9d9d9" : effectiveDepth === 1 ? "#e8e8e8" : "#f0f0f0"}`,
          }}>
            {comment.replies.map((reply, index) => 
              renderComment(reply, depth + 1, index === comment.replies!.length - 1)
            )}
          </div>
        )}
      </div>
    );
  };

return (
    <>
      {contextHolder}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <MessageOutlined />
              <span>{t('comments.title')} ({totalCommentCount})</span>
            </Space>
          <Dropdown
            menu={{ items: shareMenuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              icon={<ShareAltOutlined />}
              style={{ color: '#1890ff' }}
            >
              {t('comments.share_post')}
            </Button>
          </Dropdown>
        </div>
      }
      style={{ marginTop: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      {}
      {session?.user && (
        <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
          {replyingTo && (
            <div style={{ 
              marginBottom: "16px", 
              padding: "12px 16px", 
              backgroundColor: "#f0f8ff", 
              borderRadius: "8px", 
              border: "1px solid #d6e4ff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Space>
                <MessageOutlined style={{ color: "#1890ff" }} />
                <Text style={{ fontSize: "14px" }}>
                  {t('comments.replying_to')} <Text strong>{replyingToUsername}</Text>
                </Text>
              </Space>
              <Button 
                type="link" 
                size="small" 
                onClick={() => {
                  setReplyingTo(null);
                  setReplyingToUsername(null);
                }}
                style={{ padding: 0, height: "auto" }}
              >
                {t('common.cancel')}
              </Button>
            </div>
          )}
          <Form.Item
            name="content"
            rules={[
              { required: true, message: t('comments.content_required') },
              { max: 1000, message: t('comments.content_max_length') },
            ]}
          >
            <TextArea
              rows={4}
              style={{ minHeight: "100px", borderRadius: "8px" }}
              placeholder={replyingTo ? t('comments.reply_placeholder') : t('comments.comment_placeholder')}
              maxLength={1000}
              showCount
              // style={{ borderRadius: "8px" }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              icon={<SendOutlined />}
              size="large"
              style={{ borderRadius: "8px" }}
            >
              {replyingTo ? t('comments.post_reply') : t('comments.post_comment')}
            </Button>
          </Form.Item>
        </Form>
      )}

{!session?.user && (
        <div style={{ 
          textAlign: "center", 
          padding: "32px", 
          backgroundColor: "#fafafa",
          borderRadius: "8px",
          border: "1px dashed #d9d9d9"
        }}>
          <Space direction="vertical" size="small">
            <UserOutlined style={{ fontSize: "32px", color: "#bfbfbf" }} />
            <Text type="secondary">
              {t('comments.login_prompt')}{" "}
              <Button type="link" href="/login" style={{ padding: 0 }}>
                {t('nav.login')}
              </Button>
            </Text>
          </Space>
        </div>
      )}

<Divider style={{ margin: "24px 0" }} />

{}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" tip={t('comments.loading')} />
        </div>
      ) : comments.length === 0 ? (
        <Empty
          description={t('comments.no_comments')}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: "40px 20px" }}
        />
      ) : (
        <div style={{ marginTop: "8px" }}>
          {comments.map((comment) => renderComment(comment, 0, false))}
          {totalCommentCount > 0 && (
            <div style={{ 
              marginTop: "24px", 
              paddingTop: "16px", 
              borderTop: "1px solid #f0f0f0",
              textAlign: "center" 
            }}>
              <Text type="secondary" style={{ fontSize: "13px" }}>
                {t('comments.total_count', { count: totalCommentCount })}
              </Text>
            </div>
          )}
        </div>
      )}

{}
      <Modal
        title={t('comments.share_post')}
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
        width={400}
      >
        <Card style={{ backgroundColor: 'white', border: 'none' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Text strong>{shareTitle}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {currentUrl}
              </Text>
            </div>

<Space wrap style={{ justifyContent: 'center' }}>
              <Button 
                icon={<FacebookOutlined />} 
                onClick={shareToFacebook}
                style={{ color: '#1877F2', borderColor: '#1877F2' }}
                size="large"
              >
                Facebook
              </Button>
              <Button 
                icon={<TwitterOutlined />} 
                onClick={shareToTwitter}
                style={{ color: '#1DA1F2', borderColor: '#1DA1F2' }}
                size="large"
              >
                Twitter
              </Button>
              <Button 
                icon={<LinkedinOutlined />} 
                onClick={shareToLinkedIn}
                style={{ color: '#0077B5', borderColor: '#0077B5' }}
                size="large"
              >
                LinkedIn
              </Button>
              <Button 
                icon={<CopyOutlined />} 
                onClick={copyToClipboard}
                size="large"
              >
                {t('comments.copy_link')}
              </Button>
            </Space>
          </Space>
        </Card>
      </Modal>
      </Card>
    </>
  );
}
