import React from 'react'
import Image from "next/image";
import { getTranslations } from 'next-intl/server';

const ContactSpotlight = async ({ locale }) => {
    
    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : 'ltr'

    const t = await getTranslations({locale, namespace: 'contact_us'});

    return (
        <div className='contactSpotlight'>
            <div className="imageContainer">
                <Image src="/contact-us.webp"
                    fill
                    alt='contact bg'
                />
                    <div className="gradient"></div>
                <div className="info">
                    <div className="wrapper">
                        <h1 className="mainHeading">{t("CONTACT US")}</h1>
                        <p className="subHeading">{t("We'd love to hear from you!")}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactSpotlight