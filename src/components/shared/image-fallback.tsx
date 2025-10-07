"use client";

import React from "react";
import useWindowSize from "@hooks/windows-resize/window-resize.hook";
import Image from "next/image";
import { useEffect, useState } from "react";

const ImageFallback = (props: any) => {
  const { src, fallback, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

useEffect(() => {
    setImgSrc(src);
  }, [src]);
  const { width } = useWindowSize();

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={props.alt || ""}
      onError={() => {
        setImgSrc(fallback);
      }}
      style={{
        objectFit: "cover",
        maxWidth: "100%",
        minHeight: width > 767 ? "450px" : "350px",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      quality={100}
    />
  );
};

export default ImageFallback;
