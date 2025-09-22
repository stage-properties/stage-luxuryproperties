import CommuntiySlider from "./CommuntiySlider";
import { getFeaturedCities } from "../service";
import { getTranslations } from "next-intl/server";

const CommunitySection = async ({ locale }) => {
  const t = await getTranslations({ locale, namespace: "common" });
  const featuredCityData = await getFeaturedCities(`page=1&locale=${locale}`);

  return (
    <div className="communitySection">
      <div className="communitySectionParent">
        <h2 className="title">{t("dubai_s_most")}</h2>
        <h2 className="subtitle">{t("coveted_enclaves")}</h2>
        {/* 🌟 Wrap the text + glow in a stage */}
        <div className="community-textStage">
          <div className="community-spotlight" aria-hidden="true" />
          <h3 className="text">
            Explore the neighborhoods where luxury is not just a standard, but a
            lifestyle.
          </h3>
        </div>
        <div className="community-slider">
          <CommuntiySlider featuredCityData={featuredCityData?.data} />
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
