"use client";
import React, { useState, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";

import LeftArrow from '../../../../../../../../../../assets/Icons/leftArrow.svg'
import RightArrow from '../../../../../../../../../../assets/Icons/rightArrow.svg'

import useIsMobile from "@/app/[locale]/_utils/useIsMobile";
import CarouselRightArrow from "@/app/[locale]/_components/categoryCarousel/CarouselRightArrow";
import CarouselLeftArrow from "@/app/[locale]/_components/categoryCarousel/CarouselLeftArrow";

const GalleryCarousel = ({ offplanGallery }) => {
  let sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile({maxWidth: 1065})

  const next = () => {
    sliderRef.slickNext();
  };

  const previous = () => {
    sliderRef.slickPrev();
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !isMobile,
    nextArrow: <CarouselRightArrow />,
    prevArrow: <CarouselLeftArrow />,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    afterChange: (index) => setCurrentSlide(index)
  };

  return (
    <>
      <Slider {...settings} ref={(slider) => (sliderRef = slider)}>
        {offplanGallery?.map((item) => (
          <div key={item?.id}>
            <div className="__imageContainer">
              <Image
                src={item?.attributes?.url}
                alt="GalleryImage"
                layout="fill"   // This makes the image fill the container
                objectFit="contain"  // Ensure the image fits within the container without distortion
              />
            </div>
          </div>
        ))}
      </Slider>
      {
        isMobile && (
          <div className="sliderArrows" style={{ marginTop: ".5rem" }}>
              <LeftArrow 
                  className='arrow prev' 
                  onClick={previous} 
                  style={{ opacity: currentSlide === 0 ? 0.5 : 1 }} 
              />
              <RightArrow 
                  className='arrow next' 
                  onClick={next} 
                  style={{ opacity: currentSlide === offplanGallery?.length - settings.slidesToShow ? 0.5 : 1 }} 
              />
          </div>
        )
      }

    </>
  );
};

export default GalleryCarousel;