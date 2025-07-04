/**
 * @param {string} pathname       – the current URL path  
 * @param {object} searchParams   – Next’s searchParams object  
 * @param {Function} t            – your translation function (e.g. t_secondary)  
 * @param {string} currency       – selected currency code  
 * @param {string} areaUnit       – selected area unit code  
 * @param {object} rates          – your config.data.attributes rates  
 * @param {boolean} isRTL         – locale direction flag  
 * @param {Function} convertMyCurrency  
 * @param {Function} numberFormat  
 * @param {Function} formatNumberToArabic  
 * @param {Function} convertFTM  
 */
export function getActiveFilters({
    pathname,
    searchParams,
    t,
    currency,
    areaUnit,
    rates: {
        aed_to_gbp_exchange_rate,
        aed_to_eur_exchange_rate,
        aed_to_usd_exchange_rate,
        aed_to_inr_exchange_rate,
        aed_to_rub_exchange_rate
    },
    isRTL,
    convertMyCurrency,
    numberFormat,
    formatNumberToArabic,
    convertFTM
}) {
    // 1) property type
    const propMatch = pathname.match(/\/([^/]+)-for-(?:sale|rent)/);
    const rawType = propMatch?.[1] || null;
    const formattedPropertyType = rawType
        ? rawType.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
        : null;
    // 2) search text
    const textMatch = pathname.match(/\/in-([^/]+)/);
    const rawText = textMatch?.[1] || null;
    const formattedSearchText = rawText
        ? rawText.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
        : null;
    // 3) url-param filters
    const urlFilters = Object.entries(searchParams)
        .filter(([key, val]) => {
            if (!val || ["sort","sortOrder","offer"].includes(key)) return false;
            if ((key==="minPrice"||key==="minArea") && Number(val)<=Number.MIN_SAFE_INTEGER) return false;
            if ((key==="maxPrice"||key==="maxArea") && Number(val)>=Number.MAX_SAFE_INTEGER) return false;
            return true;
        })
        .map(([key,val]) => {
            if (key==="bedroom") {
            const cnt = Number(val);
            return { key, label:`${cnt} ${t(cnt>1?"bedrooms":"bedroom")}` };
            }
            if (key==="minPrice"||key==="maxPrice") {
            const conv = convertMyCurrency({
                value: val,
                aed_to_gbp_exchange_rate,
                aed_to_eur_exchange_rate,
                aed_to_usd_exchange_rate,
                aed_to_inr_exchange_rate,
                aed_to_rub_exchange_rate,
                currency
            });
            const fmt = isRTL ? formatNumberToArabic(conv,true) : numberFormat(conv);
            return { key, label:`${t(key)}: ${fmt} ${t(currency.toLowerCase())}` };
            }
            if (key==="minArea"||key==="maxArea") {
            const n = convertFTM(val);
            return { key, label:`${t(key)}: ${n} ${t(areaUnit.toUpperCase())}` };
            }
            return { key, label:`${t(key)}: ${val}` };
        });
    // 4) assemble, omitting “properties” default
    return [
        ...(rawType && rawType!=="properties" ? [{ key:"propertyType",label:formattedPropertyType }] : []),
        ...(formattedSearchText ? [{ key:"search",       label:formattedSearchText       }] : []),
        ...urlFilters
    ];
}