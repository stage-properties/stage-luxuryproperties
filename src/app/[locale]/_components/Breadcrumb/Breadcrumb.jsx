"use client";

import { Breadcrumb as AntBreadcrumb } from "antd";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

const Breadcrumb = ({ home = true, items, scriptJSON }) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const [scrolled, setScrolled] = useState(false);
  const SCROLL_THRESHOLD = 80; // match header feel; avoid blur at top

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop;
        setScrolled(y > SCROLL_THRESHOLD);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const homeItem = home
    ? {
        href: "/",
        title: (
          <img
            src="/home-white.svg"
            alt="home"
            style={{ width: "18.584px", height: "16.66px" }}
          />
        ),
      }
    : {
        title: (
          <img
            src="/home-white.svg"
            alt="home"
            style={{
              width: "18.584px",
              height: "16.66px",
              visibility: "hidden",
            }}
          />
        ),
      };

  // Conditionally spread items if there are any
  const breadcrumbItems = items?.length ? [homeItem, ...items] : [homeItem];

  if (!home) return null;

  return (
    <div
      dir={direction}
      className={`breadcrumb-container${scrolled ? " is-scrolled" : ""}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        justifyContent: isRTL ? "flex-end" : "flex-start",
      }}
    >
      <AntBreadcrumb
        separator={
          <img
            src="/seperator-white.svg"
            style={{ width: "7.36px", height: "12.72px" }}
            alt="separator"
          />
        }
        items={breadcrumbItems}
      />
      {scriptJSON && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: scriptJSON }}
        />
      )}
    </div>
  );
};

export default Breadcrumb;
