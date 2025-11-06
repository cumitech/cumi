"use client";

import React from "react";
import useWindowSize from "@hooks/windows-resize/window-resize.hook";
import Image from "next/image";
import { useEffect, useState } from "react";

const ImageFallback = (props: any) => {
  const { src, fallback = "/favicon.svg", ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  const { width } = useWindowSize();

  const isFill = Boolean((rest as any).fill);
  const displaySrc = imgSrc || fallback;

  return (
    <Image
      {...rest}
      src={displaySrc}
      alt={props.alt || ""}
      onError={() => {
        setImgSrc(fallback);
      }}
      style={
        isFill
          ? { objectFit: "cover", backgroundSize: "cover", backgroundPosition: "center" }
          : {
              objectFit: "cover",
              maxWidth: "100%",
              minHeight: width > 767 ? "450px" : "350px",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
      }
      quality={100}
    />
  );
};

export default ImageFallback;