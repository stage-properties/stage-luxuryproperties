"use client";
import CarouselLeftArrow from "@/app/[locale]/_components/categoryCarousel/CarouselLeftArrow";
import CarouselRightArrow from "@/app/[locale]/_components/categoryCarousel/CarouselRightArrow";
import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";

const GalleryCarousel = ({ galleryData, startIndex = 0, alternativeText }) => {
  const sliderRef = useRef(null);
  const validatedStartIndex = Math.min(Math.max(startIndex, 0), galleryData.length - 1);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(validatedStartIndex);
    }
  }, [validatedStartIndex, galleryData]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CarouselRightArrow />,
    prevArrow: <CarouselLeftArrow />,
  };

  return (
    <div className="carouselGallerySection">
      {galleryData?.length > 0 && (
        <Slider ref={sliderRef} className="gallery" {...settings}>
          {galleryData.map((item) => (
            <div className="item" key={item?.id}>
              <div className="__imageContainer">
                <Image
                  src={item?.attributes?.url}
                  fill
                  alt={item?.attributes?.alternativeText || alternativeText}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={100}
                />
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default GalleryCarousel;
