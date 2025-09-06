import CommuntiySlider from "./CommuntiySlider";
import { getFeaturedCities } from "../service";
import { getTranslations } from "next-intl/server";

import Link from "next/link";

const CommunitySection = async ({ locale, community_subheading }) => {
  const t = await getTranslations({ locale, namespace: "common" });
  const featuredCityData = await getFeaturedCities(`page=1&locale=${locale}`);

  return (
    <div className="communitySection">
      <div className="wrapper">
        <h2 className="mainHeading gradientText">{t("dubai_s_most")}</h2>
        <h2 className="mainHeading gradientText">{t("coveted_enclaves")}</h2>
        <h3 className="mainHeading gradientText marginTop">
          {t(
            "explore_the_neighborhoods_where_luxury_is_not_just_a_standard_but_a_lifestyle"
          )}
        </h3>
        <CommuntiySlider featuredCityData={featuredCityData?.data} />
      </div>
    </div>
  );
};

export default CommunitySection;
