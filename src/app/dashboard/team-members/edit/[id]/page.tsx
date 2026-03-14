"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";

export default function TeamMemberEdit() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Our team", "List", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
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
          <Form.Item name="order" label="Order">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Edit>
    </>
  );
}
