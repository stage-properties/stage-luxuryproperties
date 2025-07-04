import 'server-only'

import parse from "html-react-parser";
import { getTranslations } from 'next-intl/server';
import DownloadBrochureButton from '@/app/[locale]/offplan/[emirateParam]/[cityParam]/property/[id]/_components/Description/DownloadBrochureButton'

export default async function Description({ offplanDataContent, projectName, project_name, pageName, locale }) {
  
  const t = await getTranslations({locale, namespace: 'offplan_single'});

  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <div className='descriptionContainer' dir={direction}>
      <div className={`wrapper ${isRTL ? 'ar' : ''}`}>
        <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t('About')} {project_name}</h2>
        {parse(offplanDataContent)}
        <img src="/brochureImage.webp" alt="brochure" className="brochureImage" width="100%" height="100%" />
        <DownloadBrochureButton pageName={pageName} projectName={projectName} />
      </div>
    </div>
  );
}