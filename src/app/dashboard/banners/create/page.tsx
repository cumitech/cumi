"use client";

import PageBreadCrumbs from "../../../../components/shared/page-breadcrumb/page-breadcrumb.component";
import { ImageUploadField } from "../../../../components/shared/image-upload-field.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Card, Button, Space } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

export default function BannerCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Banners", "Lists", "Create"]} />
      <div style={{ 
        padding: "24px", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh"
      }}>
        <Card 
          style={{ 
            maxWidth: "800px", 
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            border: "none"
          }}
        >
          <div style={{ padding: "24px" }}>
            <h2 style={{ 
              marginBottom: "24px", 
              color: "#1f2937",
              fontSize: "24px",
              fontWeight: "600",
              textAlign: "center"
            }}>
              Create New Banner
            </h2>
            
            <Form {...formProps} layout="vertical" form={formProps.form}>
              <Form.Item
                name={"title"}
                label={<span style={{ fontWeight: "500", color: "#374151" }}>Title</span>}
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginBottom: 20 }}
              >
                <Input 
                  size="large" 
                  style={{ 
                    borderRadius: "8px",
                    border: "2px solid #e5e7eb",
                    padding: "12px 16px"
                  }}
                  placeholder="Enter banner title"
                />
              </Form.Item>
              
              <Form.Item
                name={"subTitle"}
                label={<span style={{ fontWeight: "500", color: "#374151" }}>Description</span>}
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginBottom: 20 }}
              >
                <Input.TextArea 
                  size="large" 
                  rows={4}
                  style={{ 
                    borderRadius: "8px",
                    border: "2px solid #e5e7eb",
                    padding: "12px 16px"
                  }}
                  placeholder="Enter banner description"
                />
              </Form.Item>
              
              <ImageUploadField
                name="image"
                label="Banner Image"
                required={true}
                form={formProps.form}
                maxSize={5 * 1024 * 1024}
              />

              {/* Custom Action Buttons */}
              <div style={{ 
                display: "flex", 
                justifyContent: "flex-end", 
                gap: "12px",
                paddingTop: "24px",
                borderTop: "1px solid #e5e7eb"
              }}>
                <Button
                  size="large"
                  icon={<CloseOutlined />}
                  onClick={() => window.history.back()}
                  style={{
                    borderRadius: "8px",
                    border: "2px solid #e5e7eb",
                    color: "#6b7280",
                    fontWeight: "500",
                    padding: "8px 24px",
                    height: "auto"
                  }}
                >
                  Cancel
                </Button>
                <Button
                  {...saveButtonProps}
                  size="large"
                  icon={<SaveOutlined />}
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    color: "white",
                    fontWeight: "500",
                    padding: "8px 24px",
                    height: "auto",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  Create Banner
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
}

