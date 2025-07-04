"use client";

import { Breadcrumb as AntBreadcrumb } from "antd";
import { useLocale } from 'next-intl';

const Breadcrumb = ({ home = true, items, scriptJSON }) => {

  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const homeItem = home ? {
    href: "/",
    title: (
      <img
        src="/home-white.svg"
        alt="home"
        style={{ width: "18.584px", height: "16.66px" }}
      />
    ),  
  } : {
    title : (
      <img
        src="/home-white.svg"
        alt="home"
        style={{ width: "18.584px", height: "16.66px", visibility: 'hidden' }}
      />
    )
  };

  // Conditionally spread items if there are any
  const breadcrumbItems = items?.length ? [homeItem, ...items] : [homeItem];

  if(!home) return null

  return (
    <div
      dir={direction}
      className="breadcrumb-container"
      style={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(18, 24, 35, 0.7)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        justifyContent: isRTL ? 'flex-end' : 'flex-start'
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