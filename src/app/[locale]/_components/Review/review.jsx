'use client'

import useIsMobile from "@/app/[locale]/_utils/useIsMobile";
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { formatNumberToArabic } from "../../_utils/utils";

const Review = () => {
    const t = useTranslations('common');
    const locale = useLocale();
    const isMobile = useIsMobile({maxWidth: 1065})

    return (
        <div id="review-container">
            <div className="review-content gradientBorder">
                <div className={`review-box gradientBorder ${locale === 'ar' ? 'ar' : ''}`}>
                    <div>
                        <img src="./google-logo.svg" alt="google" className="google-logo" />
                    </div>
                    <div className="review-details">
                        <div className="google-rating"><span>{t('google_rating')}</span></div>
                        <div className="rating">
                            <span className="rating-value gradientText">{locale === 'ar' ? formatNumberToArabic(4.9): 4.9}</span>
                                <img src="./star.svg" alt="google star rating" width={isMobile ? 150 : 250} />
                        </div>
                        <Link target="_blank" rel="noopener noreferrer" className="reviews-link" href="https://www.google.com/search?q=Stage+Properties+Brokers+LLC+-+Office+106%2C+Building+3+-+Business+Park+-+Dubai+Hills+-+Dubai+-+United+Arab+Emirates&oq=stage+properties&gs_lcrp=EgZjaHJvbWUqBggCEEUYOzIGCAAQRRg7MgYIARBFGDkyBggCEEUYOzIGCAMQRRhBMgYIBBBFGEEyBggFEEUYQTIGCAYQRRg8MgYIBxBFGDzSAQgzNzUxajBqNKgCALACAQ&sourceid=chrome&ie=UTF-8#lrd=0x3e5f69716c4db3e1:0xe69e317a545a19d2,1,,,,">
                        {t('see_all_our_reviews')}</Link>
                        <Link target="_blank" href='https://www.google.com/search?q=Stage+Properties+Brokers+LLC+-+Office+106%2C+Building+3+-+Business+Park+-+Dubai+Hills+-+Dubai+-+United+Arab+Emirates&oq=stage+properties&gs_lcrp=EgZjaHJvbWUqBggCEEUYOzIGCAAQRRg7MgYIARBFGDkyBggCEEUYOzIGCAMQRRhBMgYIBBBFGEEyBggFEEUYQTIGCAYQRRg8MgYIBxBFGDzSAQgzNzUxajBqNKgCALACAQ&sourceid=chrome&ie=UTF-8#lrd=0x3e5f69716c4db3e1:0xe69e317a545a19d2,1,,,,'>
                            <button className="globalBtn">
                            {t('leave_us_a_review')}
                            </button>
                        </Link>

                    </div>
                </div>
                <div className={`agency-message ${locale === 'ar' ? 'ar' : ''}`}>
                    <h2 className="title gradientText mainHeading">
                    {t('a_reputation_built_on_customer_satisfaction')}
                    </h2>
                </div>    
            </div>
        </div>
    )
}

export default Review;