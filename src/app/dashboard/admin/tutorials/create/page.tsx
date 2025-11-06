"use client";
import React, { useEffect, useState } from "react";
import { Card, Form, Input, Select, Button, message } from "antd";

export default function CreateTutorialPage() {
  const [form] = Form.useForm();
  const [subs, setSubs] = useState<any[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setSubLoading(true);
      try {
        const res = await fetch("/api/tutorials/subcategories");
        const json = await res.json();
        setSubs(json?.data || []);
      } finally {
        setSubLoading(false);
      }
    })();
  }, []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create tutorial");
      message.success("Tutorial created");
      form.resetFields();
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Create Tutorial">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input size="large" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="content" label="Content">
          <Input.TextArea rows={8} />
        </Form.Item>
        <Form.Item name="imageUrl" label="Image URL">
          <Input />
        </Form.Item>
        <Form.Item name="subcategoryId" label="Subcategory" rules={[{ required: true }]}> 
          <Select loading={subLoading} options={subs.map((s) => ({ value: s.id, label: s.name }))} />
        </Form.Item>
        <Form.Item name="status" label="Status" initialValue="DRAFT">
          <Select options={["DRAFT","PUBLISHED","REJECTED"].map(s => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>Create</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}


