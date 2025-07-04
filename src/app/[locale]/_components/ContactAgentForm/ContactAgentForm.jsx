"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import DropDownArrow from "../../../../../assets/Icons/dropdownArrow.svg";
import Swal from "sweetalert2";
import ErrorIcon from "../../../../../assets/Icons/error.svg";
import { hubspotFormAPI } from "../SubscribeNewsletter/service";
import {useRouter} from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from "next/dynamic";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

const ContactAgentForm = ({ title ,pageName,formRef,projectName, agentImageURL}) => {

  const t = useTranslations('contact_form');

  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const [value, setValue] = useState()
  const [dropDown, setDropDown] = useState(false);
  const dropDownRef = useRef(null);
  const [inputValues, setInputValues] = useState();
  const [error, setError] = useState();

  const router = useRouter()
  useEffect(() => {
    let handleOutClick = (e) => {
      if (!dropDownRef?.current?.contains(e.target)) {
        setDropDown("");
      }
    };
    window.addEventListener("click", handleOutClick);
  }, [dropDownRef]);

  const handleUpdate = (item) => {
    const { name, value } = item?.target;
    handleChange(name, value);
  };

  const handleChange = (name, value) => {
    setDropDown("")
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

  const dropDownHandler = (e,type) => {
    e.stopPropagation();
    setDropDown(!dropDown);
  };

  

  const submitForm = (e) => {
    e.preventDefault();
    const validateStatus = validation();
    if (validateStatus) {
      updateHubspotForm();
    }
  };

  const updateHubspotForm = async () => {
    let pageInfo = {
      pageUri:window.location.href,
      pageName:pageName,
      project_name:projectName
    }
    const formType = 'listing-form'
    const result = await hubspotFormAPI(inputValues, formType,pageInfo);
    if (result?.status === 200) {
      setInputValues(null);
      setValue(null)
      router.push('?ofp=success',{scroll:false})
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
    <div className="contactAgentForm" dir={direction}>
      <div className="leftContainer">
        <div className="imageContainer">
          <Image src={agentImageURL} fill alt="Agent" />
        </div>
      </div>
      <div className="rightContainer">
        <h2 className="mainHeading">{title}</h2>
        <div className="form">
          <form>
            <div className="inputFields">
              <div
                className={
                  error?.fullname ? "error inputContainer" : "inputContainer"
                }
              >
                <input
                  type="text"
                  placeholder={t("Your Name")}
                  className={`${isRTL ? 'ar' : ''}`}
                  name="fullname"
                  value={inputValues?.fullname || ""}
                  onChange={(item) => handleUpdate(item)}
                />
                {error?.fullname && (
                  <span className="errorIcon">
                    <ErrorIcon />
                  </span>
                )}
              </div>
              {/* <div
                className={
                  error?.mobilephone ? "error inputContainer" : "inputContainer"
                }
              >
                <input
                  dir={direction}
                  type="tel"
                  name="mobilephone"
                  id="tel"
                  placeholder={t("YOUR PHONE")}
                  value={inputValues?.mobilephone || ""}
                  onChange={(item) => handleUpdate(item)}
                />
                {error?.mobilephone && (
                  <span className="errorIcon">
                    <ErrorIcon />
                  </span>
                )}
              </div> */}
              <div className={error?.mobilephone ? "error inputContainer" : "inputContainer"}>
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
              <div
                className={
                  error?.email ? "error inputContainer" : "inputContainer"
                }
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={t("YOUR EMAIL")}
                  className={`${isRTL ? 'ar' : ''}`}
                  value={inputValues?.email || ""}
                  onChange={(item) => handleUpdate(item)}
                />
                {error?.email && (
                  <span className="errorIcon">
                    <ErrorIcon />
                  </span>
                )}
              </div>
              <div
                className="inputContainer languageDropdown"
                ref={dropDownRef}
                onClick={(e) => dropDownHandler(e,"LANGUAGE")}
              >
                <span className="label">
                  {t(inputValues?.language || "LANGUAGE")}
                </span>
                <span className="icon">
                  <DropDownArrow />
                </span>
                {dropDown && (
                  <div className="dropDown">
                    <ul className="listDropdownitems">
                      <li onClick={(e) => {handleChange("language", "English");dropDownHandler(e,null)}}>
                        <span className="text">{t('English')}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Arabic")}>
                        <span className="text">{t('Arabic')}</span>
                      </li>
                      <li onClick={() => handleChange("language", "French")}>
                        <span className="text">{t('French')}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Hindi")}>
                        <span className="text">{t('Hindi')}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Russian")}>
                        <span className="text">{t("Russian")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "German")}>
                        <span className="text">{t("German")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Urdu")}>
                        <span className="text">{t("Urdu")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Punjabi")}>
                        <span className="text">{t("Punjabi")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Juish")}>
                        <span className="text">{t("Juish")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Kurdish")}>
                        <span className="text">{t("Kurdish")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Turkish")}>
                        <span className="text">{t("Turkish")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Armenian")}>
                        <span className="text">{t("Armenian")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Persian")}>
                        <span className="text">{t("Persian")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Dutch")}>
                        <span className="text">{t("Dutch")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Ukrainian")}>
                        <span className="text">{t("Ukrainian")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Italian")}>
                        <span className="text">{t("Italian")}</span>
                      </li>
                      <li onClick={() => handleChange("language", "Spanish")}>
                        <span className="text">{t("Spanish")}</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="buttonContainer">
              <button id="offplanSubmitBtn" className="globalBtn" onClick={(e) => submitForm(e)}>
                {t("submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactAgentForm;
