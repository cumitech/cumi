"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Modal,
  Form,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Input,
  Select,
  Button,
  notification,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  BookOutlined,
  ClockCircleOutlined,
  StarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { ICourse } from "@domain/models/course";
import { useSession } from "next-auth/react";
import PhoneNumberInput from "@components/shared/phone-number-input.component";
import { validatePhoneNumber, normalizePhoneNumber } from "@utils/country-codes";
import { showLoginRequiredNotificationSimple, getCurrentUrlForRedirect } from "@components/shared/login-required-notification";

const { Title, Text } = Typography;
const { Option } = Select;

interface CourseEnrollmentModalProps {
  visible: boolean;
  onCancel: () => void;
  course: ICourse | null;
  onSuccess?: () => void;
}

export const CourseEnrollmentModal: React.FC<CourseEnrollmentModalProps> = ({
  visible,
  onCancel,
  course,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [api, contextHolder] = notification.useNotification();

const handleEnrollmentSubmit = async (values: any) => {
    try {
      if (!course || !session?.user?.id) {
        showLoginRequiredNotificationSimple({
          message: "Authentication Required",
          description: "Please log in to enroll in this course and access all features.",
          redirectUrl: getCurrentUrlForRedirect()
        });
        return;
      }

setIsEnrolling(true);

      const countryCode = values.countryCode || 'CM';
      const enrollmentData = {
        courseId: course.id,
        userId: session.user.id,
        studentPhone: normalizePhoneNumber(countryCode, values.studentPhone),
        countryCode,
        emergencyContact: values.emergencyContact,
        educationLevel: values.educationLevel,
        internetAccess: values.internetAccess,
        preferredContact: values.preferredContact,
        studySchedule: values.studySchedule,
        certificateLanguage: values.certificateLanguage,
        motivation: values.motivation,
        skillsGained: values.skillsGained,
        notes: values.notes,
        // Set admin-controlled defaults
        status: "active",
        paymentStatus: course.isFree ? "free" : "pending",
        progress: 0,
      };

const response = await fetch("/api/course-enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrollmentData),
        });

const data = await response.json();

if (!response.ok) {
        throw new Error(data.message || "Enrollment failed");
      }

api.success({
        message: "Enrollment Successful!",
        description: "Successfully enrolled in the course! You can now access all course materials.",
        placement: 'topRight',
        duration: 4,
      });
      form.resetFields();
      onCancel();
      onSuccess?.();
    } catch (error) {
      console.error("Enrollment error:", error);
      api.error({
        message: "Enrollment Failed",
        description: error instanceof Error ? error.message : "Enrollment failed. Please try again.",
        placement: 'topRight',
      });
    } finally {
      setIsEnrolling(false);
    }
  };

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

if (!course) return null;

return (
    <>
      {contextHolder}
      <Modal
        title={`Enroll in ${course.title}`}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width="95%"
        style={{ maxWidth: '800px', top: 20 }}
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
        <Card style={{ backgroundColor: 'white', border: 'none' }}>
        <Card size="small" style={{ marginBottom: 24, backgroundColor: 'white' }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div style={{ position: 'relative', width: "100%", height: 150 }}>
                <Image
                  src={course.imageUrl || "/img/design-3.jpg"}
                  alt={course.title || "Course enrollment"}
                  fill
                  style={{
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            </Col>
            <Col span={24}>
              <Space direction="vertical" size="small">
                <Title level={4} style={{ margin: 0 }}>
                  {course.title}
                </Title>
                <Space>
                  <ClockCircleOutlined />
                  <Text>{course.durationWeeks ? `${course.durationWeeks} weeks` : 'Self-paced'}</Text>
                </Space>
                <Space>
                  <StarOutlined />
                  <Text>{course.level?.charAt(0).toUpperCase() + course.level?.slice(1)} Level</Text>
                </Space>
                <Space>
                  <DollarOutlined />
                  <Text>{course.isFree ? 'Free' : `${course.price} ${course.currency}`}</Text>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>

<Form
          form={form}
          layout="vertical"
          onFinish={handleEnrollmentSubmit}
          size="large"
        >
        {}
        <Form.Item name="countryCode" initialValue="CM" hidden>
          <Input />
        </Form.Item>

<Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="studentPhone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your phone number" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const countryCode = form.getFieldValue('countryCode') || 'CM';
                    if (validatePhoneNumber(countryCode, value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Please enter a valid phone number"));
                  },
                },
              ]}
            >
              <PhoneNumberInput
                placeholder="Enter your phone number"
                showMoneyServices={true}
                countryCode="CM"
                size="large"
                onCountryCodeChange={(code) => {
                  form.setFieldValue('countryCode', code);
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="emergencyContact"
              label="Emergency Contact"
              rules={[
                { required: true, message: "Please enter emergency contact" },
              ]}
            >
              <Input placeholder="Emergency contact phone number" size="large" />
            </Form.Item>
          </Col>
        </Row>

<Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="educationLevel"
              label="Education Level"
              rules={[
                { required: true, message: "Please select your education level" },
              ]}
            >
              <Select placeholder="Select education level">
                <Option value="primary">Primary School</Option>
                <Option value="secondary">Secondary School</Option>
                <Option value="university">University</Option>
                <Option value="professional">Professional</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="internetAccess"
              label="Internet Access"
              rules={[
                { required: true, message: "Please select your internet access type" },
              ]}
            >
              <Select placeholder="Select internet access type">
                <Option value="high_speed">High Speed</Option>
                <Option value="mobile_data">Mobile Data</Option>
                <Option value="limited">Limited</Option>
                <Option value="cybercafe">Cybercafe</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

<Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="preferredContact"
              label="Preferred Contact Method"
              rules={[
                { required: true, message: "Please select preferred contact method" },
              ]}
            >
              <Select placeholder="Select contact method">
                <Option value="whatsapp">WhatsApp</Option>
                <Option value="sms">SMS</Option>
                <Option value="call">Phone Call</Option>
                <Option value="email">Email</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="studySchedule"
              label="Preferred Study Schedule"
              rules={[
                { required: true, message: "Please select your study schedule" },
              ]}
            >
              <Select placeholder="Select study schedule">
                <Option value="morning">Morning</Option>
                <Option value="afternoon">Afternoon</Option>
                <Option value="evening">Evening</Option>
                <Option value="weekend">Weekend</Option>
                <Option value="flexible">Flexible</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

<Form.Item
          name="certificateLanguage"
          label="Certificate Language"
          rules={[
            { required: true, message: "Please select certificate language" },
          ]}
        >
          <Select placeholder="Select certificate language">
            <Option value="french">French</Option>
            <Option value="english">English</Option>
            <Option value="both">Both</Option>
          </Select>
        </Form.Item>

<Form.Item
          name="motivation"
          label="Motivation for Taking This Course"
          rules={[
            { required: true, message: "Please explain your motivation" },
          ]}
        >
          <Input.TextArea 
            placeholder="Why do you want to take this course? What are your goals?" 
            rows={3}
          />
        </Form.Item>

<Form.Item
          name="skillsGained"
          label="Expected Skills"
        >
          <Input.TextArea 
            placeholder="What skills do you expect to gain from this course?" 
            rows={2}
          />
        </Form.Item>

<Form.Item
          name="notes"
          label="Additional Notes"
        >
          <Input.TextArea 
            placeholder="Any additional information or special requests" 
            rows={2}
          />
        </Form.Item>

<Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isEnrolling}
            >
              {isEnrolling ? 'Enrolling...' : 'Complete Enrollment'}
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
        </Form>
      </Card>
    </Modal>
    </>
  );
};

export default CourseEnrollmentModal;
