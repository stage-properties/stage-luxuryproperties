'use client'

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import Banner from '@/app/[locale]/_components/Banner/Banner';

const AboutDeveloper = ({ offplanData, developer_description }) => {

    const t = useTranslations('offplan_single');
    const locale = useLocale()
    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : 'ltr'

    const developer_name = offplanData?.attributes?.developer?.data?.attributes?.developer_name;
    const developer_logo = offplanData?.attributes?.developer?.data?.attributes?.developer_logo?.data?.attributes?.url;
    const developer_logo_alt = offplanData?.attributes?.developer?.data?.attributes?.developer_logo?.data?.attributes?.alternativeText || developer_name;
    const developer_slug = offplanData?.attributes?.developer?.data?.attributes?.slug;

    return (
        <div className="aboutDeveloper gradientBorder" dir={direction}>
            <div className="wrapper">
                <div className="parent imageParent">
                    <img className="developer_image" src={developer_logo} alt={developer_logo_alt} />
                </div>
                <div className="parent">
                    {isRTL ? 
                    <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t("About The Developer")} - {developer_name}</h2> 
                    : 
                    <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t("About The Developer")} - {developer_name}</h2> 
                    }
                    <p className="developer_description">{developer_description}</p>
                    <Link className='globalBtn generalButton' href={`/developers/${developer_slug}`}>{t('View all developer projects')}</Link>
                </div>
            </div>
            <div className="wrapper" style={{marginTop: '5rem'}}>
                <Banner type={'LDR'} />
            </div>
        </div>
    );
};

export default AboutDeveloper;