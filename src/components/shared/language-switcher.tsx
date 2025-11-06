"use client";

import { Button, Dropdown, Space } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale) return;

setLoading(true);
    try {
      // Update the locale cookie
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      
      // Reload the page to apply the new locale
      window.location.reload();
    } catch (error) {
      console.error("Error changing language:", error);
    } finally {
      setLoading(false);
    }
  };

const menuItems = languages.map((lang) => ({
    key: lang.code,
    label: (
      <Space>
        <span>{lang.flag}</span>
        <span>{lang.name}</span>
      </Space>
    ),
    onClick: () => handleLanguageChange(lang.code),
  }));

return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={["click"]}
      disabled={loading}
    >
      <Button
        type="text"
        icon={<GlobalOutlined />}
        loading={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span>{currentLanguage.flag}</span>
        <span style={{ fontSize: "12px" }}>{currentLanguage.code.toUpperCase()}</span>
      </Button>
    </Dropdown>
  );
}
