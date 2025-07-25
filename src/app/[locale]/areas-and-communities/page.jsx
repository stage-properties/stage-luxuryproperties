import Breadcrumb from "../_components/Breadcrumb/Breadcrumb";
import GradientLine from "../_components/GradientLine/GradientLine";
import { fetchAPI, formatNumberToArabic } from "../_utils/utils";
import SubscribeNewsletter from "../_components/SubscribeNewsletter/SubscribeNewsletter";
import CommunitiesAndAreasCard from "../_components/CommunityAndAreasCard/CommunityAndAreasCard";
import CTAContainer from "../_components/CTA/CtaContainer/CtaContainer";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

export const generateMetadata = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale } = params;

  const res_areaPage = await fetchAPI(`pageArea?locale=${locale}`, "noCache");

  const meta_title = res_areaPage?.attributes?.meta_title;
  const meta_description = res_areaPage?.attributes?.meta_description;

  const canonicalURL = `${origin}/${
    locale === "ar" ? "ar/" : ""
  }areas-and-communities`;

  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");

  return {
    title: meta_title,
    description: meta_description,
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
      title: meta_title,
      description: meta_description,
      images: [
        {
          url: `${origin}/stage-default.png`,
          width: 1200,
          height: 630,
          alt: "Areas & Communities",
        },
      ],
      type: "website",
    },
  };
};

const AreasAndCommunities = async ({ params: { locale } }) => {
  const { origin } = serverPathname();

  const res_areaPage = await fetchAPI(`pageArea?locale=${locale}`, "noCache");
  const res_communities = await fetchAPI(
    `communities/all?locale=${locale}`,
    "noCache"
  );

  const heading = res_areaPage?.attributes?.heading;
  const description = res_areaPage?.attributes?.description;
  const t_areas_and_communities = await getTranslations({
    locale,
    namespace: "areas_and_communities",
  });

  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const breadcrumbItems = [
    {
      title: (
        <p className="breadcrumb focus">
          {t_areas_and_communities("areas_and_communities")}
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
        "name": "Areas and Communities",
        "item": "${origin}/areas-and-communities"
      }]
    }`;

  console.log("res_communities.data", res_communities.data);

  let res_communities_translated = res_communities?.data?.map((item) =>
    item.attributes.description?.trim().length > 100
      ? item.attributes.description?.substring(0, 100)?.trim() + "..."
      : item.attributes.description?.trim()
  );
  const _description = res_communities_translated;

  res_communities_translated = res_communities.data =
    res_communities?.data?.map((item, index) => {
      return {
        ...item,
        attributes: {
          ...item.attributes,
          description: _description[index], // place translated text here
        },
      };
    });

  return (
    <div className="wrapper areasAndCommunities">
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <div className="top">
        <h1 className={`title ${isRTL ? "ar" : ""}`}>{heading}</h1>
        <p className={`subtitle ${isRTL ? "ar" : ""}`}>{description}</p>
        <GradientLine width={"80%"} />
        <div className="_container">
          {res_communities_translated?.map((community) => {
            const id = community?.id;
            const url = `/areas-and-communities/${community?.attributes?.slug}`;
            const logo_url = community?.attributes?.community_image?.data;
            const alternativeText =
              community?.attributes?.community_image?.data?.attributes
                ?.alternativeText;
            const title = community?.attributes?.community_name;
            // const numberOfProjects = isRTL ? formatNumberToArabic(community?.attributes?.totalOffplans) : community?.attributes?.totalOffplans

            const formatDescription =
              community?.attributes?.description?.toString();
            const description =
              formatDescription?.trim().length > 100
                ? formatDescription?.substring(0, 100)?.trim() + "..."
                : formatDescription?.trim();

            return (
              <CommunitiesAndAreasCard
                key={id}
                url={url}
                logo={logo_url}
                title={title}
                description={description}
                numberOfProjects={community?.attributes?.totalOffplans}
                alternativeText={alternativeText}
                locale={locale}
              />
            );
          })}
        </div>
        <CTAContainer
          style={{
            marginBottom: "7rem",
            marginTop: "7rem",
            width: "99%",
            textAlign: "center",
          }}
        />
        <div className="contentContainer">
          <SubscribeNewsletter
            title={t_areas_and_communities(
              "GET IN TOUCH WITH ONE OF OUR EXPERTS"
            )}
            type="contact-form"
          />
        </div>
      </div>
    </div>
  );
};

export default AreasAndCommunities;
