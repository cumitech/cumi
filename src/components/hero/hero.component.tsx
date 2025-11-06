"use client";

import React from "react";
import { Button, Space } from "antd";
import useWindowSize from "@hooks/windows-resize/window-resize.hook";
import Image from "next/image";
import { useTranslation } from "@contexts/translation.context";

export const AppHero = () => {
  const { width } = useWindowSize()
  const { t } = useTranslation()

return (
    <div
      className="mx-auto row align-items-center"
      style={{ marginTop: "4rem", width: "90%", minHeight: "23rem" }}
    >
      <div className="col-12 d-flex flex-column col-md-5">
        <h1 className="gradient-title" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>{t('hero.title')}</h1>
        <p className="text-wrap">
          {t('hero.description')}
        </p>
        <div className="mt-3">
          <Space size="middle" direction="horizontal">
            <Button
              className="primary-btn shadow-sm"
              shape="round"
              href="/our-services"
              size="large"
            >
              {t('hero.hire_services')}
            </Button>
            <Button
              size="large"
              href="/about-us"
              className="default-btn fw-bold"
              shape="round"
            >
              {t('hero.our_mission')}
            </Button>
          </Space>
        </div>
      </div>
      <div className="d-sm-none ms-auto d-md-inline col-md-6" style={{ marginTop: width < 767 ? 40 : 0 }}>
        <Image
          src={"/img/IMG_4491-min.jpeg"}
          alt="Software engineering team at CUMI - Professional developers working on innovative digital solutions"
          height={500}
          width={1200}
          quality={85}
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          style={{
            width: "100%",
            height: "23rem",
            borderRadius: 50,
            objectFit: "cover",
            border: "6px solid #54c6aa",
          }}
        />
      </div>
    </div>
  );
};
