import { fetchSecondaryProperties } from "@/app/[locale]/(dubai)/[offeringType]/service";
import { getTranslations } from 'next-intl/server';
import CommonCarousel from "../../_components/CommonCarousel/CommonCarousel";
import { Link } from '@/i18n/routing';
import { getFeaturedOffplans } from "../service";

const SecondaryListingSection = async ({ locale, type, title, subheading }) => {
  const t = await getTranslations({locale, namespace: 'common'});
  const direction = locale === 'ar' ? 'rtl' : 'ltr'

  let redirectURL = type === "SECONDARY-SALE" ? `${locale}/buy/residential/properties-for-sale` : type === "SECONDARY-RENT" ? `${locale}/rent/residential/properties-for-rent` : "/offplan";
  
  async function getSecondaryProperties() {
    let query = "";
    if (type === "SECONDARY-SALE") {
      query = "pg=1&searchType=scndry&offer=sale&ctg=residential";
    } else if ("SECONDARY-RENT") {
      query = "pg=1&searchType=scndry&offer=rent&ctg=residential";
    }
    properties = await fetchSecondaryProperties(query); // server side api calling
  };

  async function getFeaturedOffplanProperties() {
    properties = await getFeaturedOffplans(); // server side api calling
  };

  let properties;

  if(type === 'OFFPLAN') {
    await getFeaturedOffplanProperties()
  } else {
    await getSecondaryProperties();
  }
  
  return (
    <div className="listingProperties gradientBorder">
      <div className="wrapper">
        <div dir={direction}>
          <div className="headingSection">
            <h2 className="mainHeading gradientText">{title}</h2>
            <h3 className="mainHeading gradientText">{subheading}</h3>
          </div>
        </div>
        {properties?.data?.length && <CommonCarousel properties={properties?.data} type={type} configuration={properties?.configuration} />}
        <div className="buttonContainer" style={{marginTop: 'unset', margin: '0 auto'}}>
          <Link href={redirectURL} className="globalBtn showMoreBtn" style={{textAlign: 'center'}}>
            {t('Show All')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SecondaryListingSection;
