"use client";
import useWindowSize from "@hooks/windows-resize/window-resize.hook";
import { Button } from "antd";
import Image from "next/image";
import React from "react";
import { useTranslation } from "@contexts/translation.context";
import { trackCtaClick } from "@lib/analytics";

export const AppService = () => {
  const { width } = useWindowSize();
  const { t } = useTranslation();

return (
    <div
      id="work-with-us"
      className="container mx-auto"
      style={{
        minHeight: "20rem",
      }}
    >
      <div
        className="bg-light py-0 row"
        style={{
          borderTopLeftRadius: "7rem",
          borderBottomLeftRadius: "7rem",
          borderTopRightRadius: "7rem",
          borderBottomRightRadius: "7rem",
        }}
      >
        <div
          className="col-md-5 p-3 p-lg-5 bg-light d-flex flex-column justify-content-center align-items"
          style={{
            borderTopLeftRadius: width > 767 ? "7rem" : 0,
            borderBottomLeftRadius: width > 767 ? "7rem" : 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <h3 className="text-center mb-4">{t('service.ready_to_work')}</h3>
          <p className="text-center">
            {t('service.description')}
          </p>
          <Button
            className="primary-btn mt-3 mx-auto"
            href="https://wa.me/237681289411"
            target="_blank"
            size="large"
            style={{
              width: "10rem",
            }}
            shape="round"
            onClick={() => trackCtaClick("cta_work_with_us", "https://wa.me/237681289411")}
          >
            {t("cta.get_in_touch")}
          </Button>
        </div>
        <div className="col-md-6 px-5 p-md-0 ms-auto">
          <Image
            height={500}
            width={1200}
            quality={85}
            loading="lazy"
            src={"/img/relaxing.jpg"}
            style={{
              width: "100%",
              height: "20rem",
              objectFit: "cover",
              objectPosition: "20% 20%",
              borderTopRightRadius: width > 767 ? "7rem" : 50,
              borderBottomRightRadius: width > 767 ? "7rem" : 50,
              borderTopLeftRadius: width > 767 ? 0 : 50,
              borderBottomLeftRadius: width > 767 ? 0 : 50,
              border: width > 767 ? "none" : "6px solid #54c6aa",
            }}
            alt="drinking"
          />
        </div>
      </div>
    </div>
  );
};
