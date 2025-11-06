"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Button,
  Space,
  Table,
  Tag,
  Spin,
  Descriptions,
  Popconfirm,
  notification,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { useTranslation } from "@contexts/translation.context";
import { commentAPI } from "@store/api/comment_api";
import { postInteractionAPI } from "@store/api/post-interaction_api";
import { postAPI } from "@store/api/post_api";

const { Title, Text } = Typography;

interface PostDetailsPageProps {
  params: {
    id: string;
  };
}

export default function PostDetailsPage({ params }: PostDetailsPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [api, contextHolder] = notification.useNotification();

  // RTK Query hooks
  const { data: postResponse, isLoading: postLoading, error: postError } = postAPI.useGetSinglePostQuery(params.id);
  const post = (postResponse as any)?.data || postResponse;
  const { data: postComments = [], isLoading: commentsLoading, refetch: refetchComments } = commentAPI.useGetCommentsByPostIdQuery(params.id);
  const { data: postStats } = postInteractionAPI.useGetPostStatsQuery(
    { postId: params.id, userId: session?.user?.id },
    { skip: !session?.user?.id }
  );

  // Debug logging
  useEffect(() => {
    // Post data loaded
  }, [postResponse, post, postStats, postComments]);

  // Handle comment approval
  const handleCommentApproval = async (commentId: string | undefined, isApproved: boolean) => {
    if (!commentId) return;
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isApproved: isApproved,
        }),
      });

      if (response.ok) {
        api.success({
          message: t('common.success'),
          description: isApproved ? t('creator.comment_approved') : t('creator.comment_rejected'),
          placement: 'topRight',
          duration: 2,
        });
        refetchComments();
      } else {
        api.error({
          message: t('common.error'),
          description: t('creator.comment_update_failed'),
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      api.error({
        message: t('common.error'),
        description: t('creator.comment_update_failed'),
        placement: 'topRight',
      });
    }
  };

  // Handle comment deletion
  const handleCommentDeletion = async (commentId: string | undefined) => {
    if (!commentId) return;
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        api.success({
          message: t('common.success'),
          description: t('creator.comment_deleted'),
          placement: 'topRight',
          duration: 2,
        });
        refetchComments();
      } else {
        api.error({
          message: t('common.error'),
          description: t('creator.comment_delete_failed'),
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      api.error({
        message: t('common.error'),
        description: t('creator.comment_delete_failed'),
        placement: 'topRight',
      });
    }
  };

  const commentColumns = [
    {
      title: t('common.user'),
      dataIndex: 'user',
      key: 'user',
      width: 150,
      render: (user: any, record: any) => (
        <Space>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}>
            {(user?.name || user?.username || 'U')[0].toUpperCase()}
          </div>
          <Text strong>{user?.name || user?.username || record.userId}</Text>
        </Space>
      ),
    },
    {
      title: t('creator.comment'),
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <div style={{ maxWidth: 500 }}>
          <Text>{content?.length > 150 ? `${content.substring(0, 150)}...` : content}</Text>
        </div>
      ),
    },
    {
      title: t('creator.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => (
        <Text style={{ fontSize: '13px', color: '#666' }}>
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'isApproved',
      key: 'isApproved',
      width: 110,
      render: (isApproved: boolean) => (
        <Tag 
          color={isApproved ? 'green' : 'orange'}
          style={{ borderRadius: '6px', padding: '4px 12px', fontWeight: 500 }}
        >
          {isApproved ? t('creator.approved') : t('creator.pending')}
        </Tag>
      ),
      filters: [
        { text: t('creator.approved'), value: true },
        { text: t('creator.pending'), value: false },
      ],
      onFilter: (value: any, record: any) => record.isApproved === value,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          {!record.isApproved && (
            <Button
              type="primary"
              size="middle"
              icon={<CheckOutlined />}
              onClick={() => handleCommentApproval(record.id, true)}
              style={{ 
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #52c41a 0%, #a0d911 100%)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(82, 196, 26, 0.3)',
                fontWeight: 500,
              }}
            >
              {t('creator.approve')}
            </Button>
          )}
          {record.isApproved && (
            <Button
              size="middle"
              icon={<CloseOutlined />}
              onClick={() => handleCommentApproval(record.id, false)}
              style={{ 
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontWeight: 500,
              }}
            >
              {t('creator.reject')}
            </Button>
          )}
          <Popconfirm
            title={t('creator.delete_comment_title')}
            description={t('creator.delete_comment_confirm')}
            onConfirm={() => handleCommentDeletion(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button
              danger
              size="middle"
              icon={<DeleteOutlined />}
              style={{ 
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(255, 77, 79, 0.3)',
                fontWeight: 500,
              }}
            >
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (postLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!post || postError) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Text>{t('creator.post_not_found')}</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      
      {/* Enhanced Breadcrumb */}
      <EnhancedBreadcrumb
        items={[
          { title: t('creator.post_management') },
          { title: post?.title || t('common.loading') }
        ]}
      />

      {/* Page Title */}
      <Title level={2} style={{ marginBottom: 24 }}>
        {t('creator.post_details')}
      </Title>

      {/* Post Statistics */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
          border: "none",
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ color: 'white', marginBottom: 20 }}>{t('creator.post_statistics')}</Title>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6} md={6}>
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                textAlign: 'center',
              }}
            >
              <Statistic
                title={t('creator.total_comments')}
                value={postComments?.length || 0}
                prefix={<MessageOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ fontSize: 24, fontWeight: 'bold', color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                textAlign: 'center',
              }}
            >
              <Statistic
                title={t('creator.total_likes')}
                value={postStats?.likesCount || 0}
                prefix={<LikeOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ fontSize: 24, fontWeight: 'bold', color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                textAlign: 'center',
              }}
            >
              <Statistic
                title={t('creator.total_dislikes')}
                value={postStats?.dislikesCount || 0}
                prefix={<LikeOutlined style={{ color: "#ff4d4f" }} />}
                valueStyle={{ fontSize: 24, fontWeight: 'bold', color: "#ff4d4f" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                textAlign: 'center',
              }}
            >
              <Statistic
                title={t('creator.engagement_rate')}
                value={postComments.length > 0 || (postStats?.likesCount || 0) > 0 ? 
                  Math.round(((postComments.length + (postStats?.likesCount || 0) + (postStats?.dislikesCount || 0)) / 3) * 10) : 0
                }
                suffix="%"
                prefix={<UserOutlined style={{ color: "#722ed1" }} />}
                valueStyle={{ fontSize: 24, fontWeight: 'bold', color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Post Details & Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Post Information Card */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <MessageOutlined style={{ fontSize: '20px', color: 'white' }} />
                </div>
                <span>{t('creator.post_information')}</span>
              </div>
            }
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}
            extra={
              <Space>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => {
                    const slug = (post as any).slug || post.id;
                    window.open(`/blog-posts/${slug}`, '_blank');
                  }}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    fontWeight: 500,
                  }}
                >
                  {t('creator.preview_post')}
                </Button>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    const slug = (post as any).slug || post.id;
                    router.push(`/blog-posts/${slug}`);
                  }}
                  style={{
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)',
                    fontWeight: 600,
                  }}
                >
                  {t('creator.view_full_post')}
                </Button>
              </Space>
            }
          >
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label={t('common.title')} span={2}>
                <Text strong style={{ fontSize: '15px' }}>{post.title}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t('common.status')}>
                <Tag 
                  color={post.status?.toLowerCase() === 'published' ? 'green' : post.status?.toLowerCase() === 'draft' ? 'orange' : 'default'}
                  style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '6px' }}
                >
                  {t(`common.${post.status?.toLowerCase()}`)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('creator.published')}>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : t('common.draft')}
              </Descriptions.Item>
              <Descriptions.Item label={t('common.category')}>
                <Tag color="blue" style={{ borderRadius: '6px' }}>
                  {(post as any).Category?.name || post.categoryId || t('creator.uncategorized')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('common.author')}>
                <Space>
                  <UserOutlined />
                  {(post as any).author?.username || post.authorId}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label={t('common.created_at')}>
                {(post as any).createdAt ? new Date((post as any).createdAt).toLocaleString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('common.updated_at')}>
                {(post as any).updatedAt ? new Date((post as any).updatedAt).toLocaleString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('common.description')} span={2}>
                {post.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Comment Stats Card */}
        <Col xs={24} lg={8}>
          <Card
            title={t('creator.comment_statistics')}
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
              height: '100%',
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  style={{
                    background: 'linear-gradient(135deg, #52c41a 0%, #a0d911 100%)',
                    borderRadius: '12px',
                    border: 'none',
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#333' }}>{t('creator.approved_comments')}</span>}
                    value={postComments.filter(c => c.isApproved).length}
                    valueStyle={{ color: '#333', fontSize: 28, fontWeight: 'bold' }}
                    prefix={<CheckOutlined style={{ color: '#333' }} />}
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  style={{
                    background: 'linear-gradient(135deg, #fa8c16 0%, #faad14 100%)',
                    borderRadius: '12px',
                    border: 'none',
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#333' }}>{t('creator.pending_comments')}</span>}
                    value={postComments.filter(c => !c.isApproved).length}
                    valueStyle={{ color: '#333', fontSize: 28, fontWeight: 'bold' }}
                    prefix={<CloseOutlined style={{ color: '#333' }} />}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Comments Management */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MessageOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div>
              <div>{t('creator.comments_management')}</div>
              {postComments.length > 0 && (
                <div style={{ fontSize: '13px', color: '#666', fontWeight: 'normal', marginTop: '4px' }}>
                  {postComments.length} {t('creator.comment')}{postComments.length !== 1 ? 's' : ''} • {' '}
                  <span style={{ color: '#52c41a' }}>{postComments.filter(c => c.isApproved).length} {t('creator.approved').toLowerCase()}</span> • {' '}
                  <span style={{ color: '#fa8c16' }}>{postComments.filter(c => !c.isApproved).length} {t('creator.pending').toLowerCase()}</span>
                </div>
              )}
            </div>
          </div>
        }
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
        }}
      >
        {postComments.length === 0 && !commentsLoading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
            borderRadius: '12px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <MessageOutlined style={{ fontSize: '40px', color: '#1890ff' }} />
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
              {t('creator.no_comments_on_post')}
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              {t('creator.comments_will_appear_here')}
            </div>
          </div>
        ) : (
          <Table
            dataSource={postComments}
            columns={commentColumns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} comments`,
              style: { marginTop: '16px' },
            }}
            size="middle"
            loading={commentsLoading}
            scroll={{ x: 1100 }}
            style={{
              borderRadius: '8px',
            }}
            rowClassName={(record, index) => 
              index % 2 === 0 ? '' : 'ant-table-row-alternate'
            }
          />
        )}
      </Card>
    </div>
  );
}

