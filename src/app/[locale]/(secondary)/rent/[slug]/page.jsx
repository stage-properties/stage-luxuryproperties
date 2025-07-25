import React from "react";
import SecondaryDetailsPage from "../../_components/SecondaryDetailsPage";
import { fetchSingleSecondaryProperty } from "../../service";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import { addThreeMonthsToDate } from "@/app/[locale]/_utils/utils";
import CTAContainer from "@/app/[locale]/_components/CTA/CtaContainer/CtaContainer";
import FaqSection from "@/app/[locale]/_components/Faq/FaqSection";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { convertMyCurrency } from "@/app/[locale]/_utils/utils";
import { formatNumberToArabic } from "@/app/[locale]/_utils/utils";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

const Breadcrumb = dynamic(() =>
  import("@/app/[locale]/_components/Breadcrumb/Breadcrumb")
);

const page = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "single_secondary" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  const findTitle = (SecondaryPropertyData) => {
    const emirate =
      SecondaryPropertyData?.data?.attributes?.emirate?.data?.attributes
        ?.emirate_name;
    const category =
      SecondaryPropertyData?.data?.attributes?.category?.data?.attributes
        ?.category_name;
    const propertyType =
      SecondaryPropertyData?.data?.attributes?.property_type?.data?.attributes
        ?.type;
    const offeringType =
      SecondaryPropertyData?.data?.attributes?.offering_type?.data?.attributes
        ?.type;
    const _community =
      locale === "ar"
        ? SecondaryPropertyData?.data?.attributes?.community?.data?.attributes
            ?.localizations?.data?.[0]?.attributes?.community_name ??
          SecondaryPropertyData?.data?.attributes?.community?.data?.attributes
            ?.community_name
        : SecondaryPropertyData?.data?.attributes?.community?.data?.attributes
            ?.community_name;

    const emirate_ar =
      SecondaryPropertyData?.data?.attributes?.emirate?.data?.attributes
        ?.localizations?.data?.[0]?.attributes?.emirate_name;
    const _emirate = locale === "ar" ? emirate_ar ?? emirate : emirate;

    let englishTitle = "";
    let arabicTitle = "";

    const bedrooms = SecondaryPropertyData?.data?.attributes?.bedrooms;
    const NumToBedroomsInAR = (number) => {
      if (number == 0) return t("studio");
      if (number == 1)
        return locale === "ar" ? t("bedroom") : `${number} ${t("bedroom")}`;
      else if (number == 2)
        return locale === "ar"
          ? t("two-bedrooms")
          : `${number} ${t("bedrooms")}`;
      else if (number > 2)
        return `${
          locale === "ar" ? `من ${formatNumberToArabic(number)}` : number
        } ${t("bedrooms")}`;
    };

    if (category === "Residential") {
      if (bedrooms == "0") {
        // When bedrooms is "0", we assume this is a studio
        englishTitle = `${t("studio")} ${t("for")} ${t(
          offeringType?.toLowerCase()
        )} ${t("in")} ${_community}, ${_emirate}`;
        // Arabic order: you might want to reverse certain parts and use an Arabic comma (،)
        arabicTitle = `${t("studio")} ${t("for")}${t(
          offeringType?.toLowerCase()
        )} ${t("in")} ${_community}، ${_emirate}`;
      } else if (bedrooms) {
        // When there is a bedroom count
        englishTitle = `${NumToBedroomsInAR(bedrooms)} ${t_common(
          propertyType?.toLowerCase()
        )} ${t("for")} ${t(offeringType.toLowerCase())} ${t(
          "in"
        )} ${_community}, ${_emirate}`;
        arabicTitle = `${t_common(
          propertyType?.toLowerCase()
        )} ${NumToBedroomsInAR(bedrooms)} ${t("for")}${t(
          offeringType.toLowerCase()
        )} ${t("in")} ${_community}، ${_emirate}`;
      } else {
        // Fallback when bedroom count is not provided
        englishTitle = `${t_common(propertyType?.toLowerCase())} ${t(
          "for"
        )} ${t(offeringType?.toLowerCase())} ${t(
          "in"
        )} ${_community}, ${_emirate}`;
        arabicTitle = `${t_common(propertyType?.toLowerCase())} ${t("for")}${t(
          offeringType?.toLowerCase()
        )} ${t("in")} ${_community}، ${_emirate}`;
      }
    } else {
      // Fallback for non-residential categories
      englishTitle = `${t_common(propertyType?.toLowerCase())} ${t("for")} ${t(
        offeringType?.toLowerCase()
      )} ${t("in")} ${_community}, ${_emirate}`;
      arabicTitle = `${t_common(propertyType?.toLowerCase())} ${t("for")}${t(
        offeringType?.toLowerCase()
      )} ${t("in")} ${_community}، ${_emirate}`;
    }

    const property_ref_no =
      SecondaryPropertyData?.data?.attributes?.property_ref_no;
    const title =
      locale === "ar"
        ? arabicTitle + " " + property_ref_no
        : englishTitle + " " + property_ref_no;

    return title;
  };

  let SecondaryPropertyData = await fetchSingleSecondaryProperty(
    params?.slug + `?ln=${locale}`
  );

  const configuration = SecondaryPropertyData?.configuration?.data?.attributes;
  const aed_to_usd_exchange_rate = configuration?.aed_to_usd_exchange_rate;
  const aed_to_eur_exchange_rate = configuration?.aed_to_eur_exchange_rate;
  const aed_to_gbp_exchange_rate = configuration?.aed_to_gbp_exchange_rate;
  const aed_to_inr_exchange_rate = configuration?.aed_to_inr_exchange_rate;
  const aed_to_rub_exchange_rate = configuration?.aed_to_rub_exchange_rate;

  if (!SecondaryPropertyData?.data) notFound();

  const chosenTitle = SecondaryPropertyData?.data?.attributes?.chosen_title;
  let title = chosenTitle || findTitle(SecondaryPropertyData);

  const isCommercial =
    SecondaryPropertyData?.data?.attributes?.category?.data?.attributes?.category_name
      ?.toString()
      ?.toLowerCase() === "commercial";

  const text = isCommercial ? t("commercial_for_rent") : t("rent");
  const url = isCommercial
    ? "/rent/commercial/properties-for-rent"
    : "/rent/residential/properties-for-rent";

  const property_ref_no =
    SecondaryPropertyData?.data?.attributes?.property_ref_no;

  const availableFor = addThreeMonthsToDate(
    SecondaryPropertyData?.data?.attributes?.last_updated_on_portal
  );
  const breadcrumbItems = [
    {
      title: (
        <Link href={url} className="breadcrumb">
          {text}
        </Link>
      ),
    },
    {
      title: <p className="breadcrumb focus">{title}</p>,
    },
  ];

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
      "name": "${text}",
      "item": "${origin}${url}"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": "${title}",
      "item": "${origin}/rent/${params.slug}"
    }
    ]
  }`;

  const refNumber =
    SecondaryPropertyData?.data?.attributes?.property_ref_no.split("-")[1];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
            "@context": "http://schema.org",
            "@type": "Product",
            "name": "${title}",
            "description": "${
              SecondaryPropertyData?.data?.attributes?.meta_description
            }",
            "image": "${
              SecondaryPropertyData?.data?.attributes?.featured_image?.data
                ?.attributes.url
            }",
            "sku": "${refNumber}",
            "mpn": "${
              SecondaryPropertyData?.data?.attributes?.property_ref_no
            }",
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5",
                "worstRating": "0"
              },
              "author": {
                "@type": "Organization",
                "name": "Stage Properties Brokers LLC",
                "legalName": "Stage Properties Brokers LLC",
                "alternateName": "Stage Properties Brokers LLC",
                "url": "${origin}/",
                "description": "Discover prime investment opportunities with Stage Properties, Dubai's leading property broker. Your gateway to buying properties in Dubai.",
                "sameAs": [
                  "https://www.facebook.com/stageproperties/",
                  "https://x.com/stageproperties",
                  "https://www.instagram.com/stageproperties/",
                  "https://www.youtube.com/@stageproperties",
                  "https://www.linkedin.com/company/stage-properties-brokers-llc?originalSubdomain=ae",
                  "https://www.tiktok.com/@stageproperties"
                ],
                "logo": "${origin}/_next/image?url=%2FStage_Logo_White.png&w=828&q=75",
                "image": "${origin}/_next/image?url=%2FStage_Logo_White.png&w=828&q=75",
                "telephone": "+971 522 081 705",
                "email": "info@stageproperties.com",
                "founder": "Ghassan Saliba",
                "foundingDate": "2020-01-01",
                "award": [
                  "Alliance by EMAAR",
                  "DAMAC Unity",
                  "Rising Star Award by DAMAC",
                  "Regalia Performance Award by DEYAAR Properties",
                  "Rising Star Award by Jumierah Golf Estates",
                  "Broker Award by Binghatti"
                ],
                "foundingLocation": "Dubai",
                "numberOfEmployees": "98",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "OFFICE 106, BUILDING 3",
                  "addressLocality": "DUBAI HILLS BUSINESS PARK",
                  "addressRegion": "DUBAI HILLS ESTATE",
                  "postalCode": "215088, Dubai, UAE",
                  "addressCountry": "AE"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "sales",
                  "telephone": "+971 522 081 705",
                  "email": "info@stageproperties.com",
                  "areaServed": "AE",
                  "availableLanguage": [
                    "English",
                    "Turkish",
                    "Arabic",
                    "Spanish",
                    "French",
                    "German",
                    "Hindi",
                    "Punjabi",
                    "Pashto",
                    "Romanian",
                    "Russian",
                    "Urdu"
                  ]
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "79"
                }
              }
            },
            "offers": [
              {
                "@type": "Offer",
                "price": "${parseInt(
                  SecondaryPropertyData?.data?.attributes?.price
                )}",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock"
              },
              {
                "@type": "Offer",
                "price": "${parseInt(
                  convertMyCurrency({
                    value: SecondaryPropertyData?.data?.attributes?.price,
                    aed_to_eur_exchange_rate,
                    aed_to_usd_exchange_rate,
                    aed_to_gbp_exchange_rate,
                    aed_to_inr_exchange_rate,
                    aed_to_rub_exchange_rate,
                    currency: "USD",
                  })
                )}",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              {
                "@type": "Offer",
                "price": "${parseInt(
                  convertMyCurrency({
                    value: SecondaryPropertyData?.data?.attributes?.price,
                    aed_to_eur_exchange_rate,
                    aed_to_usd_exchange_rate,
                    aed_to_gbp_exchange_rate,
                    aed_to_inr_exchange_rate,
                    aed_to_rub_exchange_rate,
                    currency: "EUR",
                  })
                )}",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
              },
              {
                "@type": "Offer",
                "price": "${parseInt(
                  convertMyCurrency({
                    value: SecondaryPropertyData?.data?.attributes?.price,
                    aed_to_eur_exchange_rate,
                    aed_to_usd_exchange_rate,
                    aed_to_gbp_exchange_rate,
                    aed_to_inr_exchange_rate,
                    aed_to_rub_exchange_rate,
                    currency: "EUR",
                  })
                )}",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "ratingCount": "5",
              "bestRating": "5",
              "worstRating": "0",
              "reviewCount": "1"
            }
          }`,
        }}
      />
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <SecondaryDetailsPage
        SecondaryPropertyData={SecondaryPropertyData}
        alternativeText={title}
        locale={locale}
      />
      <CTAContainer style={{ marginBottom: "7rem" }} />
      <FaqSection style={{ marginBottom: "7rem" }} />
    </>
  );
};

export default page;
