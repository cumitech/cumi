"use client";

import { Avatar, Button, Dropdown, Space, Typography } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined, DashboardOutlined } from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getBaseUrl } from "@utils/get-base-url";

const { Text } = Typography;

export default function UserProfileDropdown() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

const handleLogout = async () => {
    setLoading(true);
    try {
      const baseUrl = getBaseUrl();
      await signOut({ 
        callbackUrl: `${baseUrl}/login`,
        redirect: true 
      });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

const handleDashboard = () => {
    router.push("/dashboard");
  };

const handleSettings = () => {
    router.push("/dashboard/settings");
  };

const menuItems = [
    {
      key: "profile",
      label: (
        <Space direction="vertical" size={0}>
          <Text strong>{session?.user?.name || "User"}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {session?.user?.email}
          </Text>
        </Space>
      ),
      disabled: true,
    },
    {
      type: "divider" as const,
    },
    {
      key: "dashboard",
      label: (
        <Space>
          <DashboardOutlined />
          <span>Dashboard</span>
        </Space>
      ),
      onClick: handleDashboard,
    },
    {
      key: "settings",
      label: (
        <Space>
          <SettingOutlined />
          <span>Settings</span>
        </Space>
      ),
      onClick: handleSettings,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: (
        <Space>
          <LogoutOutlined />
          <span>Logout</span>
        </Space>
      ),
      onClick: handleLogout,
      danger: true,
    },
  ];

return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={["click"]}
      disabled={loading}
    >
      <Button
        type="text"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 8px",
          height: "auto",
        }}
        loading={loading}
      >
        <Avatar
          size="small"
          src={session?.user?.image}
          icon={<UserOutlined />}
        />
        <Text style={{ fontSize: "14px" }}>
          {session?.user?.name || "User"}
        </Text>
      </Button>
    </Dropdown>
  );
}
