"use client";
import React, { useState } from "react";
import {
  Button,
  ConfigProvider,
  Input,
  notification,
  Row,
  Col,
  Divider,
  Typography,
} from "antd";
import {
  ArrowRightOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  RocketOutlined,
  BookOutlined,
  UserOutlined,
  DashboardOutlined,
  FacebookFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  GithubFilled,
} from "@ant-design/icons";
import styles from "./footer.module.css";
import Link from "next/link";
import Image from "next/image";
import { THEME } from "@constants/constant";
import { useTranslation } from "@contexts/translation.context";
import { trackFormGoal } from "@lib/analytics";

const { Title, Text } = Typography;

type Props = {
  logoPath: string;
};
export const AppFooter: React.FC<Props> = ({ logoPath }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { t } = useTranslation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      api.warning({
        message: t("subscribe.invalid_title"),
        description: t("subscribe.invalid_email"),
        placement: "topRight",
      });
      return;
    }

    setLoading(true);
    try {
      const recaptchaToken = await (await import("@lib/recaptcha-client")).getRecaptchaToken("SUBSCRIBE");
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name: email.split("@")[0], recaptchaToken, recaptchaAction: "SUBSCRIBE" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to subscribe");
      }

      api.success({
        message: t("subscribe.success_title"),
        description: t("subscribe.success_message"),
        placement: "topRight",
        duration: 4,
      });
      trackFormGoal("newsletter_signup", { source: "footer" });
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      api.error({
        message: t("subscribe.error_title"),
        description:
          error instanceof Error ? error.message : t("subscribe.error_message"),
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <footer className={`section ${styles.section}`}>
        <div className="container bg-none">
          <Row gutter={[48, 48]} className={`${styles.content}`}>
            {}
            <Col
              xs={0}
              sm={0}
              md={0}
              lg={6}
              className={`${styles.content_group_logo}  d-none d-lg-block`}
            >
              <Image
                src={`${logoPath || "/"}logo-shadow-png.png`}
                className={styles.logo}
                height={90}
                width={160}
                quality={100}
                priority
                alt="CumiTech Logo"
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease",
                  marginBottom: "20px",
                }}
              />
              <Text
                className={styles.subheading}
                style={{ display: "block", marginBottom: "20px" }}
              >
                {t("footer.tagline")}
              </Text>

              {}
              <div className={`${styles.contactInfo} d-none d-lg-block`}>
                <div className={styles.contactItem}>
                  <MailOutlined className={styles.contactIcon} />
                  <a href="mailto:info@cumi.dev" className={styles.contactLink}>
                    info@cumi.dev
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <PhoneOutlined className={styles.contactIcon} />
                  <a href="tel:+237681289411" className={styles.contactLink}>
                    +237 681 289 411
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <EnvironmentOutlined className={styles.contactIcon} />
                  <Text className={styles.contactLink}>Douala, Cameroon</Text>
                </div>
              </div>

              {}
              <div
                className={styles.socialMedia}
                style={{ display: "flex", gap: "12px", marginTop: "20px" }}
              >
                <a
                  href="https://web.facebook.com/ayeahgodlove/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={styles.socialIcon}
                >
                  <FacebookFilled />
                </a>
                <a
                  href="https://twitter.com/GodloveAyeah"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className={styles.socialIcon}
                >
                  <TwitterSquareFilled />
                </a>
                <a
                  href="https://www.linkedin.com/in/ayeah-godlove-akoni-0820a0164/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={styles.socialIcon}
                >
                  <LinkedinFilled />
                </a>
                <a
                  href="https://github.com/ayeahgodlove"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={styles.socialIcon}
                >
                  <GithubFilled />
                </a>
              </div>
            </Col>

            {}
            <Col xs={12} sm={12} md={8} lg={4} className={styles.content_group}>
              <Title level={5} className={styles.footerTitle}>
                <RocketOutlined className={styles.titleIcon} />
                {t("footer.discover")}
              </Title>
              <Link href="/blog-posts">{t("nav.blog-posts")}</Link>
              <Link href="/tutorials">{t("nav.tutorials")}</Link>
              <Link href="/opportunities">{t("nav.opportunities")}</Link>
              <Link href="/recommendations">{t("nav.tools")}</Link>
              <Link href="/partners">{t("footer.partners")}</Link>
            </Col>

            {}
            <Col xs={12} sm={12} md={8} lg={4} className={styles.content_group}>
              <Title level={5} className={styles.footerTitle}>
                <BookOutlined className={styles.titleIcon} />
                {t("footer.info")}
              </Title>
              <Link href="/courses">{t("nav.courses")}</Link>
              <Link href="/events">{t("nav.events")}</Link>
              <Link href="/faqs">{t("footer.faqs")}</Link>
              <Link href="/terms-of-use">{t("footer.terms_of_use")}</Link>
              <Link href="/privacy-policy">{t("footer.privacy_policy")}</Link>
              <Link href="/cookie-policy">{t("footer.cookie_policy")}</Link>
            </Col>

            {}
            <Col
              xs={12}
              sm={12}
              md={8}
              lg={4}
              className={styles.content_group}
            >
              <Title level={5} className={styles.footerTitle}>
                <UserOutlined className={styles.titleIcon} />
                {t("footer.account")}
              </Title>
              <Link href="/login">{t("nav.login")}</Link>
              <Link href="/register">{t("footer.register")}</Link>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={12}
              lg={6}
              className={styles.content_group_waitlist}
              id="join_mailing"
            >
              <Title level={5} className={styles.footerTitle}>
                <MailOutlined className={styles.titleIcon} />
                {t("footer.join_mailing")}
              </Title>
              <Text
                className={styles.subheading}
                style={{ display: "block", marginBottom: "16px" }}
              >
                {t("footer.mailing_description")}
              </Text>
              <form onSubmit={handleSubscribe}>
                <Input
                  type="email"
                  placeholder={t("footer.email_placeholder")}
                  size="large"
                  prefix={<MailOutlined style={{ color: "#22C55E" }} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  style={{
                    borderRadius: "12px",
                    marginBottom: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  icon={<ArrowRightOutlined />}
                  aria-label={t("footer.subscribe_button")}
                  style={{
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                    border: "none",
                    fontWeight: 600,
                    height: "44px",
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  {t("footer.subscribe_button")}
                </Button>
              </form>
            </Col>
          </Row>
        </div>
      </footer>
    </>
  );
};
