"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToPrevious = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100">
        <p className="text-muted-foreground">暂无图片</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="group relative aspect-square overflow-hidden rounded-lg bg-gray-50">
        <Image
          src={images[current]}
          alt={`产品图片 ${current + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            "object-cover object-center transition-transform duration-300",
            isZoomed && "scale-150 cursor-zoom-out",
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
              aria-label="上一张"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
              aria-label="下一张"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-2 right-2 rounded-full bg-white/80 p-2 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
          aria-label={isZoomed ? "缩小" : "放大"}
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
          {current + 1} / {images.length}
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => setCurrent(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                current === index
                  ? "border-primary ring-primary/20 ring-2"
                  : "border-transparent hover:border-gray-300",
              )}
            >
              <Image
                src={image}
                alt={`缩略图 ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
