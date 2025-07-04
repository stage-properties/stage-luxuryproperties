import { getTranslations } from 'next-intl/server';
import OurStory from "../OurStory/OurStory";
import OurServices from "../OurServices/OurServices";
import BlogSection from "../BlogsSection/BlogSection";
// import FaqSection from "../../_components/Faq/FaqSection"
import Banner from '@/app/[locale]/_components/Banner/Banner'
import FeaturedLuxuries from "../FeaturedLuxuries/FeaturedLuxuries";
import MeetOurTeam from "../MeetOurTeam/MeetOurTeam";
import CommunitySection from "../CommunitySection/CommunitySection";
import MarketOverviewSection from "../MarketOverviewSection/MarketOverviewSection";
import SecondaryListingSection from "../PropertiesListing/PropertiesListingSection";
import Review from '../../_components/Review/review'

const HomePageLazyLoad = async ({locale, our_story, slide_1, slide_2, slide_3, properties_for_sale_subheading, properties_for_rent_subheading, blogs_subheading, community_subheading}) => {
  const direction = locale === 'ar' ? 'rtl' : 'ltr'  
  const t = await getTranslations({locale, namespace: 'common'});
  // const isMobile = useIsMobile({maxWidth: 768})
  return (
    <>
      <FeaturedLuxuries locale={locale} />
      <div dir={direction}>
        <Review />
        <Banner type={'MPU'} />
        <OurStory our_story={our_story} slide_1={slide_1} slide_2={slide_2} slide_3={slide_3} />
      </div>
      <SecondaryListingSection locale={locale} subheading={properties_for_sale_subheading} type={'SECONDARY-SALE'} title={t('properties_for_sale').toUpperCase()}/>
      <SecondaryListingSection locale={locale} subheading={properties_for_rent_subheading} type={'SECONDARY-RENT'} title={t('properties_for_rent').toUpperCase()}/>
      <div dir={direction}>
        <OurServices />
      </div>
      <Banner type={'MPU'} />
      <MeetOurTeam />
      <CommunitySection community_subheading={community_subheading} locale={locale} />
      <MarketOverviewSection locale={locale} />
      <div style={{
          border: '1px solid transparent',
          borderImage: 'radial-gradient(circle, rgba(255, 236, 224, 1) 0%, rgba(240, 202, 178, 1) 35%, rgba(172, 131, 109, 1) 100%)',
          borderImageSlice: 1,
          borderWidth: '6px',
          borderLeft: 'none',
          borderRight: 'none'
      }}>
      </div>
      <BlogSection locale={locale} blogs_subheading={blogs_subheading} />
    </>
  );
};

export default HomePageLazyLoad;
