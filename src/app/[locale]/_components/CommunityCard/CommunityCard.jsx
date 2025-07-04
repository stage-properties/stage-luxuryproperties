import React from "react";
import Image from "next/image";
import { Link } from '@/i18n/routing';
const CommunityCard = ({ featuredCityData }) => {
  const community_name = featuredCityData?.attributes?.community_name
  const alternativeText = featuredCityData?.attributes?.community_image?.data?.attributes?.alternativeText
  // const contactText = `Hi There, I am interested in  https://www.stageproperties.com/ this listing from your website. I would like to get more information, please.Thank you.`;
  // const emailSubject = "Interested in property web enquiry";
  let emirate = featuredCityData?.attributes?.emirate?.data?.attributes?.emirate_name?featuredCityData?.attributes?.emirate?.data?.attributes?.emirate_name?.toLowerCase():'allemirates'
  let areaReplacedValue = featuredCityData?.attributes?.slug
  let redirectURL = `/areas-and-communities/${areaReplacedValue}`
  return (
    <div className="communityCard">
      <Link href={redirectURL}>
        <div className="imageContainer gradientBorder">
          <Image
            src={featuredCityData?.attributes?.community_image?.data?.attributes?.url?featuredCityData?.attributes?.community_image?.data?.attributes?.url:"/sample_card_image.jpeg"}
            fill={true}
            alt={alternativeText || community_name}
          />
        </div>
        <h3 className="name">{featuredCityData?.attributes?.community_name}</h3>
        {/* <span className="guide">need area guide?</span> */}
      </Link>
      {/* <div className="contactInfo">
        <a href="tel:+97180078243">
          <span className="icon">
            <PhoneIcon />
          </span>
        </a>
        <a
          href={`mailto:contact@stageproperties.com?subject=${emailSubject}&body=${contactText}`}
        >
          <span className="icon">
            <MailIcon />
          </span>
        </a>
        <a href={`https://wa.me/+97180078243?text=${contactText}`}>
          <span className="icon">
            <WhatsappIcon />
          </span>
        </a>
      </div> */}
    </div>
  );
};

export default CommunityCard;
