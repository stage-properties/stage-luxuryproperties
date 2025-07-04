"use client";
import dynamic from 'next/dynamic'

import React, { useEffect, useState } from "react";
dynamic(() => import ('slick-carousel/slick/slick.css'))
dynamic(() => import ('slick-carousel/slick/slick-theme.css'))
// import Slider from "react-slick";
import Image from "next/image";
const Slider = dynamic(() => import ('react-slick'),{
  ssr:true
})
const SpotlightTeamCarousel = ({ teamDataResponse }) => {
  const [teamData, setTeamData] = useState([]);
  // const [teamDataAPIinfo, setTeamDataAPIinfo] = useState();
  // const [page,setPage] = useState(1)

  useEffect(() => {
    setTeamData(teamDataResponse?.data);
    // setTeamDataAPIinfo(teamDataResponse?.meta);
  }, []);

  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: true,
    centerMode: false,
    slidesToShow: 5,
    slidesToScroll:1,
    variableWidth: true,
    // lazyLoad: true,
    // afterChange: async () => await fetchTeamsbyLazy(),
    arrows: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    // cssEase: "linear",
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
  };

  // const fetchTeamsbyLazy = async () => {
  //   setPage((prev) => prev + 1);
  //   console.log(teamDataAPIinfo,"api info")
  //   if (page < teamDataAPIinfo?.pagination?.pageCount) {
  //     const pageCount = `page=${page + 1}`;
  //     const response = await getTeamData("all",`${pageCount}`);
  //       setTeamData([...teamData, ...response?.data]);

  //   }
  // };
  return (
    <div className="featuredListContainer">
      <Slider {...settings}>
        {teamData?.map((item, index) => {
          if (
            item?.attributes?.image?.data?.attributes?.url &&
            item?.id !== "185"
          ) {
            return (
              <div className="item" key={item?.id} style={{ width: 300 }}>
                <div className="imageContainer ">
                  <Image
                    quality={100}
                    src={item?.attributes?.image?.data?.attributes?.url}
                    sizes="100vw"
                    fill
                    alt="Member_image"
                  />
                </div>
              </div>
            );
          }
        })}
      </Slider>
      <div className="overlayImage gradientBorder">
        <Image
          src="https://d37zlj91i7b9eq.cloudfront.net/stage-properties/stage/teams/1701843288056.webp"
          fill={true}
          alt="Member_image"
        />
      </div>
      <div className="gradient"></div>
    </div>
  );
};

export default SpotlightTeamCarousel;
