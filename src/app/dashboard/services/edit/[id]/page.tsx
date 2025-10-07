"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import ImageUploadField from "@components/shared/image-upload-field.component";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import { useUpload } from "@hooks/shared/upload.hook";

export default function ServiceEdit() {
  const { formProps, saveButtonProps, form, queryResult } = useForm({});
  const { handleRemove } = useUpload({
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    form: formProps.form,
  });

  // Parse existing items data when form loads
  useEffect(() => {
    const currentItems = formProps.form?.getFieldValue('items');
    if (currentItems) {
      let parsedItems = currentItems;
      
      // If items is a string, try to parse it as JSON
      if (typeof currentItems === 'string') {
        try {
          parsedItems = JSON.parse(currentItems);
        } catch (error) {
          console.warn('Failed to parse items JSON:', error);
          parsedItems = [];
        }
      }
      
      // Ensure it's an array
      if (Array.isArray(parsedItems)) {
        formProps.form?.setFieldsValue({
          items: parsedItems
        });
      }
    }
  }, [formProps.form]);

  const handleRemoveWithCleanup = async (file: any) => {
    // Get the initial image URL from the query result
    const initialImageUrl = queryResult?.data?.data?.imageUrl;
    
    // If removing existing file, delete it from server
    if (file.url === initialImageUrl && initialImageUrl) {
      try {
        // Extract filename from URL and delete from server
        const filename = initialImageUrl.split('/').pop();
        if (filename) {
          await fetch(`/api/uploads/${filename}`, {
            method: 'DELETE',
          });
        }
        message.success('File deleted successfully');
      } catch (error) {
        console.error('Error deleting file:', error);
        message.warning('File removed from form but may still exist on server');
      }
    }
    
    // Use the hook's handleRemove for uploaded files
    return await handleRemove(file);
  };

  return (
    <>
      <PageBreadCrumbs items={["Services", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form} size="large">
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
            name={"description"}
            label="Description"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 15 }}
          >
            <Input.TextArea size="large" />
          </Form.Item>

          <Form.Item
            name={"items"}
            label="Service Items"
            tooltip="Add the specific services or features you offer. Press Enter to add each item."
            style={{ marginBottom: 15 }}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="Add service items (e.g., Web Development, Mobile Apps)"
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>

          <ImageUploadField
            name="imageUrl"
            label="Service Image"
            required={true}
            form={formProps.form}
            initialImageUrl={queryResult?.data?.data?.imageUrl}
            maxSize={5 * 1024 * 1024}
          />
        </Form>
      </Edit>
    </>
  );
}
