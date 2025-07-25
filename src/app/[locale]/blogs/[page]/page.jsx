import React from "react";
import BlogCard from "../../_components/blogCard/BlogCard";
import { fetchBlogs } from "../service";
import GradientLine from "../../_components/GradientLine/GradientLine";
import SubscribeNewsletter from "../../_components/SubscribeNewsletter/SubscribeNewsletter";
import { queryGeneratorAndWordChecker } from "../../_utils/utils";
import Pagination from "../../_components/Pagination/Pagination";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import { fetchPageInfo } from "../service";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import getTranslation from "../../_utils/translate";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

const Breadcrumb = dynamic(() =>
  import("@/app/[locale]/_components/Breadcrumb/Breadcrumb")
);

export async function generateMetadata({ params }) {
  const { origin } = serverPathname();
  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");
  const { locale, page } = params;

  const pageInfo = await fetchPageInfo(`locale=${locale}`);

  let meta_title = pageInfo.data.attributes.meta_title;
  let meta_description = pageInfo.data.attributes.meta_description;

  let metaTitleTranslation = meta_title;
  let metaDescriptionTranslation = meta_description;

  if (locale !== "en") {
    const translation = await getTranslation({
      text: { metaTitleTranslation, metaDescriptionTranslation },
      locale,
    });
    metaTitleTranslation = translation.metaTitleTranslation;
    metaDescriptionTranslation = translation.metaDescriptionTranslation;
  }

  return {
    title: metaTitleTranslation,
    description: metaDescriptionTranslation,
    alternates: {
      canonical: `${origin}/${locale === "ar" ? "ar/" : ""}blogs`,
      languages: {
        "en-gb": fullURL,
        en: fullURL,
        "x-default": fullURL,
        ar: fullURL.replace(origin, `${origin}/ar`),
      },
    },
    openGraph: {
      url: fullURL,
      title: metaTitleTranslation,
      description: metaDescriptionTranslation,
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

const handle404Page = (str) => {
  const pattern = /^page-\d+$/;
  if (!str.match(pattern)) notFound();
};

const page = async ({ params }) => {
  const { page, locale } = params;
  const isRTL = locale === "ar";

  const pageInfo = await fetchPageInfo(`locale=${locale}`);

  let page_heading = pageInfo.data.attributes.page_heading;
  let brief_intro = pageInfo.data.attributes.brief_intro;

  handle404Page(page);
  const { origin } = serverPathname();

  const t = await getTranslations({ locale, namespace: "blogs" });

  const query = queryGeneratorAndWordChecker(params);
  const blogs = await fetchBlogs(query?.query + `&locale=${locale}`);

  let pageHeadingTranslation = page_heading;
  let briefIntroTranslation = brief_intro;
  let blogsTranslation = blogs;

  if (locale !== "en") {
    const translation = await getTranslation({
      text: { pageHeadingTranslation, briefIntroTranslation },
      locale,
    });

    pageHeadingTranslation = translation.pageHeadingTranslation;
    briefIntroTranslation = translation.briefIntroTranslation;

    const blogsTitles = blogs?.data.map((blog) => blog?.attributes?.blog_title);
    const blogsTitlesTranslated = await getTranslation({
      text: blogsTitles,
      locale,
    });
    blogs?.data.map(
      (blog, index) =>
        (blog.attributes.blog_title = blogsTitlesTranslated[index])
    );
  }

  const currPaginationPage = blogs.meta.pagination.page;

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
      "name": "Blogs",
      "item": "${origin}/blogs"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": "Page ${currPaginationPage}",
      "item": "${origin}/blogs/page-${currPaginationPage}"
    }]
  }`;

  const breadcrumbItems = [
    {
      title: (
        <Link href="/blogs" className="breadcrumb">
          {t("blogs")}
        </Link>
      ),
    },
    {
      title: (
        <p className="breadcrumb focus">
          {t("page")} {currPaginationPage}
        </p>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <div id="blogsListing">
        <div className="wrapper">
          <h1 className={`mainHeading gradientText ${isRTL ? "ar" : ""}`}>
            {pageHeadingTranslation}
          </h1>
          <p className={`description ${isRTL ? "ar" : ""}`}>
            {briefIntroTranslation}
          </p>
          <GradientLine width={"50%"} />
          <div className="itemListing">
            {blogsTranslation?.data?.map((item) => (
              <div className="item" key={item?.blog_id}>
                <BlogCard data={item} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "3rem" }}>
            <Pagination pageDetails={blogs?.meta?.pagination} />
          </div>
          <GradientLine width={"50%"} />
          <SubscribeNewsletter type="newsletter-form" />
        </div>
      </div>
    </>
  );
};

export default page;
