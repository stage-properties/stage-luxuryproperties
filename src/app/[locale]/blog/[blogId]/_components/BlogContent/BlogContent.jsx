import React from "react";
import parse, { domToReact } from "html-react-parser";
import SubscribeNewsletter from "@/app/[locale]/_components/SubscribeNewsletter/SubscribeNewsletter";
import FaqSection from "@/app/[locale]/_components/Faq/FaqSection";
import ContactAgentForm from "@/app/[locale]/_components/ContactAgentForm/ContactAgentForm";
import { getRandomAgentImage } from "@/app/[locale]/_commonService/network";
import CTAContainer from "@/app/[locale]/_components/CTA/CtaContainer/CtaContainer";
import { getTranslations } from "next-intl/server";
import Banner from "@/app/[locale]/_components/Banner/Banner";
import BlogCard from "@/app/[locale]/_components/blogCard/BlogCard";
import { fetchYouMayLikeBlogs } from "@/app/[locale]/blog/[blogId]/service";

const BlogContent = async ({ blogContent, locale, blogCategory, blogSlug }) => {
  const youMayLikeBlogs = await fetchYouMayLikeBlogs({
    categorySlug: blogCategory,
    locale: locale,
    pageSize: 4
  });
  const youMayLikeBlogsData = youMayLikeBlogs?.data?.blogs?.data;

  const t = await getTranslations({ locale, namespace: "blog" });
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const random_agent_image = await getRandomAgentImage();
  const formRef = "";

  let h2Count = 0; // Counter for h2 tags

  const parsedBlogContent = parse(blogContent, {
    replace: (domNode, index) => {
      if (domNode.type === "tag" && domNode.name.toLowerCase() === "h2") {
        h2Count++;
        // For the first h2, return it as is without a banner
        if (h2Count === 1) {
          return React.createElement(
            domNode.name,
            { ...domNode.attribs, key: `h2-${index}` },
            domToReact(domNode.children)
          );
        }
        return (
          <React.Fragment key={`frag-${index}`}>
            <div className="banner-wrapper">
              <Banner type={"MPU"} key={`banner-${index}`} />
            </div>
            {React.createElement(
              domNode.name,
              { ...domNode.attribs, key: `h2-${index}` },
              domToReact(domNode.children)
            )}
          </React.Fragment>
        );
      }
    }
  });

  // Filter blogs and limit to a maximum of three items
  const filteredBlogs = youMayLikeBlogsData
    ?.filter((item) => item?.attributes?.slug !== blogSlug)
    .slice(0, 3);

  // Calculate container width based on the number of items
  const widthForBlogCard = () => {
    if (filteredBlogs?.length === 1) {
      return "33.33%";
    } else if (filteredBlogs?.length === 2) {
      return "66.66%";
    } else if (filteredBlogs?.length === 3) {
      return "100%";
    }
  };

  return (
    <div className="BlogContent" dir={direction}>
      <div className={`${isRTL ? "ar" : ""}`}>
        {blogContent && parsedBlogContent}
        <div className="nextSection">
          <FaqSection className="faq-section" />
          <div className="cta-wrapper">
            <CTAContainer />
          </div>
          {filteredBlogs.length > 0 ? <>
            <h2 className="you-may-also-like-title">{t('You May Also Like')}</h2>
            <div
              className="blog-cards-container"
              style={{ "--container-width": widthForBlogCard() }}
            >
              {filteredBlogs.map((item) => (
                <BlogCard key={item.id} data={item} />
              ))}
            </div>
          </> : null}
          <div className="contact-agent-wrapper">
            <ContactAgentForm
              agentImageURL={random_agent_image.url}
              formRef={formRef}
              title={t("Talk to an agent")}
              projectName={"project_name"}
              pageName={""}
            />
          </div>
          <SubscribeNewsletter type="newsletter-form" />
        </div>
      </div>
    </div>
  );
};

export default BlogContent;