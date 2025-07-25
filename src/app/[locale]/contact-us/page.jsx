import React from "react";
import ContactSpotlight from "./_components/ContactSpotlight";
import OurOffice from "./_components/OurOffice";
import ContactInfo from "./_components/ContactInfo";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

const Breadcrumb = dynamic(() =>
  import("@/app/[locale]/_components/Breadcrumb/Breadcrumb")
);

export async function generateMetadata({ params }) {
  const { origin } = serverPathname();
  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");

  return {
    title: {
      absolute: "Contact Stage Properties | Your Real Estate Partner",
    },
    description: `Get in touch with Stage Properties, your trusted real estate partner. Reach out for expert advice and seamless assistance in your property ventures`,
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
      title: "Contact Stage Properties | Your Real Estate Partner",
      description: `Get in touch with Stage Properties, your trusted real estate partner. Reach out for expert advice and seamless assistance in your property ventures`,
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
}

const page = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "contact_us" });

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
      "name": "Contact us",
      "item": "${origin}/contact-us"
    }]
  }`;

  const breadcrumbItems = [
    {
      title: <p className="breadcrumb focus">{t("contact_us")}</p>,
    },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <div id="contactUsPage">
        <ContactSpotlight locale={locale} />
        <OurOffice />
        <ContactInfo locale={locale} />
      </div>
    </>
  );
};

export default page;
