"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Descriptions,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Table,
  Tooltip,
  Tabs,
  Select,
  Switch,
  InputNumber,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import {
  ClockCircleOutlined,
  BookOutlined,
  TrophyOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { useParams } from "next/navigation";
import { useTranslation } from "@contexts/translation.context";
import { useGetSingleLessonQuery } from "@store/api/lesson_api";
import {
  useGetAssignmentsByLessonQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} from "@store/api/assignment_api";
import {
  useGetQuizzesByLessonQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} from "@store/api/quiz_api";
import { useNotification } from "@refinedev/core";
import Link from "next/link";
import slugify from "slugify";

const { Text } = Typography;

const LessonDetailsPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const { t } = useTranslation();

  const { data: lesson, isLoading: lessonLoading } =
    useGetSingleLessonQuery(id);
  const { data: assignments = [], isLoading: assignLoading } =
    useGetAssignmentsByLessonQuery(id);
  const { data: quizzes = [], isLoading: quizLoading } =
    useGetQuizzesByLessonQuery(id);
  const [createAssignment, { isLoading: creatingAssignment }] =
    useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: updatingAssignment }] =
    useUpdateAssignmentMutation();
  const [deleteAssignment, { isLoading: deletingAssignment }] =
    useDeleteAssignmentMutation();
  const [createQuiz, { isLoading: creatingQuiz }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: updatingQuiz }] = useUpdateQuizMutation();
  const [deleteQuiz, { isLoading: deletingQuiz }] = useDeleteQuizMutation();
  const { open } = useNotification();

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [viewAssignment, setViewAssignment] = useState<any>(null);
  const [viewQuiz, setViewQuiz] = useState<any>(null);
  const [viewAssignmentModalOpen, setViewAssignmentModalOpen] = useState(false);
  const [viewQuizModalOpen, setViewQuizModalOpen] = useState(false);
  const [assignmentForm] = Form.useForm();
  const [quizForm] = Form.useForm();

  // Assignment handlers
  const handleViewAssignment = (assignment: any) => {
    setViewAssignment(assignment);
    setViewAssignmentModalOpen(true);
  };

  const handleEditAssignment = (assignment: any) => {
    setEditingAssignment(assignment);
    // Parse rubric if it's a JSON string
    const assignmentData = {
      ...assignment,
      rubricCriteria: assignment.rubric
        ? typeof assignment.rubric === "string"
          ? JSON.parse(assignment.rubric).criteria || []
          : assignment.rubric.criteria || []
        : [{ criterion: "", points: 10, description: "" }],
    };
    assignmentForm.setFieldsValue(assignmentData);
    setAssignmentModalOpen(true);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      await deleteAssignment(assignmentId).unwrap();
      open?.({
        type: "success",
        message: t('common.success'),
        description: t('lesson_manage.assignment_deleted_success'),
      });
    } catch (error: any) {
      open?.({
        type: "error",
        message: t('common.error'),
        description: t('lesson_manage.assignment_delete_failed', { message: error.message }),
      });
    }
  };

  // Quiz handlers
  const handleViewQuiz = (quiz: any) => {
    setViewQuiz(quiz);
    setViewQuizModalOpen(true);
  };

  const handleEditQuiz = (quiz: any) => {
    setEditingQuiz(quiz);
    // Parse answers if it's a JSON string
    const quizData = {
      ...quiz,
      answers:
        typeof quiz.answers === "string"
          ? JSON.parse(quiz.answers || "[]")
          : quiz.answers,
    };
    quizForm.setFieldsValue(quizData);
    setQuizModalOpen(true);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await deleteQuiz(quizId).unwrap();
      open?.({
        type: "success",
        message: t('common.success'),
        description: t('lesson_manage.quiz_deleted_success'),
      });
    } catch (error: any) {
      open?.({
        type: "error",
        message: t('common.error'),
        description: t('lesson_manage.quiz_delete_failed', { message: error.message }),
      });
    }
  };

  const loading = lessonLoading || assignLoading || quizLoading;

  return (
    <div>
      <EnhancedBreadcrumb
        items={[
          { title: t('lesson_manage.dashboard'), href: "/dashboard/creator" },
          { title: t('lesson_manage.lessons'), href: "/dashboard/modules" },
          { title: lesson?.title || t('lesson_manage.lesson') },
        ]}
        showBackButton
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title={t('module_manage.assignments')}
              value={assignments.length}
              prefix={<BookOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title={t('module_manage.quizzes')}
              value={quizzes.length}
              prefix={<TrophyOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title={t('lesson_manage.duration_min')}
              value={lesson?.durationMinutes ?? 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          marginTop: 16,
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
        loading={loading}
      >
        {lesson && (
          <Descriptions
            column={2}
            bordered
            size="small"
            title={t('lesson_manage.lesson_information')}
          >
            <Descriptions.Item label={t('common.title')}>{lesson.title}</Descriptions.Item>
            <Descriptions.Item label={t('common.status')}>
              <Tag
                color={
                  lesson.status === "published"
                    ? "green"
                    : lesson.status === "draft"
                    ? "orange"
                    : "gray"
                }
              >
                {t(`common.${lesson.status?.toLowerCase()}`)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.difficulty')}>
              {t(`module_manage.${lesson.difficulty}`)}
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.type')}>
              {t(`module_manage.${lesson.lessonType}`)}
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.order')}>
              {lesson.lessonOrder}
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.language')}>
              {lesson.language || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.created_at')}>
              {new Date(lesson.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.updated_at')}>
              {new Date(lesson.updatedAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.description')} span={2}>
              {lesson.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {/* Tabs with tables and per-tab controls */}
      <Card
        bordered={false}
        style={{
          marginTop: 16,
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
      >
        <Tabs
          defaultActiveKey="assignments"
          items={[
            {
              key: "assignments",
              label: `${t('module_manage.assignments')} (${assignments.length})`,
              children: (
                <>
                  <Row justify="end" style={{ marginBottom: 12 }}>
                    <Button
                      type="primary"
                      onClick={() => setAssignmentModalOpen(true)}
                      size="large"
                      style={{
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        fontWeight: 500,
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                      }}
                    >
                      {t('lesson_manage.new_assignment')}
                    </Button>
                  </Row>
                  <Table
                    size="small"
                    dataSource={assignments}
                    rowKey={(r: any) => r.id}
                    loading={assignLoading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }}
                    scroll={{ x: 1200 }}
                    columns={[
                      {
                        title: "#",
                        dataIndex: "assignmentOrder",
                        key: "assignmentOrder",
                        width: 60,
                        sorter: (a: any, b: any) =>
                          (a.assignmentOrder || 0) - (b.assignmentOrder || 0),
                        render: (value: number) => (
                          <Tag
                            color="blue"
                            style={{ fontWeight: "bold", fontSize: 12 }}
                          >
                            {value || 1}
                          </Tag>
                        ),
                      },
                      {
                        title: t('lesson_manage.assignment_title'),
                        dataIndex: "title",
                        key: "title",
                        render: (title: string, record: any) => (
                          <div>
                            <div
                              style={{ fontWeight: "bold", marginBottom: 2 }}
                            >
                              {title}
                            </div>
                            <div style={{ fontSize: 11, color: "#666" }}>
                              ID: {record.id?.substring(0, 8)}...
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: t('module_manage.type'),
                        dataIndex: "assignmentType",
                        key: "assignmentType",
                        width: 100,
                        render: (value: string) => (
                          <Tag color="purple">{value || "essay"}</Tag>
                        ),
                      },
                      {
                        title: t('lesson_manage.score'),
                        key: "score",
                        width: 120,
                        render: (_: any, record: any) => (
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 12, fontWeight: "bold" }}>
                              {record.maxScore || 100} {t('lesson_manage.pts')}
                            </div>
                            <div style={{ fontSize: 10, color: "#666" }}>
                              {t('lesson_manage.pass')}: {record.passingScore || 50}
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: t('common.status'),
                        dataIndex: "status",
                        key: "status",
                        width: 100,
                        filters: [
                          { text: t('common.published'), value: "published" },
                          { text: t('common.draft'), value: "draft" },
                          { text: t('common.archived'), value: "archived" },
                        ],
                        onFilter: (value: any, record: any) =>
                          record.status === value,
                        render: (value: string) => {
                          const statusLower = value?.toLowerCase();
                          const statusConfig = {
                            published: { color: "green" },
                            draft: { color: "orange" },
                            archived: { color: "gray" },
                          };
                          const config = statusConfig[
                            statusLower as keyof typeof statusConfig
                          ] || {
                            color: "default",
                          };
                          return <Tag color={config.color}>{t(`common.${statusLower}`)}</Tag>;
                        },
                      },
                      {
                        title: t('lesson_manage.due_date'),
                        dataIndex: "dueDate",
                        key: "dueDate",
                        width: 140,
                        sorter: (a: any, b: any) =>
                          new Date(a.dueDate || 0).getTime() -
                          new Date(b.dueDate || 0).getTime(),
                        render: (v: string) =>
                          v ? new Date(v).toLocaleDateString() : "-",
                      },
                      {
                        title: t('module_manage.created'),
                        dataIndex: "createdAt",
                        key: "createdAt",
                        width: 140,
                        sorter: (a: any, b: any) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime(),
                        render: (v: string) => new Date(v).toLocaleDateString(),
                      },
                      {
                        title: t('common.actions'),
                        key: "actions",
                        width: 280,
                        render: (_: any, record: any) => (
                          <Space size="small" wrap>
                            <Tooltip title={t('module_manage.view_details')}>
                              <Button
                                icon={<EyeOutlined />}
                                size="small"
                                ghost
                                style={{ borderRadius: 8 }}
                                onClick={() => handleViewAssignment(record)}
                              />
                            </Tooltip>
                            <Tooltip title={t('lesson_manage.edit_assignment')}>
                              <Button
                                type="primary"
                                icon={<EditOutlined />}
                                size="small"
                                ghost
                                style={{ borderRadius: 8 }}
                                onClick={() => handleEditAssignment(record)}
                              />
                            </Tooltip>
                            <Tooltip title={t('lesson_manage.manage_assignment')}>
                              <Link
                                href={`/dashboard/assignments/${record.id}`}
                              >
                                <Button
                                  size="small"
                                  style={{ 
                                    borderRadius: 8,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    border: "none",
                                    color: "white"
                                  }}
                                >
                                  {t('common.manage')}
                                </Button>
                              </Link>
                            </Tooltip>
                            <Popconfirm
                              title={t('lesson_manage.delete_assignment_title')}
                              description={t('lesson_manage.delete_assignment_confirm')}
                              onConfirm={() =>
                                handleDeleteAssignment(record.id)
                              }
                              okText={t('common.yes')}
                              cancelText={t('common.no')}
                            >
                              <Tooltip title={t('lesson_manage.delete_assignment')}>
                                <Button
                                  icon={<DeleteOutlined />}
                                  size="small"
                                  danger
                                  ghost
                                  style={{ borderRadius: 8 }}
                                  loading={deletingAssignment}
                                />
                              </Tooltip>
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </>
              ),
            },
            {
              key: "quizzes",
              label: `${t('module_manage.quizzes')} (${quizzes.length})`,
              children: (
                <>
                  <Row justify="end" style={{ marginBottom: 12 }}>
                    <Button 
                      type="primary"
                      onClick={() => setQuizModalOpen(true)}
                      size="large"
                      style={{
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        fontWeight: 500,
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                      }}
                    >
                      {t('lesson_manage.new_quiz')}
                    </Button>
                  </Row>
                  <Table
                    size="small"
                    dataSource={quizzes}
                    rowKey={(r: any) => r.id}
                    loading={quizLoading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }}
                    scroll={{ x: 1200 }}
                    columns={[
                      {
                        title: "#",
                        dataIndex: "quizOrder",
                        key: "quizOrder",
                        width: 60,
                        sorter: (a: any, b: any) =>
                          (a.quizOrder || 0) - (b.quizOrder || 0),
                        render: (value: number) => (
                          <Tag
                            color="blue"
                            style={{ fontWeight: "bold", fontSize: 12 }}
                          >
                            {value || 1}
                          </Tag>
                        ),
                      },
                      {
                        title: t('lesson_manage.quiz_title'),
                        dataIndex: "title",
                        key: "title",
                        render: (title: string, record: any) => (
                          <div>
                            <div
                              style={{ fontWeight: "bold", marginBottom: 2 }}
                            >
                              {title}
                            </div>
                            <div style={{ fontSize: 11, color: "#666" }}>
                              ID: {record.id?.substring(0, 8)}...
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: t('lesson_manage.question'),
                        dataIndex: "question",
                        key: "question",
                        ellipsis: { showTitle: false },
                        render: (text: string) => (
                          <Tooltip title={text}>
                            <div style={{ maxWidth: 200 }}>{text}</div>
                          </Tooltip>
                        ),
                      },
                      {
                        title: t('module_manage.type'),
                        dataIndex: "quizType",
                        key: "quizType",
                        width: 120,
                        render: (value: string) => (
                          <Tag color="cyan">{value || "multiple_choice"}</Tag>
                        ),
                      },
                      {
                        title: t('module_manage.difficulty'),
                        dataIndex: "difficulty",
                        key: "difficulty",
                        width: 100,
                        filters: [
                          { text: t('lesson_manage.easy'), value: "easy" },
                          { text: t('lesson_manage.medium'), value: "medium" },
                          { text: t('lesson_manage.hard'), value: "hard" },
                        ],
                        onFilter: (value: any, record: any) =>
                          record.difficulty === value,
                        render: (value: string) => {
                          const config = {
                            easy: { color: "green" },
                            medium: { color: "orange" },
                            hard: { color: "red" },
                          };
                          const difficultyConfig = config[
                            value as keyof typeof config
                          ] || {
                            color: "default",
                          };
                          return (
                            <Tag color={difficultyConfig.color}>
                              {t(`lesson_manage.${value}`)}
                            </Tag>
                          );
                        },
                      },
                      {
                        title: t('lesson_manage.points'),
                        dataIndex: "points",
                        key: "points",
                        width: 80,
                        align: "center" as const,
                        sorter: (a: any, b: any) =>
                          (a.points || 0) - (b.points || 0),
                        render: (value: number) => (
                          <Tag color="gold">{value || 1} {t('lesson_manage.pts')}</Tag>
                        ),
                      },
                      {
                        title: t('common.status'),
                        dataIndex: "status",
                        key: "status",
                        width: 100,
                        filters: [
                          { text: t('common.published'), value: "published" },
                          { text: t('common.draft'), value: "draft" },
                          { text: t('common.archived'), value: "archived" },
                        ],
                        onFilter: (value: any, record: any) =>
                          record.status === value,
                        render: (value: string) => {
                          const statusLower = value?.toLowerCase();
                          const statusConfig = {
                            published: { color: "green" },
                            draft: { color: "orange" },
                            archived: { color: "gray" },
                          };
                          const config = statusConfig[
                            statusLower as keyof typeof statusConfig
                          ] || {
                            color: "default",
                          };
                          return <Tag color={config.color}>{t(`common.${statusLower}`)}</Tag>;
                        },
                      },
                      {
                        title: t('module_manage.created'),
                        dataIndex: "createdAt",
                        key: "createdAt",
                        width: 140,
                        sorter: (a: any, b: any) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime(),
                        render: (v: string) => new Date(v).toLocaleDateString(),
                      },
                      {
                        title: t('common.actions'),
                        key: "actions",
                        width: 280,
                        render: (_: any, record: any) => (
                          <Space size="small" wrap>
                            <Tooltip title={t('module_manage.view_details')}>
                              <Button
                                icon={<EyeOutlined />}
                                size="small"
                                ghost
                                style={{ borderRadius: 8 }}
                                onClick={() => handleViewQuiz(record)}
                              />
                            </Tooltip>
                            <Tooltip title={t('lesson_manage.edit_quiz')}>
                              <Button
                                type="primary"
                                icon={<EditOutlined />}
                                size="small"
                                ghost
                                style={{ borderRadius: 8 }}
                                onClick={() => handleEditQuiz(record)}
                              />
                            </Tooltip>
                            <Tooltip title={t('lesson_manage.manage_quiz')}>
                              <Link href={`/dashboard/quizzes/${record.id}`}>
                                <Button
                                  size="small"
                                  style={{ 
                                    borderRadius: 8,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    border: "none",
                                    color: "white"
                                  }}
                                >
                                  {t('common.manage')}
                                </Button>
                              </Link>
                            </Tooltip>
                            <Popconfirm
                              title={t('lesson_manage.delete_quiz_title')}
                              description={t('lesson_manage.delete_quiz_confirm')}
                              onConfirm={() => handleDeleteQuiz(record.id)}
                              okText={t('common.yes')}
                              cancelText={t('common.no')}
                            >
                              <Tooltip title={t('lesson_manage.delete_quiz')}>
                                <Button
                                  icon={<DeleteOutlined />}
                                  size="small"
                                  danger
                                  ghost
                                  style={{ borderRadius: 8 }}
                                  loading={deletingQuiz}
                                />
                              </Tooltip>
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* Create/Edit Assignment Modal */}
      <Modal
        title={
          editingAssignment
            ? `${t('lesson_manage.edit_assignment')}: ${editingAssignment.title}`
            : t('lesson_manage.create_assignment')
        }
        open={assignmentModalOpen}
        onCancel={() => {
          setAssignmentModalOpen(false);
          setEditingAssignment(null);
          assignmentForm.resetFields();
        }}
        onOk={() => assignmentForm.submit()}
        okText={editingAssignment ? t('lesson_manage.update') : t('lesson_manage.create')}
        cancelText={t('common.cancel')}
        okButtonProps={{ 
          loading: creatingAssignment || updatingAssignment,
          style: {
            borderRadius: "8px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "8px"
          }
        }}
        destroyOnClose={true}
        maskClosable={true}
        keyboard={true}
        forceRender={false}
        width="95%"
        style={{ maxWidth: '1200px', top: 20 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            padding: '24px'
          }
        }}
      >
        <Card bordered={false} style={{ backgroundColor: "white" }}>
          {" "}
          <Form
            form={assignmentForm}
            layout="vertical"
            onFinish={async (values) => {
              try {
                if (editingAssignment) {
                  // Update assignment
                  await updateAssignment({
                    id: editingAssignment.id,
                    assignment: {
                      title: values.title,
                      slug: slugify(values.title, {
                        lower: true,
                        replacement: "-",
                      }),
                      description: values.description || "",
                      instructions: values.instructions || "",
                      lessonId: id,
                      courseId: lesson?.courseId,
                      moduleId: lesson?.moduleId,
                      userId: lesson?.userId || "",
                      assignmentType: values.assignmentType || "essay",
                      status: values.status || "draft",
                      assignmentOrder: values.assignmentOrder ?? 1,
                      maxScore: Number(values.maxScore ?? 100),
                      passingScore: Number(values.passingScore ?? 50),
                      maxAttempts: Number(values.maxAttempts ?? 3),
                      timeLimitMinutes: values.timeLimitMinutes
                        ? Number(values.timeLimitMinutes)
                        : undefined,
                      availableFrom: values.availableFrom
                        ? values.availableFrom instanceof Date
                          ? values.availableFrom.toISOString()
                          : values.availableFrom
                        : undefined,
                      dueDate: values.dueDate
                        ? values.dueDate instanceof Date
                          ? values.dueDate.toISOString()
                          : values.dueDate
                        : undefined,
                      lateSubmissionAllowed: !!values.lateSubmissionAllowed,
                      latePenaltyPercent:
                        values.latePenaltyPercent != null
                          ? Number(values.latePenaltyPercent)
                          : undefined,
                      submissionFormat: values.submissionFormat || "text",
                      allowedFileTypes: values.allowedFileTypes || undefined,
                      maxFileSizeMb:
                        values.maxFileSizeMb != null
                          ? Number(values.maxFileSizeMb)
                          : undefined,
                      minWordCount:
                        values.minWordCount != null
                          ? Number(values.minWordCount)
                          : undefined,
                      maxWordCount:
                        values.maxWordCount != null
                          ? Number(values.maxWordCount)
                          : undefined,
                      autoGrade: !!values.autoGrade,
                      rubric: values.rubricCriteria
                        ? JSON.stringify({ criteria: values.rubricCriteria })
                        : undefined,
                      peerReviewEnabled: !!values.peerReviewEnabled,
                      peerReviewsRequired:
                        values.peerReviewsRequired != null
                          ? Number(values.peerReviewsRequired)
                          : undefined,
                      referenceMaterials:
                        values.referenceMaterials || undefined,
                      sampleSubmissions: values.sampleSubmissions || undefined,
                    },
                  }).unwrap();
                  open?.({
                    type: "success",
                    message: t('common.success'),
                    description: t('lesson_manage.assignment_updated_success'),
                  });
                } else {
                  // Create assignment
                  await createAssignment({
                    title: values.title,
                    slug: slugify(values.title, {
                      lower: true,
                      replacement: "-",
                    }),
                    description: values.description || "",
                    instructions: values.instructions || "",
                    lessonId: id,
                    courseId: lesson?.courseId,
                    moduleId: lesson?.moduleId,
                    userId: lesson?.userId || "",
                    assignmentType: values.assignmentType || "essay",
                    status: values.status || "draft",
                    assignmentOrder: values.assignmentOrder ?? 1,
                    maxScore: Number(values.maxScore ?? 100),
                    passingScore: Number(values.passingScore ?? 50),
                    maxAttempts: Number(values.maxAttempts ?? 3),
                    timeLimitMinutes: values.timeLimitMinutes
                      ? Number(values.timeLimitMinutes)
                      : undefined,
                    availableFrom: values.availableFrom
                      ? values.availableFrom instanceof Date
                        ? values.availableFrom.toISOString()
                        : values.availableFrom
                      : undefined,
                    dueDate: values.dueDate
                      ? values.dueDate instanceof Date
                        ? values.dueDate.toISOString()
                        : values.dueDate
                      : undefined,
                    lateSubmissionAllowed: !!values.lateSubmissionAllowed,
                    latePenaltyPercent:
                      values.latePenaltyPercent != null
                        ? Number(values.latePenaltyPercent)
                        : undefined,
                    submissionFormat: values.submissionFormat || "text",
                    allowedFileTypes: values.allowedFileTypes || undefined,
                    maxFileSizeMb:
                      values.maxFileSizeMb != null
                        ? Number(values.maxFileSizeMb)
                        : undefined,
                    minWordCount:
                      values.minWordCount != null
                        ? Number(values.minWordCount)
                        : undefined,
                    maxWordCount:
                      values.maxWordCount != null
                        ? Number(values.maxWordCount)
                        : undefined,
                    autoGrade: !!values.autoGrade,
                    rubric: values.rubricCriteria
                      ? JSON.stringify({ criteria: values.rubricCriteria })
                      : undefined,
                    peerReviewEnabled: !!values.peerReviewEnabled,
                    peerReviewsRequired:
                      values.peerReviewsRequired != null
                        ? Number(values.peerReviewsRequired)
                        : undefined,
                    referenceMaterials: values.referenceMaterials || undefined,
                    sampleSubmissions: values.sampleSubmissions || undefined,
                  }).unwrap();
                  open?.({
                    type: "success",
                    message: t('common.success'),
                    description: t('lesson_manage.assignment_created_success'),
                  });
                }
                setAssignmentModalOpen(false);
                setEditingAssignment(null);
                assignmentForm.resetFields();
              } catch (e: any) {
                open?.({
                  type: "error",
                  message: t('common.error'),
                  description:
                    e?.data?.message ||
                    e?.message ||
                    t('lesson_manage.assignment_create_failed'),
                });
              }
            }}
          >
            <Form.Item
              name="title"
              label={t('common.title')}
              rules={[{ required: true, message: t('forms.please_enter', { field: t('common.title').toLowerCase() }) }]}
            >
              <Input placeholder={t('lesson_manage.assignment_title_placeholder')} size="large" />
            </Form.Item>
            <Form.Item name="description" label={t('common.description')}>
              <Input.TextArea rows={3} placeholder={t('lesson_manage.assignment_description_placeholder')} />
            </Form.Item>
            <Form.Item name="instructions" label={t('lesson_manage.instructions')}>
              <Input.TextArea rows={4} placeholder={t('lesson_manage.instructions_placeholder')} />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="assignmentType"
                  label={t('module_manage.type')}
                  initialValue="essay"
                  rules={[{ required: true }]}
                >
                  <Select
                    size="large"
                    options={
                      [
                        { value: "essay", label: t('lesson_manage.essay') },
                        { value: "project", label: t('lesson_manage.project') },
                        { value: "practical", label: t('lesson_manage.practical') },
                        { value: "presentation", label: t('lesson_manage.presentation') },
                        { value: "research", label: t('lesson_manage.research') },
                        { value: "coding", label: t('lesson_manage.coding') },
                        { value: "design", label: t('lesson_manage.design') },
                      ] as any
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label={t('common.status')}
                  initialValue="draft"
                  rules={[{ required: true }]}
                >
                  <Select
                    size="large"
                    options={
                      [
                        { value: "draft", label: t('common.draft') },
                        { value: "published", label: t('common.published') },
                        { value: "archived", label: t('common.archived') },
                      ] as any
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name="assignmentOrder"
                  label={t('module_manage.order')}
                  initialValue={1}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="maxScore" label={t('lesson_manage.max_score')} initialValue={100}>
                  <InputNumber step={0.01} min={0} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="passingScore"
                  label={t('lesson_manage.passing_score')}
                  initialValue={50}
                >
                  <InputNumber step={0.01} min={0} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name="maxAttempts"
                  label={t('lesson_manage.max_attempts')}
                  initialValue={3}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="timeLimitMinutes" label={t('lesson_manage.time_limit_min')}>
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="latePenaltyPercent" label={t('lesson_manage.late_penalty')}>
                  <InputNumber step={0.01} min={0} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="availableFrom" label={t('lesson_manage.available_from')}>
                  <DatePicker showTime style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dueDate" label={t('lesson_manage.due_date')}>
                  <DatePicker showTime style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="submissionFormat"
                  label={t('lesson_manage.submission_format')}
                  initialValue="text"
                >
                  <Select
                    size="large"
                    options={
                      [
                        { value: "text", label: t('lesson_manage.text') },
                        { value: "file_upload", label: t('lesson_manage.file_upload') },
                        { value: "url", label: t('lesson_manage.url') },
                        { value: "both_text_file", label: t('lesson_manage.text_file') },
                      ] as any
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="allowedFileTypes" label={t('lesson_manage.allowed_file_types')}>
                  <Input placeholder={t('lesson_manage.file_types_placeholder')} size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name="maxFileSizeMb"
                  label={t('lesson_manage.max_file_size')}
                  initialValue={10}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="minWordCount" label={t('lesson_manage.min_words')}>
                  <InputNumber min={0} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="maxWordCount" label={t('lesson_manage.max_words')}>
                  <InputNumber min={0} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name="autoGrade"
                  label={t('lesson_manage.auto_grade')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="lateSubmissionAllowed"
                  label={t('lesson_manage.late_submission')}
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="peerReviewEnabled"
                  label={t('lesson_manage.peer_review')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="peerReviewsRequired"
                  label={t('lesson_manage.peer_reviews_required')}
                >
                  <InputNumber min={0} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="sampleSubmissions"
                  label={t('lesson_manage.sample_submissions')}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Form.List
              name="rubricCriteria"
              initialValue={[{ criterion: "", points: 10, description: "" }]}
            >
              {(fields, { add, remove }) => (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <label style={{ fontWeight: 600 }}>{t('lesson_manage.grading_rubric')}</label>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      size="small"
                    >
                      {t('lesson_manage.add_criterion')}
                    </Button>
                  </div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{ marginBottom: 8, backgroundColor: "#fafafa" }}
                    >
                      <Row gutter={8}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "criterion"]}
                            label={t('lesson_manage.criterion')}
                            rules={[
                              {
                                required: true,
                                message: t('lesson_manage.enter_criterion'),
                              },
                            ]}
                          >
                            <Input placeholder={t('lesson_manage.criterion_placeholder')} />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "points"]}
                            label={t('lesson_manage.points')}
                            rules={[
                              { required: true, message: t('lesson_manage.enter_points') },
                            ]}
                          >
                            <InputNumber
                              min={1}
                              max={100}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            label={t('common.description')}
                          >
                            <Input placeholder={t('lesson_manage.criterion_description_placeholder')} />
                          </Form.Item>
                        </Col>
                        <Col
                          span={2}
                          style={{
                            display: "flex",
                            alignItems: "end",
                            paddingBottom: 24,
                          }}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            disabled={fields.length <= 1}
                            title={t('lesson_manage.remove_criterion')}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>
            <Form.Item name="referenceMaterials" label={t('lesson_manage.reference_materials')}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      {/* Create/Edit Quiz Modal */}
      <Modal
        title={editingQuiz ? `${t('lesson_manage.edit_quiz')}: ${editingQuiz.title}` : t('lesson_manage.create_quiz')}
        open={quizModalOpen}
        onCancel={() => {
          setQuizModalOpen(false);
          setEditingQuiz(null);
          quizForm.resetFields();
        }}
        onOk={() => quizForm.submit()}
        okText={editingQuiz ? t('lesson_manage.update') : t('lesson_manage.create')}
        cancelText={t('common.cancel')}
        okButtonProps={{ 
          loading: creatingQuiz || updatingQuiz,
          style: {
            borderRadius: "8px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "8px"
          }
        }}
        destroyOnClose={true}
        maskClosable={true}
        keyboard={true}
        forceRender={false}
        width="95%"
        style={{ maxWidth: '1100px', top: 20 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            padding: '24px'
          }
        }}
      >
        <Card bordered={false} style={{ backgroundColor: "white" }}>
          <Form
            form={quizForm}
            layout="vertical"
            onFinish={async (values) => {
              try {
                // Convert dynamic answers array to JSON string
                const answersArray = values.answers || [];

                if (editingQuiz) {
                  // Update quiz
                  await updateQuiz({
                    id: editingQuiz.id,
                    quiz: {
                      question: values.question,
                      answers: JSON.stringify(answersArray),
                      correctAnswerIndex: Number(
                        values.correctAnswerIndex ?? 0
                      ),
                      lessonId: id,
                      userId: lesson?.userId || "",
                      title: values.title,
                      instructions: values.instructions,
                      quizType: values.quizType || "multiple_choice",
                      points: Number(values.points ?? 1),
                      timeLimitMinutes: values.timeLimitMinutes
                        ? Number(values.timeLimitMinutes)
                        : undefined,
                      difficulty: values.difficulty || "easy",
                      explanation: values.explanation,
                      localExample: values.localExample,
                      passRequired: !!values.passRequired,
                      quizOrder: Number(values.quizOrder ?? 1),
                      status: values.status || "draft",
                      language: values.language || "both",
                    },
                  }).unwrap();
                  open?.({
                    type: "success",
                    message: t('common.success'),
                    description: t('lesson_manage.quiz_updated_success'),
                  });
                } else {
                  // Create quiz
                  await createQuiz({
                    question: values.question,
                    answers: JSON.stringify(answersArray),
                    correctAnswerIndex: Number(values.correctAnswerIndex ?? 0),
                    lessonId: id,
                    userId: lesson?.userId || "",
                    title: values.title,
                    instructions: values.instructions,
                    quizType: values.quizType || "multiple_choice",
                    points: Number(values.points ?? 1),
                    timeLimitMinutes: values.timeLimitMinutes
                      ? Number(values.timeLimitMinutes)
                      : undefined,
                    difficulty: values.difficulty || "easy",
                    explanation: values.explanation,
                    localExample: values.localExample,
                    passRequired: !!values.passRequired,
                    quizOrder: Number(values.quizOrder ?? 1),
                    status: values.status || "draft",
                    language: values.language || "both",
                  }).unwrap();
                  open?.({
                    type: "success",
                    message: t('common.success'),
                    description: t('lesson_manage.quiz_created_success'),
                  });
                }
                setQuizModalOpen(false);
                setEditingQuiz(null);
                quizForm.resetFields();
              } catch (e: any) {
                open?.({
                  type: "error",
                  message: t('common.error'),
                  description:
                    e?.data?.message || e?.message || t('lesson_manage.quiz_create_failed'),
                });
              }
            }}
          >
            <Form.Item
              name="title"
              label={t('lesson_manage.quiz_title')}
              rules={[{ required: true, message: t('forms.please_enter', { field: t('lesson_manage.quiz_title').toLowerCase() }) }]}
            >
              <Input placeholder={t('lesson_manage.quiz_title_placeholder')} size="large" />
            </Form.Item>
            <Form.Item
              name="question"
              label={t('lesson_manage.question')}
              rules={[{ required: true, message: t('forms.please_enter', { field: t('lesson_manage.question').toLowerCase() }) }]}
            >
              <Input.TextArea rows={2} placeholder={t('lesson_manage.question_placeholder')} />
            </Form.Item>

            <Form.List name="answers" initialValue={["Option A", "Option B"]}>
              {(fields, { add, remove }) => (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <label style={{ fontWeight: 600 }}>{t('lesson_manage.answer_options')}</label>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      size="small"
                    >
                      {t('lesson_manage.add_answer')}
                    </Button>
                  </div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={8} style={{ marginBottom: 8 }}>
                      <Col flex="auto">
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[
                            {
                              required: true,
                              message: t('lesson_manage.enter_answer_option'),
                            },
                          ]}
                        >
                          <Input placeholder={`${t('lesson_manage.answer_option')} ${name + 1}`} />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                          disabled={fields.length <= 2}
                          title={t('lesson_manage.remove_answer')}
                        />
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>

            <Form.Item
              name="correctAnswerIndex"
              label={t('lesson_manage.correct_answer_index')}
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: "100%" }} size="large" />
            </Form.Item>
            <Form.Item name="instructions" label={t('lesson_manage.instructions')}>
              <Input.TextArea rows={2} placeholder={t('lesson_manage.quiz_instructions_placeholder')} />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="quizType"
                  label={t('module_manage.type')}
                  initialValue="multiple_choice"
                  rules={[{ required: true }]}
                >
                  <Select
                    size="large"
                    options={[
                      { value: "multiple_choice", label: t('lesson_manage.multiple_choice') },
                      { value: "true_false", label: t('lesson_manage.true_false') },
                      { value: "fill_blank", label: t('lesson_manage.fill_blank') },
                      { value: "short_answer", label: t('lesson_manage.short_answer') },
                      { value: "essay", label: t('lesson_manage.essay') },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="difficulty"
                  label={t('module_manage.difficulty')}
                  initialValue="easy"
                  rules={[{ required: true }]}
                >
                  <Select
                    size="large"
                    options={[
                      { value: "easy", label: t('lesson_manage.easy') },
                      { value: "medium", label: t('lesson_manage.medium') },
                      { value: "hard", label: t('lesson_manage.hard') },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="points" label={t('lesson_manage.points')} initialValue={1}>
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="quizOrder" label={t('module_manage.order')} initialValue={1}>
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="timeLimitMinutes" label={t('lesson_manage.time_limit_min')}>
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="language"
                  label={t('lesson_manage.language')}
                  initialValue="both"
                  rules={[{ required: true }]}
                >
                  <Select
                    size="large"
                    options={[
                      { value: "english", label: t('forms.english') },
                      { value: "french", label: t('forms.french') },
                      { value: "both", label: t('forms.both') },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label={t('common.status')}
                  initialValue="draft"
                  rules={[{ required: true }]}
                >
                  <Select
                    size="large"
                    options={[
                      { value: "draft", label: t('common.draft') },
                      { value: "published", label: t('common.published') },
                      { value: "archived", label: t('common.archived') },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="passRequired"
              label={t('lesson_manage.pass_required')}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="explanation"
              label={t('lesson_manage.explanation_correct')}
            >
              <Input.TextArea
                rows={2}
                placeholder={t('lesson_manage.explanation_placeholder')}
              />
            </Form.Item>
            <Form.Item name="localExample" label={t('lesson_manage.local_example')}>
              <Input.TextArea rows={2} placeholder={t('lesson_manage.local_example_placeholder')} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      {/* View Assignment Modal */}
      <Modal
        title={
          viewAssignment
            ? `${t('lesson_manage.assignment')}: ${viewAssignment.title}`
            : t('lesson_manage.assignment_details')
        }
        open={viewAssignmentModalOpen}
        onCancel={() => setViewAssignmentModalOpen(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setViewAssignmentModalOpen(false)}
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
        {viewAssignment && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label={t('common.title')}>
              {viewAssignment.title}
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.type')}>
              <Tag color="purple">{viewAssignment.assignmentType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('common.status')}>
              <Tag
                color={
                  viewAssignment.status === "published"
                    ? "green"
                    : viewAssignment.status === "draft"
                    ? "orange"
                    : "gray"
                }
              >
                {t(`common.${viewAssignment.status?.toLowerCase()}`)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.max_score')}>
              {viewAssignment.maxScore || 100} {t('lesson_manage.pts')}
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.passing_score')}>
              {viewAssignment.passingScore || 50} {t('lesson_manage.pts')}
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.max_attempts')}>
              {viewAssignment.maxAttempts || 3}
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.due_date')}>
              {viewAssignment.dueDate
                ? new Date(viewAssignment.dueDate).toLocaleString()
                : t('lesson_manage.no_due_date')}
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.time_limit')}>
              {viewAssignment.timeLimitMinutes
                ? `${viewAssignment.timeLimitMinutes} min`
                : t('lesson_manage.no_limit')}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.description')} span={2}>
              {viewAssignment.description}
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.instructions')} span={2}>
              {viewAssignment.instructions}
            </Descriptions.Item>
            {viewAssignment.rubric && (
              <Descriptions.Item label={t('lesson_manage.grading_rubric')} span={2}>
                {(() => {
                  try {
                    const rubric =
                      typeof viewAssignment.rubric === "string"
                        ? JSON.parse(viewAssignment.rubric)
                        : viewAssignment.rubric;
                    const criteria = rubric?.criteria || [];
                    return (
                      <div>
                        {criteria.map((criterion: any, index: number) => (
                          <div
                            key={index}
                            style={{
                              marginBottom: 8,
                              padding: 8,
                              backgroundColor: "#f5f5f5",
                              borderRadius: 4,
                            }}
                          >
                            <div style={{ fontWeight: "bold" }}>
                              {criterion.criterion} ({criterion.points} {t('lesson_manage.pts')})
                            </div>
                            {criterion.description && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#666",
                                  marginTop: 4,
                                }}
                              >
                                {criterion.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  } catch (e) {
                    return <Text type="secondary">{t('lesson_manage.invalid_rubric')}</Text>;
                  }
                })()}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* View Quiz Modal */}
      <Modal
        title={viewQuiz ? `${t('lesson_manage.quiz')}: ${viewQuiz.title}` : t('lesson_manage.quiz_details')}
        open={viewQuizModalOpen}
        onCancel={() => setViewQuizModalOpen(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setViewQuizModalOpen(false)}
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
        {viewQuiz && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label={t('common.title')}>
              {viewQuiz.title}
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.type')}>
              <Tag color="cyan">{viewQuiz.quizType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.difficulty')}>
              <Tag
                color={
                  viewQuiz.difficulty === "easy"
                    ? "green"
                    : viewQuiz.difficulty === "medium"
                    ? "orange"
                    : "red"
                }
              >
                {t(`lesson_manage.${viewQuiz.difficulty}`)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.points')}>
              {viewQuiz.points || 1} {t('lesson_manage.pts')}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.status')}>
              <Tag
                color={
                  viewQuiz.status === "published"
                    ? "green"
                    : viewQuiz.status === "draft"
                    ? "orange"
                    : "gray"
                }
              >
                {t(`common.${viewQuiz.status?.toLowerCase()}`)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.language')}>
              <Tag>{viewQuiz.language}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.time_limit')}>
              {viewQuiz.timeLimitMinutes
                ? `${viewQuiz.timeLimitMinutes} min`
                : t('lesson_manage.no_limit')}
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.pass_required')}>
              <Tag color={viewQuiz.passRequired ? "red" : "green"}>
                {viewQuiz.passRequired ? t('lesson_manage.required') : t('lesson_manage.optional')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.question')} span={2}>
              {viewQuiz.question}
            </Descriptions.Item>
            <Descriptions.Item label={t('lesson_manage.answer_options')} span={2}>
              {Array.isArray(viewQuiz.answers) ? (
                <div>
                  {viewQuiz.answers.map((answer: string, index: number) => (
                    <Tag
                      key={index}
                      color={
                        index === viewQuiz.correctAnswerIndex
                          ? "green"
                          : "default"
                      }
                      style={{ margin: "2px 4px 2px 0" }}
                    >
                      {index === viewQuiz.correctAnswerIndex ? "(Correct) " : ""}
                      {answer}
                    </Tag>
                  ))}
                </div>
              ) : (
                <div>{viewQuiz.answers}</div>
              )}
            </Descriptions.Item>
            {viewQuiz.explanation && (
              <Descriptions.Item label={t('lesson_manage.explanation')} span={2}>
                {viewQuiz.explanation}
              </Descriptions.Item>
            )}
            {viewQuiz.localExample && (
              <Descriptions.Item label={t('lesson_manage.local_example')} span={2}>
                {viewQuiz.localExample}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default LessonDetailsPage;
