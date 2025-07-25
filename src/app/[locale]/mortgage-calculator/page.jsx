import React from "react";
import MortgageCalculator from "../_components/MortgageCalculator/MortgageCalculator";
import dynamic from "next/dynamic";
import CTAContainer from "../_components/CTA/CtaContainer/CtaContainer";
import FaqSection from "../_components/Faq/FaqSection";
import { useServerPathname } from "../_utils/useServerPathname";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { fetchAPI } from "../_utils/fetch";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

const Breadcrumb = dynamic(() =>
  import("@/app/[locale]/_components/Breadcrumb/Breadcrumb")
);

export const generateMetadata = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale } = params;

  const t_mortgage_calculator = await getTranslations({
    locale,
    namespace: "mortgage_calculator",
  });

  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");

  return {
    metadataBase: new URL(origin),
    title: {
      absolute: t_mortgage_calculator("Mortgage Calculator | Stage Properties"),
    },
    description: t_mortgage_calculator(
      "Determine your affordability and look into bank loan choices"
    ),
    alternates: {
      canonical: fullURL,
      languages: {
        "en-gb": fullURL,
        en: fullURL,
        "x-default": fullURL,
        ar: fullURL.replace(origin, `${origin}/ar`),
      },
    },
    openGraph: {
      url: fullURL,
      title: t_mortgage_calculator("Mortgage Calculator | Stage Properties"),
      description: t_mortgage_calculator(
        "Determine your affordability and look into bank loan choices"
      ),
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
const page = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale } = params;

  const t_mortgage_calculator = await getTranslations({
    locale,
    namespace: "mortgage_calculator",
  });
  const exchangeRates = await fetchAPI("configuration", "noCache");

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
      "name": "Mortgage Calculator",
      "item": "${origin}/mortgage-calculator"
    }]
  }`;

  const breadcrumbItems = [
    {
      title: (
        <p className="breadcrumb focus">
          {t_mortgage_calculator("MORTGAGE CALCULATOR")}
        </p>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <div id="mortage-calculator">
        <MortgageCalculator exchangeRates={exchangeRates} />
        <CTAContainer style={{ marginTop: "5rem" }} />
        <FaqSection classname="faqSection" />
      </div>
    </>
  );
};

export default page;
