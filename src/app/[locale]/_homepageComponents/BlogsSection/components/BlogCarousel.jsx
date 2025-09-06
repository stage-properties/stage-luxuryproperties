"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function BlogCarousel({ blogs }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1.5,
    slidesToScroll: 1,
    arrows: false,
    initialSlide: 0.5,
    lazyLoad: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: true,
          centerMode: true,
          centerPadding: "0px",
        },
      },
    ],
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
            const excerpt = attrs?.excerpt || "—";
            const date = getDate(attrs?.publishedAt);

            return (
              <div className="blogSlide" key={item?.id ?? `placeholder-${idx}`}>
                <Link
                  className="slideCard gradientBorder-xl"
                  href={href}
                  style={{ ["--bg-url"]: `url(${img})` }}
                >
                  <div className="slideImageWrap">
                    <div className="imgRel">
                      <Image
                        src={img}
                        alt={alt}
                        fill
                        priority
                        sizes="(min-width: 1024px) 40vw, 90vw"
                      />
                    </div>
                  </div>

                  <div className="slideContent">
                    <h4 className="slideTitle">{title}</h4>
                    <p className="slideExcerpt">{excerpt}</p>

                    <div className="slideFooter">
                      {date && <span className="slideDate">{date}</span>}
                      <span className="slideCta" aria-hidden>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="27"
                          height="27"
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
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          }
        )}
      </Slider>
    </div>
  );
}
