import { services, services_ar } from "./data";
import OurServicesCard from "@/app/[locale]/_components/OurServicesCard/OurServicesCard";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

const OurServices = () => {
  
  const t = useTranslations('common');
  const locale = useLocale()
  const isRTL = locale === 'ar'

  const _services = isRTL ? services_ar : services

  return (
    <div className="ourServicesSection gradientBorder">
      <div className="serviceList">
        <div className="wrapper">
          <h2 className={`mainHeading gradientText ${isRTL ? 'ar' : ''}`}>{t('our_services')}</h2>
          <h3 className="mainHeading gradientText">{t('at_stage_properties_we_offer_a_comprehensive_range_of_services')}</h3>
          <div className="scrollContainer">
            <div className="servicesContainer">
              {_services?.map((item) => (
                <div className={`serviceItem ${isRTL ? 'ar' : ''}`} key={item?.id}>
                  <OurServicesCard data={item} />
                </div>
              ))}
            </div>
          </div>
          <div className="line">
            <Image src="/gradientLine.png" fill={true} alt="Gradient-line" />
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="mortgageCalculator">
          <h2 className={`mainHeading gradientText ${isRTL ? 'ar' : ''}`}>
            {t('discover_your_affordable_mortgage_payment')}
          </h2>
          <h3 className={`mainHeading gradientText ${isRTL ? 'ar' : ''}`}>
            {t('let_s_find_your_perfect_loan_from_our_bank_partners')}
          </h3>
          <Link href={'/mortgage-calculator'}>
            <button className="globalBtn showMoreBtn">{t('get_your_free_mortgage_calculator')}</button>     
          </Link>
        </div>
      </div>
     
    </div>
  );
};

export default OurServices;
