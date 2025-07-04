import 'server-only'

import { formatNumberToArabic, numberFormat } from "@/app/[locale]/_utils/utils";
import { getTranslations } from 'next-intl/server';

const PropertyPrice = async ({offplanData, locale}) => {

    const t = await getTranslations({locale, namespace: 'offplan_single'});
    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : 'ltr'

    const starting_price = offplanData?.attributes?.starting_price

    const global_aed_to_eur_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_eur_exchange_rate
    const global_aed_to_usd_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_usd_exchange_rate
    const global_aed_to_gbp_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_gbp_exchange_rate

    const aed_to_eur_exchange_rate = global_aed_to_eur_exchange_rate || 0.25
    const aed_to_usd_exchange_rate = global_aed_to_usd_exchange_rate || 0.27
    const aed_to_gbp_exchange_rate = global_aed_to_gbp_exchange_rate || 0.27

    const starting_price_usd = starting_price * aed_to_usd_exchange_rate
    const starting_price_eur = starting_price * aed_to_eur_exchange_rate
    const starting_price_gbp = starting_price * aed_to_gbp_exchange_rate

    if(!starting_price) return null

    return (
        <div id='propertyPrice' dir={direction}>
            <div className="wrapper">
                <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t("Property Price in Different Currencies")}</h2>
                <div className="priceContainer">
                    <div className={`item ${isRTL ? 'ar': ''}`}>
                        {isRTL ? <div className="price">{formatNumberToArabic(starting_price, true)} {t('aed')}</div> : <div className="price">{t('aed')} {numberFormat(starting_price)}</div>}
                        <div className="text">{t('Starting Price')}</div>
                    </div>
                    <div className={`item ${isRTL ? 'ar' : ''}`}>
                        {isRTL ? <div className="price">{formatNumberToArabic(starting_price_usd, true)} {t("usd")}</div> : <div className="price">{t("usd")} {numberFormat(starting_price_usd)}</div> }
                        <div className="text">{t("Starting Price")}</div>
                    </div>
                    <div className={`item ${isRTL ? 'ar' : ''}`}>
                        {isRTL ? <div className="price">{formatNumberToArabic(starting_price_eur, true)} {t("eur")}</div> : <div className="price">{t("eur")} {numberFormat(starting_price_eur)}</div>}
                        <div className="text">{t("Starting Price")}</div>
                    </div>
                    <div className={`item ${isRTL ? 'ar' : ''}`}>
                        {isRTL ? <div className="price">{formatNumberToArabic(starting_price_gbp, true)} {t("gbp")}</div> : <div className="price">{t("gbp")} {numberFormat(starting_price_gbp)}</div>}
                        <div className="text">{t("Starting Price")}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertyPrice