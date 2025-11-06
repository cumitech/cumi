"use client";

import React, { useState, useRef } from "react";
import {
  Col,
  Row,
  Card,
  Statistic,
  Typography,
  Space,
  Table,
  Tag,
  Button,
  Spin,
  Tabs,
  notification,
  Modal,
  Descriptions,
  Popconfirm,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  UserOutlined,
  MessageOutlined,
  LikeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useTranslation } from "@contexts/translation.context";
import { statsAPI } from "@store/api/stats_api";
import { commentAPI } from "@store/api/comment_api";
import { postInteractionAPI } from "@store/api/post-interaction_api";
import { eventRegistrationAPI } from "@store/api/event-registration_api";
import { useTable } from "@refinedev/antd";
import { useNotification as useCoreNotification } from "@refinedev/core";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import { useRouter } from "next/navigation";
import CourseCreateModal from "@components/modals/CourseCreateModal";
import PostCreateModal from "@components/modals/PostCreateModal";
import EventCreateModal from "@components/modals/EventCreateModal";
import CourseManagementModal from "@components/modals/CourseManagementModal";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import AccountActivationNotification from "@components/shared/account-activation-notification";

const { Title, Text } = Typography;

export default function CreatorDashboard() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const { open } = useCoreNotification();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  // Modal states
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [courseManagementVisible, setCourseManagementVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // View modal states
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewModalData, setViewModalData] = useState<any>(null);
  const [viewModalType, setViewModalType] = useState<
    "course" | "post" | "event"
  >("course");

  // Management modal states
  const [eventManagementVisible, setEventManagementVisible] = useState(false);
  const [postManagementVisible, setPostManagementVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // API calls for management data
  const { data: eventRegistrations } = eventRegistrationAPI.useGetEventRegistrationsByEventQuery(
    selectedEvent?.id || "",
    { skip: !selectedEvent?.id }
  );

  const { data: postComments } = commentAPI.useGetCommentsByPostIdQuery(
    selectedPost?.id || "",
    { skip: !selectedPost?.id }
  );

  const { data: postStats } = postInteractionAPI.useGetPostStatsQuery(
    { postId: selectedPost?.id || '', userId: session?.user?.id },
    { skip: !selectedPost?.id }
  );

  // Table refs for focus management
  const coursesTableRef = useRef<any>(null);
  const postsTableRef = useRef<any>(null);
  const eventsTableRef = useRef<any>(null);

  // Fetch stats data
  const statsQuery = statsAPI.useGetDashboardStatsQuery(undefined, {
    skip: !session?.user,
    refetchOnMountOrArgChange: true,
  });

  const stats = statsQuery.data?.overview || {
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalCourses: 0,
    totalProjects: 0,
    totalOpportunities: 0,
    totalServices: 0,
    totalProfessionals: 0,
    totalBanners: 0,
    totalContactMessages: 0,
    totalSubscribers: 0,
    totalComments: 0,
    totalPostLikes: 0,
    totalCommentLikes: 0,
    totalUserLikes: 0,
    totalUserComments: 0,
    // Course-specific stats for creators
    totalCourseEnrollments: 0,
    totalCourseModules: 0,
    totalCourseAssignments: 0,
    totalCourseProgress: 0,
  };

  // Table configurations
  const {
    tableProps: coursesTableProps,
    tableQueryResult: coursesQueryResult,
  } = useTable({
    resource: "courses",
    syncWithLocation: true,
  });

  const { tableProps: postsTableProps, tableQueryResult: postsQueryResult } =
    useTable({
      resource: "posts",
      syncWithLocation: true,
    });

  const { tableProps: eventsTableProps, tableQueryResult: eventsQueryResult } =
    useTable({
      resource: "events",
      syncWithLocation: true,
    });

  // Handle successful creation
  const handleCreationSuccess = (type: "course" | "post" | "event") => {
    api.success({
      message: t('creator.success'),
      description: t(`creator.${type}_created_success`),
      placement: 'topRight',
      duration: 3,
    });

    // Refetch the appropriate table data
    switch (type) {
      case "course":
        coursesQueryResult.refetch();
        // Focus on courses table
        setTimeout(() => {
          coursesTableRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        break;
      case "post":
        postsQueryResult.refetch();
        // Focus on posts table
        setTimeout(() => {
          postsTableRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        break;
      case "event":
        eventsQueryResult.refetch();
        // Focus on events table
        setTimeout(() => {
          eventsTableRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        break;
    }

    // Refetch stats
    statsQuery.refetch();
  };

  // Handle event management
  const handleEventManagement = (event: any) => {
    setSelectedEvent(event);
    setEventManagementVisible(true);
  };

  // Handle post management
  const handlePostManagement = (post: any) => {
    setSelectedPost(post);
    setPostManagementVisible(true);
  };

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
        // Refetch comments to update the table
        if (selectedPost?.id) {
          // The RTK Query will automatically refetch due to cache invalidation
        }
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
        // Refetch comments to update the table
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

  // Handle view action
  const handleView = async (
    record: BaseRecord,
    type: "course" | "post" | "event"
  ) => {
    if (!record.id) return;
    try {
      const response = await fetch(`/api/${type}s/${record.id}`);
      const data = await response.json();

      if (response.ok) {
        setViewModalData(data);
        setViewModalType(type);
        setViewModalVisible(true);
      } else {
        api.error({
          message: t('common.error'),
          description: t(`creator.fetch_${type}_failed`, { message: data.message }),
          placement: 'topRight',
        });
      }
    } catch (error: any) {
      api.error({
        message: t('common.error'),
        description: t(`creator.fetch_${type}_failed`, { message: error.message }),
        placement: 'topRight',
      });
    }
  };

  // Handle edit action
  const handleEdit = (
    record: BaseRecord,
    type: "course" | "post" | "event"
  ) => {
    if (type === "course") {
      setEditingCourse(record);
      setCourseModalVisible(true);
    } else if (type === "post") {
      setEditingPost(record);
      setPostModalVisible(true);
    } else if (type === "event") {
      setEditingEvent(record);
      setEventModalVisible(true);
    }
  };

  // Handle delete action
  const handleDelete = async (
    record: BaseRecord,
    type: "course" | "post" | "event"
  ) => {
    try {
      const response = await fetch(`/api/${type}s/${record.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        api.success({
          message: t('common.success'),
          description: t(`creator.${type}_deleted_success`),
          placement: 'topRight',
          duration: 3,
        });

        // Refetch the appropriate table data
        switch (type) {
          case "course":
            coursesQueryResult.refetch();
            break;
          case "post":
            postsQueryResult.refetch();
            break;
          case "event":
            eventsQueryResult.refetch();
            break;
        }

        // Refetch stats
        statsQuery.refetch();
      } else {
        api.error({
          message: t('common.error'),
          description: t(`creator.${type}_delete_failed`, { message: data.message }),
          placement: 'topRight',
        });
      }
    } catch (error: any) {
      api.error({
        message: t('common.error'),
        description: t(`creator.${type}_delete_failed`, { message: error.message }),
        placement: 'topRight',
      });
    }
  };

  // Show loading while session is loading
  if (status === "loading") {
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

  // Only render creator dashboard for creator/student users
  if (
    !session?.user ||
    !["creator", "student"].includes(session.user.role || "")
  ) {
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

  // Creator-specific stats
  const creatorStats = [
    {
      title: t('creator.my_courses'),
      value: stats.totalCourses,
      icon: <BookOutlined />,
      color: "#52c41a",
    },
    {
      title: t('creator.course_modules'),
      value: stats.totalCourseModules,
      icon: <CalendarOutlined />,
      color: "#1890ff",
    },
    {
      title: t('creator.course_assignments'),
      value: stats.totalCourseAssignments,
      icon: <CalendarOutlined />,
      color: "#13c2c2",
    },
    {
      title: t('creator.my_posts'),
      value: stats.totalPosts,
      icon: <BookOutlined />,
      color: "#722ed1",
    },
    {
      title: t('creator.post_likes_received'),
      value: stats.totalPostLikes,
      icon: <LikeOutlined />,
      color: "#fa8c16",
    },
    {
      title: t('creator.comment_likes_received'),
      value: stats.totalCommentLikes,
      icon: <LikeOutlined />,
      color: "#eb2f96",
    },
    {
      title: t('creator.my_comments'),
      value: stats.totalUserComments,
      icon: <MessageOutlined />,
      color: "#52c41a",
    },
  ];

  // Table columns
  const courseColumns = [
    {
      title: t('common.id'),
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: number) =>
        format.twoChar((index + 1).toString()),
    },
    {
      title: t('common.title'),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t('common.price'),
      dataIndex: "price",
      key: "price",
      render: (value: any, record: any) => (
        <span>
          {record.isFree ? (
            <Tag color="green">{t('common.free')}</Tag>
          ) : (
            `${value || 0} ${record.currency || "XAF"}`
          )}
        </span>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const statusLower = value?.toLowerCase();
        const colorMap = {
          draft: "orange",
          published: "green",
          archived: "gray",
          suspended: "red",
        };
        return (
          <Tag color={colorMap[statusLower as keyof typeof colorMap] || "default"}>
            {t(`common.${statusLower}`)}
          </Tag>
        );
      },
    },
    {
      title: t('common.actions'),
      key: "actions",
      render: (_: any, record: BaseRecord) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="middle"
            onClick={() => handleView(record, "course")}
            title={t('creator.view_course')}
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Button
            icon={<EditOutlined />}
            size="middle"
            onClick={() => handleEdit(record, "course")}
            title={t('creator.edit_course')}
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Button
            type="primary"
            size="middle"
            onClick={() => router.push(`/dashboard/courses/${record.id}`)}
            title={t('creator.manage_course')}
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            }}
          >
            {t('creator.manage')}
          </Button>
          <Popconfirm
            title={t('creator.delete_course')}
            description={t('creator.delete_course_confirm')}
            onConfirm={() => handleDelete(record, "course")}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button
              icon={<DeleteOutlined />}
              size="middle"
              danger
              title={t('creator.delete_course')}
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(255,77,79,0.3)',
              }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const postColumns = [
    {
      title: t('common.id'),
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: number) =>
        format.twoChar((index + 1).toString()),
    },
    {
      title: t('common.title'),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t('common.status'),
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const statusLower = value?.toLowerCase();
        const colorMap = {
          draft: "orange",
          published: "green",
          archived: "gray",
        };
        return (
          <Tag color={colorMap[statusLower as keyof typeof colorMap] || "default"}>
            {t(`common.${statusLower}`)}
          </Tag>
        );
      },
    },
    {
      title: t('common.actions'),
      key: "actions",
      render: (_: any, record: BaseRecord) => (
        <Space>
          <Button
            icon={<SettingOutlined />}
            size="middle"
            type="primary"
            onClick={() => router.push(`/dashboard/blog-posts/${record.id}`)}
            title={t('creator.manage_post')}
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)',
            }}
          >
            {t('creator.manage')}
          </Button>
          <Button
            icon={<EyeOutlined />}
            size="middle"
            onClick={() => handleView(record, "post")}
            title={t('creator.view_post')}
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Button
            icon={<EditOutlined />}
            size="middle"
            onClick={() => handleEdit(record, "post")}
            title={t('creator.edit_post')}
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Popconfirm
            title={t('creator.delete_post')}
            description={t('creator.delete_post_confirm')}
            onConfirm={() => handleDelete(record, "post")}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button
              icon={<DeleteOutlined />}
              size="middle"
              danger
              title={t('creator.delete_post')}
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(255,77,79,0.3)',
              }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const eventColumns = [
    {
      title: t('common.id'),
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: number) =>
        format.twoChar((index + 1).toString()),
    },
    {
      title: t('common.title'),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t('creator.event_date'),
      dataIndex: "eventDate",
      key: "eventDate",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: t('creator.location'),
      dataIndex: "location",
      key: "location",
    },
    {
      title: t('common.status'),
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const statusLower = value?.toLowerCase();
        const colorMap = {
          draft: "orange",
          published: "green",
          cancelled: "red",
          completed: "blue",
        };
        return (
          <Tag color={colorMap[statusLower as keyof typeof colorMap] || "default"}>
            {t(`common.${statusLower}`)}
          </Tag>
        );
      },
    },
    {
      title: t('common.actions'),
      key: "actions",
      render: (_: any, record: BaseRecord) => (
        <Space>
          <Button
            icon={<SettingOutlined />}
            size="middle"
            type="primary"
            onClick={() => router.push(`/dashboard/events/${record.id}`)}
            title={t('creator.manage_event')}
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(255, 167, 81, 0.4)',
            }}
          >
            {t('creator.manage')}
          </Button>
          <Button
            icon={<EyeOutlined />}
            size="middle"
            onClick={() => handleView(record, "event")}
            title={t('creator.view_event')}
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Button
            icon={<EditOutlined />}
            size="middle"
            onClick={() => handleEdit(record, "event")}
            title={t('creator.edit_event')}
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Popconfirm
            title={t('creator.delete_event')}
            description={t('creator.delete_event_confirm')}
            onConfirm={() => handleDelete(record, "event")}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button
              icon={<DeleteOutlined />}
              size="middle"
              danger
              title={t('creator.delete_event')}
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(255,77,79,0.3)',
              }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "courses",
      label: t('creator.courses'),
      children: (
        <div ref={coursesTableRef}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>{t('creator.my_courses')}</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCourseModalVisible(true)}
              size="large"
              style={{
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: '42px',
                padding: '0 24px',
                fontWeight: 600,
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
              }}
            >
              {t('creator.create_course')}
            </Button>
          </div>
          <Table
            {...coursesTableProps}
            columns={courseColumns}
            rowKey="id"
            pagination={{
              ...coursesTableProps.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            locale={{ emptyText: t('creator.no_courses_yet') }}
          />
        </div>
      ),
    },
    {
      key: "posts",
      label: t('creator.posts'),
      children: (
        <div ref={postsTableRef}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>{t('creator.my_posts')}</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setPostModalVisible(true)}
              size="large"
              style={{
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                height: '42px',
                padding: '0 24px',
                fontWeight: 600,
                boxShadow: '0 6px 16px rgba(240, 147, 251, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(240, 147, 251, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(240, 147, 251, 0.4)';
              }}
            >
              {t('creator.create_post')}
            </Button>
          </div>
          <Table
            {...postsTableProps}
            columns={postColumns}
            rowKey="id"
            pagination={{
              ...postsTableProps.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            locale={{ emptyText: t('creator.no_posts_yet') }}
          />
        </div>
      ),
    },
    {
      key: "events",
      label: t('creator.events'),
      children: (
        <div ref={eventsTableRef}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>{t('creator.my_events')}</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setEventModalVisible(true)}
              size="large"
              style={{
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)',
                border: 'none',
                height: '42px',
                padding: '0 24px',
                fontWeight: 600,
                boxShadow: '0 6px 16px rgba(255, 167, 81, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 167, 81, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 167, 81, 0.4)';
              }}
            >
              {t('creator.create_event')}
            </Button>
          </div>
          <Table
            {...eventsTableProps}
            columns={eventColumns}
            rowKey="id"
            pagination={{
              ...eventsTableProps.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            locale={{ emptyText: t('creator.no_events_yet') }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <EnhancedBreadcrumb items={[]} showBackButton={false} />
      <Title level={4}>{t('creator.dashboard_title')}</Title>
      
      {/* Account Activation Notification */}
      <AccountActivationNotification />
      {/* Creator Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={4}>{t('creator.your_statistics')}</Title>
        </Col>
        {creatorStats.map((stat, index) => (
          <Col sm={6} md={6} span={24} key={index}>
            <Card
              size="small"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "none",
              }}
            >
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
                valueStyle={{ fontSize: 20 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Content Management Tabs */}
      <Card
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
      >
        <Tabs defaultActiveKey="courses" items={tabItems} />
      </Card>

      {/* Modals */}
      <CourseCreateModal
        visible={courseModalVisible}
        onCancel={() => {
          setCourseModalVisible(false);
          setEditingCourse(null);
        }}
        onSuccess={() => handleCreationSuccess("course")}
        editingCourse={editingCourse}
      />

      <PostCreateModal
        visible={postModalVisible}
        onCancel={() => {
          setPostModalVisible(false);
          setEditingPost(null);
        }}
        onSuccess={() => handleCreationSuccess("post")}
        editingPost={editingPost}
      />

      <EventCreateModal
        visible={eventModalVisible}
        onCancel={() => {
          setEventModalVisible(false);
          setEditingEvent(null);
        }}
        onSuccess={() => handleCreationSuccess("event")}
        editingEvent={editingEvent}
      />

      <CourseManagementModal
        visible={courseManagementVisible}
        onCancel={() => {
          setCourseManagementVisible(false);
          setSelectedCourse(null);
        }}
        courseId={selectedCourse?.id}
        courseTitle={selectedCourse?.title}
      />

      {/* View Modal */}
      <Modal
        title={t(`creator.view_${viewModalType}_details`)}
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setViewModalData(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalVisible(false);
              setViewModalData(null);
            }}
            size="large"
            style={{
              borderRadius: '8px',
              height: '40px',
              padding: '0 24px',
              fontWeight: 500,
            }}
          >
            {t('common.close')}
          </Button>,
        ]}
        width="95%"
        style={{ maxWidth: '900px', top: 20 }}
        destroyOnClose={true}
        maskClosable={true}
        keyboard={true}
        forceRender={false}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            padding: '24px'
          }
        }}
      >
        {viewModalData && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label={t('common.id')}>{viewModalData.id}</Descriptions.Item>
            <Descriptions.Item label={t('common.title')}>
              {viewModalData.title}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.status')}>
              <Tag
                color={
                  viewModalData.status?.toLowerCase() === "published"
                    ? "green"
                    : viewModalData.status?.toLowerCase() === "draft"
                    ? "orange"
                    : viewModalData.status?.toLowerCase() === "archived"
                    ? "gray"
                    : viewModalData.status?.toLowerCase() === "cancelled"
                    ? "red"
                    : viewModalData.status?.toLowerCase() === "completed"
                    ? "blue"
                    : "default"
                }
              >
                {t(`common.${viewModalData.status?.toLowerCase()}`)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('common.created_at')}>
              {new Date(viewModalData.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.updated_at')}>
              {new Date(viewModalData.updatedAt).toLocaleString()}
            </Descriptions.Item>

            {/* Course-specific fields */}
            {viewModalType === "course" && (
              <>
                <Descriptions.Item label={t('common.author')}>
                  {viewModalData.authorName}
                </Descriptions.Item>
                <Descriptions.Item label={t('common.price')}>
                  {viewModalData.isFree ? (
                    <Tag color="green">{t('common.free')}</Tag>
                  ) : (
                    `${viewModalData.price || 0} ${
                      viewModalData.currency || "XAF"
                    }`
                  )}
                </Descriptions.Item>
                <Descriptions.Item label={t('common.level')}>
                  {viewModalData.level}
                </Descriptions.Item>
                <Descriptions.Item label={t('common.language')}>
                  {viewModalData.language}
                </Descriptions.Item>
                <Descriptions.Item label={t('common.description')} span={2}>
                  {viewModalData.description}
                </Descriptions.Item>
              </>
            )}

            {/* Post-specific fields */}
            {viewModalType === "post" && (
              <>
                <Descriptions.Item label={t('common.excerpt')} span={2}>
                  {viewModalData.description}
                </Descriptions.Item>
                <Descriptions.Item label={t('common.content')} span={2}>
                  <div
                    dangerouslySetInnerHTML={{ __html: viewModalData.content }}
                  />
                </Descriptions.Item>
              </>
            )}

            {/* Event-specific fields */}
            {viewModalType === "event" && (
              <>
                <Descriptions.Item label={t('creator.event_date')}>
                  {new Date(viewModalData.eventDate).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label={t('creator.location')}>
                  {viewModalData.location}
                </Descriptions.Item>
                <Descriptions.Item label={t('common.category')}>
                  {viewModalData.category}
                </Descriptions.Item>
                <Descriptions.Item label={t('common.description')} span={2}>
                  {viewModalData.description}
                </Descriptions.Item>
                <Descriptions.Item label={t('common.content')} span={2}>
                  <div
                    dangerouslySetInnerHTML={{ __html: viewModalData.content }}
                  />
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Event Management Modal */}
      <Modal
        title={`${t('creator.manage_event')}: ${selectedEvent?.title || t('creator.event')}`}
        open={eventManagementVisible}
        onCancel={() => {
          setEventManagementVisible(false);
          setSelectedEvent(null);
        }}
        footer={[
          <Button 
            key="close-event-mgmt" 
            onClick={() => setEventManagementVisible(false)} 
            size="large"
            style={{
              borderRadius: '8px',
              height: '40px',
              padding: '0 24px',
              fontWeight: 500,
            }}
          >
            {t('common.close')}
          </Button>,
          <Button
            key="view-full-event-mgmt"
            type="primary"
            onClick={() => {
              if (selectedEvent?.slug) {
                router.push(`/events/${selectedEvent.slug}`);
              } else {
                router.push(`/events/${selectedEvent?.id}`);
              }
              setEventManagementVisible(false);
            }}
            size="large"
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)',
              border: 'none',
              height: '40px',
              padding: '0 24px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(255, 167, 81, 0.4)',
            }}
          >
            {t('creator.view_full_event')}
          </Button>,
        ]}
        width="95%"
        style={{ maxWidth: '1100px' }}
      >
        {selectedEvent && (
          <Card style={{ backgroundColor: 'white', border: 'none' }}>
            <Row gutter={[16, 16]}>
              {/* Event Details */}
              <Col xs={24} lg={12}>
                <Card title={t('creator.event_details')} style={{ backgroundColor: '#f8f9fa', marginBottom: 16 }}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label={t('common.title')}>{selectedEvent.title}</Descriptions.Item>
                    <Descriptions.Item label={t('creator.date')}>
                      {selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString() : t('creator.tbd')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('creator.location')}>{selectedEvent.location || t('creator.online')}</Descriptions.Item>
                    <Descriptions.Item label={t('common.status')}>
                      <Tag color={selectedEvent.status?.toLowerCase() === 'published' ? 'green' : selectedEvent.status?.toLowerCase() === 'cancelled' ? 'red' : 'orange'}>
                        {t(`common.${selectedEvent.status?.toLowerCase()}`)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('creator.entry_fee')}>
                      {selectedEvent.isFree ? (
                        <Tag color="green">{t('creator.free_event')}</Tag>
                      ) : (
                        `${selectedEvent.entryFee || 0} ${selectedEvent.currency || 'XAF'}`
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('creator.max_attendees')}>
                      {selectedEvent.maxAttendees || t('creator.unlimited')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('creator.current_attendees')}>
                      {selectedEvent.currentAttendees || 0}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Event Stats */}
                <Card title={t('creator.event_statistics')} style={{ backgroundColor: '#f0f8ff' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title={t('creator.total_registrations')}
                        value={eventRegistrations?.length || 0}
                        prefix={<TeamOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={t('creator.registration_rate')}
                        value={selectedEvent.maxAttendees ? 
                          Math.round(((selectedEvent.currentAttendees || 0) / selectedEvent.maxAttendees) * 100) : 0
                        }
                        suffix="%"
                        prefix={<UserOutlined />}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Event Registrations Table */}
              <Col xs={24} lg={12}>
                <Card title={t('creator.event_registrations')} style={{ backgroundColor: '#f0f8ff' }}>
                  <Table
                    dataSource={eventRegistrations || []}
                    columns={[
                      {
                        title: t('common.name'),
                        dataIndex: 'name',
                        key: 'name',
                      },
                      {
                        title: t('common.email'),
                        dataIndex: 'email',
                        key: 'email',
                      },
                      {
                        title: t('common.phone'),
                        dataIndex: 'phone',
                        key: 'phone',
                      },
                      {
                        title: t('common.status'),
                        dataIndex: 'status',
                        key: 'status',
                        render: (status: string) => (
                          <Tag color={status?.toLowerCase() === 'confirmed' ? 'green' : status?.toLowerCase() === 'cancelled' ? 'red' : 'orange'}>
                            {t(`common.${status?.toLowerCase()}`)}
                          </Tag>
                        ),
                      },
                      {
                        title: t('creator.registration_date'),
                        dataIndex: 'registrationDate',
                        key: 'registrationDate',
                        render: (date: string) => new Date(date).toLocaleDateString(),
                      },
                    ]}
                    size="small"
                    pagination={{ pageSize: 5 }}
                    locale={{ emptyText: t('creator.no_registrations_yet') }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        )}
      </Modal>

      {/* Post Management Modal */}
      <Modal
        title={`${t('creator.manage_post')}: ${selectedPost?.title || t('creator.post')}`}
        open={postManagementVisible}
        onCancel={() => {
          setPostManagementVisible(false);
          setSelectedPost(null);
        }}
        footer={[
          <Button 
            key="close-post-mgmt" 
            onClick={() => setPostManagementVisible(false)} 
            size="large"
            style={{
              borderRadius: '8px',
              height: '40px',
              padding: '0 24px',
              fontWeight: 500,
            }}
          >
            {t('common.close')}
          </Button>,
          <Button
            key="view-full-post-mgmt"
            type="primary"
            onClick={() => {
              if (selectedPost?.slug) {
                router.push(`/blog-posts/${selectedPost.slug}`);
              } else {
                router.push(`/blog-posts/${selectedPost?.id}`);
              }
              setPostManagementVisible(false);
            }}
            size="large"
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              height: '40px',
              padding: '0 24px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)',
            }}
          >
            {t('creator.view_full_post')}
          </Button>,
        ]}
        width={1200}
      >
        {selectedPost && (
          <Card style={{ backgroundColor: 'white', border: 'none' }}>
            <Row gutter={[16, 16]}>
              {/* Post Details */}
              <Col xs={24} lg={8}>
                <Card title={t('creator.post_details')} style={{ backgroundColor: '#f8f9fa', marginBottom: 16 }}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label={t('common.title')}>{selectedPost.title}</Descriptions.Item>
                    <Descriptions.Item label={t('common.status')}>
                      <Tag color={selectedPost.status?.toLowerCase() === 'published' ? 'green' : selectedPost.status?.toLowerCase() === 'draft' ? 'orange' : 'default'}>
                        {t(`common.${selectedPost.status?.toLowerCase()}`)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('creator.published')}>
                      {selectedPost.publishedAt ? new Date(selectedPost.publishedAt).toLocaleDateString() : t('common.draft')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('common.category')}>{selectedPost.categoryId || t('creator.uncategorized')}</Descriptions.Item>
                    <Descriptions.Item label={t('common.description')}>{selectedPost.description}</Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Post Stats */}
                <Card title={t('creator.post_statistics')} style={{ backgroundColor: '#f0f8ff' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Statistic
                        title={t('creator.total_comments')}
                        value={postComments?.length || 0}
                        prefix={<MessageOutlined />}
                      />
                    </Col>
                    <Col span={24}>
                      <Statistic
                        title={t('creator.total_likes')}
                        value={postStats?.likesCount || 0}
                        prefix={<LikeOutlined />}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Post Comments Management */}
              <Col xs={24} lg={16}>
                <Card title={t('creator.comments_management')} style={{ backgroundColor: '#f0f8ff' }}>
                  <Table
                    dataSource={postComments || []}
                    columns={[
                      {
                        title: t('common.user'),
                        dataIndex: 'user',
                        key: 'user',
                        render: (user: any, record: any) => (
                          <Space>
                            <UserOutlined />
                            <Text>{user?.name || user?.username || record.userId}</Text>
                          </Space>
                        ),
                      },
                      {
                        title: t('creator.comment'),
                        dataIndex: 'content',
                        key: 'content',
                        render: (content: string) => (
                          <div style={{ maxWidth: 300 }}>
                            {content?.length > 100 ? `${content.substring(0, 100)}...` : content}
                          </div>
                        ),
                      },
                      {
                        title: t('creator.date'),
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (date: string) => new Date(date).toLocaleDateString(),
                      },
                      {
                        title: t('common.status'),
                        dataIndex: 'isApproved',
                        key: 'isApproved',
                        render: (isApproved: boolean) => (
                          <Tag color={isApproved ? 'green' : 'orange'}>
                            {isApproved ? t('creator.approved') : t('creator.pending')}
                          </Tag>
                        ),
                      },
                      {
                        title: t('common.actions'),
                        key: 'actions',
                        render: (_: any, record: any) => (
                          <Space>
                            {!record.isApproved && (
                              <Button
                                type="primary"
                                size="middle"
                                onClick={() => handleCommentApproval(record.id, true)}
                                style={{
                                  borderRadius: '6px',
                                  fontWeight: 500,
                                }}
                              >
                                {t('creator.approve')}
                              </Button>
                            )}
                            {record.isApproved && (
                              <Button
                                size="middle"
                                onClick={() => handleCommentApproval(record.id, false)}
                                style={{
                                  borderRadius: '6px',
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
                                style={{
                                  borderRadius: '6px',
                                  fontWeight: 500,
                                }}
                              >
                                {t('common.delete')}
                              </Button>
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                    size="small"
                    pagination={{ pageSize: 5 }}
                    locale={{ emptyText: t('creator.no_comments_yet') }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        )}
      </Modal>
    </div>
  );
}

