import Image from "next/image";
import { Link } from '@/i18n/routing';
import ViewAllButton from "./components/ViewAllButton";
import { fetchBlogs } from "@/app/[locale]/_commonService/network";
import { getTranslations } from 'next-intl/server';

const BlogSection = async ({locale, blogs_subheading}) => {
  const t = await getTranslations({locale, namespace: 'common'});
  const blogs = await fetchBlogs(locale, "featured:asc");

  return (
    <div className="blogSection">
      <div className="imageContainer">
        <div className="contentContainer">
          <div className="wrapper">
            <h2 className="mainHeading gradientText">{t('blogs')}</h2>
            <h3 className="mainHeading gradientText">{blogs_subheading}</h3>
            <div className="containers">
              <div className="left">
                <Link href={`/blog/${blogs&&blogs[0]?.attributes?.slug}`}>
                  <div className="imageContainer gradientBorder">
                    <Image
                      src={
                       ( blogs?.length>0 && blogs[0]?.attributes?.featured_image?.data?.attributes?.url)
                          ? blogs[0]?.attributes?.featured_image?.data?.attributes?.url
                          : "/ourStoryBG.jpeg"
                      }
                      fill={true}
                      alt={blogs?.length > 0 && (blogs[0]?.attributes?.featured_image?.data?.attributes?.alternativeText || blogs[0]?.attributes?.blog_title)}
                    />
                  </div>
                  <p  className="blog_title flexible_front">{blogs[0]?.attributes?.blog_title}</p>
                </Link>
                <div className="desktop-only">
                  <ViewAllButton />
                </div>
              </div>
              <div className="right">
                {blogs?.length>0 && blogs?.slice(1, 4)?.map((item, index) => (
                  <Link href={`/blog/${item?.attributes?.slug}`} key={item?.id}>
                    <div
                      className="imageContainer gradientBorder"
                      key={item?.blog_id}
                    >
                      <Image
                        src={item?.attributes?.featured_image?.data?.attributes?.url}
                        fill={true}
                        alt={item?.attributes?.featured_image?.data?.attributes?.alternativeText || item?.attributes?.blog_title}
                      />
                    </div>
                    <p className="blog_title"
                    >{item?.attributes?.blog_title}</p>
                  </Link>
                ))}
              </div>
              <div className="mobile-only">
                <ViewAllButton  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
