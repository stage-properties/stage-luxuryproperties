"use client";
import CarouselLeftArrow from "@/app/[locale]/_components/categoryCarousel/CarouselLeftArrow";
import CarouselRightArrow from "@/app/[locale]/_components/categoryCarousel/CarouselRightArrow";
import React from "react";
import TeamCard from "@/app/[locale]/_components/TeamCard.jsx/TeamCard";
import { useLocale } from 'next-intl';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'

const TeamCarousel = ({ teamData }) => {

  const locale = useLocale()
  const isRTL = locale === 'ar'

  const settings = {
    className: "center",
    centerMode: true,
    dots: false,
    infinite: true,
    lazyLoad: false,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    nextArrow: <CarouselRightArrow />,
    prevArrow: <CarouselLeftArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };
  return (
    <Slider className="teamContainer" {...settings}>
      {teamData?.map((item) => {
        if (item?.id !== "186" && item?.id !== "185") {
          return (
            <div className="teamItem" key={item?.id}>
              <TeamCard teamData={item} />
            </div>
          );
        }
      })}
    </Slider>
  );
};

export default TeamCarousel;
