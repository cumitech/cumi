"use client";

import React, { useRef, useState, useEffect } from "react";
import { Card, Spin, Typography, Button, Carousel } from "antd";
import {
  RocketOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useTranslation } from "@contexts/translation.context";
import { serviceAPI } from "@store/api/service_api";
import Link from "next/link";
import type { CarouselRef } from "antd/es/carousel";

const { Title, Text, Paragraph } = Typography;

interface IServicesSectionProps {
  showViewAllButton?: boolean;
  showContainer?: boolean;
}

export const ServicesSection: React.FC<IServicesSectionProps> = ({
  showViewAllButton = false,
  showContainer = false,
}) => {
  const { t } = useTranslation();
  const { data: servicesData, isLoading } =
    serviceAPI.useFetchAllServicesQuery(1);
  const services = (servicesData as any)?.data || servicesData || [];
  const carouselRef = useRef<CarouselRef>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992); // <992px = mobile/tablet (show 1 card)
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
        <div style={{ marginTop: "16px", fontSize: "16px", color: "#666" }}>
          {t("common.loading")}
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  // Group services based on screen size: 1 for mobile/tablet (<992px), 3 for desktop (≥992px)
  const servicesPerSlide = isMobile ? 1 : 3;
  const serviceSlides = [];
  for (let i = 0; i < services.length; i += servicesPerSlide) {
    serviceSlides.push(services.slice(i, i + servicesPerSlide));
  }

  const handlePrev = () => carouselRef.current?.prev();
  const handleNext = () => carouselRef.current?.next();

  return (
    <section
      style={{
        padding: "80px 0",
        background: "linear-gradient(135deg, #f8fafb 0%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "-200px",
          width: "600px",
          height: "600px",
          //   background: "radial-gradient(circle, rgba(32,178,170,0.04) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        className={`container bg-none`}
        style={{ position: "relative", zIndex: 1 }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <Title
            level={2}
            style={{
              fontSize: "42px",
              fontWeight: "700",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #20b2aa 0%, #17a2b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.5px",
            }}
          >
            {t("services_section.title")}
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              color: "#666",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.8",
              fontWeight: "400",
            }}
          >
            {t("services_section.subtitle")}
          </Paragraph>
        </div>

        <div
          style={{
            position: "relative",
            padding: isMobile ? "0 32px" : "0 60px",
          }}
        >
          {serviceSlides.length > 1 && (
            <>
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={handlePrev}
                style={{
                  position: "absolute",
                  left: isMobile ? "-8px" : "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: isMobile ? "36px" : "48px",
                  height: isMobile ? "36px" : "48px",
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "14px" : "18px",
                  color: "#20b2aa",
                  border: "2px solid #e8e8e8",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#20b2aa";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "#20b2aa";
                  e.currentTarget.style.transform =
                    "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#20b2aa";
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              />
              <Button
                type="text"
                icon={<RightOutlined />}
                onClick={handleNext}
                style={{
                  position: "absolute",
                  right: isMobile ? "-8px" : "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: isMobile ? "36px" : "48px",
                  height: isMobile ? "36px" : "48px",
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "14px" : "18px",
                  color: "#20b2aa",
                  border: "2px solid #e8e8e8",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#20b2aa";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "#20b2aa";
                  e.currentTarget.style.transform =
                    "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#20b2aa";
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              />
            </>
          )}

          {}
          <Carousel
            ref={carouselRef}
            dots={false}
            // dotPosition="bottom"
            autoplay
            autoplaySpeed={4000}
            speed={800}
            swipeToSlide
            draggable
            style={{ padding: "20px 0 40px 0" }}
          >
            {serviceSlides.map((slide, slideIndex) => (
              <div key={slideIndex}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                    gap: isMobile ? "16px" : "32px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: isMobile ? "5px" : "0",
                  }}
                >
                  {slide.map((service: any) => (
                    <Card
                      key={service.id}
                      hoverable
                      style={{
                        borderRadius: "24px",
                        border: "2px solid #f0f0f0",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        overflow: "hidden",
                        background: "white",
                        height: "100%",
                      }}
                      styles={{
                        body: {
                          padding: "0",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        },
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-16px)";
                        e.currentTarget.style.boxShadow =
                          "0 16px 40px rgba(32,178,170,0.2)";
                        e.currentTarget.style.borderColor = "#20b2aa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 20px rgba(0,0,0,0.08)";
                        e.currentTarget.style.borderColor = "#f0f0f0";
                      }}
                    >
                      {}
                      {service.imageUrl && (
                        <div
                          style={{
                            width: "100%",
                            height: "200px",
                            position: "relative",
                            overflow: "hidden",
                            background:
                              "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                          }}
                        >
                          <Image
                            src={service.imageUrl}
                            alt={service.title}
                            fill
                            sizes="400px"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "16px",
                              right: "16px",
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              background: "rgba(32,178,170,0.95)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            }}
                          >
                            <RocketOutlined
                              style={{ fontSize: "20px", color: "white" }}
                            />
                          </div>
                        </div>
                      )}

                      {}
                      <div
                        style={{
                          padding: "28px 24px",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Title
                          level={4}
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#333",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {service.title}
                        </Title>
                        <Paragraph
                          ellipsis={{ rows: 3 }}
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            margin: "0 0 20px 0",
                            lineHeight: "1.7",
                            minHeight: "63px",
                          }}
                        >
                          {service.description}
                        </Paragraph>

                        {}
                        {service.items && (
                          <div style={{ marginBottom: "20px" }}>
                            {(Array.isArray(service.items)
                              ? service.items
                              : JSON.parse(service.items || "[]")
                            )
                              .slice(0, 3)
                              .map((item: string, idx: number) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "8px",
                                    fontSize: "13px",
                                    color: "#555",
                                  }}
                                >
                                  <CheckCircleOutlined
                                    style={{
                                      color: "#20b2aa",
                                      fontSize: "14px",
                                    }}
                                  />
                                  <span style={{ fontWeight: "500" }}>
                                    {item}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}

                        {}
                        <Link
                          href={`/our-services/${service.slug}`}
                          style={{ marginTop: "auto" }}
                        >
                          <Button
                            type="primary"
                            block
                            shape="round"
                            style={{
                              background:
                                "linear-gradient(135deg, #20b2aa 0%, #17a2b8 100%)",
                              border: "none",
                              color: "white",
                              fontWeight: "500",
                              fontSize: "14px",
                              height: "40px",
                              boxShadow: "0 2px 8px rgba(32,178,170,0.25)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(32,178,170,0.35)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(32,178,170,0.25)";
                            }}
                          >
                            {t("services_section.learn_more")}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {showViewAllButton && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <Link href="/our-services">
              <Button
                size="large"
                shape="round"
                icon={<RocketOutlined />}
                style={{
                  background:
                    "linear-gradient(135deg, #20b2aa 0%, #17a2b8 100%)",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  padding: "0 40px",
                  height: "52px",
                  fontSize: "16px",
                  boxShadow: "0 4px 16px rgba(32,178,170,0.3)",
                  letterSpacing: "0.5px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(32,178,170,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(32,178,170,0.3)";
                }}
              >
                {t("services_section.view_all")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
