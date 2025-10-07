"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
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
  message,
  Tabs,
  Collapse,
  Rate
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
  QuestionCircleOutlined,
  MessageOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled
} from "@ant-design/icons";
import Link from "next/link";
import { useSession } from "next-auth/react";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  instructor: {
    name: string;
    avatar?: string;
    bio: string;
    rating: number;
    studentsCount: number;
    coursesCount: number;
  };
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
  requirements: string[];
  whatYouWillLearn: string[];
  reviews: Review[];
  isLiked: boolean;
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
  videoUrl?: string;
  content?: string;
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'code' | 'image';
  url: string;
  size: string;
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export default function CourseDetailPage({ courseId }: { courseId: string }) {
  const { data: session } = useSession();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

useEffect(() => {
    // Mock data - replace with actual API call
    const mockCourse: CourseDetail = {
      id: courseId,
      title: "Complete React Development Course",
      description: "Learn React from scratch to advanced concepts including hooks, context, and state management.",
      fullDescription: "This comprehensive React course will take you from beginner to advanced level. You'll learn all the essential concepts including components, props, state, lifecycle methods, hooks, context API, and much more. By the end of this course, you'll be able to build complex React applications with confidence.",
      instructor: {
        name: "John Doe",
        avatar: "/img/avatar.png",
        bio: "Senior React Developer with 8+ years of experience. Worked at top tech companies and contributed to open source projects.",
        rating: 4.9,
        studentsCount: 15000,
        coursesCount: 12
      },
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
      isLiked: false,
      requirements: [
        "Basic knowledge of HTML, CSS, and JavaScript",
        "Node.js installed on your computer",
        "A code editor (VS Code recommended)",
        "Basic understanding of programming concepts"
      ],
      whatYouWillLearn: [
        "Build modern React applications from scratch",
        "Understand React components and JSX",
        "Master React hooks and state management",
        "Implement routing and navigation",
        "Handle forms and user input",
        "Work with APIs and data fetching",
        "Deploy React applications"
      ],
      reviews: [
        {
          id: "1",
          user: {
            name: "Alice Johnson",
            avatar: "/img/avatar.png"
          },
          rating: 5,
          comment: "Excellent course! The instructor explains everything clearly and the projects are very practical.",
          date: "2024-01-18",
          helpful: 12
        },
        {
          id: "2",
          user: {
            name: "Bob Smith",
            avatar: "/img/avatar.png"
          },
          rating: 4,
          comment: "Great content, but could use more advanced examples in the later sections.",
          date: "2024-01-16",
          helpful: 8
        }
      ],
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
          videoUrl: "https://example.com/video1",
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
          order: 2,
          videoUrl: "https://example.com/video2"
        },
        {
          id: "l3",
          title: "State and Lifecycle",
          description: "Managing component state and lifecycle methods",
          type: "video",
          duration: "55 min",
          isCompleted: false,
          isLocked: false,
          order: 3,
          videoUrl: "https://example.com/video3"
        },
        {
          id: "l4",
          title: "React Hooks",
          description: "Understanding and using React hooks",
          type: "video",
          duration: "70 min",
          isCompleted: false,
          isLocked: true,
          order: 4,
          videoUrl: "https://example.com/video4"
        },
        {
          id: "l5",
          title: "Quiz: React Fundamentals",
          description: "Test your knowledge of React basics",
          type: "quiz",
          duration: "15 min",
          isCompleted: false,
          isLocked: false,
          order: 5
        }
      ]
    };

setTimeout(() => {
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);
  }, [courseId]);

const handleEnrollCourse = () => {
    if (course) {
      setCourse({ ...course, isEnrolled: true, progress: 0 });
      message.success("Successfully enrolled in course!");
    }
  };

const handleLikeCourse = () => {
    if (course) {
      setCourse({ ...course, isLiked: !course.isLiked });
      message.success(course.isLiked ? "Removed from favorites" : "Added to favorites");
    }
  };

const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLessonModalVisible(true);
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

if (loading) {
    return <div>Loading...</div>;
  }

if (!course) {
    return <div>Course not found</div>;
  }

return (
    <div>
      {}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div style={{ position: 'relative', width: '100%', height: 300 }}>
              <Image
                src={course.thumbnail}
                alt={`${course.title} - Course thumbnail`}
                fill
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {course.title}
                </Title>
                <Space style={{ marginTop: 8 }}>
                  <Tag color={getLevelColor(course.level)}>
                    {course.level}
                  </Tag>
                  <Tag color="blue">{course.category}</Tag>
                  {course.tags.map(tag => (
                    <Tag key={tag} color="default">{tag}</Tag>
                  ))}
                </Space>
              </div>

<div>
                <Space>
                  <StarOutlined style={{ color: '#faad14' }} />
                  <Text strong>{course.rating}</Text>
                  <Text type="secondary">({course.studentsCount} students)</Text>
                </Space>
              </div>

<div>
                <Space>
                  <Avatar src={course.instructor.avatar} icon={<UserOutlined />} />
                  <div>
                    <Text strong>{course.instructor.name}</Text>
                    <br />
                    <Text type="secondary">Instructor</Text>
                  </div>
                </Space>
              </div>

<div>
                <Space>
                  <ClockCircleOutlined />
                  <Text>{course.duration}</Text>
                  <CalendarOutlined />
                  <Text>Last updated: {new Date(course.updatedAt).toLocaleDateString()}</Text>
                </Space>
              </div>

<Divider />

<div>
                <Space>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={handleEnrollCourse}
                    disabled={course.isEnrolled}
                  >
                    {course.isEnrolled ? 'Enrolled' : `Enroll for $${course.price}`}
                  </Button>
                  <Button
                    icon={course.isLiked ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleLikeCourse}
                    style={{ color: course.isLiked ? '#ff4d4f' : undefined }}
                  />
                  <Button icon={<ShareAltOutlined />}>
                    Share
                  </Button>
                </Space>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

{}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Overview" key="overview">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Title level={4}>About This Course</Title>
                    <Paragraph>{course.fullDescription}</Paragraph>
                  </div>

<div>
                    <Title level={4}>What You&apos;ll Learn</Title>
                    <ul>
                      {course.whatYouWillLearn.map((item, index) => (
                        <li key={index}>
                          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

<div>
                    <Title level={4}>Requirements</Title>
                    <ul>
                      {course.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Space>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Course Statistics">
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Total Lessons</Text>
                      <br />
                      <Text type="secondary">{course.lessons.length} lessons</Text>
                    </div>
                    <div>
                      <Text strong>Course Duration</Text>
                      <br />
                      <Text type="secondary">{course.duration}</Text>
                    </div>
                    <div>
                      <Text strong>Level</Text>
                      <br />
                      <Tag color={getLevelColor(course.level)}>
                        {course.level}
                      </Tag>
                    </div>
                    <div>
                      <Text strong>Students Enrolled</Text>
                      <br />
                      <Text type="secondary">{course.studentsCount.toLocaleString()}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>

<TabPane tab="Curriculum" key="curriculum">
            <div>
              <Title level={4}>Course Content</Title>
              <Collapse>
                <Panel header={`Section 1: React Fundamentals (${course.lessons.length} lessons)`} key="1">
                  <List
                    dataSource={course.lessons}
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
                              onClick={() => handleStartLesson(lesson)}
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
                </Panel>
              </Collapse>
            </div>
          </TabPane>

<TabPane tab="Reviews" key="reviews">
            <div>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                      <Title level={2} style={{ margin: 0 }}>
                        {course.rating}
                      </Title>
                      <Rate disabled defaultValue={course.rating} />
                      <Text type="secondary">
                        Based on {course.reviews.length} reviews
                      </Text>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} md={16}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {course.reviews.map((review) => (
                      <Card key={review.id} size="small">
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Space>
                                <Avatar size="small" src={review.user.avatar} icon={<UserOutlined />} />
                                <Text strong>{review.user.name}</Text>
                                <Rate disabled defaultValue={review.rating} />
                              </Space>
                            </Col>
                            <Col>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {review.date}
                              </Text>
                            </Col>
                          </Row>
                          <Text>{review.comment}</Text>
                          <Space>
                            <Button size="small" type="text">
                              Helpful ({review.helpful})
                            </Button>
                          </Space>
                        </Space>
                      </Card>
                    ))}
                  </Space>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>

{}
      <Modal
        title={selectedLesson?.title}
        open={lessonModalVisible}
        onCancel={() => setLessonModalVisible(false)}
        width={1000}
        footer={null}
      >
        {selectedLesson && (
          <div>
            {selectedLesson.type === 'video' && selectedLesson.videoUrl && (
              <div style={{ marginBottom: 24 }}>
                <video
                  controls
                  style={{ width: '100%', height: 400 }}
                  src={selectedLesson.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

<div>
              <Title level={4}>Lesson Description</Title>
              <Paragraph>{selectedLesson.description}</Paragraph>

{selectedLesson.resources && selectedLesson.resources.length > 0 && (
                <div>
                  <Title level={5}>Resources</Title>
                  <List
                    dataSource={selectedLesson.resources}
                    renderItem={(resource) => (
                      <List.Item
                        actions={[
                          <Button key="download" type="primary" size="small" icon={<DownloadOutlined />}>
                            Download
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={resource.name}
                          description={`${resource.type.toUpperCase()} • ${resource.size}`}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
