"use client";

import PageBreadCrumbs from "../../../../../../components/shared/page-breadcrumb/page-breadcrumb.component";
import ImageUploadField from "../../../../../../components/shared/image-upload-field.component";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export default function BannerEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  return (
    <>
      <PageBreadCrumbs items={["Banners", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
          <Form.Item
            name={"title"}
            label="Title"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name={"subTitle"}
            label="Description"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input.TextArea size="large" />
          </Form.Item>
          <ImageUploadField
            name="image"
            label="Banner Image"
            required={true}
            form={formProps.form}
            initialImageUrl={queryResult?.data?.data?.image}
            maxSize={5 * 1024 * 1024}
          />
        </Form>
      </Edit>
    </>
  );
}
