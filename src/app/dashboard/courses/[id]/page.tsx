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
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Spin,
  Descriptions,
  Select,
  DatePicker,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useNotification } from "@refinedev/core";
import RichTextEditor from "@components/shared/rich-text-editor";
import CourseHeader from "@components/course/course-header.component";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { 
  useGetModulesByCourseQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation 
} from "@store/api/module_api";
import { useGetSingleCourseQuery } from "@store/api/course_api";
import dayjs from "dayjs";
import { useTranslation } from "@contexts/translation.context";
import { notification } from "antd";

const { Title, Text } = Typography;

interface CourseDetailsPageProps {
  params: {
    id: string;
  };
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { id } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const { open } = useNotification();
  const { t } = useTranslation();
  const [api, contextHolder] = notification.useNotification();
  const [moduleModalVisible, setModuleModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [moduleForm] = Form.useForm();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewModalData, setViewModalData] = useState<any>(null);

  // RTK Query hooks
  const { data: course, isLoading: courseLoading, error: courseError } = useGetSingleCourseQuery(id);
  const { data: modules = [], isLoading: modulesLoading, refetch: refetchModules } = useGetModulesByCourseQuery(id);
  const [createModule, { isLoading: createLoading }] = useCreateModuleMutation();
  const [updateModule, { isLoading: updateLoading }] = useUpdateModuleMutation();
  const [deleteModule, { isLoading: deleteLoading }] = useDeleteModuleMutation();


  // Handle course error
  useEffect(() => {
    if (courseError) {
      api.error({
        message: t('common.error'),
        description: t('course_manage.fetch_course_failed'),
        placement: 'topRight',
      });
      router.push("/dashboard/creator");
    }
  }, [courseError, api, router, t]);

  const handleModuleSubmit = async (values: any) => {
    try {
      // Generate slug from title
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-");

      // Handle unlockDate properly - convert dayjs to ISO string
      let unlockDate = null;
      if (values.unlockDate) {
        if (dayjs.isDayjs(values.unlockDate)) {
          unlockDate = values.unlockDate.toISOString();
        } else if (values.unlockDate instanceof Date) {
          unlockDate = values.unlockDate.toISOString();
        } else if (typeof values.unlockDate === 'string') {
          unlockDate = values.unlockDate;
        } else {
          try {
            unlockDate = new Date(values.unlockDate).toISOString();
          } catch (e) {
            unlockDate = null;
          }
        }
      }

      const moduleData = {
        title: values.title,
        slug: slug,
        description: values.description || "",
        courseId: id,
        userId: session?.user?.id || "",
        moduleOrder: values.moduleOrder || 1,
        status: values.status || "draft",
        learningObjectives: values.learningObjectives || "",
        prerequisites: values.prerequisites || "",
        estimatedDurationHours: values.estimatedDurationHours || null,
        isLocked: values.isLocked || false,
        unlockDate: unlockDate,
        totalLessons: 0,
        totalQuizzes: 0,
        totalAssignments: 0,
      };

      // Validate required data
      if (!session?.user?.id) {
        throw new Error("User session not found. Please log in again.");
      }

      if (!id) {
        throw new Error("Course ID is required.");
      }

      if (editingModule) {
        // Update module
        await updateModule({ id: editingModule.id, module: moduleData }).unwrap();
        api.success({
          message: t('common.success'),
          description: t('course_manage.module_updated_success'),
          placement: 'topRight',
          duration: 2,
        });
      } else {
        // Create module
        await createModule(moduleData).unwrap();
        api.success({
          message: t('common.success'),
          description: t('course_manage.module_created_success'),
          placement: 'topRight',
          duration: 2,
        });
      }
      
      moduleForm.resetFields();
      setEditingModule(null);
      setModuleModalVisible(false);
    } catch (error: any) {
      // Extract error message from RTK Query error
      let errorMessage = t('course_manage.unknown_error');
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.validationErrors?.length > 0) {
        errorMessage = error.data.validationErrors.map((err: any) => err.message).join(", ");
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status) {
        errorMessage = `${t('course_manage.server_error')} (${error.status})`;
      }

      api.error({
        message: t('common.error'),
        description: t('course_manage.module_save_failed', { message: errorMessage }),
        placement: 'topRight',
      });
    }
  };

  const handleViewModule = (module: any) => {
    setViewModalData(module);
    setViewModalVisible(true);
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    moduleForm.setFieldsValue({
      ...module,
      unlockDate: module.unlockDate ? dayjs(module.unlockDate) : null,
    });
    setModuleModalVisible(true);
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await deleteModule(moduleId).unwrap();
      api.success({
        message: t('common.success'),
        description: t('course_manage.module_deleted_success'),
        placement: 'topRight',
        duration: 2,
      });
    } catch (error: any) {
      api.error({
        message: t('common.error'),
        description: t('course_manage.module_delete_failed', { message: error.message }),
        placement: 'topRight',
      });
    }
  };

  const moduleColumns = [
    {
      title: "#",
      dataIndex: "moduleOrder",
      key: "moduleOrder",
      width: 60,
      render: (value: number) => (
        <Tag color="blue" style={{ fontWeight: 'bold' }}>
          {value || 1}
        </Tag>
      ),
      sorter: (a: any, b: any) => (a.moduleOrder || 0) - (b.moduleOrder || 0),
    },
    {
      title: t('course_manage.module_title'),
      dataIndex: "title",
      key: "title",
      render: (value: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {value || t('course_manage.untitled_module')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.id?.substring(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      title: t('common.description'),
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (value: string) => (
        <div style={{ maxWidth: 200 }}>
          {value ? (
            <Text ellipsis={{ tooltip: value }}>
              {value}
            </Text>
          ) : (
            <Text type="secondary" italic>{t('course_manage.no_description')}</Text>
          )}
        </div>
      ),
    },
    {
      title: t('course_manage.duration'),
      dataIndex: "estimatedDurationHours",
      key: "estimatedDurationHours",
      width: 100,
      render: (value: number) => (
        <div style={{ textAlign: 'center' }}>
          {value ? (
            <Tag color="blue">
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {value}h
            </Tag>
          ) : (
            <Text type="secondary">-</Text>
          )}
        </div>
      ),
    },
    {
      title: t('course_manage.content_stats'),
      key: "contentStats",
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tag color="green" icon={<BookOutlined />}>
            {record.totalLessons || 0}
          </Tag>
          <Tag color="orange">
            {record.totalAssignments || 0}
          </Tag>
          <Tag color="purple">
            {record.totalQuizzes || 0}
          </Tag>
        </Space>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value: string) => {
        const statusLower = value?.toLowerCase();
        const statusConfig = {
          published: { color: 'green' },
          draft: { color: 'orange' },
          archived: { color: 'gray' }
        };
        const config = statusConfig[statusLower as keyof typeof statusConfig] || { color: 'default' };
        
        return (
          <Tag color={config.color}>
            {t(`common.${statusLower}`)}
          </Tag>
        );
      },
      filters: [
        { text: t('common.published'), value: 'published' },
        { text: t('common.draft'), value: 'draft' },
        { text: t('common.archived'), value: 'archived' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: t('course_manage.access'),
      dataIndex: "isLocked",
      key: "isLocked",
      width: 80,
      render: (value: boolean, record: any) => (
        <div>
          <Tag color={value ? "red" : "green"}>
            {value ? t('course_manage.locked') : t('course_manage.open')}
          </Tag>
          {record.unlockDate && (
            <div style={{ fontSize: '10px', color: '#666', marginTop: 2 }}>
              {t('course_manage.until')}: {new Date(record.unlockDate).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('course_manage.created'),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (value: string) => (
        <Text style={{ fontSize: '12px' }}>
          {value ? new Date(value).toLocaleDateString() : '-'}
        </Text>
      ),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: t('common.actions'),
      key: "actions",
      width: 280,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="middle" 
            onClick={() => handleViewModule(record)}
            title={t('course_manage.view_module')}
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Button 
            icon={<EditOutlined />} 
            size="middle" 
            onClick={() => handleEditModule(record)}
            title={t('course_manage.edit_module')}
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Button 
            type="primary"
            size="middle" 
            onClick={() => router.push(`/dashboard/modules/${record.id}`)}
            title={t('course_manage.manage_module')}
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              fontWeight: 500,
            }}
          >
            {t('creator.manage')}
          </Button>
          <Popconfirm
            title={t('course_manage.delete_module_title')}
            description={t('course_manage.delete_module_confirm')}
            onConfirm={() => handleDeleteModule(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
          <Button 
            icon={<DeleteOutlined />} 
            size="middle" 
            danger
              loading={deleteLoading}
              title={t('course_manage.delete_module')}
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

  if (courseLoading) {
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

  if (!course) {
    return (
      <div
        style={{
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
          height: "100vh",
        }}
      >
        <Text>Course not found</Text>
      </div>
    );
  }

  // Calculate course stats
  const totalModules = modules.length;
  const publishedModules = modules.filter((m) => m.status === 'published').length;
  const totalLessons = modules.reduce((sum, m) => sum + (m.totalLessons || 0), 0);
  const totalAssignments = modules.reduce((sum, m) => sum + (m.totalAssignments || 0), 0);
  const totalQuizzes = modules.reduce((sum, m) => sum + (m.totalQuizzes || 0), 0);
  const totalDuration = modules.reduce((sum, m) => sum + (m.estimatedDurationHours || 0), 0);

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      {/* Enhanced Breadcrumb */}
      <EnhancedBreadcrumb
        items={[
          { title: t('course_manage.course_management') },
          { title: course?.title || t('common.loading') }
        ]}
      />

      {/* Page Title */}
      <Title level={2} style={{ marginBottom: 24 }}>
        {t('course_manage.course_details')}
      </Title>

      {/* Course Header */}
      <CourseHeader course={course} />

      {/* Course Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={4}>{t('course_manage.course_statistics')}</Title>
        </Col>
        <Col sm={6} md={6} span={24}>
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
              title={t('course_manage.total_modules')}
              value={totalModules}
              prefix={
                <span style={{ color: "#1890ff" }}>
                  <BookOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
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
              title={t('course_manage.published_modules')}
              value={publishedModules}
              prefix={
                <span style={{ color: "#52c41a" }}>
                  <BookOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
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
              title={t('course_manage.total_lessons')}
              value={totalLessons}
              prefix={
                <span style={{ color: "#722ed1" }}>
                  <BookOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
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
              title={t('course_manage.total_duration')}
              value={totalDuration}
              suffix={t('course_manage.hours')}
              prefix={
                <span style={{ color: "#fa8c16" }}>
                  <ClockCircleOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
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
              title={t('course_manage.assignments')}
              value={totalAssignments}
              prefix={
                <span style={{ color: "#13c2c2" }}>
                  <TrophyOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
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
              title={t('course_manage.quizzes')}
              value={totalQuizzes}
              prefix={
                <span style={{ color: "#eb2f96" }}>
                  <TrophyOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
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
              title={t('course_manage.enrolled_students')}
              value={course.currentStudents || 0}
              prefix={
                <span style={{ color: "#52c41a" }}>
                  <UserOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
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
              title={t('course_manage.max_students')}
              value={course.maxStudents || t('creator.unlimited')}
              prefix={
                <span style={{ color: "#fa8c16" }}>
                  <UserOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Course Details */}
      <Card
        title={t('course_manage.course_information')}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
          marginBottom: 24,
        }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label={t('common.author')}>
            {course.authorName}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.price')}>
            {course.isFree ? (
              <Tag color="green">{t('common.free')}</Tag>
            ) : (
              `${course.price || 0} ${course.currency || "XAF"}`
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.language')}>
            {course.language}
          </Descriptions.Item>
          <Descriptions.Item label={t('course_manage.duration')}>
            {course.durationWeeks} {t('course_manage.weeks')}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.created_at')}>
            {new Date(course.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.updated_at')}>
            {new Date(course.updatedAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Modules Management */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{t('course_manage.course_modules')}</span>
            {modules.length > 0 && (
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
                {modules.length} {t('course_manage.module')}{modules.length !== 1 ? 's' : ''} • {' '}
                {modules.filter(m => m.status === 'published').length} {t('common.published').toLowerCase()} • {' '}
                {modules.reduce((sum, m) => sum + (m.totalLessons || 0), 0)} {t('course_manage.lessons_total')}
              </div>
            )}
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModuleModalVisible(true)}
            size="large"
            style={{
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              height: '42px',
              padding: '0 24px',
              fontWeight: 600,
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
            }}
          >
            {t('course_manage.add_module')}
          </Button>
        }
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
      >
        {modules.length === 0 && !modulesLoading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#666'
          }}>
            <BookOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }} />
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              {t('course_manage.no_modules_found')}
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              {t('course_manage.click_add_module')}
            </div>
          </div>
        ) : (
        <Table
          dataSource={modules}
          columns={moduleColumns}
          rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} modules`,
            }}
          size="small"
            loading={modulesLoading}
            scroll={{ x: 1200 }}
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
        />
        )}
      </Card>

      {/* Module Modal */}
      <Modal
        title={
          editingModule
            ? `${t('course_manage.edit_module')}: ${editingModule.title}`
            : t('course_manage.add_new_module')
        }
        open={moduleModalVisible}
        onCancel={() => {
          setModuleModalVisible(false);
          setEditingModule(null);
          moduleForm.resetFields();
        }}
        footer={null}
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
        <Card style={{ backgroundColor: "white" }}>
        <Form
          form={moduleForm}
          layout="vertical"
          onFinish={handleModuleSubmit}
          size="large"
        >
          <Form.Item
            name="title"
            label={t('course_manage.module_title')}
            rules={[{ required: true, message: t('forms.please_enter', { field: t('course_manage.module_title').toLowerCase() }) }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('common.description')}
              rules={[
                { required: true, message: t('forms.please_enter', { field: t('common.description').toLowerCase() }) },
              ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

            <Form.Item name="learningObjectives" label={t('course_manage.learning_objectives')}>
              <Input.TextArea
                rows={3}
                placeholder={t('course_manage.enter_learning_objectives')}
              />
            </Form.Item>

            <Form.Item name="prerequisites" label={t('course_manage.prerequisites')}>
              <Input.TextArea rows={3} placeholder={t('course_manage.enter_prerequisites')} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                  name="moduleOrder"
                  label={t('course_manage.module_order')}
                  rules={[
                    { required: true, message: t('forms.please_enter', { field: t('course_manage.module_order').toLowerCase() }) },
                  ]}
                  initialValue={1}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  name="estimatedDurationHours"
                  label={t('course_manage.duration_hours')}
              >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
          </Row>

            <Row gutter={16}>
              <Col span={12}>
          <Form.Item
                  name="status"
                  label={t('common.status')}
                  rules={[{ required: true, message: t('forms.please_select', { field: t('common.status').toLowerCase() }) }]}
                  initialValue="draft"
                >
                  <Select size="large">
                    <Select.Option value="draft">{t('common.draft')}</Select.Option>
                    <Select.Option value="published">{t('common.published')}</Select.Option>
                    <Select.Option value="archived">{t('common.archived')}</Select.Option>
                  </Select>
          </Form.Item>
              </Col>
              <Col span={12}>
          <Form.Item
                  name="isLocked"
                  label={t('course_manage.lock_module')}
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="unlockDate" label={t('course_manage.unlock_date')}>
              <DatePicker style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '12px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
                <Button 
                  onClick={() => {
                setModuleModalVisible(false);
                setEditingModule(null);
                moduleForm.resetFields();
                  }}
                  size="large"
                  style={{
                    borderRadius: "8px",
                    border: "2px solid #e5e7eb",
                    color: "#6b7280",
                    fontWeight: "500",
                    padding: "8px 24px",
                    height: "auto"
                  }}
                >
                {t('common.cancel')}
              </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  size="large"
                  loading={createLoading || updateLoading}
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    color: "white",
                    fontWeight: "500",
                    padding: "8px 24px",
                    height: "auto",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                  }}
                >
                {createLoading || updateLoading ? t('forms.saving') : (editingModule ? t('course_manage.update_module') : t('course_manage.create_module'))}
              </Button>
            </div>
          </Form.Item>
        </Form>
        </Card>
      </Modal>

      {/* View Module Modal */}
      <Modal
        title={`${t('course_manage.module_details')}: ${viewModalData?.title}`}
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
          </Button>
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
            <Descriptions.Item label={t('common.title')}>{viewModalData.title}</Descriptions.Item>
            <Descriptions.Item label={t('common.description')} span={2}>
              {viewModalData.description}
            </Descriptions.Item>
            <Descriptions.Item label={t('course_manage.learning_objectives')} span={2}>
              {viewModalData.learningObjectives || t('course_manage.not_specified')}
            </Descriptions.Item>
            <Descriptions.Item label={t('course_manage.prerequisites')} span={2}>
              {viewModalData.prerequisites || t('course_manage.none')}
            </Descriptions.Item>
            <Descriptions.Item label={t('course_manage.module_order')}>{viewModalData.moduleOrder}</Descriptions.Item>
            <Descriptions.Item label={t('course_manage.duration')}>
              {viewModalData.estimatedDurationHours ? `${viewModalData.estimatedDurationHours} ${t('course_manage.hours_full')}` : t('course_manage.not_specified')}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.status')}>
              <Tag color={
                viewModalData.status === 'published' ? 'green' :
                viewModalData.status === 'draft' ? 'orange' :
                viewModalData.status === 'archived' ? 'gray' : 'default'
              }>
                {t(`common.${viewModalData.status?.toLowerCase()}`)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('course_manage.locked_status')}>
              <Tag color={viewModalData.isLocked ? 'red' : 'green'}>
                {viewModalData.isLocked ? t('course_manage.locked') : t('course_manage.unlocked')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('course_manage.unlock_date')}>
              {viewModalData.unlockDate ? new Date(viewModalData.unlockDate).toLocaleDateString() : t('course_manage.na')}
            </Descriptions.Item>
            <Descriptions.Item label={t('course_manage.total_lessons')}>{viewModalData.totalLessons || 0}</Descriptions.Item>
            <Descriptions.Item label={t('course_manage.total_assignments')}>{viewModalData.totalAssignments || 0}</Descriptions.Item>
            <Descriptions.Item label={t('course_manage.total_quizzes')}>{viewModalData.totalQuizzes || 0}</Descriptions.Item>
            <Descriptions.Item label={t('common.created_at')}>
              {new Date(viewModalData.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.updated_at')}>
              {new Date(viewModalData.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
