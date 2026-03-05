"use client";

import React from "react";
import { Card, Row, Col, Statistic, Descriptions, Tag, Spin, Typography } from "antd";
import { TrophyOutlined, ClockCircleOutlined, BookOutlined } from "@ant-design/icons";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { useParams } from "next/navigation";
import { useTranslation } from "@contexts/translation.context";
import { useGetSingleQuizQuery } from "@store/api/quiz_api";

const { Text } = Typography;

const QuizDetailsPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const { t } = useTranslation();

  const { data: quiz, isLoading: quizLoading, error: quizError } = useGetSingleQuizQuery(id);

  if (quizLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (quizError || !quiz) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Text>{t('quiz_manage.quiz_not_found')}</Text>
      </div>
    );
  }

  // Parse answers if it's a JSON string
  const answers = typeof quiz.answers === 'string' ? JSON.parse(quiz.answers || '[]') : quiz.answers;

  return (
    <div>
      <EnhancedBreadcrumb
        items={[
          { title: t('lesson_manage.dashboard'), href: "/dashboard/creator" },
          { title: t('lesson_manage.lessons'), href: "/dashboard/modules" },
          { title: t('module_manage.quizzes') },
          { title: quiz.title || t('lesson_manage.quiz') }
        ]}
        showBackButton
      />

      {/* Quiz Header Card */}
      <Card
        bordered={false}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
          marginBottom: 16,
        }}
      >
        <Row gutter={[0, 0]} align="middle">
          <Col xs={24} sm={24} md={16} lg={18} xl={18} style={{ minHeight: 200 }}>
            <div style={{ padding: "0 16px" }}>
              <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
                {quiz.title}
              </h1>
              <p style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
                {quiz.question}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Tag color={quiz.status === "published" ? "green" : quiz.status === "draft" ? "orange" : "gray"}>
                  {t(`common.${quiz.status?.toLowerCase()}`)}
                </Tag>
                <Tag color="cyan">{quiz.quizType}</Tag>
                <Tag color={quiz.difficulty === "easy" ? "green" : quiz.difficulty === "medium" ? "orange" : "red"}>
                  {t(`lesson_manage.${quiz.difficulty}`)}
                </Tag>
                <Tag color="gold">{quiz.points || 1} {t('lesson_manage.pts')}</Tag>
                {quiz.passRequired && <Tag color="red">{t('lesson_manage.pass_required')}</Tag>}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Quiz Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title={t('lesson_manage.points')}
              value={quiz.points || 1}
              prefix={<span style={{ color: "#faad14" }}><TrophyOutlined /></span>}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title={t('lesson_manage.time_limit')}
              value={quiz.timeLimitMinutes || 0}
              suffix="min"
              prefix={<span style={{ color: "#1890ff" }}><ClockCircleOutlined /></span>}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title={t('lesson_manage.answer_options')}
              value={Array.isArray(answers) ? answers.length : 0}
              prefix={<span style={{ color: "#52c41a" }}><BookOutlined /></span>}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quiz Details */}
      <Card
        bordered={false}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
        title={t('lesson_manage.quiz_details')}
      >
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('common.title')}>{quiz.title}</Descriptions.Item>
          <Descriptions.Item label={t('module_manage.order')}>{quiz.quizOrder || 1}</Descriptions.Item>
          <Descriptions.Item label={t('module_manage.type')}>{quiz.quizType}</Descriptions.Item>
          <Descriptions.Item label={t('module_manage.difficulty')}>{t(`lesson_manage.${quiz.difficulty}`)}</Descriptions.Item>
          <Descriptions.Item label={t('lesson_manage.points')}>{quiz.points || 1}</Descriptions.Item>
          <Descriptions.Item label={t('lesson_manage.language')}>{quiz.language}</Descriptions.Item>
          <Descriptions.Item label={t('lesson_manage.time_limit')}>
            {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} ${t('quiz_manage.minutes')}` : t('quiz_manage.no_time_limit')}
          </Descriptions.Item>
          <Descriptions.Item label={t('lesson_manage.pass_required')}>
            {quiz.passRequired ? t('common.yes') : t('common.no')}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.created_at')}>
            {new Date(quiz.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.updated_at')}>
            {new Date(quiz.updatedAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label={t('lesson_manage.question')} span={2}>
            {quiz.question}
          </Descriptions.Item>
          {quiz.instructions && (
            <Descriptions.Item label={t('lesson_manage.instructions')} span={2}>
              {quiz.instructions}
            </Descriptions.Item>
          )}
          <Descriptions.Item label={t('lesson_manage.answer_options')} span={2}>
            {Array.isArray(answers) ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {answers.map((answer: string, index: number) => (
                  <Tag
                    key={index}
                    color={index === quiz.correctAnswerIndex ? "green" : "default"}
                    style={{ margin: "2px 0" }}
                  >
                    {index === quiz.correctAnswerIndex ? "" : `${index + 1}. `}
                    {answer}
                  </Tag>
                ))}
              </div>
            ) : (
              <Text>{quiz.answers}</Text>
            )}
          </Descriptions.Item>
          {quiz.explanation && (
            <Descriptions.Item label={t('lesson_manage.explanation')} span={2}>
              {quiz.explanation}
            </Descriptions.Item>
          )}
          {quiz.localExample && (
            <Descriptions.Item label={t('lesson_manage.local_example')} span={2}>
              {quiz.localExample}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default QuizDetailsPage;
