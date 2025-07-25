import React from "react";
import BlogInfoSpotlight from "./_components/BlogInfoSpotlight/BlogInfoSpotlight";
import { fetchBlog } from "./service";
import BlogContent from "./_components/BlogContent/BlogContent";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import Chatbot from "@/app/[locale]/_components/Chatbot/Chatbot";
import FaqSection from "@/app/[locale]/_components/Faq/FaqSection";
import { notFound } from "next/navigation";
import { isObjectEmpty } from "@/app/[locale]/_utils/utils";
import { useServerPathname } from "@/app/[locale]/_utils/useServerPathname";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import getTranslation from "../../_utils/translate";
import DispatchLangSwitcher from "./_components/DispatchLangSwitcher";
import Banner from "@/app/[locale]/_components/Banner/Banner";
import Breadcrumb from "@/app/[locale]/_components/Breadcrumb/Breadcrumb";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

export const generateMetadata = async ({ params }) => {
  const { origin } = serverPathname();

  const { locale } = params;

  const blogId = params?.blogId;
  const blogInfo = await fetchBlog(blogId, locale);

  const headerList = headers();
  const fullURL = headerList.get("x-current-url").replace("ar/", "");

  if (isObjectEmpty(blogInfo)) {
    notFound();
  }

  let titleTranslation = blogInfo?.attributes?.seo?.metaTitle
    ? blogInfo?.attributes?.seo?.metaTitle + "| Stage Properties"
    : blogInfo?.attributes?.project_name + "| Stage Properties";
  let descriptionTranslation = blogInfo?.attributes?.seo?.metaDescription
    ? blogInfo?.attributes?.seo?.metaDescription
    : `Buy Property in Dubai - Stage Properties, Dubai's best investment property broker`;
  let openGraphURL =
    blogInfo?.attributes?.featured_image?.data?.attributes?.url;
  let openGraphAlt =
    blogInfo?.attributes?.featured_image?.data?.attributes?.alternativeText ||
    titleTranslation;
  let twitterImage = blogInfo?.attributes?.featured_image?.data?.attributes?.url
    ? blogInfo?.attributes?.featured_image?.data?.attributes?.url
    : "url/image.webp";
  let facebookImage = blogInfo?.attributes?.featured_image?.data?.attributes
    ?.url
    ? blogInfo?.attributes?.featured_image?.data?.attributes?.url
    : "url/image.webp";
  let keywords = blogInfo?.attributes?.seo?.keywords
    ? blogInfo?.attributes?.seo?.keywords
    : blogInfo?.attributes?.seo?.metaTitle;

  const translation = await getTranslation({
    text: { titleTranslation, descriptionTranslation },
    locale,
  });

  const slug = blogInfo?.attributes?.slug;

  // to check if the offplan have a translation in arabic
  const hasArabic = blogInfo?.hasArabic;
  const alternatesLanguage = hasArabic
    ? {
        "en-gb": fullURL,
        en: fullURL,
        "x-default": fullURL,
        ar: fullURL.replace(origin, `${origin}/ar`),
      }
    : {
        "en-gb": fullURL,
        en: fullURL,
        "x-default": fullURL,
      };

  return {
    metadataBase: new URL(origin),
    title: translation.titleTranslation,
    description: translation.descriptionTranslation,
    openGraph: {
      url: fullURL,
      title: translation.titleTranslation,
      description: translation.descriptionTranslation,
      images: [
        {
          url: openGraphURL,
          width: 1200,
          height: 630,
          alt: openGraphAlt,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      site: "Stage properties",
      title: translation.titleTranslation,
      description: translation.descriptionTranslation,
      image: twitterImage,
    },
    facebook: {
      card: "summary_large_image",
      site: "Stage properties",
      title: translation.titleTranslation,
      description: translation.descriptionTranslation,
      image: facebookImage,
    },
    alternates: {
      canonical: fullURL.replace("/en/", "/"),
      languages: alternatesLanguage,
    },
    keywords: keywords,
  };
};

const page = async ({ params }) => {
  const { origin } = serverPathname();
  const { locale } = params;
  const t_blogs = await getTranslations({ locale, namespace: "blogs" });

  const blogId = params?.blogId;
  const blogInfo = await fetchBlog(blogId, locale);
  // to check if the blog have a translation in arabic
  const hasArabic = blogInfo?.hasArabic;

  const blogInfoTranslation = await getTranslation({
    text: blogInfo?.attributes?.blog_title.toString().trim().toUpperCase(),
    locale,
  });
  const blogCategory =
    blogInfo?.attributes?.blog_categories?.data[0]?.attributes?.slug;

  const breadcrumbItems = [
    {
      title: (
        <Link href="/blogs" className="breadcrumb">
          {t_blogs("blogs")}
        </Link>
      ),
    },
    {
      title: <p className="breadcrumb focus">{blogInfoTranslation}</p>,
    },
  ];

  const slug = blogInfo?.attributes?.slug;

  const scriptJSON = `{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "${origin}${locale === "en" ? "" : `/${locale}`}"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Blogs",
      "item": "${origin}/${locale === "en" ? "" : `${locale}/`}blogs"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": "${blogInfo?.attributes?.blog_title.toString().trim()}",
      "item": "${origin}/${locale === "en" ? "" : `${locale}/`}blog/${slug}"
    }
    ]
  }`;

  return (
    <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <DispatchLangSwitcher hasArabic={hasArabic} />
      {/* <div id="chatbot">
        <Chatbot />
      </div> */}
      <div id="blogInfo" className="wrapper">
        <BlogInfoSpotlight blogInfo={blogInfo} locale={locale} />
        <div
          style={{
            display: "flex",
            position: "relative",
            justifyContent: "space-between",
          }}
        >
          <BlogContent
            blogContent={blogInfo?.attributes?.content}
            locale={locale}
            blogCategory={blogCategory}
            blogSlug={slug}
          />
          <div
            style={{
              position: "sticky",
              top: "105px",
              alignSelf: "flex-start",
              height: "calc(100vh - 100px)",
            }}
          >
            <Banner type={"HP"} imageBannerClass={"imageBannerClass"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
