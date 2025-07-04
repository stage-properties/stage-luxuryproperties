import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import LandscapeTeamCard from "@/app/[locale]/_components/TeamCard.jsx/LandscapeTeamCard";
import { getTeamData } from "@/app/[locale]/_commonService/network";

const CarouselListing = ({ teamData, teamType,APIinfo,setTeamData,apiType, locale }) => {
  const [page,setPage] = useState(1)
  // const [teamData, setTeamData] = useState([]);

  const settings = {
    className: "center",
    centerMode: true,
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    // lazyLoad: true,
    afterChange: async () => await fetchTeamsbyLazy(),
    responsive: [
      {
        breakpoint: 1050, // screen size below 1050
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
          infinite: false,
        },
      },
      {
        breakpoint: 980, // screen size below 980
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          infinite: false,
        },
      },
      {
        breakpoint: 768, // screen size below 768
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 640, // screen size below 640
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 480, // screen size below 480
        settings: {
          slidesToShow: 1,
          slidesToScroll: 0,
          infinite: false,
        },
      },
      {
        breakpoint: 360, // screen size below 360
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 320, // screen size below 320
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };

  // useEffect(() => {
  //   setTeamData(teamDataInfo);
  // }, []);

    const fetchTeamsbyLazy = async () => {
    setPage((prev) => prev + 1);
    if (page < APIinfo?.pagination?.pageCount) {
      const pageCount = `page=${page + 1}`;
      const response = await getTeamData(apiType,`${pageCount}`,6);
        setTeamData([...teamData, ...response?.data]);
    }
  };
  return (
    <div className="carouselListing">
      <Slider {...settings}>
        {teamType === "MANAGEMENT" &&
          teamData
            ?.filter((item) => item.id === "186" || item.id === "185")
            ?.sort((a, b) => a.id - b.id)?.map((item) => (
              <div key={item?.id} className="item">
                <LandscapeTeamCard data={item} locale={locale} />
              </div>
            ))}
         {
              teamType === "MANAGEMENT" &&(
                teamData?.filter((item)=>item.id!=="186" && item.id !== "185").map((item) => (
                  <div key={item?.id} className="item">
                    <LandscapeTeamCard data={item} locale={locale} />
                  </div>
                ))
              )
            }
            {
              teamType !== "MANAGEMENT" &&(
                teamData?.filter((item)=>item.id!=="186" && item.id !== "185").map((item) => (
                  <div key={item?.id} className="item">
                    <LandscapeTeamCard data={item} locale={locale} />
                  </div>
                ))
              )
            }
      </Slider>
    </div>
  );
};

export default CarouselListing;
