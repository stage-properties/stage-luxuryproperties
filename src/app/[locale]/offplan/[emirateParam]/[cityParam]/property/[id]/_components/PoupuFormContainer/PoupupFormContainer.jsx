"use client";
import ContactForm from "@/app/[locale]/_components/ContactForm/ContactForm";
import React, { useEffect, useState } from "react";
import ChatIcon from '../../../../../../../../../../assets/Icons/chatIcon.svg'

const PoupupFormContainer = () => {
  const [contactFormModal, setContactFormModal] = useState(false);

  return (
    <div className="popupFormContainer">
        <div className="formButton">
            <button className="gradientBorder" onClick={()=>setContactFormModal(true)}>
            <ChatIcon/>
            </button>
        </div>
      {contactFormModal && (
        <ContactForm
          setContactFormModal={setContactFormModal}
          type="contact-form"
          title="Contact Us"
        />
      )}
    </div>
  );
};

export default PoupupFormContainer;
