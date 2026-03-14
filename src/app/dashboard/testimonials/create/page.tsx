"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";

export default function TestimonialCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Testimonials", "List", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="quote"
            label="Quote"
            rules={[{ required: true, message: "Quote is required" }]}
          >
            <Input.TextArea rows={4} placeholder="Client testimonial quote" />
          </Form.Item>
          <Form.Item
            name="authorName"
            label="Author Name"
            rules={[{ required: true, message: "Author name is required" }]}
          >
            <Input placeholder="e.g. Sarah M." />
          </Form.Item>
          <Form.Item name="authorRole" label="Author Role">
            <Input placeholder="e.g. Founder, Tech Startup" />
          </Form.Item>
          <Form.Item name="order" label="Order" initialValue={0}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Create>
    </>
  );
}
