"use client";
import React, { useState } from "react";
import Image from "next/image";
import CarouselRightArrow from "@/app/components/categoryCarousel/CarouselRightArrow";
import CarouselLeftArrow from "@/app/components/categoryCarousel/CarouselLeftArrow";
import dynamic from 'next/dynamic'
dynamic(() => import ('slick-carousel/slick/slick.css'))
dynamic(() => import ('slick-carousel/slick/slick-theme.css'))
const DynamicContactForm = dynamic(() => import ('../../_components/ContactForm/ContactForm'),{
  ssr:false
})
const DynamicSlider = dynamic(() => import ('react-slick'),{
  ssr:false
})
const OurStory = () => {
  const [contactFormModal, setContactFormModal] = useState(false);
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    nextArrow: <CarouselRightArrow />,
    prevArrow: <CarouselLeftArrow />,
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
        <DynamicContactForm setContactFormModal={setContactFormModal} type='contact-form' />
      )}
      <div className="imageContainer">
        <Image src="/ourStoryBG.jpeg" fill={true} alt="Our-story-bg" quality={60} sizes="(max-width:980px 100vw) (max-width:1200px 50vw)" />
        <div className="gradient"></div>

        <div className="contentContainer">
          <div className="wrapper">
            <div className="leftContainer">
              <div className="circleContainer">
                <div className="outerCircle">
                  <div
                    className="texts"
                  >
                    <span className="title">20+ YEARS</span>
                    <span>OF INDUSTRY EXPERIENCE</span>
                  </div>
                  <div className="secondCircle">
                    <div
                      className="texts"
                    >
                      <span className="title">5000 +</span>
                      <span>CUSTOMERS SERVED</span>
                    </div>
                    <div className="thirdCircle">
                      <div
                        className="texts"
                      >
                        <span className="title">15 +</span>
                        <span>LANGUAGES SPOKEN</span>
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
              className="rightContainer"
              data-aos="fade-left"
              data-aos-delay="0"
              data-aos-once="true"
            >
              <h2 className="mainHeading gradientText">Our story</h2>
              <p className="description">
                Our story is defined by the remarkable achievements we've
                garnered in a short span of time in the dynamic Dubai real
                estate market. We may not be the biggest, but we take pride in
                our journey of growth and our strong presence in this
                ever-evolving industry. 
              </p>
              <div className="buttonContainer">
                <button
                  className="globalBtn"
                  onClick={() => setContactFormModal(true)}
                >
                  get in touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ourStoryCarouselSection">
        <div className="wrapper">
          <div className="carouselMainContainer gradientBorder">
            <DynamicSlider className="storySlick" {...settings}>
              <div className="carouselItem">
                <div className="left">
                  <p className="description">
                    What sets us apart is our experienced top management, with
                    an expertise of over 20 years in the Dubai real estate
                    scene. This depth of knowledge provides us with a unique
                    vantage point to help you navigate the market and make
                    informed decisions.
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
                  <p className="description">
                    At Stage Properties, we've cultivated a friendly and
                    professional environment, ensuring that our clients feel
                    comfortable and supported throughout their real estate
                    endeavors. Our dedicated team of agents consistently
                    achieves monthly sales, a testament to their unwavering
                    commitment to your real estate success.  
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
                  <p className="description">
                    Our journey is a testament to our dedication to your real
                    estate goals, and we look forward to being part of your next
                    chapter in Dubai's thriving property market. Join us, and
                    together, let's make your real estate dreams a reality.   
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
            </DynamicSlider>

            <div className="navController">
              <h2>OUR STORY</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
