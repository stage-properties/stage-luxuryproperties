import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { fetchBlogs } from "@/app/[locale]/_commonService/network";
import BlogCarousel from "./components/BlogCarousel";

const BlogSection = async ({ locale, blogs_subheading }) => {
  const t = await getTranslations({ locale, namespace: "common" });
  const blogs = await fetchBlogs(locale, "featured:asc");

  return (
    <div id="homePage">
      <section className="blogSection">
        <div className="contentContainer">
          <div className="wrapper">
            <h2 className="title">{t("blogs")}</h2>

            {/* 🌟 subtitle + spotlight */}
            <div className="blog-subtitleStage">
              <div className="blog-spotlight" aria-hidden="true" />
              <h3 className="subtitle">
                A Comprehensive Collection of Investments
                <br /> Expertise and Insights
              </h3>
            </div>

            {/* ✅ Slick carousel (client) */}
            <BlogCarousel blogs={blogs ?? []} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogSection;
