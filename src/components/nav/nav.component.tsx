"use client";

import { Affix, Button, Dropdown, Avatar, Space } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useCallback, useEffect } from "react";
import { LanguageSelector, useTranslation } from "@contexts/translation.context";

type Props = {
  logoPath: string;
};
export const AppNav: React.FC<Props> = ({ logoPath }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();

// Fix hydration mismatch - only use Affix on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

const handleLogout = useCallback(async () => {
    setIsNavigating(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsNavigating(false);
    }
  }, []);

const handleNavigation = useCallback((href: string) => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 1000);
  }, []);

const getLinkStyle = (path: string) => ({
    color: pathname === path ? "#22C55E" : "#4b5563",
    fontWeight: pathname === path ? "600" : "500",
    letterSpacing: "0.3px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative" as const,
    background: pathname === path 
      ? "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)" 
      : "transparent",
  });

const getLinkClassName = (path: string) => 
    `nav-link ${pathname === path ? " active fw-bold" : ""}`;

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
          <div style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "0.3px", color: "#1f2937" }}>
            {session?.user?.name || session?.user?.email || t('nav.user')}
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
    ...(session?.user?.role !== 'user' ? [{
      key: "dashboard",
      icon: <DashboardOutlined style={{ fontSize: "16px", color: "#22C55E" }} />,
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
          {t('nav.dashboard')}
        </Link>
      ),
    }] : []),
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
          {t('nav.settings')}
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
        <span style={{ 
          fontWeight: "500",
          letterSpacing: "0.3px",
          fontSize: "14px",
          color: "#ef4444"
        }}>
          {t('nav.logout')}
        </span>
      ),
      onClick: handleLogout,
      danger: true,
    },
  ];

const navContent = (
      <nav 
        className="navbar navbar-expand-lg navbar-full-width" 
        style={{ 
          background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          // borderBottom: "3px solid transparent",
          borderImage: "linear-gradient(90deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%) 1",
          borderImageSlice: "0 0 1 0",
          transition: "all 0.3s ease",
          position: "relative",
        }}
      >
        <div className="container-fluid bg-none" style={{ 
          width: "100%", 
          maxWidth: "none", 
          padding: "8px 16px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap"
          }}>
            <Link href={"/"} style={{ flexShrink: 0, order: 1 }}>
              <Image
                src={`${logoPath || '/'}cumi-green.jpg`}
                height={60}
                width={120}
                quality={100}
                alt="CumiTech Logo"
                priority
                style={{ 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{ flexShrink: 0, order: 2, marginLeft: 'auto' }}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ overflow: "hidden" }}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ 
              gap: "4px",
              flexWrap: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname === "/" ? "active fw-bold" : ""}`}
                  style={{
                    color: pathname === "/" ? "#22C55E" : "#4b5563",
                    fontWeight: pathname === "/" ? "600" : "500",
                    letterSpacing: "0.3px",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    whiteSpace: "nowrap",
                    fontSize: "15px",
                    background: pathname === "/" 
                      ? "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)" 
                      : "transparent",
                    border: pathname === "/" ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid transparent",
                  }}
                  aria-current="page"
                  href="/"
                  onMouseEnter={(e) => {
                    if (pathname !== "/") {
                      e.currentTarget.style.background = "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)";
                      e.currentTarget.style.color = "#22C55E";
                      e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.2)";
                      e.currentTarget.style.transform = "translateX(2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== "/") {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#4b5563";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }
                  }}
                >
                  {t('nav.welcome')}
                </Link>
              </li>
              {[
                { path: "/our_services", label: t('nav.services') },
                { path: "/projects", label: t('nav.projects') },
                { path: "/blog_posts", label: t('nav.blog_posts') },
                { path: "/opportunities", label: t('nav.opportunities') },
                { path: "/events", label: t('nav.events') },
                { path: "/courses", label: t('nav.courses') },
                { path: "/mobile-app", label: t('nav.mobile_app') },
                { path: "/about_us", label: t('nav.about_us') },
                { path: "/contact_us", label: t('nav.contact_us') },
              ].map(({ path, label }) => (
                <li className="nav-item" key={path}>
                  <Link
                    className={getLinkClassName(path)}
                    style={{
                      ...getLinkStyle(path),
                      padding: "8px 16px",
                      borderRadius: "10px",
                      whiteSpace: "nowrap",
                      fontSize: "15px",
                      border: pathname === path ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid transparent",
                    }}
                    href={path}
                    onMouseEnter={(e) => {
                      if (pathname !== path) {
                        e.currentTarget.style.background = "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)";
                        e.currentTarget.style.color = "#22C55E";
                        e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.2)";
                        e.currentTarget.style.transform = "translateX(2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pathname !== path) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#4b5563";
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.transform = "translateX(0)";
                      }
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="d-flex flex-sm-column flex-md-row align-items-center" style={{ flexShrink: 0 }}>
              <Space size="small">
                <LanguageSelector />
                {status === "loading" ? (
                  <Button 
                    loading 
                    size="large" 
                    shape="round"
                    style={{
                      fontWeight: "500",
                      letterSpacing: "0.3px",
                      height: "42px",
                      padding: "0 24px",
                    }}
                  >
                    {t('common.loading')}
                  </Button>
                ) : session ? (
                  <Dropdown
                    menu={{ 
                      items: userMenuItems,
                      style: {
                        borderRadius: "10px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        padding: "4px",
                        minWidth: "200px"
                      }
                    }}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                  >
                    <Space 
                      className="cursor-pointer"
                      style={{
                        padding: "6px 12px",
                        borderRadius: "12px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
                        border: "1px solid rgba(34, 197, 94, 0.15)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #dcfce7 0%, #cffafe 100%)";
                        e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.3)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)";
                        e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.15)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Avatar
                        size={44}
                        src={session.user?.image}
                        icon={<UserOutlined />}
                        style={{ 
                          background: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)"
                        }}
                      />
                    </Space>
                  </Dropdown>
                ) : (
                  <Button
                    className="primary-btn"
                    shape="round"
                    href="/login"
                    size="large"
                    style={{
                      background: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                      border: "none",
                      color: "white",
                      fontWeight: "600",
                      letterSpacing: "0.3px",
                      height: "44px",
                      padding: "0 32px",
                      boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(34, 197, 94, 0.4)";
                      e.currentTarget.style.background = "linear-gradient(135deg, #16a34a 0%, #0d9488 100%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.3)";
                      e.currentTarget.style.background = "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)";
                    }}
                  >
                    {t('nav.login')}
                  </Button>
                )}
              </Space>
            </div>
          </div>
        </div>
      </nav>
  );

// Only use Affix on client to prevent hydration mismatch
  return isMounted ? <Affix offsetTop={0}>{navContent}</Affix> : navContent;
};
