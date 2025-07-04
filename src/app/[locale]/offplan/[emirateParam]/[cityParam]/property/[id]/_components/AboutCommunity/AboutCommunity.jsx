'use client'

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

const AboutCommunity = ({ offplanData }) => {

    const t = useTranslations('offplan_single')
    const locale = useLocale()
    const isRTL = locale === 'ar'
    const direction = isRTL ? 'ltr' : 'rtl'
    const directionleft = !isRTL ? 'ltr' : 'rtl'

    let community_name = offplanData?.attributes?.community?.data?.attributes?.community_name
    let community_description = offplanData?.attributes?.community?.data?.attributes?.description
    const community_logo = offplanData?.attributes?.community?.data?.attributes?.community_image?.data?.attributes?.url;
    const community_logo_alt = offplanData?.attributes?.community?.data?.attributes?.community_image?.data?.attributes?.alternativeText || community_name;
    const community_slug = offplanData?.attributes?.community?.data?.attributes?.slug;

    return (
        <div className="aboutDeveloper gradientBorder" dir={direction}>
            <div className="wrapper">
                <div className="parent imageParent">
                    <img className="developer_image" src={community_logo} alt={community_logo_alt} />
                </div>
                <div className="parent" dir={directionleft}>
                    {isRTL ? 
                    <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t("About The Community")} - {community_name}</h2> 
                    : 
                    <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t("About The Community")} - {community_name}</h2> 
                    }
                    <p className="developer_description">{community_description}</p>
                    <Link className='globalBtn generalButton' href={`/areas-and-communities/${community_slug}`}>{t('View all community projects')}</Link>
                </div>
            </div>
        </div>
    );

}

export default AboutCommunity