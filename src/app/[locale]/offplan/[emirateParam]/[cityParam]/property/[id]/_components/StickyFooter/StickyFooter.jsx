'use client'

import { useState } from "react";
import { useSelector } from "react-redux";
import { convertPrice, convertMyCurrency } from "@/app/[locale]/_utils/utils";
import ContactForm from "@/app/[locale]/_components/ContactForm/ContactForm";
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

const StickyFooter = ({offplanData, projectName}) => {
    const pathname = usePathname();

    const locale = useLocale()
    const t = useTranslations('offplan');

    const isRTL = locale === 'ar'
    const [contactFormModal, setContactFormModal] = useState(false);

    const developer_name = offplanData?.attributes?.developer?.data?.attributes?.developer_name
    const developer_logo_url = offplanData?.attributes?.developer?.data?.attributes?.developer_logo?.data?.attributes?.url
    const developer_logo_alternative_text = offplanData?.attributes?.developer?.data?.attributes?.developer_logo?.data?.attributes?.alternativeText || developer_name

    const handover_info = offplanData?.attributes?.handover_info
    const handover_quarter = offplanData?.attributes?.handover_quarter

    const starting_price = offplanData?.attributes?.starting_price
    const currency = useSelector((state) => state.currency.value);
    
    const payment_plan = offplanData?.attributes?.payment_plans?.map(({plan_name}) => plan_name).join(", ")
    const payment_plan_text = payment_plan ? `${t('Attractive')} ${payment_plan}` : t('Flexible')

    const aed_to_eur_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_eur_exchange_rate
    const aed_to_gbp_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_gbp_exchange_rate
    const aed_to_usd_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_usd_exchange_rate
    const aed_to_inr_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_inr_exchange_rate
    const aed_to_rub_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_rub_exchange_rate

    const project_name = offplanData?.attributes?.project_name
    const pageName = offplanData?.attributes?.slug

    return (
        <div className={`offplan-sticky-footer ${isRTL ? 'ar' : ''}`}>
            <div dir={isRTL ? 'rtl' : 'ltr'}>
            {contactFormModal && (
                    <ContactForm setContactFormModal={setContactFormModal} type='listing-form' projectName={projectName} pageName={pageName} />
            )}
            </div>
            <div className="offplan-sticky-footer-logos">
                <img className="offplan-sticky-footer-image" src={developer_logo_url} alt={developer_logo_alternative_text} />
            </div>
            <div>
                {offplanData?.attributes?.available_units}
            </div>
            {isRTL ? <>
                <div>
                <p className="offplan-sticky-footer-text">{t('Payment Plan')}</p>
                <p className="offplan-sticky-footer-text">{payment_plan_text}</p>
            </div>
            </> : <>
            <div>
                <p className="offplan-sticky-footer-text">{payment_plan_text}</p>
                <p className="offplan-sticky-footer-text">{t('Payment Plan')}</p>
            </div>
            </>}
            <div>
                <p className="offplan-sticky-footer-text">{t('Starting from')}</p>
                {
                    isRTL ? <p className="offplan-sticky-footer-text">{convertPrice(convertMyCurrency({
                        value: starting_price, currency, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, aed_to_usd_exchange_rate
                    }), isRTL)} {t(currency.toLowerCase())}</p> :
                    <p className="offplan-sticky-footer-text">{t(currency.toLowerCase())} {convertPrice(convertMyCurrency({
                        value: starting_price, currency, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, aed_to_usd_exchange_rate
                    }), isRTL)}</p>
                }

            </div>
            <div>
                <p className="offplan-sticky-footer-text">{t('Handover')}</p>
                <p className="offplan-sticky-footer-text">{t('in')} {handover_info} {handover_quarter}</p>
            </div>
            <button className="offplan-register-button" onClick={() => setContactFormModal(true)}>{t('Register Interest')}</button>
            {pathname.includes('/offplan/') && (
            <style jsx global>{`
                .widgetButton {
                    @media all and (min-width: 992px){
                        bottom: 100px !important;
                    }
                }
                `}</style>
            )}
        </div>
    )
}

export default StickyFooter