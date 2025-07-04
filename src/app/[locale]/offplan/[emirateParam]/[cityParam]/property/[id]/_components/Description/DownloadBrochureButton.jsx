'use client';

import React, { useState } from 'react';
import ContactForm from '@/app/[locale]/_components/ContactForm/ContactForm';
import { useTranslations } from 'next-intl';

export default function DownloadBrochureButton({ pageName, projectName }) {
  const t = useTranslations('offplan_single');

  const [contactFormModal, setContactFormModal] = useState(false);

  return (
    <>
      {contactFormModal && (
        <ContactForm 
          setContactFormModal={setContactFormModal} 
          type='listing-form' 
          projectName={projectName} 
          pageName={pageName} 
        />
      )}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="globalBtn fullWidth" onClick={() => setContactFormModal(true)}>
          {t('Download Free Brochure')}
        </button>
      </div>
    </>
  );
}