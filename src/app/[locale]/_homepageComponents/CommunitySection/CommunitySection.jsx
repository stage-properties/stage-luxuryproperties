import CommuntiySlider from './CommuntiySlider'
import { getFeaturedCities } from '../service'
import { getTranslations } from 'next-intl/server';

import Link from 'next/link';

const CommunitySection = async ({locale, community_subheading}) => {
  const t = await getTranslations({locale, namespace: 'common'});
  const featuredCityData = await getFeaturedCities(`page=1&locale=${locale}`)

  return (
    <div className='communitySection gradientBorder'>
        <div className="wrapper">
            <h2 className="mainHeading gradientText">{t('discover_upcoming_projects_in_dubai_s_vibrant_communities')}</h2>
            <h3 className="mainHeading gradientText">{community_subheading}</h3>
            <CommuntiySlider featuredCityData={featuredCityData?.data}/>
            <div className="_buttonContainer">
              <Link href={'/areas-and-communities'}>
                <button className="globalBtn showMoreBtn">{t('Show All')}</button>
              </Link>
            </div>
        </div>
    </div>
  )
}

export default CommunitySection