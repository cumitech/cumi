"use client";

import React from "react";
import { Button, Space, Carousel } from "antd";
import useWindowSize from "@hooks/windows-resize/window-resize.hook";
import Image from "next/image";
import { useTranslation } from "@contexts/translation.context";
import { trackCtaClick } from "@lib/analytics";

export const AppHero = () => {
  const { width } = useWindowSize();
  const { t } = useTranslation();

  const isMobile = width < 768;

  const heroImages = [
    {
      src: "/img/IMG_4491-min.jpeg",
      alt: "Software engineering team at CUMI - Professional developers working on innovative digital solutions",
    },
    {
      src: "/img/christopher-gower-m_HRfLhgABo-unsplash.jpg",
      alt: "CUMI brand visuals representing digital solutions for growing businesses",
    },
    {
      src: "/img/daniel-korpai-pKRNxEguRgM-unsplash.jpg",
      alt: "CUMI brand visuals representing digital solutions for growing businesses",
    },
    {
      src: "/img/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg",
      alt: "CUMI brand visuals representing digital solutions for growing businesses",
    },
  ];

  const textBlock = (
    <div className="col-12 d-flex flex-column col-md-5">
      <h1
        className="gradient-title"
        style={{
          fontSize: isMobile ? "1.9rem" : "2.5rem",
          fontWeight: "700",
          marginBottom: "1rem",
          lineHeight: isMobile ? 1.2 : 1.25,
        }}
      >
        {t("hero.title")}
      </h1>
      <p className="text-wrap">{t("hero.description")}</p>
      <div className="mt-3">
        <Space size="middle" direction="horizontal">
          <Button
            className="primary-btn shadow-sm"
            shape="round"
            href="/contact-us"
            size="large"
            onClick={() => trackCtaClick("hero_start_project", "/contact-us")}
          >
            {t("cta.start_project")}
          </Button>
          <Button
            size="large"
            href="/our-services"
            className="default-btn fw-bold"
            shape="round"
          >
            {t("hero.hire_services")}
          </Button>
        </Space>
      </div>
    </div>
  );

  const imageBlock = (
    <div
      className="ms-auto d-md-inline col-md-6"
      style={{
        marginTop: width < 767 ? 24 : 0,
        marginBottom: width < 767 ? 24 : 0,
      }}
    >
      <Carousel
        autoplay
        autoplaySpeed={5000}
        dots={false}
        arrows={false}
        pauseOnHover={false}
        effect="fade"
        className="hero-image-carousel"
      >
        {heroImages.map((img) => (
          <div key={img.src}>
            <Image
              src={img.src}
              alt={img.alt}
              height={500}
              width={1200}
              quality={85}
              priority
              style={{
                width: "100%",
                height: "23rem",
                borderRadius: 50,
                objectFit: "cover",
                border: "6px solid #54c6aa",
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );

  return (
    <div
      className="mx-auto row align-items-center"
      style={{
        marginTop: isMobile ? "1.5rem" : "4rem",
        width: "90%",
        minHeight: "23rem",
      }}
    >
      {isMobile ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </div>
  );
};
