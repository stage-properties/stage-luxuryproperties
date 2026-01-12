"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function BlogCarousel({ blogs }) {
  const slideCount = blogs?.length ?? 0;
  const hasMultiple = slideCount > 1;

  const settings = {
    dots: true, // desktop only; turned off below
    infinite: slideCount > 2,
    speed: 260,
    slidesToShow: hasMultiple ? 1.6 : 1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: hasMultiple,
    centerPadding: hasMultiple ? "48px" : "0px",
    lazyLoad: false,
    responsive: hasMultiple
      ? [
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 1.4,
              centerPadding: "40px",
              dots: false,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1.2,
              centerPadding: "32px",
              dots: false,
            },
          },
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 1.1,
              centerPadding: "26px",
              dots: false,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              dots: false,
              centerMode: true,
              centerPadding: "18px",
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              centerMode: true,
              centerPadding: "12px",
              dots: false,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              centerMode: true,
              centerPadding: "0px",
              dots: false,
            },
          },
        ]
      : [],
  };

  const getDate = (d) => {
    if (!d) return null;
    try {
      return new Date(d).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="blogsSliderContainer">
      <Slider {...settings}>
        {(blogs?.length ? blogs : Array.from({ length: 1 })).map(
          (item, idx) => {
            const attrs = item?.attributes || {};
            const href = attrs?.slug ? `/blog/${attrs.slug}` : "#";
            const img =
              attrs?.featured_image?.data?.attributes?.url ||
              "/ourStoryBG.jpeg";
            const alt =
              attrs?.featured_image?.data?.attributes?.alternativeText ||
              attrs?.blog_title ||
              "Blog image";
            const title = attrs?.blog_title || "—";
            const excerpt =
              attrs?.excerpt ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
            const date = getDate(attrs?.publishedAt);

            return (
              <div className="blogSlide" key={item?.id ?? `placeholder-${idx}`}>
                <div
                  className="slideCard gradientBorder-xl"
                  style={{ ["--bg-url"]: `url(${img})` }}
                >
                  <div className="slideImageWrap">
                    <div className="imgRel">
                      <Image
                        src={img}
                        alt={alt}
                        fill
                        priority
                        sizes="(min-width: 1280px) 32vw, (min-width: 1024px) 40vw, (min-width: 768px) 60vw, 90vw"
                      />
                    </div>
                  </div>

                  <div className="slideContent">
                    <h4 className="slideTitle">{title}</h4>
                    <p className="slideExcerpt">{excerpt}</p>
                    <p className="slideDate">27 Apr 2025</p>

                    <div className="slideFooter">
                      {date && <span className="slideDate">{date}</span>}

                      {/* Only arrow is clickable */}
                      <Link className="slideCta" href={href}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 27 27"
                          fill="none"
                        >
                          <path
                            d="M26 13.5L1 13.5M26 13.5L13.5 26M26 13.5L13.5 1"
                            stroke="#FFFAE8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </Slider>
    </div>
  );
}
