"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Progress, 
  Timeline, 
  Tag, 
  Button,
  Space,
  Avatar,
  Statistic,
  Divider
} from "antd";
import {
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  BookOutlined,
  CalendarOutlined,
  StarOutlined,
  FireOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface ProgressData {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  studyStreak: number;
  totalStudyTime: string;
  achievements: Achievement[];
  recentActivity: Activity[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: 'course' | 'lesson' | 'streak' | 'time';
}

interface Activity {
  id: string;
  type: 'lesson_completed' | 'course_enrolled' | 'achievement_earned';
  title: string;
  description: string;
  timestamp: string;
  courseName?: string;
}

export default function CourseProgressTracker() {
  const [progressData, setProgressData] = useState<ProgressData>({
    totalCourses: 3,
    completedCourses: 1,
    totalLessons: 12,
    completedLessons: 8,
    studyStreak: 7,
    totalStudyTime: "24h 30m",
    achievements: [
      {
        id: "1",
        title: "First Course Complete",
        description: "Completed your first course",
        icon: "",
        earnedAt: "2024-01-20",
        type: "course"
      },
      {
        id: "2",
        title: "Week Warrior",
        description: "7-day study streak",
        icon: "",
        earnedAt: "2024-01-25",
        type: "streak"
      },
      {
        id: "3",
        title: "Quick Learner",
        description: "Completed 5 lessons in one day",
        icon: "",
        earnedAt: "2024-01-22",
        type: "lesson"
      }
    ],
    recentActivity: [
      {
        id: "1",
        type: "lesson_completed",
        title: "Completed Lesson",
        description: "React Hooks Fundamentals",
        timestamp: "2 hours ago",
        courseName: "Complete React Development Course"
      },
      {
        id: "2",
        type: "course_enrolled",
        title: "Enrolled in Course",
        description: "Advanced Node.js Development",
        timestamp: "1 day ago"
      },
      {
        id: "3",
        type: "achievement_earned",
        title: "Achievement Earned",
        description: "Week Warrior - 7-day study streak",
        timestamp: "2 days ago"
      }
    ]
  });

const courseProgress = Math.round((progressData.completedCourses / progressData.totalCourses) * 100);
  const lessonProgress = Math.round((progressData.completedLessons / progressData.totalLessons) * 100);

const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'course_enrolled': return <BookOutlined style={{ color: '#1890ff' }} />;
      case 'achievement_earned': return <TrophyOutlined style={{ color: '#faad14' }} />;
      default: return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

const getAchievementColor = (type: string) => {
    switch (type) {
      case 'course': return '#52c41a';
      case 'lesson': return '#1890ff';
      case 'streak': return '#faad14';
      case 'time': return '#722ed1';
      default: return '#d9d9d9';
    }
  };

return (
    <div>
      {}
      <Card title="Learning Progress" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Course Progress"
              value={courseProgress}
              suffix="%"
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress 
              percent={courseProgress} 
              size="small" 
              strokeColor="#1890ff"
              showInfo={false}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Lesson Progress"
              value={lessonProgress}
              suffix="%"
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={lessonProgress} 
              size="small" 
              strokeColor="#52c41a"
              showInfo={false}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Study Streak"
              value={progressData.studyStreak}
              suffix="days"
              prefix={<FireOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Total Study Time"
              value={progressData.totalStudyTime}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>

<Row gutter={[16, 16]}>
        {}
        <Col xs={24} lg={12}>
          <Card title="Achievements" style={{ height: '100%' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {progressData.achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  size="small"
                  style={{
                    border: `2px solid ${getAchievementColor(achievement.type)}`,
                    borderRadius: 8
                  }}
                >
                  <Row align="middle" gutter={[12, 12]}>
                    <Col>
                      <div style={{
                        fontSize: 32,
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `${getAchievementColor(achievement.type)}20`,
                        borderRadius: 8
                      }}>
                        {achievement.icon}
                      </div>
                    </Col>
                    <Col flex="auto">
                      <Title level={5} style={{ margin: 0 }}>
                        {achievement.title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {achievement.description}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                      </Text>
                    </Col>
                    <Col>
                      <Tag color={getAchievementColor(achievement.type)}>
                        {achievement.type}
                      </Tag>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>

{}
        <Col xs={24} lg={12}>
          <Card title="Recent Activity" style={{ height: '100%' }}>
            <Timeline
              items={progressData.recentActivity.map((activity) => ({
                dot: getActivityIcon(activity.type),
                children: (
                  <div>
                    <Text strong>{activity.title}</Text>
                    <br />
                    <Text type="secondary">{activity.description}</Text>
                    {activity.courseName && (
                      <>
                        <br />
                        <Tag color="blue" style={{ fontSize: 10 }}>
                          {activity.courseName}
                        </Tag>
                      </>
                    )}
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {activity.timestamp}
                    </Text>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

{}
      <Card title="Study Goals" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="small">
                <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Text strong>Daily Goal</Text>
                <Text type="secondary">Complete 2 lessons</Text>
                <Progress 
                  percent={75} 
                  size="small" 
                  strokeColor="#1890ff"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  1.5 / 2 lessons completed
                </Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="small">
                <BookOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <Text strong>Weekly Goal</Text>
                <Text type="secondary">Complete 1 course</Text>
                <Progress 
                  percent={60} 
                  size="small" 
                  strokeColor="#52c41a"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  3 / 5 days remaining
                </Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="small">
                <FireOutlined style={{ fontSize: 24, color: '#faad14' }} />
                <Text strong>Streak Goal</Text>
                <Text type="secondary">30-day streak</Text>
                <Progress 
                  percent={23} 
                  size="small" 
                  strokeColor="#faad14"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  7 / 30 days
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
