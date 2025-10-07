"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Button, 
  Progress, 
  Tag, 
  Avatar,
  List,
  Badge,
  Divider,
  Tooltip,
  Modal,
  Input,
  Select,
  message
} from "antd";
import {
  BookOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  CalendarOutlined,
  StarOutlined,
  EyeOutlined,
  DownloadOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  CodeOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CourseProgressTracker from "./course-progress-tracker";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  studentsCount: number;
  price: number;
  isEnrolled: boolean;
  progress: number;
  lessons: Lesson[];
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  order: number;
  resources?: Resource[];
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'code' | 'image';
  url: string;
  size: string;
}

export default function CourseDashboard() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModalVisible, setCourseModalVisible] = useState(false);

// Mock data - replace with actual API calls
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        title: "Complete React Development Course",
        description: "Learn React from scratch to advanced concepts including hooks, context, and state management.",
        instructor: "John Doe",
        instructorAvatar: "/img/avatar.png",
        thumbnail: "/img/design-3.jpg",
        duration: "24 hours",
        level: "Intermediate",
        rating: 4.8,
        studentsCount: 1250,
        price: 99,
        isEnrolled: true,
        progress: 65,
        category: "Web Development",
        tags: ["React", "JavaScript", "Frontend"],
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
        lessons: [
          {
            id: "l1",
            title: "Introduction to React",
            description: "Understanding React basics and setup",
            type: "video",
            duration: "45 min",
            isCompleted: true,
            isLocked: false,
            order: 1,
            resources: [
              { id: "r1", name: "React Setup Guide", type: "pdf", url: "#", size: "2.3 MB" }
            ]
          },
          {
            id: "l2",
            title: "Components and Props",
            description: "Creating and using React components",
            type: "video",
            duration: "60 min",
            isCompleted: true,
            isLocked: false,
            order: 2
          },
          {
            id: "l3",
            title: "State and Lifecycle",
            description: "Managing component state and lifecycle methods",
            type: "video",
            duration: "55 min",
            isCompleted: false,
            isLocked: false,
            order: 3
          },
          {
            id: "l4",
            title: "React Hooks",
            description: "Understanding and using React hooks",
            type: "video",
            duration: "70 min",
            isCompleted: false,
            isLocked: true,
            order: 4
          }
        ]
      },
      {
        id: "2",
        title: "JavaScript Fundamentals",
        description: "Master JavaScript from basics to advanced concepts including ES6+ features.",
        instructor: "Jane Smith",
        instructorAvatar: "/img/avatar.png",
        thumbnail: "/img/design-3.jpg",
        duration: "18 hours",
        level: "Beginner",
        rating: 4.9,
        studentsCount: 2100,
        price: 79,
        isEnrolled: true,
        progress: 100,
        category: "Programming",
        tags: ["JavaScript", "ES6", "Programming"],
        createdAt: "2024-01-10",
        updatedAt: "2024-01-18",
        lessons: [
          {
            id: "l5",
            title: "Variables and Data Types",
            description: "Understanding JavaScript variables and data types",
            type: "video",
            duration: "30 min",
            isCompleted: true,
            isLocked: false,
            order: 1
          },
          {
            id: "l6",
            title: "Functions and Scope",
            description: "Working with functions and understanding scope",
            type: "video",
            duration: "45 min",
            isCompleted: true,
            isLocked: false,
            order: 2
          }
        ]
      },
      {
        id: "3",
        title: "Advanced Node.js Development",
        description: "Build scalable server-side applications with Node.js and Express.",
        instructor: "Mike Johnson",
        instructorAvatar: "/img/avatar.png",
        thumbnail: "/img/design-3.jpg",
        duration: "32 hours",
        level: "Advanced",
        rating: 4.7,
        studentsCount: 850,
        price: 149,
        isEnrolled: false,
        progress: 0,
        category: "Backend Development",
        tags: ["Node.js", "Express", "Backend"],
        createdAt: "2024-01-20",
        updatedAt: "2024-01-25",
        lessons: []
      }
    ];

setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

const enrolledCourses = courses.filter(course => course.isEnrolled);
  const availableCourses = courses.filter(course => !course.isEnrolled);

const handleEnrollCourse = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: true, progress: 0 }
        : course
    ));
    message.success("Successfully enrolled in course!");
  };

const handleCompleteLesson = (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? {
            ...course,
            lessons: course.lessons.map(lesson =>
              lesson.id === lessonId 
                ? { ...lesson, isCompleted: true }
                : lesson
            ),
            progress: Math.round(
              (course.lessons.filter(l => l.isCompleted || l.id === lessonId).length / course.lessons.length) * 100
            )
          }
        : course
    ));
    message.success("Lesson completed!");
  };

const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCameraOutlined style={{ color: '#1890ff' }} />;
      case 'text': return <FileTextOutlined style={{ color: '#52c41a' }} />;
      case 'quiz': return <QuestionCircleOutlined style={{ color: '#faad14' }} />;
      case 'assignment': return <CodeOutlined style={{ color: '#722ed1' }} />;
      default: return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'green';
      case 'Intermediate': return 'blue';
      case 'Advanced': return 'red';
      default: return 'default';
    }
  };

return (
    <div>
      {}
      <CourseProgressTracker />

{}
      <Card style={{ marginBottom: 24, backgroundColor: 'white' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              My Courses 🎓
            </Title>
            <Text type="secondary">
              Continue your learning journey and track your progress
            </Text>
          </Col>
          <Col>
            <Space>
              <Search
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                placeholder="Level"
                value={filterLevel}
                onChange={setFilterLevel}
                style={{ width: 120 }}
              >
                <Option value="all">All Levels</Option>
                <Option value="Beginner">Beginner</Option>
                <Option value="Intermediate">Intermediate</Option>
                <Option value="Advanced">Advanced</Option>
              </Select>
              <Select
                placeholder="Category"
                value={filterCategory}
                onChange={setFilterCategory}
                style={{ width: 150 }}
              >
                <Option value="all">All Categories</Option>
                <Option value="Web Development">Web Development</Option>
                <Option value="Programming">Programming</Option>
                <Option value="Backend Development">Backend Development</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

{}
      <Card title="Enrolled Courses" style={{ marginBottom: 24, backgroundColor: 'white' }}>
        <Row gutter={[16, 16]}>
          {enrolledCourses.map((course) => (
            <Col xs={24} md={12} lg={8} key={course.id}>
              <Card
                hoverable
                style={{ backgroundColor: 'white' }}
                cover={
                  <div style={{ position: 'relative', height: 200, width: '100%' }}>
                    <Image
                      alt={`${course.title} - Course image`}
                      src={course.thumbnail}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: 4
                    }}>
                      {course.duration}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      right: 8
                    }}>
                      <Progress
                        percent={course.progress}
                        size="small"
                        strokeColor="#52c41a"
                        showInfo={false}
                      />
                      <Text style={{ color: 'white', fontSize: 12 }}>
                        {course.progress}% Complete
                      </Text>
                    </div>
                  </div>
                }
                actions={[
                  <Button 
                    key="continue"
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={() => {
                      setSelectedCourse(course);
                      setCourseModalVisible(true);
                    }}
                  >
                    Continue Learning
                  </Button>,
                  <Button key="view" icon={<EyeOutlined />}>
                    View Details
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <Space>
                      <Text strong>{course.title}</Text>
                      <Tag color={getLevelColor(course.level)}>
                        {course.level}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Paragraph ellipsis={{ rows: 2 }}>
                        {course.description}
                      </Paragraph>
                      <Space>
                        <Avatar size="small" src={course.instructorAvatar} icon={<UserOutlined />} />
                        <Text type="secondary">{course.instructor}</Text>
                        <StarOutlined style={{ color: '#faad14' }} />
                        <Text type="secondary">{course.rating}</Text>
                      </Space>
                      <Space>
                        <Tag color="blue">{course.category}</Tag>
                        {course.tags.slice(0, 2).map(tag => (
                          <Tag key={tag} color="default">{tag}</Tag>
                        ))}
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

{}
      <Card title="Available Courses" style={{ backgroundColor: 'white' }}>
        <Row gutter={[16, 16]}>
          {availableCourses.map((course) => (
            <Col xs={24} md={12} lg={8} key={course.id}>
              <Card
                hoverable
                style={{ backgroundColor: 'white' }}
                cover={
                  <div style={{ position: 'relative', height: 200, width: '100%' }}>
                    <Image
                      alt={`${course.title} - Course image`}
                      src={course.thumbnail}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: 4
                    }}>
                      ${course.price}
                    </div>
                  </div>
                }
                actions={[
                  <Button 
                    key="enroll"
                    type="primary"
                    onClick={() => handleEnrollCourse(course.id)}
                  >
                    Enroll Now
                  </Button>,
                  <Button key="preview" icon={<EyeOutlined />}>
                    Preview
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <Space>
                      <Text strong>{course.title}</Text>
                      <Tag color={getLevelColor(course.level)}>
                        {course.level}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Paragraph ellipsis={{ rows: 2 }}>
                        {course.description}
                      </Paragraph>
                      <Space>
                        <Avatar size="small" src={course.instructorAvatar} icon={<UserOutlined />} />
                        <Text type="secondary">{course.instructor}</Text>
                        <StarOutlined style={{ color: '#faad14' }} />
                        <Text type="secondary">{course.rating}</Text>
                        <UserOutlined style={{ color: '#1890ff' }} />
                        <Text type="secondary">{course.studentsCount}</Text>
                      </Space>
                      <Space>
                        <Tag color="blue">{course.category}</Tag>
                        {course.tags.slice(0, 2).map(tag => (
                          <Tag key={tag} color="default">{tag}</Tag>
                        ))}
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

{}
      <Modal
        title={selectedCourse?.title}
        open={courseModalVisible}
        onCancel={() => setCourseModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedCourse && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={24}>
                <div style={{ position: 'relative', width: '100%', height: 200 }}>
                  <Image
                    src={selectedCourse.thumbnail}
                    alt={`${selectedCourse.title} - Course thumbnail`}
                    fill
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                </div>
              </Col>
            </Row>

<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Text strong>Instructor: </Text>
                <Space>
                  <Avatar size="small" src={selectedCourse.instructorAvatar} icon={<UserOutlined />} />
                  <Text>{selectedCourse.instructor}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Text strong>Duration: </Text>
                <Text>{selectedCourse.duration}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Level: </Text>
                <Tag color={getLevelColor(selectedCourse.level)}>
                  {selectedCourse.level}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Progress: </Text>
                <Progress percent={selectedCourse.progress} size="small" />
              </Col>
            </Row>

<Divider />

<Title level={4}>Course Lessons</Title>
            <List
              dataSource={selectedCourse.lessons}
              renderItem={(lesson) => (
                <List.Item
                  actions={[
                    lesson.isCompleted ? (
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                    ) : lesson.isLocked ? (
                      <Tooltip title="Complete previous lessons to unlock">
                        <ClockCircleOutlined style={{ color: '#d9d9d9', fontSize: 20 }} />
                      </Tooltip>
                    ) : (
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleCompleteLesson(selectedCourse.id, lesson.id)}
                      >
                        Start
                      </Button>
                    )
                  ]}
                >
                  <List.Item.Meta
                    avatar={getLessonIcon(lesson.type)}
                    title={
                      <Space>
                        <Text strong={lesson.isCompleted}>{lesson.title}</Text>
                        {lesson.isCompleted && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        {lesson.isLocked && <ClockCircleOutlined style={{ color: '#d9d9d9' }} />}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">{lesson.description}</Text>
                        <Space>
                          <ClockCircleOutlined style={{ color: '#1890ff' }} />
                          <Text type="secondary">{lesson.duration}</Text>
                          <Tag color="blue">{lesson.type}</Tag>
                        </Space>
                        {lesson.resources && lesson.resources.length > 0 && (
                          <Space>
                            <DownloadOutlined style={{ color: '#52c41a' }} />
                            <Text type="secondary">
                              {lesson.resources.length} resource(s)
                            </Text>
                          </Space>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
