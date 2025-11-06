"use client";
import { Avatar, Breadcrumb, Button, Typography } from "antd";
import Link from "next/link";
import React from "react";
import "./banner.scss";
import { BASE_URL } from "@constants/api-url";
import { MailOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useTranslation } from "@contexts/translation.context";

const { Title, Paragraph, Text } = Typography;
interface IBreadcrumb {
  label: string;
  uri: string;
}
type Props = {
  pageTitle: string;
  breadcrumbs: IBreadcrumb[];
};
const BannerComponent: React.FC<Props> = ({ pageTitle, breadcrumbs }) => {
  const { t } = useTranslation();

return (
    <>
      <div className="container-fluid mx-auto px-3 position-relative custom__banner">
        <div
          className="flex flex-column align-items-center justify-content-center text-center"
          style={{
            paddingTop: "120px",
            paddingBottom: "120px",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Title level={2} style={{ fontSize: '2.2rem', fontWeight: '600' }}>{pageTitle}</Title>
            <Paragraph className="text-black-50 fs-5 mb-4">
              {t('banner.subtitle')}
            </Paragraph>
          </motion.div>

<Breadcrumb
            style={{ display: "flex", justifyContent: "center" }}
            items={[
              {
                title: <Link href="/">{t('banner.home')}</Link>,
              },
              ...breadcrumbs.map((b, index) => {
                return {
                  title: (
                    <Link
                      href={`/${b.uri}`}
                      key={index}
                      className="text-capitalize"
                    >
                      {b.label}
                    </Link>
                  ),
                };
              }),
            ]}
          />

<div className="d-flex justify-content-center gap-3 mt-5">
            <Button
              type="primary"
              size="large"
              className="cumi-button-primary"
              icon={<WhatsAppOutlined />}
              href="https://wa.me/237681289411"
              target="_blank"
            >
              {t('banner.get_started')}
            </Button>
            <Button
              size="large"
              className="cumi-gradient-border text-black"
              icon={<MailOutlined />}
              href="mailto:info@cumi.dev"
            >
              {t('banner.contact-us')}
            </Button>
          </div>
        </div>
        <div className="banner-theme">
          <Avatar
            className="position-absolute top-0 start-0 top-circle"
            size={50}
            src={`/img/banner/ellipse-3.png`}
          />
          <Avatar
            className="position-absolute top-0 end-0 top-circle"
            size={50}
            src={`/img/banner/ellipse-4.png`}
          />
          <Avatar
            className="position-absolute top-50 start-50 top-circle"
            size={25}
            src={`/img/banner/round.png`}
          />
          <Avatar
            className="position-absolute bottom-50 end-50 top-circle"
            size={25}
            src={`/img/banner/round2.png`}
          />
          {}
          <Avatar
            className="position-absolute top-50 start-50 translate-middle-y top-circle"
            size={25}
            src={`/img/banner/circle.png`}
          />
          <Avatar
            className="position-absolute bottom-50 end-50 translate-middle-x top-circle"
            size={25}
            src={`/img/banner/circle.png`}
          />
          {}
          <Avatar
            className="position-absolute bottom-0 start-0 bottom-circle"
            size={70}
            src={`/img/banner/ellipse-1.png`}
          />
          <Avatar
            className="position-absolute bottom-0 end-0 bottom-circle"
            size={70}
            src={`/img/banner/ellipse-2.png`}
          />
        </div>
      </div>
    </>
  );
};

export default BannerComponent;
