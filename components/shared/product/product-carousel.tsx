"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types/types";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { ImageOff, Sparkles } from "lucide-react";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className="mb-12 w-full"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product: Product) => {
          const imageUrl = product.banner || product.images?.[0];

          return (
            <CarouselItem key={product.id}>
              <Link href={`/product/${product.slug}`}>
                <div className="group relative aspect-21/9 w-full overflow-hidden rounded-xl">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                  ) : (
                    <div className="from-muted to-muted/50 flex h-full w-full items-center justify-center bg-linear-to-br">
                      <div className="text-muted-foreground flex flex-col items-center gap-2">
                        <ImageOff className="h-12 w-12" />
                        <span className="text-sm">暂无图片</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
                    {product.isFeatured && (
                      <div className="bg-primary/90 mb-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                        <Sparkles className="h-3 w-3" />
                        精选商品
                      </div>
                    )}
                    <h2 className="mb-1 text-xl font-bold drop-shadow-lg md:text-2xl lg:text-3xl">
                      {product.name}
                    </h2>
                    {product.brand_name && (
                      <p className="text-sm text-white/80">
                        {product.brand_name}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-4 h-12 w-12" />
      <CarouselNext className="right-4 h-12 w-12" />
    </Carousel>
  );
};

export default ProductCarousel;
