"use client";
import React, { useState } from "react";
import Image from "next/image";
import CarouselRightArrow from "@/app/[locale]/_components/categoryCarousel/CarouselRightArrow";
import CarouselLeftArrow from "@/app/[locale]/_components/categoryCarousel/CarouselLeftArrow";
import { useTranslations, useLocale } from 'next-intl';
import { formatNumberToArabic } from "../../_utils/utils";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ContactForm from "../../_components/ContactForm/ContactForm";
import Slider from 'react-slick'

const OurStory = ({our_story, slide_1, slide_2, slide_3}) => {
  const locale = useLocale()
  const t = useTranslations('common');
  const [contactFormModal, setContactFormModal] = useState(false);
  const isRTL = locale === 'ar';

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: !isRTL,
    nextArrow: <CarouselRightArrow />,
    prevArrow: <CarouselLeftArrow />,
    rtl: isRTL,
    initialSlide: isRTL ? 2 : 0,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: false,
          infinite: false,
        },
      },
    ],
  };
  return (
    <div className="ourStorySection">
      {contactFormModal && (
        <ContactForm setContactFormModal={setContactFormModal} type='contact-form' />
      )}
      <div className="imageContainer">
        <Image src="/ourStoryBG.jpeg" fill={true} alt="Our-story-bg" quality={60} sizes="(max-width:980px 100vw) (max-width:1200px 50vw)" />
        <div className="gradient"></div>

        <div className="contentContainer">
          <div className="_wrapper">
            <div className="leftContainer">
              <div className="circleContainer">
                <div className="outerCircle">
                  <div
                    className="texts"
                  >
                    <span className="title">{`${locale === 'ar' ? formatNumberToArabic(20): 20}+`} {t('years').toUpperCase()}</span>
                    <span>{t('of_industry_experience').toUpperCase()}</span>
                  </div>
                  <div className="secondCircle">
                    <div
                      className="texts"
                    >
                      <span className="title">{`${locale === 'ar' ? formatNumberToArabic(5000) : 5000}`} +</span>
                      <span>{t('customer_served').toUpperCase()}</span>
                    </div>
                    <div className="thirdCircle">
                      <div
                        className="texts"
                      >
                        <span className="title">{`${locale === 'ar' ? formatNumberToArabic(15) : 15}`} +</span>
                        <span>{t('languages_spoken').toUpperCase()}</span>
                      </div>
                      <div className="innerCircle">
                        <div
                          className="logo"
                        >
                          <Image
                            src="/stage-gradient-logo.png"
                            fill={true}
                            alt="Stage-logo"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="rightContainer wrapper"
              data-aos="fade-left"
              data-aos-delay="0"
              data-aos-once="true"
            >
              <h2 className={`mainHeading gradientText ${locale === 'ar' ? 'ar' : ''}`}>{t('our_story').toUpperCase()}</h2>
              <p className="description">
                {our_story.toUpperCase()}
              </p>
              <div className="buttonContainer" style={{display: "block"}}>
                <button
                  className="globalBtn"
                  onClick={() => setContactFormModal(true)}
                >
                  {t('get_in_touch')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ourStoryCarouselSection">
        <div className="wrapper">
          <div className="carouselMainContainer gradientBorder">
            <Slider className="storySlick" {...settings}>
              <div className="carouselItem">
                <div className="left">
                  <p className={`description ${isRTL ? 'ar' : ''}`}>
                    {slide_1}
                  </p>
                </div>
                <div className="right">
                  <div className="imageContainer">
                    <Image
                      src="/ourStory_1.webp"
                      fill={true}
                      alt="stage"
                    />
                  </div>
                </div>
              </div>

              <div className="carouselItem">
                <div className="left">
                  <p className={`description ${isRTL ? 'ar' : ''}`}>
                    {slide_2}
                  </p>
                </div>
                <div className="right">
                  <div className="imageContainer">
                    <Image
                      src="/contact-us.webp"
                      fill={true}
                      alt="stage"
                    />
                  </div>
                </div>
              </div>

              <div className="carouselItem">
                <div className="left">
                  <p className={`description ${isRTL ? 'ar' : ''}`}>
                    {slide_3}
                  </p>
                </div>
                <div className="right">
                  <div className="imageContainer">
                    <Image
                      src="https://d37zlj91i7b9eq.cloudfront.net/stage-properties/office_1_8b91d8ff8e.webp"
                      fill={true}
                      alt="stage"
                    />
                  </div>
                </div>
              </div>
            </Slider>
            <div className="navController">
              <h2>{t('our_story').toUpperCase()}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
