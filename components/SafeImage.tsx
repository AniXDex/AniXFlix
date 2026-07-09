"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SafeImage({ src, alt, fill, width, height, priority, sizes, className = "", style }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || "/logo.svg");
  const [isFallback, setIsFallback] = useState(!src);

  useEffect(() => {
    if (!src) {
      setImgSrc("/logo.svg");
      setIsFallback(true);
    } else {
      setImgSrc(src);
      setIsFallback(false);
    }
  }, [src]);

  if (fill) {
    return (
      <div className={`absolute inset-0 ${isFallback ? "bg-[#141414]" : ""} ${className}`}>
        <Image
          src={imgSrc}
          alt={isFallback ? "" : alt}
          fill
          priority={priority}
          sizes={sizes}
          className={isFallback ? "object-contain p-6 opacity-15" : ""}
          style={style}
          onError={() => {
            if (!isFallback) {
              setImgSrc("/logo.svg");
              setIsFallback(true);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${isFallback ? "bg-[#141414]" : ""} ${className}`} style={{ width, height, position: "relative", ...style }}>
      <Image
        src={imgSrc}
        alt={isFallback ? "" : alt}
        fill
        priority={priority}
        className={isFallback ? "object-contain p-4 opacity-15" : ""}
        onError={() => {
          if (!isFallback) {
            setImgSrc("/logo.svg");
            setIsFallback(true);
          }
        }}
      />
    </div>
  );
}
