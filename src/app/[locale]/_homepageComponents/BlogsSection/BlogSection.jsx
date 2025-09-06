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
            <h2 className="mainHeading gradientText">{t("blogs")}</h2>
            <h3 className="mainHeading gradientText">
              {t(
                "a_comprehensive_collection_of_investments_expertise_and_insights"
              )}
            </h3>

            {/* ✅ Slick carousel (client) */}
            <BlogCarousel blogs={blogs ?? []} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogSection;
