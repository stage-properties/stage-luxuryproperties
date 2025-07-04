import { fetchSecondaryProperties } from "@/app/[locale]/(dubai)/[offeringType]/service";
import PropertyCard from "../PropertyCard/PropertyCard";
import Carousel from "./Carousel";
import { getTranslations } from 'next-intl/server';

const NoData = async ({ query, locale = 'en' }) => {
    
    const t = await getTranslations('no_data');

    const data = await fetchSecondaryProperties(query + `&locale=en`);
    
    return (
        <div className='noData'>
            <img className="noDataImg" src='/noData.svg' alt="No Data" />
            <h3 className='we_could_not_find_match'>{t("we_couldn_t_find_a_perfect_match")}</h3>
            <h3 className='similar_interests'>{t("but_these_units_might_interest_you")}</h3>
            {data?.data?.length && <Carousel data={data} Card={PropertyCard} />}
        </div>
    );
};

export default NoData;