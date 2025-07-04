'use client'

import React, { useState } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { strapiRichTextToString } from '@/app/[locale]/_utils/utils';
import useIsMobile from '@/app/[locale]/_utils/useIsMobile';
import { useTranslations, useLocale } from 'next-intl';

const Faq = ({data, style = {}, classname= "", headerStyle = {}, parentStyleMobile = {}}) => {

  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const t = useTranslations('common');

  const isMobile = useIsMobile({maxWidth: 980})
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div id='faq' style={style} className={classname}>
        <div className='container'>
          <h2 className="title gradientText mainHeading sectionTitle" style={headerStyle}>{t("frequently asked questions")}</h2>
          <div className="parent" dir={isRTL ? 'rtl' : 'ltr'} style={isMobile ? parentStyleMobile : {}}>
            {data.map((item, index) => (
              <>
                {strapiRichTextToString(item.answer) && (
                  <div className={`item ${activeIndex === index ? 'active' : ''}`} key={index}>
                  <div className='question'>
                    <span className="title gradientText" onClick={() => toggleItem(index)}>
                      {item.question}
                    </span>
                    <img onClick={() => toggleItem(index)} src={activeIndex === index ? `${process.env.NEXT_PUBLIC_WEBSITE_URL}/faq_golden_open.svg` : `${process.env.NEXT_PUBLIC_WEBSITE_URL}/faq_golden_closed.svg`}  />
                  </div>
                  <div className={`answer ${activeIndex === index ? 'active' : ''}`}>
                    <BlocksRenderer content={item.answer} />
                  </div>
                </div>
              )}
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;