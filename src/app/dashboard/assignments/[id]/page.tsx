"use client";

import React from "react";
import { Card, Row, Col, Statistic, Descriptions, Tag, Spin, Typography } from "antd";
import { BookOutlined, ClockCircleOutlined, TrophyOutlined, FileTextOutlined } from "@ant-design/icons";
import EnhancedBreadcrumb from "../../../../components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { useParams } from "next/navigation";
import { useGetSingleAssignmentQuery } from "../../../../store/api/assignment_api";

const { Text } = Typography;

const AssignmentDetailsPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  const { data: assignment, isLoading: assignmentLoading, error: assignmentError } = useGetSingleAssignmentQuery(id);

  if (assignmentLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (assignmentError || !assignment) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Text>Assignment not found</Text>
      </div>
    );
  }

  return (
    <div>
      <EnhancedBreadcrumb
        items={[
          { title: "Dashboard", href: "/dashboard/creator" },
          { title: "Lessons", href: "/dashboard/modules" },
          { title: "Assignments" },
          { title: assignment.title || "Assignment" }
        ]}
        showBackButton
      />

      {/* Assignment Header Card */}
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
                {assignment.title}
              </h1>
              <p style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
                {assignment.description}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Tag color={assignment.status === "published" ? "green" : assignment.status === "draft" ? "orange" : "gray"}>
                  {assignment.status}
                </Tag>
                <Tag color="purple">{assignment.assignmentType}</Tag>
                <Tag color="gold">{assignment.maxScore || 100} pts</Tag>
                {assignment.dueDate && (
                  <Tag color="red">Due: {new Date(assignment.dueDate).toLocaleDateString()}</Tag>
                )}
                {assignment.lateSubmissionAllowed && <Tag color="orange">Late Allowed</Tag>}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Assignment Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
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
              title="Max Score"
              value={assignment.maxScore || 100}
              suffix="pts"
              prefix={<span style={{ color: "#faad14" }}><TrophyOutlined /></span>}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
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
              title="Passing Score"
              value={assignment.passingScore || 50}
              suffix="pts"
              prefix={<span style={{ color: "#52c41a" }}><BookOutlined /></span>}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
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
              title="Max Attempts"
              value={assignment.maxAttempts || 3}
              prefix={<span style={{ color: "#1890ff" }}><FileTextOutlined /></span>}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
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
              title="Time Limit"
              value={assignment.timeLimitMinutes || 0}
              suffix="min"
              prefix={<span style={{ color: "#722ed1" }}><ClockCircleOutlined /></span>}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Assignment Details */}
      <Card
        bordered={false}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
        title="Assignment Details"
      >
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="Title">{assignment.title}</Descriptions.Item>
          <Descriptions.Item label="Order">{assignment.assignmentOrder || 1}</Descriptions.Item>
          <Descriptions.Item label="Type">{assignment.assignmentType}</Descriptions.Item>
          <Descriptions.Item label="Status">{assignment.status}</Descriptions.Item>
          <Descriptions.Item label="Max Score">{assignment.maxScore || 100} points</Descriptions.Item>
          <Descriptions.Item label="Passing Score">{assignment.passingScore || 50} points</Descriptions.Item>
          <Descriptions.Item label="Max Attempts">{assignment.maxAttempts || 3}</Descriptions.Item>
          <Descriptions.Item label="Submission Format">{assignment.submissionFormat || "text"}</Descriptions.Item>
          <Descriptions.Item label="Time Limit">
            {assignment.timeLimitMinutes ? `${assignment.timeLimitMinutes} minutes` : "No time limit"}
          </Descriptions.Item>
          <Descriptions.Item label="Late Submission">
            {assignment.lateSubmissionAllowed ? "Allowed" : "Not allowed"}
          </Descriptions.Item>
          <Descriptions.Item label="Due Date">
            {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : "No due date"}
          </Descriptions.Item>
          <Descriptions.Item label="Available From">
            {assignment.availableFrom ? new Date(assignment.availableFrom).toLocaleString() : "Immediately"}
          </Descriptions.Item>
          <Descriptions.Item label="Auto Grade">
            {assignment.autoGrade ? "Enabled" : "Disabled"}
          </Descriptions.Item>
          <Descriptions.Item label="Peer Review">
            {assignment.peerReviewEnabled ? "Enabled" : "Disabled"}
          </Descriptions.Item>
          <Descriptions.Item label="File Types">
            {assignment.allowedFileTypes || "All types"}
          </Descriptions.Item>
          <Descriptions.Item label="Max File Size">
            {assignment.maxFileSizeMb ? `${assignment.maxFileSizeMb} MB` : "No limit"}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {assignment.description}
          </Descriptions.Item>
          <Descriptions.Item label="Instructions" span={2}>
            {assignment.instructions}
          </Descriptions.Item>
          {assignment.referenceMaterials && (
            <Descriptions.Item label="Reference Materials" span={2}>
              {assignment.referenceMaterials}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default AssignmentDetailsPage;
