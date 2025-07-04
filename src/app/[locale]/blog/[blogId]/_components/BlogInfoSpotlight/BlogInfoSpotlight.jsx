import React from "react";
import Image from "next/image";
import getTranslation from "@/app/[locale]/_utils/translate";

const BlogInfoSpotlight = ({ blogInfo, locale }) => {

  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  let imageUrl = blogInfo?.attributes?.featured_image?.data?.attributes?.url;
  let imageAlternativeText = blogInfo?.attributes?.featured_image?.data?.attributes?.alternativeText;
  const blogTitle = blogInfo?.attributes?.blog_title
  
  const blogTitleTranslation = getTranslation({text: blogTitle, locale})
  
  return (
    <div className="blogInfoSpotlight">
      <div className="imageContainer">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlternativeText || blogTitle}
            fill
            style={{ objectFit: "fill" }}
          />
        )}
        <div className="gradient"></div>
        <div className="info">
          <div className="wrapper">
            <h1 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{blogTitleTranslation}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogInfoSpotlight;