"use client";
import React, { useState } from "react";
import { Select, Button, Space, Typography, Card, message } from "antd";
import { SwapOutlined, UserOutlined, CrownOutlined, BookOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@contexts/translation.context";

const { Text } = Typography;
const { Option } = Select;

interface RoleSwitcherProps {
  currentRole: string;
  onRoleChange?: (newRole: string) => void;
  showLabel?: boolean;
  size?: "small" | "middle" | "large";
}

const roleConfig = {
  admin: {
    label: "Administrator",
    icon: <CrownOutlined />,
    color: "#ff4d4f",
    description: "Full system access and management"
  },
  creator: {
    label: "Content Creator",
    icon: <UserOutlined />,
    color: "#1890ff",
    description: "Create and manage educational content"
  },
  student: {
    label: "Student",
    icon: <BookOutlined />,
    color: "#52c41a",
    description: "Access courses and learning materials"
  }
};

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  showLabel = true,
  size = "middle"
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return;

    setLoading(true);
    try {
      // Update session with new role
      await update({
        ...session,
        user: {
          ...session?.user,
          role: newRole
        }
      });

      // Navigate to appropriate dashboard
      const dashboardRoutes = {
        admin: "/dashboard",
        creator: "/dashboard/creator",
        student: "/dashboard/student"
      };

      const targetRoute = dashboardRoutes[newRole as keyof typeof dashboardRoutes];
      if (targetRoute) {
        router.push(targetRoute);
        message.success(`Switched to ${roleConfig[newRole as keyof typeof roleConfig].label} view`);
      }

      // Call custom handler if provided
      if (onRoleChange) {
        onRoleChange(newRole);
      }
    } catch (error) {
      console.error("Error switching role:", error);
      message.error("Failed to switch role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentRoleConfig = roleConfig[currentRole as keyof typeof roleConfig];

  return (
    <Card 
      size="small" 
      style={{ 
        marginBottom: 16,
        background: "linear-gradient(135deg, #f8fafb 0%, #ffffff 100%)",
        border: "1px solid #e8e8e8"
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {showLabel && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SwapOutlined style={{ color: "#666" }} />
            <Text strong style={{ fontSize: "14px" }}>Role Switcher</Text>
          </div>
        )}
        
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <div style={{ 
              color: currentRoleConfig?.color || "#666",
              fontSize: "16px"
            }}>
              {currentRoleConfig?.icon}
            </div>
            <div>
              <Text strong style={{ fontSize: "14px" }}>
                {currentRoleConfig?.label || "Unknown Role"}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {currentRoleConfig?.description || "No description available"}
              </Text>
            </div>
          </div>
          
          <Select
            value={currentRole}
            onChange={handleRoleChange}
            loading={loading}
            size={size}
            style={{ minWidth: 140 }}
            suffixIcon={<SwapOutlined />}
          >
            {Object.entries(roleConfig).map(([role, config]) => (
              <Option key={role} value={role}>
                <Space>
                  <span style={{ color: config.color }}>
                    {config.icon}
                  </span>
                  <span>{config.label}</span>
                </Space>
              </Option>
            ))}
          </Select>
        </div>
      </Space>
    </Card>
  );
};

export default RoleSwitcher;
