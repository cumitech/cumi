"use client";
import { Dropdown, Avatar, Space, Tooltip, Drawer } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BulbOutlined,
  SunOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  LanguageSelector,
  useTranslation,
} from "@contexts/translation.context";
import { ColorModeContext } from "@contexts/color-mode";
import { getBaseUrl } from "@utils/get-base-url";

type Props = {
  logoPath: string;
};
export const AppNav: React.FC<Props> = ({ logoPath }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const { t } = useTranslation();
  const { mode, setMode } = useContext(ColorModeContext);
  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {}, [session]);

  const handleLogout = useCallback(async () => {
    setIsNavigating(true);
    try {
      const baseUrl = getBaseUrl();
      await signOut({ callbackUrl: `${baseUrl}/` });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsNavigating(false);
    }
  }, []);

  const primaryLinks: Array<
    | { path: string; label: string }
    | { type: "dropdown"; label: string; children: Array<{ path: string; label: string }> }
  > = [
    { path: "/", label: t("nav.welcome") },
    { path: "/our-services", label: t("nav.services") },
    { path: "/blog-posts", label: t("nav.blog-posts") },
    { path: "/projects", label: t("nav.our_work") },
    {
      type: "dropdown",
      label: t("nav.our_company"),
      children: [
        { path: "/about-us", label: t("nav.about-us") },
        { path: "/partners", label: t("nav.partners") },
        { path: "/our-team", label: t("nav.our_team") },
      ],
    },
    { path: "/contact-us", label: t("nav.contact-us") },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const userMenuItems = [
    {
      key: "username",
      label: (
        <div
          style={{
            padding: "14px 18px",
            fontWeight: "600",
            color: "#22C55E",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              fontWeight: "600",
              letterSpacing: "0.3px",
              color: "#1f2937",
            }}
          >
            {session?.user?.name || session?.user?.email || t("nav.user")}
          </div>
          {session?.user?.role && (
            <div
              style={{
                fontSize: "12px",
                color: "#22C55E",
                fontWeight: "600",
                textTransform: "uppercase",
                marginTop: "6px",
                padding: "2px 8px",
                background: "rgba(34, 197, 94, 0.1)",
                borderRadius: "6px",
                display: "inline-block",
              }}
            >
              {session.user.role}
            </div>
          )}
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider" as const,
    },
    // Only show dashboard link for non-user roles
    ...(session?.user?.role !== "user"
      ? [
          {
            key: "dashboard",
            icon: (
              <DashboardOutlined
                style={{ fontSize: "16px", color: "#22C55E" }}
              />
            ),
            label: (
              <Link
                href="/dashboard"
                style={{
                  fontWeight: "500",
                  letterSpacing: "0.3px",
                  fontSize: "14px",
                  color: "#4b5563",
                }}
              >
                {t("nav.dashboard")}
              </Link>
            ),
          },
        ]
      : []),
    {
      key: "settings",
      icon: <SettingOutlined style={{ fontSize: "16px", color: "#14B8A6" }} />,
      label: (
        <Link
          href="/dashboard/settings"
          style={{
            fontWeight: "500",
            letterSpacing: "0.3px",
            fontSize: "14px",
            color: "#4b5563",
          }}
        >
          {t("nav.settings")}
        </Link>
      ),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: "16px", color: "#ef4444" }} />,
      label: (
        <span
          style={{
            fontWeight: "500",
            letterSpacing: "0.3px",
            fontSize: "14px",
            color: "#ef4444",
          }}
        >
          {t("nav.logout")}
        </span>
      ),
      onClick: handleLogout,
      danger: true,
    },
  ];

  const navContent = (
    <header className="cumi-header-sticky">
      <div className="cumi-topbar">
        <div className="cumi-topbar-inner">
          <div className="cumi-topbar-text">
            <span className="cumi-topbar-item">
              <EnvironmentOutlined /> Bamenda, Cameroon
            </span>
            <span className="cumi-topbar-item">
              <PhoneOutlined /> +237 681 289 411
            </span>
            <span className="cumi-topbar-item">
              <MailOutlined /> <a href="mailto:info@cumi.dev">info@cumi.dev</a>
            </span>
          </div>
        </div>
      </div>

      <div className="app-nav cumi-main-nav">
        <div className="cumi-main-nav-inner">
          <Link href="/" className="cumi-nav-logo">
            <Image
              src={`${logoPath || "/"}logo-shadow-png.png`}
              height={64}
              width={180}
              quality={100}
              alt="CUMI Logo"
              priority
            />
          </Link>

          <nav className="cumi-nav-links cumi-nav-links-desktop">
            {primaryLinks.map((item, idx) =>
              "type" in item && item.type === "dropdown" ? (
                <Dropdown
                  key={idx}
                  open={companyDropdownOpen}
                  onOpenChange={setCompanyDropdownOpen}
                  trigger={["hover", "click"]}
                  placement="bottom"
                  overlayClassName="cumi-company-dropdown"
                  arrow={{ pointAtCenter: true }}
                  menu={{
                    items: item.children.map(({ path, label }) => ({
                      key: path,
                      label: (
                        <Link
                          href={path}
                          onClick={() => {
                            handleNavClick();
                            setCompanyDropdownOpen(false);
                          }}
                          className="cumi-company-dropdown-link"
                        >
                          {label}
                        </Link>
                      ),
                    })),
                  }}
                >
                  <span
                    role="button"
                    tabIndex={0}
                    aria-haspopup="menu"
                    aria-expanded={companyDropdownOpen}
                    className={`cumi-nav-link cumi-nav-link-dropdown-trigger ${
                      item.children.some((c) => pathname === c.path)
                        ? "cumi-nav-link-active"
                        : ""
                    } ${companyDropdownOpen ? "cumi-nav-dropdown-open" : ""}`}
                  >
                    <span>{item.label}</span>
                    <DownOutlined className="cumi-nav-dropdown-chevron" />
                  </span>
                </Dropdown>
              ) : (
                <Link
                  key={"path" in item ? item.path : idx}
                  href={"path" in item ? item.path : "#"}
                  className={`cumi-nav-link ${
                    pathname === ("path" in item ? item.path : "") ? "cumi-nav-link-active" : ""
                  }`}
                  onClick={handleNavClick}
                >
                  {"path" in item ? item.label : ""}
                </Link>
              )
            )}
          </nav>

          <div className="cumi-nav-actions cumi-nav-actions-desktop">
            <Space size="small" align="center">
              <LanguageSelector />
              <Tooltip
                title={
                  mode === "dark" ? t("nav.theme_light") : t("nav.theme_dark")
                }
              >
                <span
                  role="button"
                  tabIndex={0}
                  onClick={toggleTheme}
                  onKeyDown={(e) => e.key === "Enter" && toggleTheme()}
                  className="cumi-nav-theme-toggle"
                  aria-label={
                    mode === "dark" ? t("nav.theme_light") : t("nav.theme_dark")
                  }
                >
                  {mode === "dark" ? (
                    <SunOutlined style={{ fontSize: 18 }} />
                  ) : (
                    <BulbOutlined style={{ fontSize: 18 }} />
                  )}
                </span>
              </Tooltip>
              {status === "loading" ? (
                <span className="cumi-nav-loading">{t("common.loading")}</span>
              ) : session ? (
                <Dropdown
                  menu={{
                    items: userMenuItems,
                    style: {
                      borderRadius: 10,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                      padding: 4,
                      minWidth: 220,
                    },
                  }}
                  placement="bottomRight"
                  arrow={{ pointAtCenter: true }}
                >
                  <Space className="cumi-nav-userpill">
                    <Avatar
                      size={40}
                      src={session.user?.image}
                      icon={<UserOutlined />}
                    />
                  </Space>
                </Dropdown>
              ) : (
                <Link href="/login" className="cumi-nav-login">
                  {t("nav.login")}
                </Link>
              )}
            </Space>
          </div>

          <button
            type="button"
            className="cumi-nav-hamburger"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MenuOutlined />
          </button>
        </div>
      </div>

      <Drawer
        placement="right"
        width={280}
        closable
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        className="cumi-nav-drawer"
        zIndex={1600}
        styles={{
          body: {
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          },
        }}
      >
        <nav className="cumi-nav-links-mobile">
          {primaryLinks.map((item, idx) =>
            "type" in item && item.type === "dropdown" ? (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, padding: "4px 0" }}>
                  {item.label}
                </span>
                {item.children.map(({ path, label }) => (
                  <Link
                    key={path}
                    href={path}
                    className={`cumi-nav-link ${
                      pathname === path ? "cumi-nav-link-active" : ""
                    }`}
                    style={{ paddingLeft: 16 }}
                    onClick={handleNavClick}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={"path" in item ? item.path : idx}
                href={"path" in item ? item.path : "#"}
                className={`cumi-nav-link ${
                  pathname === ("path" in item ? item.path : "") ? "cumi-nav-link-active" : ""
                }`}
                onClick={handleNavClick}
              >
                {"path" in item ? item.label : ""}
              </Link>
            )
          )}
        </nav>

        <div className="cumi-nav-drawer-footer">
          <Space size="middle" align="center">
            <LanguageSelector />
            <Tooltip
              title={
                mode === "dark" ? t("nav.theme_light") : t("nav.theme_dark")
              }
            >
              <span
                role="button"
                tabIndex={0}
                onClick={toggleTheme}
                onKeyDown={(e) => e.key === "Enter" && toggleTheme()}
                className="cumi-nav-theme-toggle"
                aria-label={
                  mode === "dark" ? t("nav.theme_light") : t("nav.theme_dark")
                }
              >
                {mode === "dark" ? (
                  <SunOutlined style={{ fontSize: 18 }} />
                ) : (
                  <BulbOutlined style={{ fontSize: 18 }} />
                )}
              </span>
            </Tooltip>
            {status === "loading" ? (
              <span className="cumi-nav-loading">{t("common.loading")}</span>
            ) : session ? (
              <Dropdown
                menu={{
                  items: userMenuItems,
                  style: {
                    borderRadius: 10,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    padding: 4,
                    minWidth: 220,
                  },
                }}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <Space className="cumi-nav-userpill">
                  <Avatar
                    size={40}
                    src={session.user?.image}
                    icon={<UserOutlined />}
                  />
                </Space>
              </Dropdown>
            ) : (
              <Link
                href="/login"
                className="cumi-nav-login"
                onClick={handleNavClick}
              >
                {t("nav.login")}
              </Link>
            )}
          </Space>
        </div>
      </Drawer>
    </header>
  );

  return navContent;
};
