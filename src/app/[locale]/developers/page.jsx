import Breadcrumb from "../_components/Breadcrumb/Breadcrumb"
import DeveloperCard from "../_components/DeveloperCard/DeveloperCard"
import GradientLine from "../_components/GradientLine/GradientLine"
import { fetchAPI } from "../_utils/utils"
import SubscribeNewsletter from "../_components/SubscribeNewsletter/SubscribeNewsletter"
import CTAContainer from "../_components/CTA/CtaContainer/CtaContainer"
import FaqSection from "../_components/Faq/FaqSection"
import { useServerPathname } from "../_utils/useServerPathname"
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server"

export const generateMetadata = async ({ params }) => {
  
  const {locale} = params
  const res_developerPage = await fetchAPI(`developersPage?locale=${locale}`, 'noCache')
  const metaTitle = res_developerPage?.metaTitle
  const metaDescription = res_developerPage?.metaDescription


  const canonicalURL = `https://stageproperties.com/${locale === 'ar' ? 'ar/' : '' }developers`

  const headerList = headers()
  const fullURL = headerList.get('x-current-url').replace('ar/', '')

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalURL,
      languages: {
        'en-gb': fullURL,
        'en': fullURL,
        'x-default': fullURL,
        'ar': fullURL.replace('https://stageproperties.com', 'https://stageproperties.com/ar'),
      },
    },
    openGraph: {
      url: fullURL,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: 'https://stageproperties.com/stage-default.png',
          width: 1200,
          height: 630,
          alt: 'all developers'
        }
      ],
      type: 'website'
    }
  };
};

const Developers = async ({params}) => {
  
  const { locale } = params
  const res_developerPage = await fetchAPI(`developersPage?locale=${locale}`, 'noCache')
  const isRTL = locale == 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'
  const t = await getTranslations({locale, namespace: 'developers'});

    const breadcrumbItems = [
        {
          title: <p className="breadcrumb focus">{t('developers')}</p>
        }
    ]

    const scriptJSON = 
    `{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://stageproperties.com/"
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "Developers",
        "item": "https://stageproperties.com/developers"
      }]
    }`

    const subTitle =  res_developerPage?.subtitle
    
    return (
        <div className="wrapper developers" dir={direction}> 
          <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON}/>
          <div className="top">
              <h1 className={`title ${isRTL ? 'ar' : ''}`}>{t('real_estate_developers_in_dubai')}</h1>
              <p className={`subtitle ${isRTL ? 'ar' : ''}`}>{subTitle}</p>
              <div className="isDesktop" style={{display:"none"}}><GradientLine width={"80%"}/></div>
                  <div className="_container">
                  {
                    res_developerPage?.sorted_res_developers?.map((item, index) => {
                      const alternativeText = item?.attributes?.developer_logo?.data?.attributes?.alternativeText
                      const slug = item?.attributes?.slug

                      return (
                        <DeveloperCard
                          locale={locale}
                          key={index}
                          url={`/developers/${slug}`}
                          logo={item?.attributes?.developer_logo?.data}
                          title={item?.attributes?.developer_name}
                          numberOfProjects={item?.attributes?.offplans?.data?.length}
                          alternativeText={alternativeText}
                        />
                      )
                    })
                  }
                  </div>          
              <CTAContainer style={{marginTop: '7rem'}}/>
              <FaqSection classname={'faqContainer'}/>
              <div className="contentContainer">
                <SubscribeNewsletter title={t("GET IN TOUCH WITH ONE OF OUR EXPERTS")} type='contact-form'/>
              </div>
          </div>
      </div>
    )
}

export default Developers