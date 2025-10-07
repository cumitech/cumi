"use client";

import React, { useState } from "react";
import Image from "next/image";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { useShow } from "@refinedev/core";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Table,
  Avatar,
  Progress,
  Divider,
  Statistic,
  Badge,
  Tooltip,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Input,
  InputNumber,
  Switch,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useList, useCreate, useUpdate, useDelete, useNotification } from "@refinedev/core";
import { ICourse } from "@domain/models/course";
// import { IEnrollment } from "@domain/models/enrollment";
import { ILesson } from "@domain/models/lesson";
import { IQuiz } from "@domain/models/quiz";
import { IUser } from "@domain/models/user";
import dayjs from "dayjs";

const { Title, Text } = Typography;

// CourseDescription Component
const CourseDescription = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const wordLimit = 400;
  
  const words = description.split(' ');
  const shouldTruncate = words.length > wordLimit;
  const displayText = isExpanded || !shouldTruncate 
    ? description 
    : words.slice(0, wordLimit).join(' ') + '...';

  return (
    <div>
      <Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
        {displayText}
      </Text>
      {shouldTruncate && (
        <Button 
          type="link" 
          size="small" 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ padding: 0, marginLeft: 8 }}
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </Button>
      )}
    </div>
  );
};

export default function CourseShow() {
  const router = useRouter();
  const { open } = useNotification();
  const [isEnrollmentModalVisible, setIsEnrollmentModalVisible] =
    useState(false);
  const [editingEnrollment, setEditingEnrollment] =
    useState<any | null>(null);
  const [form] = Form.useForm();
  
  // Module modal states
  const [moduleModalVisible, setModuleModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [moduleForm] = Form.useForm();

  const { queryResult } = useShow<ICourse>({});
  const { data, isLoading } = queryResult;
  const course = data?.data;

  // Fetch related data
  const { data: enrollmentsData, refetch: refetchEnrollments } =
    useList<any>({
      resource: "enrollments",
      filters: course
        ? [
            {
              field: "courseId",
              operator: "eq",
              value: course.id,
            },
          ]
        : [],
    });

  const { data: lessonsData } = useList<ILesson>({
    resource: "lessons",
    filters: course
      ? [
          {
            field: "courseId",
            operator: "eq",
            value: course.id,
          },
        ]
      : [],
  });

  const { data: quizesData } = useList<IQuiz>({
    resource: "quizes",
    filters: lessonsData?.data
      ? [
          {
            field: "lessonId",
            operator: "in",
            value: lessonsData.data.map((lesson) => lesson.id),
          },
        ]
      : [],
  });

  const { data: usersData } = useList<IUser>({
    resource: "users",
  });

  // Fetch modules for this course
  const { data: modulesData } = useList({
    resource: "modules",
    filters: course
      ? [
          {
            field: "courseId",
            operator: "eq",
            value: course.id,
          },
        ]
      : [],
  });

  const enrollments = enrollmentsData?.data || [];
  const lessons = lessonsData?.data || [];
  const quizes = quizesData?.data || [];
  const users = usersData?.data || [];
  const modules = modulesData?.data || [];

  // Create enrollment mutation
  const { mutate: createEnrollment } = useCreate();

  // Update enrollment mutation
  const { mutate: updateEnrollment } = useUpdate();

  // Delete enrollment mutation
  const { mutate: deleteEnrollment } = useDelete();

  // Module mutations
  const { mutate: createModule } = useCreate();
  const { mutate: updateModule } = useUpdate();
  const { mutate: deleteModule } = useDelete();

  const handleCreateEnrollment = () => {
    setEditingEnrollment(null);
    form.resetFields();
    setIsEnrollmentModalVisible(true);
  };

  const handleEditEnrollment = (enrollment: any) => {
    setEditingEnrollment(enrollment);
    form.setFieldsValue({
      userId: enrollment.userId,
      enrollmentDate: dayjs(enrollment.enrollmentDate),
      completionDate: dayjs(enrollment.completionDate),
    });
    setIsEnrollmentModalVisible(true);
  };

  const handleDeleteEnrollment = (enrollmentId: string) => {
    deleteEnrollment(
      {
        resource: "enrollments",
        id: enrollmentId,
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Success",
            description: "Enrollment deleted successfully",
          });
          refetchEnrollments();
        },
        onError: () => {
          open?.({
            type: "error",
            message: "Error",
            description: "Failed to delete enrollment",
          });
        },
      }
    );
  };

  const handleEnrollmentSubmit = async () => {
    try {
      const values = await form.validateFields();

      const enrollmentData = {
        ...values,
        courseId: course?.id,
        enrollmentDate: values.enrollmentDate.format("YYYY-MM-DD"),
        completionDate: values.completionDate.format("YYYY-MM-DD"),
      };

      if (editingEnrollment) {
        updateEnrollment(
          {
            resource: "enrollments",
            id: editingEnrollment.id,
            values: enrollmentData,
          },
          {
            onSuccess: () => {
              open?.({
                type: "success",
                message: "Success",
                description: "Enrollment updated successfully",
              });
              setIsEnrollmentModalVisible(false);
              refetchEnrollments();
            },
            onError: () => {
              open?.({
                type: "error",
                message: "Error",
                description: "Failed to update enrollment",
              });
            },
          }
        );
      } else {
        createEnrollment(
          {
            resource: "enrollments",
            values: enrollmentData,
          },
          {
            onSuccess: () => {
              open?.({
                type: "success",
                message: "Success",
                description: "Enrollment created successfully",
              });
              setIsEnrollmentModalVisible(false);
              refetchEnrollments();
            },
            onError: () => {
              open?.({
                type: "error",
                message: "Error",
                description: "Failed to create enrollment",
              });
            },
          }
        );
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // Calculate statistics
  const activeEnrollments = enrollments.filter((e) => {
    const enrollmentDate = new Date(e.enrollmentDate);
    const completionDate = new Date(e.completionDate);
    const now = new Date();
    return now >= enrollmentDate && now < completionDate;
  }).length;

  const completedEnrollments = enrollments.filter((e) => {
    const completionDate = new Date(e.completionDate);
    const now = new Date();
    return now >= completionDate;
  }).length;

  const completionRate =
    enrollments.length > 0
      ? (completedEnrollments / enrollments.length) * 100
      : 0;

  // Module handling functions
  const handleModuleSubmit = async () => {
    try {
      const values = await moduleForm.validateFields();
      
      // Generate slug from title
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      const moduleData = {
        ...values,
        courseId: course?.id,
        userId: course?.userId, // Use course owner as module creator
        slug: slug,
      };

      if (editingModule) {
        updateModule(
          {
            resource: "modules",
            id: editingModule.id,
            values: moduleData,
          },
          {
            onSuccess: () => {
              open?.({
                type: "success",
                message: "Success",
                description: "Module updated successfully",
              });
              setModuleModalVisible(false);
              setEditingModule(null);
              moduleForm.resetFields();
              // Refetch modules
              window.location.reload();
            },
            onError: () => {
              open?.({
                type: "error",
                message: "Error",
                description: "Failed to update module",
              });
            },
          }
        );
      } else {
        createModule(
          {
            resource: "modules",
            values: moduleData,
          },
          {
            onSuccess: () => {
              open?.({
                type: "success",
                message: "Success",
                description: "Module created successfully",
              });
              setModuleModalVisible(false);
              moduleForm.resetFields();
              // Refetch modules
              window.location.reload();
            },
            onError: () => {
              open?.({
                type: "error",
                message: "Error",
                description: "Failed to create module",
              });
            },
          }
        );
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    moduleForm.setFieldsValue(module);
    setModuleModalVisible(true);
  };

  const handleDeleteModule = (moduleId: string) => {
    deleteModule(
      {
        resource: "modules",
        id: moduleId,
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Success",
            description: "Module deleted successfully",
          });
          // Refetch modules
          window.location.reload();
        },
        onError: () => {
          open?.({
            type: "error",
            message: "Error",
            description: "Failed to delete module",
          });
        },
      }
    );
  };

  // Module columns
  const moduleColumns = [
    {
      title: "Order",
      dataIndex: "moduleOrder",
      key: "moduleOrder",
      width: 80,
      render: (value: number) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Duration (hrs)",
      dataIndex: "estimatedDurationHours",
      key: "estimatedDurationHours",
      width: 120,
      render: (value: number) => value ? `${value}h` : '-',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value: string) => (
        <Tag color={
          value === 'published' ? 'green' : 
          value === 'draft' ? 'orange' : 
          value === 'archived' ? 'gray' : 'default'
        }>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Locked",
      dataIndex: "isLocked",
      key: "isLocked",
      width: 80,
      render: (value: boolean) => (
        <Tag color={value ? 'red' : 'green'}>
          {value ? 'Locked' : 'Unlocked'}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary"
            size="small" 
            onClick={() => router.push(`/dashboard/modules/${record.id}`)}
          >
            Manage
          </Button>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditModule(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDeleteModule(record.id)}
          />
        </Space>
      ),
    },
  ];

  const enrollmentColumns = [
    {
      title: "Student",
      dataIndex: "userId",
      key: "userId",
      render: (userId: string) => {
        const user = users.find((u) => u.id === userId);
        return (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text strong>{user?.fullName || "Unknown User"}</Text>
          </Space>
        );
      },
    },
    {
      title: "Enrollment Date",
      dataIndex: "enrollmentDate",
      key: "enrollmentDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Completion Date",
      dataIndex: "completionDate",
      key: "completionDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      key: "status",
      render: (record: any) => {
        const enrollmentDate = new Date(record.enrollmentDate);
        const completionDate = new Date(record.completionDate);
        const now = new Date();

        let status = "Pending";
        let color = "orange";

        if (now >= completionDate) {
          status = "Completed";
          color = "green";
        } else if (now >= enrollmentDate) {
          status = "In Progress";
          color = "blue";
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditEnrollment(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEnrollment(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <EnhancedBreadcrumb
        items={[
          { title: "LMS" },
          { title: "Course Details" }
        ]}
        backButtonText="Back to Dashboard"
      />

      <div
        style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}
      >
        {/* Header Section */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push("/dashboard/lms")}
                >
                  Back to LMS
                </Button>
                <Divider type="vertical" />
                <Title level={2} style={{ margin: 0 }}>
                  <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  {course?.title || "Course Details"}
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    router.push(`/dashboard/courses/edit/${course?.id}`)
                  }
                >
                  Edit Course
                </Button>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() =>
                    router.push(`/dashboard/courses/${course?.id}/lessons`)
                  }
                >
                  Manage Lessons
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Course Information */}
          <Col xs={24} lg={16}>
            <Card
              title="Course Information"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Row gutter={[16, 16]} align="top">
                {/* Course Image - First */}
                <Col xs={24} md={8}>
                  {course?.imageUrl && (
                    <div style={{ position: 'relative', width: "100%", height: 200 }}>
                      <Image
                        src={course.imageUrl}
                        alt={`${course.title} - Course image`}
                        fill
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </div>
                  )}
                </Col>
                {/* Course Details */}
                <Col xs={24} md={16}>
                  <Title level={4}>{course?.title}</Title>
                  <CourseDescription description={course?.description || ""} />
                </Col>
              </Row>
            </Card>

            {/* Course Statistics */}
            <Card title="Course Statistics" style={{ borderRadius: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Enrollments"
                    value={enrollments.length}
                    prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Active Students"
                    value={activeEnrollments}
                    prefix={<UserOutlined style={{ color: "#52c41a" }} />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Completed"
                    value={completedEnrollments}
                    prefix={<TrophyOutlined style={{ color: "#faad14" }} />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Completion Rate"
                    value={Math.round(completionRate)}
                    suffix="%"
                    prefix={
                      <ClockCircleOutlined style={{ color: "#722ed1" }} />
                    }
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Col>
              </Row>
              <Progress
                percent={Math.round(completionRate)}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>

          {/* Course Content Overview */}
          <Col xs={24} lg={8}>
            <Card
              title="Course Content"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <Card
                  hoverable
                  onClick={() => {/* Navigate to modules */}
                  }
                  style={{ borderRadius: 8, border: "2px solid #52c41a20" }}
                >
                  <Row align="middle" gutter={12}>
                    <Col>
                      <BookOutlined
                        style={{ fontSize: 24, color: "#52c41a" }}
                      />
                    </Col>
                    <Col flex={1}>
                      <Text strong style={{ color: "#52c41a" }}>
                        Modules
                      </Text>
                      <br />
                      <Text type="secondary">
                        {modules.length} modules available
                      </Text>
                    </Col>
                    <Col>
                      <Badge
                        count={modules.length}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    </Col>
                  </Row>
                </Card>

                <Card
                  hoverable
                  onClick={() =>
                    router.push(`/dashboard/courses/${course?.id}/lessons`)
                  }
                  style={{ borderRadius: 8, border: "2px solid #1890ff20" }}
                >
                  <Row align="middle" gutter={12}>
                    <Col>
                      <PlayCircleOutlined
                        style={{ fontSize: 24, color: "#1890ff" }}
                      />
                    </Col>
                    <Col flex={1}>
                      <Text strong style={{ color: "#1890ff" }}>
                        Lessons
                      </Text>
                      <br />
                      <Text type="secondary">
                        {lessons.length} lessons available
                      </Text>
                    </Col>
                    <Col>
                      <Badge
                        count={lessons.length}
                        style={{ backgroundColor: "#1890ff" }}
                      />
                    </Col>
                  </Row>
                </Card>

                <Card
                  hoverable
                  onClick={() => router.push(`/dashboard/quizes`)}
                  style={{ borderRadius: 8, border: "2px solid #722ed120" }}
                >
                  <Row align="middle" gutter={12}>
                    <Col>
                      <QuestionCircleOutlined
                        style={{ fontSize: 24, color: "#722ed1" }}
                      />
                    </Col>
                    <Col flex={1}>
                      <Text strong style={{ color: "#722ed1" }}>
                        Quizzes
                      </Text>
                      <br />
                      <Text type="secondary">
                        {quizes.length} quizzes available
                      </Text>
                    </Col>
                    <Col>
                      <Badge
                        count={quizes.length}
                        style={{ backgroundColor: "#722ed1" }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Space>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" style={{ borderRadius: 12 }}>
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  onClick={handleCreateEnrollment}
                  block
                >
                  Enroll Student
                </Button>
                <Button
                  icon={<PlayCircleOutlined />}
                  onClick={() =>
                    router.push(`/dashboard/courses/${course?.id}/lessons`)
                  }
                  block
                >
                  Manage Lessons
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Modules Management */}
        <Card
          title={
            <span>
              <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              Course Modules ({modules.length})
            </span>
          }
          style={{ marginTop: 16, borderRadius: 12 }}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModuleModalVisible(true)}
            >
              Add Module
            </Button>
          }
        >
          <Table
            columns={moduleColumns}
            dataSource={modules}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>

        {/* Enrollments Management */}
        <Card
          title={
            <span>
              <TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              Student Enrollments ({enrollments.length})
            </span>
          }
          style={{ marginTop: 16, borderRadius: 12 }}
          extra={
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={handleCreateEnrollment}
            >
              Enroll Student
            </Button>
          }
        >
          <Table
            columns={enrollmentColumns}
            dataSource={enrollments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>

        {/* Enrollment Modal */}
        <Modal
          title={editingEnrollment ? "Edit Enrollment" : "Enroll Student"}
          open={isEnrollmentModalVisible}
          onOk={handleEnrollmentSubmit}
          onCancel={() => setIsEnrollmentModalVisible(false)}
          width={500}
        >
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item
              name="userId"
              label="Student"
              rules={[{ required: true, message: "Please select a student" }]}
            >
              <Select
                placeholder="Select a student"
                showSearch
                options={users.map((user) => ({
                  label: user.fullName,
                  value: user.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="enrollmentDate"
              label="Enrollment Date"
              rules={[
                { required: true, message: "Please select enrollment date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="completionDate"
              label="Expected Completion Date"
              rules={[
                { required: true, message: "Please select completion date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Module Modal */}
        <Modal
          title={editingModule ? `Edit Module: ${editingModule.title}` : "Add New Module"}
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
          <Form
            form={moduleForm}
            layout="vertical"
            onFinish={handleModuleSubmit}
          >
            <Form.Item
              name="title"
              label="Module Title"
              rules={[{ required: true, message: "Please enter module title" }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter module description" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="learningObjectives"
              label="Learning Objectives"
            >
              <Input.TextArea rows={3} placeholder="Enter learning objectives..." />
            </Form.Item>

            <Form.Item
              name="prerequisites"
              label="Prerequisites"
            >
              <Input.TextArea rows={3} placeholder="Enter prerequisites..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="moduleOrder"
                  label="Module Order"
                  rules={[{ required: true, message: "Please enter module order" }]}
                  initialValue={1}
                >
                  <InputNumber min={1} style={{ width: '100%' }} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="estimatedDurationHours"
                  label="Duration (hours)"
                >
                  <InputNumber min={1} style={{ width: '100%' }} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: "Please select status" }]}
                  initialValue="draft"
                >
                  <Select size="large">
                    <Select.Option value="draft">Draft</Select.Option>
                    <Select.Option value="published">Published</Select.Option>
                    <Select.Option value="archived">Archived</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="isLocked"
                  label="Lock Module"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="unlockDate"
              label="Unlock Date (if locked)"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit"
                >
                  {editingModule ? "Update Module" : "Create Module"}
                </Button>
                <Button onClick={() => {
                  setModuleModalVisible(false);
                  setEditingModule(null);
                  moduleForm.resetFields();
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
