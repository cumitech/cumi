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
  Button,
  notification,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { IEvent } from "@domain/models/event.model";
import { useSession } from "next-auth/react";
import PhoneNumberInput from "@components/shared/phone-number-input.component";
import { validatePhoneNumber, normalizePhoneNumber } from "@utils/country-codes";

const { Title, Text } = Typography;

interface EventRegistrationModalProps {
  visible: boolean;
  onCancel: () => void;
  event: IEvent | null;
  onSuccess?: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  visible,
  onCancel,
  event,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [isRegistering, setIsRegistering] = useState(false);
  const [api, contextHolder] = notification.useNotification();

const handleRegistrationSubmit = async (values: any) => {
    try {
      if (!event || !session?.user?.id) {
        api.warning({
          message: "Authentication Required",
          description: "Please log in to register for events",
          placement: 'topRight',
        });
        return;
      }

setIsRegistering(true);

      const countryCode = values.countryCode || 'CM';
      const registrationData = {
        eventId: event.id,
        userId: session.user.id,
        name: values.name,
        email: values.email,
        phone: normalizePhoneNumber(countryCode, values.phone),
        countryCode,
        company: values.company,
        dietaryRequirements: values.dietaryRequirements,
        additionalNotes: values.additionalNotes,
        // Set admin-controlled defaults
        status: "pending",
        paymentStatus: event.isFree ? "paid" : "pending",
        paymentAmount: event.isFree ? 0 : event.entryFee,
      };

const response = await fetch("/api/event-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

const data = await response.json();

if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

api.success({
        message: "Registration Successful!",
        description: "Successfully registered for the event! We'll send you a confirmation email shortly.",
        placement: 'topRight',
        duration: 4,
      });
      form.resetFields();
      onCancel();
      onSuccess?.();
    } catch (error) {
      console.error("Registration error:", error);
      api.error({
        message: "Registration Failed",
        description: error instanceof Error ? error.message : "Registration failed. Please try again.",
        placement: 'topRight',
      });
    } finally {
      setIsRegistering(false);
    }
  };

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

if (!event) return null;

return (
    <>
      {contextHolder}
      <Modal
        title={`Register for ${event.title}`}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width="95%"
        style={{ maxWidth: '700px', top: 20 }}
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
                  src={event.imageUrl || "/img/design-3.jpg"}
                  alt={event.title || "Event registration"}
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
                  {event.title}
                </Title>
                <Space>
                  <CalendarOutlined />
                  <Text>
                    {formatDate(event.eventDate.toString())}
                  </Text>
                </Space>
                <Space>
                  <EnvironmentOutlined />
                  <Text>{event.location || 'TBA'}</Text>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>

<Form
          form={form}
          layout="vertical"
          onFinish={handleRegistrationSubmit}
          initialValues={{
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            countryCode: "CM",
          }}
          size="large"
        >
        {}
        <Form.Item name="countryCode" initialValue="CM" hidden>
          <Input />
        </Form.Item>

<Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: "Please enter your full name" },
          ]}
        >
          <Input placeholder="Enter your full name" size="large" />
        </Form.Item>

<Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email address" size="large" />
        </Form.Item>

<Form.Item
          name="phone"
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

<Form.Item name="company" label="Company/Organization">
          <Input placeholder="Enter your company or organization" size="large" />
        </Form.Item>

<Form.Item name="dietaryRequirements" label="Dietary Requirements">
          <Input.TextArea 
            placeholder="Any dietary restrictions or special requirements" 
            rows={2}
            size="large"
          />
        </Form.Item>

<Form.Item name="additionalNotes" label="Additional Notes">
          <Input.TextArea 
            placeholder="Any additional information or special requests" 
            rows={2}
            size="large"
          />
        </Form.Item>

<Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isRegistering}
            >
              {isRegistering ? 'Registering...' : 'Complete Registration'}
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

export default EventRegistrationModal;
