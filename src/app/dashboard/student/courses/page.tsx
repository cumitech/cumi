"use client";

import React from "react";
import Image from "next/image";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Avatar, 
  Badge,
  Tooltip,
  Empty,
  Input,
  Select,
  Divider
} from "antd";
import { 
  BookOutlined, 
  UserOutlined, 
  PlayCircleOutlined, 
  ClockCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useList } from "@refinedev/core";
import { ICourse } from "@domain/models/course";
import { ICourseEnrollment as IEnrollment } from "@domain/models/course-enrollment.model";
import { ILesson } from "@domain/models/lesson";

const { Title, Text } = Typography;
const { Search } = Input;

export default function StudentCourseBrowser() {
  const router = useRouter();

  // Fetch all available courses
  const { data: coursesData } = useList<ICourse>({
    resource: "courses",
  });

  // Fetch student's enrollments
  const { data: enrollmentsData } = useList<IEnrollment>({
    resource: "enrollments",
    filters: [
      {
        field: "userId",
        operator: "eq",
        value: "current", // This would need to be replaced with actual current user ID
      },
    ],
  });

  // Fetch lessons for all courses
  const { data: lessonsData } = useList<ILesson>({
    resource: "lessons",
  });

  const courses = coursesData?.data || [];
  const enrollments = enrollmentsData?.data || [];
  const lessons = lessonsData?.data || [];

  // Get enrolled course IDs
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  // Filter courses
  const availableCourses = courses.filter(course => !enrolledCourseIds.includes(course.id));
  const enrolledCourses = courses.filter(course => enrolledCourseIds.includes(course.id));

  const handleEnrollCourse = (courseId: string) => {
    // This would trigger enrollment creation
    router.push(`/dashboard/student/courses/${courseId}/enroll`);
  };

  const CourseCard = ({ course, isEnrolled }: { course: ICourse; isEnrolled: boolean }) => {
    const courseLessons = lessons.filter(lesson => lesson.courseId === course.id);
    const totalDuration = courseLessons.reduce((acc, lesson) => acc + (lesson.durationMinutes || 0), 0);

    return (
      <Card
        hoverable
        style={{ borderRadius: 12, height: "100%" }}
        cover={
          course.imageUrl ? (
            <div style={{ position: 'relative', height: 200, width: '100%' }}>
              <Image
                alt={`${course.title} - Course image`}
                src={course.imageUrl}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
            <div style={{ height: 200, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOutlined style={{ fontSize: 48, color: "#ccc" }} />
            </div>
          )
        }
        actions={[
          <Tooltip key="view" title="View Course Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => router.push(`/courses/${course.slug}`)}
            />
          </Tooltip>,
          isEnrolled ? (
            <Tooltip key="continue" title="Continue Learning">
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />}
                onClick={() => router.push(`/dashboard/student/courses/${course.id}/learn`)}
              >
                Continue
              </Button>
            </Tooltip>
          ) : (
            <Tooltip key="enroll" title="Enroll in Course">
              <Button 
                type="primary" 
                icon={<UserOutlined />}
                onClick={() => handleEnrollCourse(course.id)}
              >
                Enroll
              </Button>
            </Tooltip>
          )
        ]}
      >
        <Card.Meta
          avatar={<Avatar icon={<BookOutlined />} />}
          title={
            <Space>
              <Text strong>{course.title}</Text>
              {isEnrolled && <Tag color="green">Enrolled</Tag>}
            </Space>
          }
          description={
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Text type="secondary" ellipsis>
                {course.description}
              </Text>
              <Space wrap>
                <Tag color="blue">
                  <ClockCircleOutlined /> {totalDuration} min
                </Tag>
                <Tag color="green">
                  <PlayCircleOutlined /> {courseLessons.length} lessons
                </Tag>
              </Space>
            </Space>
          }
        />
      </Card>
    );
  };

  return (
    <>
      <PageBreadCrumbs items={["Dashboard", "Student", "Browse Courses"]} />
      
      <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header Section */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push("/dashboard/student")}
                >
                  Back to Dashboard
                </Button>
                <Divider type="vertical" />
                <Title level={2} style={{ margin: 0 }}>
                  <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  Browse Courses
                </Title>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Discover and enroll in courses to enhance your skills and knowledge.
                </Text>
              </div>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search courses..."
                  allowClear
                  style={{ width: 300 }}
                  prefix={<SearchOutlined />}
                />
                <Select
                  placeholder="Filter by category"
                  style={{ width: 200 }}
                  allowClear
                >
                  <Select.Option value="programming">Programming</Select.Option>
                  <Select.Option value="design">Design</Select.Option>
                  <Select.Option value="business">Business</Select.Option>
                  <Select.Option value="marketing">Marketing</Select.Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* My Enrolled Courses */}
        {enrolledCourses.length > 0 && (
          <Card 
            title={
              <span>
                <UserOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                My Enrolled Courses ({enrolledCourses.length})
              </span>
            }
            style={{ marginBottom: 24, borderRadius: 12 }}
          >
            <Row gutter={[16, 16]}>
              {enrolledCourses.map((course) => (
                <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                  <CourseCard course={course} isEnrolled={true} />
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {/* Available Courses */}
        <Card 
          title={
            <span>
              <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              Available Courses ({availableCourses.length})
            </span>
          }
          style={{ borderRadius: 12 }}
        >
          {availableCourses.length === 0 ? (
            <Empty 
              description="No courses available at the moment"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Row gutter={[16, 16]}>
              {availableCourses.map((course) => (
                <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                  <CourseCard course={course} isEnrolled={false} />
                </Col>
              ))}
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

