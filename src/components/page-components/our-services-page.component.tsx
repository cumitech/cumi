"use client";
import Image from "next/image";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { Row, Col, Typography, Card } from "antd";
import "swiper/css";
import { motion } from "framer-motion";
import {
  RocketOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "@contexts/translation.context";
import { AppCTA } from "@components/CTA.component";
import { ServicesSection } from "@components/services/services-section.component";

const { Title, Paragraph, Text } = Typography;

export default function OurServicesPageComponent() {
  const { t } = useTranslation();

const features = [
    {
      icon: <RocketOutlined />,
      title: t("services.fast_delivery"),
      description: t("services.fast_description"),
    },
    {
      icon: <BulbOutlined />,
      title: t("services.innovative_solutions"),
      description: t("services.innovative_description"),
    },
    {
      icon: <ThunderboltOutlined />,
      title: t("services.performance_focused"),
      description: t("services.performance_description"),
    },
    {
      icon: <HeartOutlined />,
      title: t("services.client_centric"),
      description: t("services.client_description"),
    },
  ];

const benefits = [
    t("services.support_24_7"),
    t("services.scalable_solutions"),
    t("services.modern_tech"),
    t("services.seo_optimized"),
    t("services.mobile_responsive"),
    t("services.security_first"),
  ];

return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

<BannerComponent
        breadcrumbs={[{ label: t("nav.services"), uri: "our-services" }]}
        pageTitle={t("nav.services")}
      />

{}
      <section className="py-5">
        <div className="container">
          <Row justify="center" className="mb-5">
            <Col xs={24} lg={16} className="text-center">
              <Title level={2} className="mb-3">
                {t("services.why_choose")}
              </Title>
              <Paragraph className="fs-5 text-muted">
                {t("services.why_description")}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className="h-100 text-center border-0 shadow-sm"
                    hoverable
                    style={{
                      transition: "all 0.3s ease",
                      borderRadius: "12px",
                    }}
                    styles={{
                      body: {
                        padding: "2rem 1.5rem",
                      },
                    }}
                  >
                    <div
                      className="text-primary mb-3"
                      style={{ fontSize: "2.5rem" }}
                    >
                      {feature.icon}
                    </div>
                    <Title level={4} className="mb-3">
                      {feature.title}
                    </Title>
                    <Paragraph className="text-muted">
                      {feature.description}
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

{}
      <section className="py-5">
        <div className="container">
          <Row justify="center" align="middle">
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Title level={2} className="mb-4">
                  {t("services.what_you_get")}
                </Title>
                <Paragraph className="fs-5 text-muted mb-4">
                  {t("services.benefits_description")}
                </Paragraph>
                <Row gutter={[16, 16]}>
                  {benefits.map((benefit, index) => (
                    <Col xs={24} sm={12} key={index}>
                      <div className="d-flex align-items-center">
                        <CheckCircleOutlined
                          className="text-success me-3"
                          style={{ fontSize: "1.2rem" }}
                        />
                        <Text strong>{benefit}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div style={{ position: 'relative', width: '100%', height: 350 }}>
                  <Image
                    className="rounded-3"
                    fill
                    src="/img/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg"
                    alt="CUMI professional services showcase"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

{}
      <ServicesSection />
      {}
      <AppCTA />

<AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
