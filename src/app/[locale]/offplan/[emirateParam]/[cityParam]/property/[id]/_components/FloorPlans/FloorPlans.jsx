'use client'

import React, { useState } from 'react';
import { formatNumberToArabic, numberFormat } from "@/app/[locale]/_utils/utils";
import ContactForm from '@/app/[locale]/_components/ContactForm/ContactForm';
import { useTranslations, useLocale } from 'next-intl';


const FloorPlans = ({ offplanData }) => {
    const t = useTranslations('offplan_single');
    const locale = useLocale()
    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : "ltr"

    const project_name = offplanData?.attributes?.project_name;
    const floor_plans = offplanData?.attributes?.floor_plans;

    // Set default selected floor plan to the first one
    const [selectedFloorPlan, setSelectedFloorPlan] = useState(0);

    // Get the selected floor plan details
    const selectedPlan = floor_plans ? floor_plans[selectedFloorPlan] : null;

    const [contactFormModal, setContactFormModal] = useState(false);

    if(!floor_plans?.length) return null

    return (
        <div id="floorplans" className='gradientBorder' dir={direction}>
            {contactFormModal && (
                <ContactForm setContactFormModal={setContactFormModal} type='contact-form' />
            )}
            <div className="wrapper">
                <div className='_left'>
                    <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t('Floor plans of')} {project_name}</h2>
                    <div className="bedrooms">
                        {
                            floor_plans?.map(({ bedroom }, index) => (
                                <div
                                    key={index}
                                    className={`item ${index === selectedFloorPlan ? 'selected' : ''} ${isRTL ? 'ar': ''}`}
                                    onClick={() => setSelectedFloorPlan(index)}
                                >
                                    {bedroom} {t('BR')}
                                </div>
                            ))
                        }
                    </div>
                    <div className='_right isMobile'>
                        <img src={selectedPlan?.plan_image?.data?.attributes?.url} alt="floor plan map"/>
                    </div>
                    <ul className="pInfo">
                        <li className={`list ${isRTL ? 'ar': ''}`}>
                            <div className="left">
                                <span className="label">{t('Type')}</span>
                            </div>
                            <div className="right">
                                <span className="value">{selectedPlan?.property_type?.data?.attributes?.type || t('N/A')}</span>
                            </div>
                        </li>
                        <li className={`list ${isRTL ? 'ar': ''}`}>
                            <div className="left">
                                <span className="label">{t("Total Area")}</span>
                            </div>
                            <div className="right">
                                <span className="value">{isRTL ? formatNumberToArabic(selectedPlan?.total_area) : numberFormat(selectedPlan?.total_area) || t('N/A')} {t("sqm")}</span>
                            </div>
                        </li>
                        <li className={`list ${isRTL ? 'ar' : ''}`}>
                            <div className="left">
                                <span className="label">{t("Starting Price")}</span>
                            </div>
                            <div className="right">
                                <span className="value">{selectedPlan?.starting_price ? isRTL ? `${formatNumberToArabic(selectedPlan?.starting_price)}$` : `$${numberFormat(selectedPlan?.starting_price)}` : t('N/A')}</span>
                            </div>
                        </li>
                    </ul>
                    <div style={{ marginTop: '2rem'}}>
                        <button className="globalBtn fullWidth" onClick={() => setContactFormModal(true)}>{t("Get All Floor Plans")}</ button>
                    </div>
                </div>
                <div className='_right isDesktop'>
                    <img src={selectedPlan?.plan_image?.data?.attributes?.url} alt="floor plan map"/>
                </div>
            </div>
        </div>
    );
};

export default FloorPlans;