import { getTranslations } from 'next-intl/server';
import { getFeaturedOffplans } from "../service";
import CategoryCarousel from "../../_components/categoryCarousel/CategoryCarousel";

const FeaturedLuxuries = async ({locale}) => {

  const t = await getTranslations({locale, namespace: 'common'});
  let featuredOffplansResponse = await getFeaturedOffplans(`page=1&ln=${locale}`) // server side api calling

  return (
    <div className="featuredLuxuriesProperties">
      <h2 className="mainHeading gradientText" style={{marginTop: '5rem'}}>{t('featured_properties_for_you').toUpperCase()}</h2>
      <div className="wrapper">
        {featuredOffplansResponse?.data?.length && <CategoryCarousel featuredData={featuredOffplansResponse}/>}
      </div>
    </div>
  );
};

export default FeaturedLuxuries;
