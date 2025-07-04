'use client'

import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ContactForm from '@/app/[locale]/_components/ContactForm/ContactForm';
import { fetchAPI } from '../../_utils/fetch';

const CustomCloseIcon = ({color}) => {
  return (
    <svg style={{borderColor: color}} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path id="Vector" d="M16.7509 15.5482C16.8299 15.6272 16.8925 15.721 16.9353 15.8241C16.978 15.9273 17 16.0379 17 16.1496C17 16.2613 16.978 16.3718 16.9353 16.475C16.8925 16.5782 16.8299 16.6719 16.7509 16.7509C16.6719 16.8299 16.5782 16.8925 16.475 16.9353C16.3718 16.978 16.2613 17 16.1496 17C16.0379 17 15.9273 16.978 15.8241 16.9353C15.721 16.8925 15.6272 16.8299 15.5482 16.7509L8.5 9.70162L1.45177 16.7509C1.29228 16.9104 1.07597 17 0.850425 17C0.624878 17 0.408569 16.9104 0.249084 16.7509C0.0895981 16.5914 4.44607e-09 16.3751 0 16.1496C-4.44607e-09 15.924 0.0895981 15.7077 0.249084 15.5482L7.29838 8.5L0.249084 1.45177C0.0895981 1.29228 -1.68045e-09 1.07597 0 0.850425C1.68045e-09 0.624878 0.0895981 0.408569 0.249084 0.249084C0.408569 0.0895981 0.624878 1.68046e-09 0.850425 0C1.07597 -1.68045e-09 1.29228 0.0895981 1.45177 0.249084L8.5 7.29838L15.5482 0.249084C15.7077 0.0895981 15.924 -4.44607e-09 16.1496 0C16.3751 4.44607e-09 16.5914 0.0895981 16.7509 0.249084C16.9104 0.408569 17 0.624878 17 0.850425C17 1.07597 16.9104 1.29228 16.7509 1.45177L9.70162 8.5L16.7509 15.5482Z" fill={color}/>
    </svg>
  )
}

const GlobalPopup = () => {
  const [open, setOpen] = useState(false);
  const [showForm, setIsShowForm] = useState(false);
  const [showClose, setShowClose] = useState(false);

  const handleShowForm = (value) => {
    setIsShowForm(value);
  };

  useEffect(() => {
    // Delay opening the popup for 9 seconds
    const timer = setTimeout(() => {
      setOpen(true);
    }, 9000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) {
      // Show the close button after 2 seconds when the popup is open
      const timer = setTimeout(() => {
        setShowClose(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Reset the close button state when popup is closed
      setShowClose(false);
    }
  }, [open]);

  const [formInfo, setFormInfo] = useState({
    title: "",
    projectName: "",
    formTitle: "",
    ctaButtonText: "",
    image: {
      url: "",
      alternativeText: ""
    },
    close_btn_color: ""
  })

  useEffect(() => {
    const getInterstitialAd = async () => {
      const res = await fetchAPI('interstitialAd', 'noCache')

      const title = res?.attributes?.title
      const project_interested = res?.attributes?.project_interested
      const cta_button_text = res?.attributes?.cta_button_text
      const form_title = res?.attributes?.form_title
      const close_btn_color = res?.attributes?.close_btn_color
      const url = res?.attributes?.visual?.data?.attributes?.url
      const alternativeText = res?.attributes?.visual?.data?.attributes?.alternativeText

      setFormInfo({
        title,
        projectName: project_interested,
        formTitle: form_title,
        ctaButtonText: cta_button_text,
        image: {
          url,
          alternativeText: alternativeText ?? title
        },
        close_btn_color
      })
    }

    getInterstitialAd()
  }, [])

  const Landing = () => (
    <div className="popup-landing-background" style={{backgroundImage: `url(${formInfo?.image?.url})`}} onClick={() => handleShowForm(true)}>
      <button className="popup-landing-button gradientBorder">
        {formInfo.ctaButtonText}
      </button>
      {showClose && (
        <div className="globalPopup-close-button" onClick={() => setOpen(false)}>
          <CustomCloseIcon color={formInfo.close_btn_color} />
        </div>
      )}
    </div>
  );

  const Form = () => (
    <ContactForm 
      title={formInfo.formTitle}
      setContactFormModal={setOpen}
      type="roadshow"
      projectName={formInfo.projectName}
      pageName={window.location.href}
      removeLanguage={true}
      isUK={true}
      closeOnClickOutside={false}
    />
  );

  return (
    !formInfo?.title || 
      !formInfo?.projectName || 
      !formInfo?.formTitle || 
      !formInfo?.ctaButtonText || 
      !formInfo?.image?.url || 
      !formInfo?.close_btn_color
    ?
    null :
    <Popup
    open={open}
    modal
    closeOnDocumentClick={false}
    onClose={() => setOpen(false)}
    lockScroll
    overlayStyle={{ zIndex: 9999999 }}
  >
    {showForm ? <Form /> : <Landing />}
  </Popup>
  );
};

export default GlobalPopup;