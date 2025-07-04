"use client";
import React, { useState } from "react";
import DropDownArrow from "../../../../../assets/Icons/dropdownArrow.svg";
import ErrorIcon from "../../../../../assets/Icons/error.svg";
import { hubspotFormAPI } from "./service";
import Swal from "sweetalert2";
import { useTranslations, useLocale } from 'next-intl';
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

const SubscribeNewsletter = ({ type, title, extraFields }) => {
  const t = useTranslations('common');

  const locale = useLocale()

  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const [value, setValue] = useState()
  const [inputValues, setInputValues] = useState();
  const [error, setError] = useState();

  const handleUpdate = (item) => {
    const { name, value } = item?.target;
    handleChange(name, value);
  };

  const handleChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const validation = () => {
    let validationStatus = true;
    let errors = {};
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!inputValues?.fullname) {
      errors.fullname = "Name is required!";
      validationStatus = false;
    }

    // Check that a phone number is entered and is valid
    if (!inputValues?.mobilephone) {
      errors.mobilephone = "Phone number is required!";
      validationStatus = false;
    } else if (!isValidPhoneNumber(inputValues.mobilephone)) {
      errors.mobilephone = "Enter a valid phone number!";
      validationStatus = false;
    }

    if (!inputValues?.email) {
      errors.email = "Email is required!";
      validationStatus = false;
    } else if (!inputValues?.email?.match(emailRegex)) {
      errors.email = "Enter a valid email!";
      validationStatus = false;
    }
    setError(errors);
    return validationStatus;
  };

  const submitForm = (e) => {
    e.preventDefault();
    const validateStatus = validation();
    if (validateStatus) {
      updateHubspotForm();
    }
  };

  const updateHubspotForm = async () => {
    const result = await hubspotFormAPI(inputValues,type);
    if (result?.status === 200) {
      setInputValues(null);
      setValue(null)
      Swal.fire({
        title: "Success",
        text: result?.data?.inlineMessage,
        icon: "success",
        confirmButtonText: "Ok",
        background: "var(--primary-bg-color)",
        color: "var(--text-color)",
      });
    }
  };
  return (
    <div className="subscribeContainer" dir={direction} id="contact-form">
      {type === "newsletter-form" ? (
        <h3>
          {t('subscribe_to_our_newsletter')}
        </h3>
      ) : (
        <h3>{title}</h3>
      )}
      <div className="subscribeForm gradientBorder">
        {extraFields && (
          <div className="oneRow topRow">
            <div className={`inputContainer top ${isRTL ? 'ar' : ''}`}>
              <span className="specialization">specialization</span>
              <span className="icon">
                <DropDownArrow />
              </span>
            </div>
            <div className={`inputContainer top`}>
              <span className="specialization">language</span>
              <span className="icon">
                <DropDownArrow />
              </span>
            </div>
          </div>
        )}
        <div className="oneRow bottomRow">
          <div className={`inputContainer bottom ${isRTL ? 'ar' : ''}`}>
            <input
              className={`${isRTL ? 'ar' : ''} ${error?.fullname ? "error" : "inputField"}`}
              style={{borderRadius: "0px"}}
              type="text"
              name="fullname"
              id="name"
              placeholder={t('your_name')}
              value={inputValues?.fullname || ""}
              onChange={(item) => handleUpdate(item)}
            />
            {error?.fullname && (
              <span className="errorIcon">
                <ErrorIcon />
              </span>
            )}
          </div>
          <div className={`inputContainer bottom ${isRTL ? 'ar' : ''}`}>
            <PhoneInput
              type="tel"
              dir={direction}
              placeholder="Phone"
              value={value}
              onChange={(val) => {
                setValue(val);
                handleChange("mobilephone", val);
              }}
              name="mobilephone"
              style={{fontSize: '16px', width: '100%'}}
              defaultCountry="AE"
              countryCallingCodeEditable={false}
              rules={{ required: true }}
              international
              className={`custom-phone-input ${error?.mobilephone ? 'error' : ''}`}
            />
            {error?.mobilephone && (
              <span className="custom-phone-input errorIcon">
                <ErrorIcon />
              </span>
            )}
          </div>
          <div className={`inputContainer bottom ${isRTL ? 'ar' : ''}`}>
            <input
              className={`${isRTL ? 'ar' : ''} ${error?.email ? "error" : "inputField"}`}
              type="email"
              name="email"
              id="email"
              placeholder={t('your_email')}
              value={inputValues?.email || ""}
              onChange={(item) => handleUpdate(item)}
              style={{borderRadius: '0px'}}
            />
            {error?.email && (
              <span className="errorIcon">
                <ErrorIcon />
              </span>
            )}
          </div>
          <button className="globalBtn" onClick={(e) => submitForm(e)}>
            {t('submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscribeNewsletter;
