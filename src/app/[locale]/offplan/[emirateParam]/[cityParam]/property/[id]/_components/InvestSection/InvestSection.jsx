'use client'
import { useState } from "react"
import ContactForm from '@/app/[locale]/_components/ContactForm/ContactForm';
import { useTranslations, useLocale } from 'next-intl';

const InvestSection = ({projectName, pageName}) => {

    const t = useTranslations('offplan_single');
    const locale = useLocale()

    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : 'ltr'

    const [contactFormModal, setContactFormModal] = useState(false);

    return (
        <div className="investSection" dir={direction}>
            {contactFormModal && (
                <ContactForm setContactFormModal={setContactFormModal} type='listing-form' projectName={projectName} pageName={pageName} />
            )}
            <div className="wrapper">
                <div className="parent">
                    <h2 className={`mainHeading investSection_title ${isRTL ? 'ar' : ''}`}>{t("Your Investment is Secure with Dubai Escrow Accounts")}</h2>
                    <div className="parent isMobile image-container">
                        <img className="investSection_image" src='/isa.svg' alt="investSection image" />
                    </div>
                    <p className="investSection_description">{t("A Dubai Escrow Account is a legal arrangement where a third party holds and regulates payment")}</p>
                    <ul>
                        <li><strong>{t("Safety and Security:")}</strong> {t("Your funds are safeguarded in a regulated escrow account, mi")}</li>
                        <li><strong>{t("Transparency:")}</strong> {t("All transactions and progress updates are transparent,")}</li>
                        <li><strong>{t("Legal Compliance:")}</strong> {t("The use of escrow accounts is mandated by the Dubai")}</li>
                        <li><strong>{t("Peace of Mind:")}</strong> {t("Knowing your investment is managed through a secure")}.</li>
                    </ul>
                    <div style={{ marginTop: '2rem'}}>
                        <button className="globalBtn generalButton" onClick={() => setContactFormModal(true)}>{t("Get investment consultation")}</ button>
                    </div>
                </div>
                <div className="parent isDesktop">
                    <img className="investSection_image" src='/isa.svg' alt="investSection image" />
                </div>
            </div>
        </div>
    )
}

export default InvestSection