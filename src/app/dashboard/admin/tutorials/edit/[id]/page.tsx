"use client";
import React, { useEffect, useState } from "react";
import { Card, Form, Input, Select, Button, message, Spin } from "antd";

export default function EditTutorialPage({ params }: { params: { id: string } }) {
  const [form] = Form.useForm();
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch("/api/tutorials/subcategories"),
          fetch(`/api/tutorials/${params.id}`),
        ]);
        const sJson = await sRes.json();
        const tJson = await tRes.json();
        setSubs(sJson?.data || []);
        if (tJson?.data) {
          const d = tJson.data;
          form.setFieldsValue({
            title: d.title,
            description: d.description,
            content: d.content,
            imageUrl: d.imageUrl,
            subcategoryId: d.subcategoryId,
            status: d.status,
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id, form]);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/tutorials/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to update tutorial");
      message.success("Tutorial updated");
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <Card title="Edit Tutorial">
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
          <Select options={subs.map((s) => ({ value: s.id, label: s.name }))} />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select options={["DRAFT","PUBLISHED","REJECTED"].map(s => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>Save</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}


