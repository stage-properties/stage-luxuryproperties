const {
  default: Breadcrumb,
} = require("@/app/[locale]/_components/Breadcrumb/Breadcrumb");
import { Link } from "@/i18n/routing";
import DeveloperCardHeader from "@/app/[locale]/_components/DeveloperCardHeader/DeveloperCardHeader";
import SearchResult from "./_SearchResult/SearchResult";
import { fetchSearchResults } from "@/app/[locale]/search/service";
import { fetchAPI } from "@/app/[locale]/_utils/fetch";
import { redirect } from "next/navigation";
import CTAContainer from "@/app/[locale]/_components/CTA/CtaContainer/CtaContainer";
import FaqSection from "@/app/[locale]/_components/Faq/FaqSection";
import { headers } from "next/headers";
import CommunitiesAndAreasCard from "@/app/[locale]/_components/CommunityAndAreasCard/CommunityAndAreasCard";
import { getTranslations } from "next-intl/server";
import Banner from "@/app/[locale]/_components/Banner/Banner";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

export const generateMetadata = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale, slug } = params;

  const getDeveloperInfo = await fetchAPI(
    `developers/${slug}?locale=${locale}`,
    "noCache"
  );

  let canonicalURL = `${origin}/${
    locale === "ar" ? "ar/" : ""
  }developers/${slug}`;

  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");

  const t = await getTranslations("common");

  const developer_communities =
    getDeveloperInfo?.data[0]?.attributes?.communities;
  const developer_name = getDeveloperInfo?.data[0]?.attributes?.developer_name;
  const developer_image_alternativeText =
    getDeveloperInfo?.data[0]?.attributes?.developer_logo?.data?.attributes
      ?.alternativeText;

  let title = developer_communities?.data?.length
    ? `${developer_name} ${t("Off Plan Projects & Communities")}`
    : `${developer_name} ${t("Off Plan Projects")}`;
  let description = getDeveloperInfo?.data[0]?.attributes?.meta_description;

  return {
    title: title + ` | ${t("Stage Properties")}`,
    description: description,
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
      title: title,
      description: description,
      images: [
        {
          url: `${origin}/stage-default.png`,
          width: 1200,
          height: 630,
          alt: developer_image_alternativeText || developer_name,
        },
      ],
      type: "website",
    },
  };
};

const Developer = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale, slug } = params;
  const t_developers = await getTranslations({
    locale,
    namespace: "developers",
  });

  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const getDeveloperInfo = await fetchAPI(
    `developers/${slug}?locale=${locale}`,
    "noCache"
  );

  const developer_name = getDeveloperInfo?.data[0]?.attributes?.developer_name;
  const developer_slug = getDeveloperInfo?.data[0]?.attributes?.slug;

  const getPropertiesByDeveloper = await fetchSearchResults(
    `slug=${developer_slug}&page=1&pageSize=9999&locale=${locale}`
  );

  if (!getDeveloperInfo?.data?.length) {
    return redirect(`/${locale}/developers`);
  }

  // Extract developer_description from getDeveloperInfo
  const developer_description =
    getDeveloperInfo?.data[0]?.attributes?.developer_description || "";

  const developer_image =
    getDeveloperInfo?.data[0]?.attributes?.developer_logo?.data?.attributes
      ?.url;
  const developer_communities =
    getDeveloperInfo?.data[0]?.attributes?.communities;
  const developer_image_alternativeText =
    getDeveloperInfo?.data[0]?.attributes?.developer_logo?.data?.attributes
      ?.alternativeText;

  const breadcrumbItems = [
    {
      title: (
        <Link href="/developers" className="breadcrumb">
          {t_developers("developers")}
        </Link>
      ),
    },
    {
      title: (
        <p className="breadcrumb focus">
          {developer_name.toString().toUpperCase()}
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
      "name": "Developers",
      "item": "${origin}/developers"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": "Developer",
      "item": "${origin}/developers/${params.developer}"
    }]
  }`;

  return (
    <div className="wrapper developer">
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <div className="__top" dir="ltr">
        <div className="isDesktop" dir={direction}>
          <h1 className="mainHeading __topProjects ___title">
            {developer_name}
          </h1>
        </div>
        <div className="isDesktop" dir={direction}>
          <DeveloperCardHeader
            title={developer_name}
            imageURL={developer_image}
            alternativeText={developer_image_alternativeText || developer_name}
            description={developer_description}
          />
        </div>
        <div className="isMobile">
          <img
            className="mobileLogo"
            src={developer_image}
            alt={developer_image_alternativeText || developer_name}
          />
          <h1 className="__title">{developer_name}</h1>
          <p className={`__subtitle ${isRTL ? "ar" : ""}`}>
            {developer_description}
          </p>
        </div>
        <div className="__seperator" />
        {getPropertiesByDeveloper?.data.length ? (
          <h2 className="mainHeading __topProjects">
            {t_developers("Top Off Plan Projects by")} {developer_name}
          </h2>
        ) : null}
        {getPropertiesByDeveloper?.data.length >= 1 &&
        getPropertiesByDeveloper?.data.length < 4 ? (
          <SearchResult searchData={getPropertiesByDeveloper} locale={locale} />
        ) : (
          <div className="splitDiv">
            <div className="left">
              <SearchResult
                searchData={getPropertiesByDeveloper}
                locale={locale}
              />
            </div>
            <div className="right">
              <Banner type={"HP"} imageBannerClass={"imageBannerClass"} />
            </div>
          </div>
        )}
        {developer_communities?.data?.length ? (
          <>
            <h2 className="mainHeading __topProjects">
              {t_developers("Top Communities Developed by")} {developer_name}
            </h2>
            <div className="_container">
              {developer_communities?.data?.map((community) => {
                const id = community?.id;

                const url = `/areas-and-communities/${community?.attributes?.slug}`;
                const logo_url = community?.attributes?.community_image?.data;
                const title = community?.attributes?.community_name;

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
                    numberOfProjects={0}
                    showNumberOfProjects={false}
                    className={"responsive"}
                    locale={locale}
                  />
                );
              })}
            </div>
          </>
        ) : null}
        {developer_communities?.data?.length ? (
          <Link href={"/areas-and-communities"} className="ctaBtnParent">
            <button className="globalBtn showMoreBtn ctaBtn">
              {t_developers("Check All Communities")}
            </button>
          </Link>
        ) : null}
        <FaqSection style={{ marginTop: "5rem", marginBottom: "5rem" }} />
        <CTAContainer style={{ marginTop: "4rem", marginBottom: "5rem" }} />
      </div>
    </div>
  );
};

export default Developer;
