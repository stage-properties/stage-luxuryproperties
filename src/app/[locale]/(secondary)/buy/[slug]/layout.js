import { headers } from "next/headers";
import { fetchSingleSecondaryProperty } from "../../service";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import { formatNumberToArabic } from "@/app/[locale]/_utils/utils";

const findTitle = async (SecondaryPropertyData, locale) => {
    
    const t_common = await getTranslations({locale, namespace: 'common'});
    const t = await getTranslations({locale, namespace: 'single_secondary'});

    const propertyData = SecondaryPropertyData?.data
    const category = propertyData?.attributes?.category?.data?.attributes?.category_name;
    const offeringType = propertyData?.attributes?.offering_type?.data?.attributes?.type;
    const emirate = propertyData?.attributes?.emirate?.data?.attributes?.emirate_name;
    const emirate_ar = propertyData?.attributes?.emirate?.data?.attributes?.localizations?.data?.[0]?.attributes?.emirate_name
    const _emirate = locale === 'ar' ? emirate_ar ?? emirate : emirate

    const propertyType = propertyData?.attributes?.property_type?.data?.attributes?.type;
    const _community = locale === 'ar' ? propertyData?.attributes?.community?.data?.attributes?.localizations?.data?.[0]?.attributes?.community_name ?? propertyData?.attributes?.community?.data?.attributes?.community_name : propertyData?.attributes?.community?.data?.attributes?.community_name

    let englishTitle = "";
    let arabicTitle = "";

    const bedrooms = propertyData?.attributes?.bedrooms

    const NumToBedroomsInAR = (number) => {
        if(number == 0) return t('studio')
        if(number == 1) return locale === 'ar' ? t('bedroom') : `${number} ${t('bedroom')}`
        else if(number == 2) return locale === 'ar' ? t('two-bedrooms') : `${number} ${t('bedrooms')}`
        else if(number > 2) return `${locale === 'ar' ? `من ${formatNumberToArabic(number)}` : number} ${t('bedrooms')}`
    }
    
    if (category === "Residential") {
        if (propertyData?.attributes?.bedrooms == "0") {
            // When bedrooms is "0", we assume this is a studio
            englishTitle = `${t('studio')} ${t('for')} ${t(offeringType.toLowerCase())} ${t('in')} ${_community}, ${_emirate}`;
            // Arabic order: you might want to reverse certain parts and use an Arabic comma (،)
            arabicTitle = `${t('studio')} ${t('for')}${t(offeringType.toLowerCase())} ${t('in')} ${_community}، ${_emirate}`;
        } else if (bedrooms) {
            // When there is a bedroom count
            englishTitle = `${NumToBedroomsInAR(bedrooms)} ${t_common(propertyType?.toLowerCase())} ${t('for')} ${t(offeringType.toLowerCase())} ${t('in')} ${_community}, ${_emirate}`;
            arabicTitle = `${t_common(propertyType?.toLowerCase())} ${NumToBedroomsInAR(bedrooms)} ${t('for')}${t(offeringType.toLowerCase())} ${t('in')} ${_community}، ${_emirate}`;
        } else {
            // Fallback when bedroom count is not provided
            englishTitle = `${t_common(propertyType?.toLowerCase())} ${t('for')} ${t(offeringType.toLowerCase())} ${t('in')} ${_community}, ${_emirate}`;
            arabicTitle = `${t_common(propertyType?.toLowerCase())} ${t('for')}${t(offeringType.toLowerCase())} ${t('in')} ${_community}، ${_emirate}`;
        }
    } else {
        // Fallback for non-residential categories
        englishTitle = `${t_common(propertyType?.toLowerCase())} ${t('for')} ${t(offeringType.toLowerCase())} ${t('in')} ${_community}, ${_emirate}`;
        arabicTitle = `${t_common(propertyType?.toLowerCase())} ${t('for')}${t(offeringType.toLowerCase())} ${t('in')} ${_community}، ${_emirate}`;
    }

    const property_ref_no = propertyData?.attributes?.property_ref_no

    const title = locale === 'ar' ? arabicTitle + " " + property_ref_no.replaceAll('-', ' - ') + " " : (englishTitle + " " + property_ref_no.replaceAll('-', ' - '))

    return title
}

const findDescription = (SecondaryPropertyData) => {
    const propertyData = SecondaryPropertyData?.data

    const meta_description = propertyData?.attributes?.meta_description
    return meta_description
}

export const generateMetadata = async ({ params }) => {

    const {locale, slug} = params
    const t = await getTranslations({locale, namespace: 'common'});

    const SecondaryPropertyData = await fetchSingleSecondaryProperty(params?.slug + `?ln=${locale}`);
    if(!SecondaryPropertyData?.data?.attributes) notFound()

    const property_ref_no = SecondaryPropertyData?.data?.attributes?.property_ref_no
    const chosenTitle = SecondaryPropertyData?.data?.attributes?.chosen_title
    const title = chosenTitle || await findTitle(SecondaryPropertyData, locale)

    const featuredImageURL = SecondaryPropertyData?.data?.attributes?.featured_image?.data?.attributes?.url
    const featuredImageAlternativeText = SecondaryPropertyData?.data?.attributes?.featured_image?.data?.attributes?.alternativeText

    const BASE_URL = 'https://stageproperties.com/'
    const paramsToString = Object.values(params).join('/');

    const headerList = headers()
    const fullURL = headerList.get('x-current-url').replace('ar/', '')

    const description = SecondaryPropertyData ? findDescription(SecondaryPropertyData): ''

    return {
        title: `${title} | ${t('Stage Properties')}`,
        description: description,
        alternates: {
            canonical: (BASE_URL + locale + '/buy/' + slug).replace('/en/', '/'),
            languages: {
                'en-gb': fullURL,
                'en': fullURL,
                'x-default': fullURL,
                'ar': fullURL.replace('https://stageproperties.com', 'https://stageproperties.com/ar'),
              },
        },
        openGraph: {
            url: fullURL,
            title: `${title} | ${t('Stage Properties')}`,
            description: `${SecondaryPropertyData ? findDescription(SecondaryPropertyData) : ''}`,
            images: [
            {
                url: featuredImageURL,
                width: 1200,
                height: 630,
                alt: featuredImageAlternativeText
            }
            ],
            type: 'website'
        }
    }
};

export default function layout({children}) {

    return (
        <>
            {children}
        </>
    )
}