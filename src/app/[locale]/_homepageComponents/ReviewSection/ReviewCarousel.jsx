'use client'
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ReviewCard from "@/app/[locale]/_components/ReviewCard/ReviewCard";
import CarouselRightArrow from "@/app/[locale]/_components/categoryCarousel/CarouselRightArrow";
import CarouselLeftArrow from "@/app/[locale]/_components/categoryCarousel/CarouselLeftArrow";
const ReviewCarousel = ({reviews}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows:true,
    nextArrow: <CarouselRightArrow />,
    prevArrow: <CarouselLeftArrow />,
  };
  return (
    <Slider className="reviews" {...settings}>
      {reviews?.map((item,index) => (
        <div className="reviewItem" key={index}>
          <ReviewCard data={item} />
        </div>
      ))}
    </Slider>
  );
};

export default ReviewCarousel;
