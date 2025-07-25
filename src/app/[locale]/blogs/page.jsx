import React from "react";
import BlogCard from "../_components/blogCard/BlogCard";
import { fetchBlogs } from "./service";
import GradientLine from "../_components/GradientLine/GradientLine";
import SubscribeNewsletter from "../_components/SubscribeNewsletter/SubscribeNewsletter";
import { queryGeneratorAndWordChecker } from "../_utils/utils";
import Pagination from "../_components/Pagination/Pagination";
import dynamic from "next/dynamic";
import { fetchPageInfo } from "./service";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import getTranslation from "../_utils/translate";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

const Breadcrumb = dynamic(() =>
  import("@/app/[locale]/_components/Breadcrumb/Breadcrumb")
);

export async function generateMetadata({ params }) {
  const { origin } = serverPathname();
  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");
  const { locale } = params;

  const pageInfo = await fetchPageInfo(`locale=${locale}`);

  let meta_title = pageInfo.data.attributes.meta_title;
  let meta_description = pageInfo.data.attributes.meta_description;

  let metaTitleTranslation = meta_title;
  let metaDescriptionTranslation = meta_description;

  const translation = await getTranslation({
    text: { metaTitleTranslation, metaDescriptionTranslation },
    locale,
  });
  metaTitleTranslation = translation.metaTitleTranslation;
  metaDescriptionTranslation = translation.metaDescriptionTranslation;

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
          alt: "all blogs",
        },
      ],
      type: "website",
    },
  };
}

const page = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale } = params;
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const pageInfo = await fetchPageInfo(`locale=${locale}`);

  let page_heading = pageInfo.data.attributes.page_heading;
  let brief_intro = pageInfo.data.attributes.brief_intro;

  const query = queryGeneratorAndWordChecker();
  const blogs = await fetchBlogs(query?.query + `&locale=${locale}`);

  const t_blogs = await getTranslations({ locale, namespace: "blogs" });

  let pageHeadingTranslation = page_heading;
  let briefIntroTranslation = brief_intro;
  let blogsTranslation = blogs;

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
  blogsTranslation?.data.map(
    (blog, index) => (blog.attributes.blog_title = blogsTitlesTranslated[index])
  );

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
    }]
  }`;

  const breadcrumbItems = [
    {
      title: <p className="breadcrumb focus">{t_blogs("blogs")}</p>,
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
              <div className="item" key={item?.id}>
                <BlogCard data={item} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "3rem" }}>
            {blogs?.meta?.pagination?.pageCount > 1 && (
              <Pagination pageDetails={blogs?.meta?.pagination} />
            )}
          </div>
          <GradientLine width={"50%"} />
          <SubscribeNewsletter type="newsletter-form" />
        </div>
      </div>
    </>
  );
};

export default page;
