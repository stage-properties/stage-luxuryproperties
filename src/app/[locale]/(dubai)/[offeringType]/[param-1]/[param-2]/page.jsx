import React from "react";
import Mainpage from "../../_component/Mainpage";
import {
  fetchRentResidentialMeta,
  fetchRentCommercialMeta,
  fetchBuyResidentialMeta,
  fetchBuyCommercialMeta,
} from "../../service";
import Tags from "@/app/[locale]/_components/Tags/Tags";
import CTAContainer from "@/app/[locale]/_components/CTA/CtaContainer/CtaContainer";
import FaqSection from "@/app/[locale]/_components/Faq/FaqSection";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

// http://localhost:3000/buy/residential/properties-for-sale

import Breadcrumb from "@/app/[locale]/_components/Breadcrumb/Breadcrumb";

// Map the parameters to the corresponding fetch function
const metaFetchers = {
  rent: {
    residential: fetchRentResidentialMeta,
    commercial: fetchRentCommercialMeta,
  },
  buy: {
    residential: fetchBuyResidentialMeta,
    commercial: fetchBuyCommercialMeta,
  },
};

// Function to fetch metadata based on params
async function fetchMetadata(offeringType, param1, locale) {
  const fetcher = metaFetchers[offeringType]?.[param1];

  const res = await fetcher(locale);
  const {
    title_tag: title,
    heading,
    subheading,
    meta_description: description,
    popular_searches,
  } = res?.data[0]?.attributes;

  return {
    title,
    heading,
    subheading,
    description,
    popular_searches,
  };
}

export async function generateMetadata({ params }) {
  const { origin } = serverPathname();

  handle404(params);

  const BASE_URL = `${origin}/`;
  const paramsToString = Object.values(params).join("/");
  const { locale, offeringType, "param-1": param1, "param-2": param2 } = params;
  const t_common = await getTranslations({ locale, namespace: "common" });

  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");

  try {
    const obj = await fetchMetadata(offeringType, param1, locale);
    const canonical = BASE_URL + paramsToString;

    const { title, description } = obj;

    const commercialOrResidential = param1?.toLowerCase();

    const { "param-2": propertyType } = params;

    const contructTitle = () => {
      if (
        propertyType === "properties-for-sale" ||
        propertyType === "properties-for-rent"
      ) {
        if (title) return title;
        else return `${t_common(param2.toLowerCase())} ${t_common("in_dubai")}`;
      } else return `${t_common(param2.toLowerCase())} ${t_common("in_dubai")}`;
    };

    const constructDescription = () => {
      if (
        propertyType === "properties-for-sale" ||
        propertyType === "properties-for-rent"
      ) {
        if (description) return description;
        else
          return (
            "Explore available " +
            param1 +
            " " +
            t_common(param2) +
            " in Dubai & Ras Al Khaimah with Stage Properties."
          );
      } else
        return (
          "Explore available " +
          param1 +
          " " +
          t_common(param2) +
          " in Dubai & Ras Al Khaimah with Stage Properties."
        );
    };

    return {
      title: contructTitle(),
      description: constructDescription(),
      alternates: {
        canonical: canonical.replace("/en/", "/"),
        languages: {
          "en-gb": fullURL,
          en: fullURL,
          "x-default": fullURL,
          ar: fullURL.replace(origin, `${origin}/ar`),
        },
      },
      openGraph: {
        url: fullURL,
        title: contructTitle(),
        description: constructDescription(),
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
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}

const handle404 = (params) => {
  const { offeringType, "param-1": param1, "param-2": param2 } = params;

  if (offeringType !== "rent" && offeringType !== "buy") notFound();
  if (
    param1?.toLowerCase() !== "commercial" &&
    param1.toLowerCase() !== "residential"
  )
    notFound();
};

const Page = async ({ params, searchParams }) => {
  const { origin } = serverPathname();

  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "breadcrumb" });
  const isRTL = locale === "ar";

  const metaFetchers = {
    rent: {
      residential: {
        text: t("rent"),
        url: `${origin}/rent/residential/properties-for-rent`,
      },
      commercial: {
        text: t("commercial_for_rent"),
        url: `${origin}/rent/commercial/properties-for-rent`,
      },
    },
    buy: {
      residential: {
        text: t("buy"),
        url: `${origin}/buy/residential/properties-for-sale`,
      },
      commercial: {
        text: t("commercial_for_sale"),
        url: `${origin}/buy/commercial/properties-for-sale`,
      },
    },
  };

  const { offeringType, "param-1": param1 } = params;
  const _text = metaFetchers[offeringType]?.[param1]?.text;
  const _url = metaFetchers[offeringType]?.[param1]?.url;

  const { popular_searches, heading, subheading } = await fetchMetadata(
    offeringType,
    param1,
    locale
  );
  const isResidential = param1 === "residential";

  const scriptJSON = `{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "${origin}/"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "${_text}",
      "item": "${_url}"
    }]
  }`;

  const breadcrumbItems = [
    {
      title: <p className="breadcrumb focus">{_text}</p>,
    },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <Mainpage
        params={params}
        searchParams={searchParams}
        heading={heading}
        subheading={subheading}
      />
      <CTAContainer style={{ marginBottom: "7rem" }} />
      <FaqSection style={{ marginBottom: "7rem" }} />
      {isResidential && popular_searches && !isRTL && (
        <div className="wrapper" style={{ marginBottom: "130px" }}>
          <h2
            className="mainHeading"
            style={{ textAlign: "left", marginBottom: "20px", color: "white" }}
          >
            Popular Searches
          </h2>
          <Tags data={popular_searches} />
        </div>
      )}
    </>
  );
};

export default Page;
