"use client";

import React, { useRef, useState, useEffect } from "react";
import { Card, Spin, Typography, Button, Carousel } from "antd";
import { GlobalOutlined, PhoneOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useTranslation } from "@contexts/translation.context";
import { useGetAllPartnersQuery } from "@store/api/partner_api";
import Link from "next/link";
import type { CarouselRef } from "antd/es/carousel";

const { Title, Text, Paragraph } = Typography;

export const PartnersSection = () => {
  const { t } = useTranslation();
  const { data: partners = [], isLoading } = useGetAllPartnersQuery();
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

  if (!isLoading && (!partners || partners.length === 0)) {
    return null;
  }

  // Group partners based on screen size: 1 for mobile/tablet (<992px), 4 for desktop (≥992px)
  const partnersPerSlide = isMobile ? 1 : 4;
  const partnerSlides = [];
  for (let i = 0; i < partners.length; i += partnersPerSlide) {
    partnerSlides.push(partners.slice(i, i + partnersPerSlide));
  }

const handlePrev = () => carouselRef.current?.prev();
  const handleNext = () => carouselRef.current?.next();

return (
    <section
      style={{
        padding: "80px 0",
        // background: "linear-gradient(180deg, #ffffff 0%, #f8fafb 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(32,178,170,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(32,178,170,0.03) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

<div className="container" style={{ position: "relative", zIndex: 1 }}>
        {}
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
            {t('partners.title')}
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
            {t('partners.subtitle')}
          </Paragraph>
        </div>

{}
        <div style={{ 
          position: "relative", 
          padding: isMobile ? "0 32px" : "0 60px"
        }}>
          {}
          {partnerSlides.length > 1 && (
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
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
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
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
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
            autoplay
            autoplaySpeed={5000}
            speed={800}
            swipeToSlide
            draggable
            style={{ padding: "20px 0 40px 0" }}
          >
            {partnerSlides.map((slide, slideIndex) => (
              <div key={slideIndex}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
                    gap: isMobile ? "16px" : "32px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: isMobile ? "5px" : "0",
                  }}
                >
                  {slide.map((partner) => (
                    <Card
                      key={partner.id}
                      hoverable
                      style={{
                        borderRadius: "20px",
                        border: "2px solid #f0f0f0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        overflow: "hidden",
                        background: "white",
                        height: "100%",
                      }}
                      styles={{
                        body: {
                          padding: "32px 24px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "20px",
                          minHeight: "200px",
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(32,178,170,0.2)";
                        e.currentTarget.style.borderColor = "#20b2aa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                        e.currentTarget.style.borderColor = "#f0f0f0";
                      }}
                    >
                      {}
                      <div
                        style={{
                          width: "140px",
                          height: "140px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "24px",
                          border: "4px solid #20b2aa",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: "0 4px 16px rgba(32,178,170,0.15)",
                        }}
                      >
                        {partner.logo ? (
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              padding: "8px",
                            }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/favicon.svg";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              fontSize: "48px",
                              fontWeight: "700",
                              color: "#20b2aa",
                            }}
                          >
                            {partner.name.charAt(0)}
                          </div>
                        )}
                      </div>

{}
                      <div style={{ textAlign: "center", width: "100%", flex: 1 }}>
                        <Title
                          level={4}
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#333",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {partner.name}
                        </Title>
                        <div style={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          gap: "8px", 
                          padding: "8px 20px",
                          background: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
                          borderRadius: "24px",
                          border: "1px solid rgba(20, 184, 166, 0.2)",
                          margin: "0 auto",
                        }}>
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#14B8A6",
                            }}
                          />
                          <Text
                            style={{
                              fontSize: "14px",
                              color: "#0d9488",
                              fontWeight: "600",
                            }}
                          >
                            {partner.location}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

{}
        <div style={{ textAlign: "center", marginTop: "64px" }}>
          <Link href="/partners">
            <Button
              size="large"
              shape="round"
              style={{
                background: "linear-gradient(135deg, #20b2aa 0%, #17a2b8 100%)",
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
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(32,178,170,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(32,178,170,0.3)";
              }}
            >
              {t('partners.view_all')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
