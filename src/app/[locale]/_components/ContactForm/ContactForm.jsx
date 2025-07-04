"use client";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../../../../assets/Icons/closeIcon.svg";
import ErrorIcon from "../../../../../assets/Icons/error.svg";
import Swal from "sweetalert2";
import { hubspotFormAPI } from "../SubscribeNewsletter/service";
import DropDownArrow from "../../../../../assets/Icons/dropdownArrow.svg";
import {useDispatch} from "react-redux";
import { getContactModal } from "@/app/[locale]/redux/contactModal/contactModalSlice";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

const ContactForm = ({ title, setContactFormModal, extraValues, type, messageText, redux, projectName, pageName, removeLanguage = false, isUK = false, closeOnClickOutside = true}) => {

  const t = useTranslations('contact_form');

  const [value, setValue] = useState()
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const [inputValues, setInputValues] = useState({
    message:messageText
  });
  const [dropDown, setDropDown] = useState(false);
  const [error, setError] = useState();
  const dropDownRef = useRef(null);
  const dispatch = useDispatch()

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

  const submitForm = async (e) => {
    e.preventDefault();
    const validateStatus = validation();
    if (validateStatus) {
      await updateHubspotForm();
      modalCloseHandler()
    }
  };

  const dropDownHandler = (e, type) => {
    e.stopPropagation();
    setDropDown(!dropDown);
  };


  const updateHubspotForm = async () => {
    let pageInfo = {
      pageUri:window.location.href,
      pageName:pageName,
      project_name:projectName
    }

    const result = await hubspotFormAPI(inputValues, type, pageInfo);
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
      }).then(() => modalCloseHandler());
    }
  };

  const modalCloseHandler = () => {
    if(redux){
      dispatch(
        getContactModal({
          contactModalRedux:false
        })
      )
    }else{
      setContactFormModal(false)
    }
  }

  // Overlay click event
  const handleOverlayClick = () => {
    if (closeOnClickOutside) {
      modalCloseHandler();
    }
  };

  return (
    <div id="contactForm">
      <div className="overlay" onClick={handleOverlayClick}></div>

      <div className="content">
        <div className="closeIcon" onClick={() => modalCloseHandler()}>
          <CloseIcon />
        </div>
        <h1 className="mainHeading gradientText" style={{marginBottom: '2rem'}}>{title}</h1>
        <div className="formContainer">
          <div className={error?.fullname ? "error inputContainer" : "inputContainer"}>
            <input
              className={error?.fullname ? "error" : "inputField"}
              type="text"
              name="fullname"
              id="name"
              placeholder={t("Your Name")}
              value={inputValues?.fullname || ""}
              onChange={(item) => handleUpdate(item)}
            />
            {error?.fullname && (
              <span className="errorIcon">
                <ErrorIcon />
              </span>
            )}
          </div>
          <div className={`inputContainer bottom ${isRTL ? 'ar' : ''} ${error?.mobilephone ? 'error' : ''}`}>
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
              defaultCountry={isUK ? 'GB' : 'AE'}
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
          {/* <div className="inputContainer"> */}
          <div className={`inputContainer bottom ${error?.email ? 'error' : ''}`}>
            <input
              className={error?.email ? "error" : "inputField"}
              type="email"
              name="email"
              id="phone"
              placeholder={t("YOUR EMAIL")}
              value={inputValues?.email || ""}
              onChange={(item) => handleUpdate(item)}
            />
            {error?.email && (
              <span className="errorIcon">
                <ErrorIcon />
              </span>
            )}
          </div>
          {!removeLanguage && <div
            className="inputContainer"
            ref={dropDownRef}
            onClick={(e) => dropDownHandler(e, "LANGUAGE")}
          >
            <span className="label">{t(inputValues?.language || "LANGUAGE")}</span>
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
          </div>}
          <div className="inputContainer" style={removeLanguage ? {borderBottom: 'unset'} : {}}>
          

            <div className="textArea">
            <label htmlFor="message">{t("Message")}</label>
          <textarea value={inputValues?.message || ""} onChange={(item) => handleUpdate(item)} name="message" id="message" cols="30" rows="10"></textarea>

            </div>

          </div>
          <div className="buttonContainer">
            <button className="globalBtn" onClick={(e) => submitForm(e)}>
              {t('submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
