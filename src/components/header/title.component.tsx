"use client";
import Image from "next/image";
import { useLink, useRouterContext, useRouterType } from "@refinedev/core";
import React from "react";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

return (
    <ActiveLink to="/">
      {collapsed ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: "65.5px",
          }}
        >
          <Image
            src="/cumi-green.jpg"
            alt="CUMI Logo"
            width={53}
            height={41}
            style={{
              margin: "0 auto",
              padding: "12px 0",
              width: "auto",
              height: "auto",
              maxHeight: "65.5px",
            }}
          />
        </div>
      ) : (
        <div style={{ position: "relative", padding: "12px 24px" }}>
          <Image
            src="/cumi-green.jpg"
            alt="CUMI Logo"
            width={180}
            height={42}
            style={{
              width: "180px",
              height: "auto",
            }}
          />
        </div>
      )}
    </ActiveLink>
  );
};
