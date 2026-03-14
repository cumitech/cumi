"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";

export default function TeamMemberCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Our team", "List", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="fullName"
            label="Full name"
            rules={[{ required: true, message: "Full name is required" }]}
          >
            <Input placeholder="e.g. Jane Doe" />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Input placeholder="e.g. Lead Developer" />
          </Form.Item>
          <Form.Item name="bio" label="Bio">
            <Input.TextArea rows={4} placeholder="Short bio" />
          </Form.Item>
          <Form.Item name="imageUrl" label="Image URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="order" label="Order" initialValue={0}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Create>
    </>
  );
}
