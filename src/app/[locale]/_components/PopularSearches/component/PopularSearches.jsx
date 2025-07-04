'use client'

import React from 'react';
import useIsMobile from '@/app/[locale]/_utils/useIsMobile';
import { useTranslations, useLocale } from 'next-intl';
import Tags from '../../Tags/Tags';

export default function PopularSearches({data, style = {}, classname= "", headerStyle = {}, parentStyleMobile = {}}) {
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const t = useTranslations('common');
  const isMobile = useIsMobile({maxWidth: 980})

  return (
    <>
      {data.length ? (
        <div id='popularSearches' style={style} className={classname}>
          <div className='container'>
            <div className="parent" dir={isRTL ? 'rtl' : 'ltr'} style={isMobile ? parentStyleMobile : {}}>
              <div className='wrapper' style={{marginBottom: '130px'}}>
                <h2 className='mainHeading' style={{textAlign: isRTL ? 'right' : 'left', marginBottom: '20px', color: 'white'}}>{t("Popular Searches")}</h2>
                <Tags data={data} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};