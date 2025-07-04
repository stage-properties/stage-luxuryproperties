import Image from "next/image";
import { fetchAPI } from "./_utils/fetch";
import { getTranslations } from 'next-intl/server';
import HomePageLazyLoad from "./_homepageComponents/homePageLazyLoad/HomePageLazyLoad"
import Breadcrumb from "./_components/Breadcrumb/Breadcrumb";
import SearchSection from "./_components/SearchSection/SearchSection";

export async function generateMetadata({params}) {

  const { locale } = params
  const t = await getTranslations({locale, namespace: 'common'});

  const landingPageInfoRes = await fetchAPI(`/landingPage?locale=${locale}`, "noCache");
  const landingPageInfo = landingPageInfoRes[0]?.attributes
  const meta_title = landingPageInfo?.meta_title || `${t("Stage Properties | Dubai's leading property broker")}`
  const meta_description = landingPageInfo?.meta_description || `${t("Discover prime investment opportunities with Stage Properties in dubai")}`

  try {
    return {
      title: meta_title,
      description: meta_description,
      alternates: {
        canonical: `https://stageproperties.com/${locale === 'ar' ? 'ar' : ''}`,
        languages: {
          'en-gb': 'https://stageproperties.com',
          'en': 'https://stageproperties.com',
          'x-default': 'https://stageproperties.com',
          'ar': 'https://stageproperties.com/ar',
        },
      },
      openGraph: {
        url: "https://stageproperties.com",
        title: meta_title,
        description: meta_description,
        images: [
          {
            url: "https://stageproperties.com/stage-default.png",
            width: 1200,
            height: 630,
            alt: "Logo",
          },
        ],
        type: "website",
      },
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: 'Default Title',
      description: 'Default Description',
    };
  }
}


export default async function Home({params: {locale}}) {
  const t = await getTranslations({locale, namespace: 'common'});

  const landingPageInfoRes = await fetchAPI(`/landingPage?locale=${locale}`, "noCache");
  const landingPageInfo = landingPageInfoRes[0]?.attributes

  const title = landingPageInfo?.title || t('smart_investments_start_here')
  const subtitle = landingPageInfo?.subtitle

  const cta_title = landingPageInfo?.cta_title
  const our_story = landingPageInfo?.our_story
  const slide_1 = landingPageInfo?.slide_1
  const slide_2 = landingPageInfo?.slide_2
  const slide_3 = landingPageInfo?.slide_3
  const properties_for_sale_subheading = landingPageInfo?.properties_for_sale_subheading
  const properties_for_rent_subheading = landingPageInfo?.properties_for_rent_subheading
  const blogs_subheading = landingPageInfo?.blogs_subheading
  const community_subheading = landingPageInfo?.community_subheading

  return (
    <>
      <main>
        <Breadcrumb home={false} />
        <div id="homePage">
          <div className="videoContainer">
            <Image 
              className="hero" 
              priority={true} 
              src="/1704292151466_compressed.webp" 
              fill 
              alt="Dubai skyscrapers"
              quality={60} 
              sizes="(max-width:980px 100vw)" 
            />
            <div className="headlineParent wrapper">
              <h1 className="headline"><span className="part-1">{t("Leading Property")} </span><span>{t("Broker in Dubai")}</span></h1>
              <span className="subheadline"><span className="part-1">{t("Smart Investments")}</span><span> {t("Start Here")}</span></span>
            </div>
          </div>
          <div className="searchComponent">
            <div className="wrapper">
              <h2 className="mainHeading gradientText title">
                {cta_title}
              </h2>
              <span className="downArrow" />
              <SearchSection bgColor={false} />
            </div>
          </div>
          <HomePageLazyLoad 
            locale={locale}
            our_story={our_story} 
            slide_1={slide_1} 
            slide_2={slide_2} 
            slide_3={slide_3} 
            properties_for_sale_subheading={properties_for_sale_subheading}
            properties_for_rent_subheading={properties_for_rent_subheading}
            blogs_subheading={blogs_subheading}
            community_subheading={community_subheading}
          />
        </div>
      </main>
    </>
  );
}
