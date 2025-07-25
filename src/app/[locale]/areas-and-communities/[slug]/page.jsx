const {
  default: Breadcrumb,
} = require("@/app/[locale]/_components/Breadcrumb/Breadcrumb");
import { Link } from "@/i18n/routing";
import SearchResult from "./_SearchResult/SearchResult";
import { fetchAPI } from "@/app/[locale]/_utils/fetch";
import Carousel from "@/app/[locale]/_components/NoData/Carousel";
import PropertyCard from "@/app/[locale]/_components/PropertyCard/PropertyCard";
import Image from "next/image";
import GradientLine from "@/app/[locale]/_components/GradientLine/GradientLine";
import CTAContainer from "@/app/[locale]/_components/CTA/CtaContainer/CtaContainer";
import { headers } from "next/headers";
import FaqSection from "@/app/[locale]/_components/Faq/FaqSection";
import { getTranslations } from "next-intl/server";
import Banner from "@/app/[locale]/_components/Banner/Banner";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";
// import DubailandTransactionsTable from './components/DubailandTransactionsTable/DubailandTransactionsTable';

export const generateMetadata = async ({ params }) => {
  const { origin } = serverPathname();

  const { locale, slug } = params;
  const t = await getTranslations({
    locale,
    namespace: "areas_and_communities",
  });

  const getCommunityInfo = await fetchAPI(
    `communities/single/${slug}?locale=${locale}`,
    "noCache"
  );

  const communityName = getCommunityInfo?.attributes?.community_name;
  const communityImage =
    getCommunityInfo?.attributes?.community_image?.data?.attributes?.url;
  const alternativeText =
    getCommunityInfo?.attributes?.community_image?.data?.attributes
      ?.alternativeText;
  const metaDescription = getCommunityInfo?.attributes?.meta_description;

  let canonicalURL = `${origin}/${
    locale === "ar" ? "ar/" : ""
  }areas-and-communities/${slug}`;

  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");
  const title = `${t(
    "Off Plan Projects & Ready Properties in"
  )} ${communityName}`;

  return {
    title: title,
    description: metaDescription,
    alternates: {
      canonical: canonicalURL,
      languages: {
        "en-gb": fullURL,
        en: fullURL,
        "x-default": fullURL,
        ar: fullURL.replace(origin, `${origin}/ar`),
      },
    },
    openGraph: {
      url: fullURL,
      title: communityName + ` | ${t("Stage Properties")}`,
      description: metaDescription,
      images: [
        {
          url: communityImage,
          width: 1200,
          height: 630,
          alt: alternativeText || communityName,
        },
      ],
      type: "website",
    },
  };
};

const Community = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale, slug } = params;

  const isRTL = locale === "ar";

  const direction = isRTL ? "rtl" : "ltr";

  const t_areas_and_communities = await getTranslations({
    locale,
    namespace: "areas_and_communities",
  });

  const offplanProjects = await fetchAPI(
    `offplan/list/communities/${slug}?locale=${locale}`,
    "noCache"
  );
  const secondaryPropertiesSale = await fetchAPI(
    `secondary/communities/${slug}?offeringType=Sale&locale=${locale}`,
    "noCache"
  );
  const secondaryPropertiesRent = await fetchAPI(
    `secondary/communities/${slug}?offeringType=Rent&locale=${locale}`,
    "noCache"
  );

  const getCommunityInfo = await fetchAPI(
    `communities/single/${params?.slug}?locale=${locale}`,
    "noCache"
  );

  const communityName = getCommunityInfo?.attributes?.community_name;
  const communityDescription = getCommunityInfo?.attributes?.description;
  const communityImage =
    getCommunityInfo?.attributes?.community_image?.data?.attributes?.url;
  const alternativeText =
    getCommunityInfo?.attributes?.community_image?.data?.attributes
      ?.alternativeText;
  const dld_name = getCommunityInfo?.attributes?.dld_name;

  const breadcrumbItems = [
    {
      title: (
        <Link href="/areas-and-communities" className="breadcrumb">
          {t_areas_and_communities("areas_and_communities")}
        </Link>
      ),
    },
    {
      title: (
        <p className="breadcrumb focus">
          {communityName?.toString()?.toUpperCase()}
        </p>
      ),
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
      "name": "Areas And Communities",
      "item": "${origin}/areas-and-communities"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": "${communityName}",
      "item": "${origin}/areas-and-communities/${slug}"
    }]
  }`;

  return (
    <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <div className="_imageContainer">
        <Image
          src={communityImage}
          alt={alternativeText || communityName}
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="_titleContainer">
          <h1 className={`__title ${isRTL ? "ar" : ""}`}>{communityName}</h1>
        </div>
      </div>
      <div className="wrapper community">
        <div className="__top">
          <p className={`__subtitle ${isRTL ? "ar" : ""}`}>
            {communityDescription}
          </p>
          {offplanProjects?.data?.length ? (
            <h2 className="mainHeading _title">
              {t_areas_and_communities("Off Plan Projects in")} {communityName}
            </h2>
          ) : null}
          <div className="splitDiv">
            <div className="left">
              <SearchResult searchData={offplanProjects} locale={locale} />
            </div>
            <div className="right">
              <Banner type={"HP"} imageBannerClass={"imageBannerClass"} />
            </div>
          </div>
          <div className="__gradientLine">
            <GradientLine />
          </div>
          {/* <div style={{marginTop: '5rem', marginBottom: '5rem'}}> */}
          {/* <h3 className="mainHeading gradientText" style={{marginBottom: '1.5rem'}}>Recent Transactions In {communityName}</h3> */}
          {/* <DubailandTransactionsTable dld_name={dld_name} /> */}
          {/* </div> */}
          <div
            className="similiarPropertyComponent"
            style={{ marginTop: "7rem", position: "relative" }}
          >
            {secondaryPropertiesSale?.data?.length ? (
              <>
                {isRTL ? (
                  <h2
                    className={`mainHeading similarPropertyComponentHeading ${
                      isRTL ? "ar" : ""
                    }`}
                  >
                    {communityName}{" "}
                    {t_areas_and_communities("Ready properties for Sale in")}
                  </h2>
                ) : (
                  <h2
                    className={`mainHeading similarPropertyComponentHeading ${
                      isRTL ? "ar" : ""
                    }`}
                  >
                    {t_areas_and_communities("Ready properties for Sale in")}{" "}
                    {communityName}
                  </h2>
                )}
                {isRTL ? (
                  <p
                    className={`similarPropertyComponentSubheading ${
                      isRTL ? "ar" : ""
                    }`}
                  >
                    {communityName}{" "}
                    {t_areas_and_communities(
                      "Discover ready properties for sale in"
                    )}
                  </p>
                ) : (
                  <p
                    className={`similarPropertyComponentSubheading ${
                      isRTL ? "ar" : ""
                    }`}
                  >
                    {t_areas_and_communities(
                      "Discover ready properties for sale in"
                    )}{" "}
                    {communityName}
                  </p>
                )}
                <div className="carouselSection">
                  <Carousel
                    data={secondaryPropertiesSale}
                    Card={PropertyCard}
                  />
                </div>
              </>
            ) : null}
            {secondaryPropertiesRent?.data?.length ? (
              <>
                {isRTL ? (
                  <h2
                    className={`mainHeading similarPropertyComponentHeading ${
                      isRTL ? "ar" : ""
                    }`}
                  >
                    {communityName}{" "}
                    {t_areas_and_communities("Ready properties for Rent in")}
                  </h2>
                ) : (
                  <h2
                    className={`mainHeading similarPropertyComponentHeading ${
                      isRTL ? "ar" : ""
                    }`}
                  >
                    {t_areas_and_communities("Ready properties for Rent in")}{" "}
                    {communityName}{" "}
                  </h2>
                )}
                {isRTL ? (
                  <p
                    className={`similarPropertyComponentSubheading ${
                      isRTL ? "ar" : ""
                    }`}
                  >
                    {communityName}{" "}
                    {t_areas_and_communities(
                      "Discover ready properties for Rent in"
                    )}
                  </p>
                ) : (
                  <p
                    className={`similarPropertyComponentSubheading ${
                      isRTL ? "ar" : ""
                    }`}
                  >
                    {t_areas_and_communities(
                      "Discover ready properties for Rent in"
                    )}{" "}
                    {communityName}
                  </p>
                )}

                <div className="carouselSection">
                  <Carousel
                    data={secondaryPropertiesRent}
                    Card={PropertyCard}
                  />
                </div>
              </>
            ) : null}
            <CTAContainer style={{ marginBottom: "7rem", width: "99%" }} />
            <FaqSection
              headerStyle={{ textAlign: "center", width: "99%" }}
              style={{ width: "99%" }}
              parentStyleMobile={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
