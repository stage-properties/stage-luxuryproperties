import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
const CommunityCard = ({ featuredCityData }) => {
  const community_name = featuredCityData?.attributes?.community_name;
  const alternativeText =
    featuredCityData?.attributes?.community_image?.data?.attributes
      ?.alternativeText;
  let areaReplacedValue = featuredCityData?.attributes?.slug;
  let redirectURL = `/areas-and-communities/${areaReplacedValue}`;
  return (
    <div className="communityCard">
      <Link href={redirectURL}>
        <div className="imageContainer">
          <Image
            src={
              featuredCityData?.attributes?.community_image?.data?.attributes
                ?.url
                ? featuredCityData?.attributes?.community_image?.data
                    ?.attributes?.url
                : "/sample_card_image.jpeg"
            }
            fill={true}
            alt={alternativeText || community_name}
          />
        </div>
        <h3 className="name">{featuredCityData?.attributes?.community_name}</h3>
      </Link>
    </div>
  );
};

export default CommunityCard;
