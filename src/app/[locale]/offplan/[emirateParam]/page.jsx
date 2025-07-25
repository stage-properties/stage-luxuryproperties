import React from "react";
import CategoryWise from "./_components/CategoryWise/CategoryWise";
import dynamic from "next/dynamic";
import Tags from "@/app/[locale]/_components/Tags/Tags";
import { fetchPageInfo } from "../service";
import CTAContainer from "@/app/[locale]/_components/CTA/CtaContainer/CtaContainer";
import FaqSection from "@/app/[locale]/_components/Faq/FaqSection";
import { notFound } from "next/navigation";
import { useServerPathname } from "@/app/[locale]/_utils/useServerPathname";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

// http://localhost:3000/offplan/page-2
const Breadcrumb = dynamic(() =>
  import("@/app/[locale]/_components/Breadcrumb/Breadcrumb")
);

export const generateMetadata = async ({ params }) => {
  const { origin } = serverPathname();
  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");

  const { locale, emirateParam } = params;
  const t = await getTranslations("offplan");

  return {
    title: t("Discover Off-Plan Properties in Dubai"),
    description: t(
      `Explore Dubai's off-plan projects and properties with Stage Properties`
    ),
    alternates: {
      canonical: `${origin}/${locale === "ar" ? "ar/" : ""}offplan`,
      languages: {
        "en-gb": fullURL,
        en: fullURL,
        "x-default": fullURL,
        ar: fullURL.replace(origin, `${origin}/ar`),
      },
    },
    openGraph: {
      url: fullURL,
      title: t("Our Passionate Real Estate Professionals"),
      description: t(`Discover our seasoned team with`),
      images: [
        {
          url: `${origin}/stage-default.png`,
          width: 1200,
          height: 630,
          alt: "Logo",
        },
      ],
      type: "website",
    },
  };
};

const handle404Page = (str) => {
  const pattern = /^page-\d+$/;
  if (!str.match(pattern)) notFound();
};

const page = async ({ params, searchParams }) => {
  const { locale } = params;

  const t_offplan = await getTranslations({ locale, namespace: "offplan" });

  const isRTL = locale === "ar";

  const { emirateParam } = params;
  handle404Page(emirateParam);

  const res_popularSearch = await fetchPageInfo();
  const popularSearches = res_popularSearch?.data?.attributes?.popular_searches;

  const scriptJSON = `{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://stageproperties.com/"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "OFF PLAN",
      "item": "https://stageproperties.com/offplan"
    }]
  }`;

  const breadcrumbItems = [
    {
      title: <p className="breadcrumb focus">{t_offplan("OFF PLAN")}</p>,
    },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <CategoryWise params={params} searchParams={searchParams} />
      <CTAContainer style={{ marginBottom: "7rem" }} />
      <FaqSection />
      {/* {popularSearches && !isRTL && (
        <>
          <div className="wrapper" style={{ marginBottom: "130px" }}>
            <h2
              className="mainHeading"
              style={{
                textAlign: "left",
                marginBottom: "20px",
                color: "white",
              }}
            >
              {t_offplan("Popular Searches")}
            </h2>
            <Tags data={popularSearches} />
          </div>
        </>
      )} */}
    </>
  );
};

export default page;
