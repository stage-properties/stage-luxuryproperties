import React from "react";
import MobileIcon from "../../../../../assets/Icons/mobile.svg";
import WhatsappIcon from "../../../../../assets/Icons/whatsapp.svg";
import LocationIcon from "../../../../../assets/Icons/locationGradient.svg";
import MailIcon from "../../../../../assets/Icons/mail.svg";
import Facebook from "../../../../../assets/Icons/facebook.svg";
import Twitter from "../../../../../assets/Icons/twitter.svg";
import Instagram from "../../../../../assets/Icons/instagram.svg";
import LinkedIn from "../../../../../assets/Icons/linkedin.svg";
import Youtube from "../../../../../assets/Icons/youtube.svg";
import Tiktok from "../../../../../assets/Icons/tiktok.svg";
import ContactForm from "@/app/[locale]/_components/ContactForm/ContactForm";
import SubscribeNewsletter from "@/app/[locale]/_components/SubscribeNewsletter/SubscribeNewsletter";
import {
  whatsappNumber,
  whatsappNumberText,
} from "@/app/[locale]/_utils/contants";
import { getTranslations } from "next-intl/server";

const ContactInfo = async ({ locale }) => {
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const t = await getTranslations({ locale, namespace: "contact_us" });

  const contactText = `Hi There, I am contacting through your website.`;

  return (
    <div className="contactInfo">
      <div className="wrapper">
        <div className="infoContainer">
          {/* <div className="item">
            <div className="top multiple">
              <span className="icon">
                <MobileIcon />
              </span>
              <span className="icon">
                <WhatsappIcon />
              </span>
            </div>
            
            <div className="bottom">
              <a href="tel:+971 800-207-8243">+971 800-207-8243</a>
            </div>
          </div> */}

          <div className="item">
            <div className="top">
              <span className="icon">
                <MobileIcon />
              </span>
            </div>

            <div className="bottom">
              <a href="tel:+971 800-207-8243">
                {" "}
                <strong>{t("Toll free within UAE")} </strong>
                {t("800-207-8243")}
              </a>
              <br />
              <a href="tel:+971 45-866-200">
                <strong>{t("Calls from outside UAE")} </strong>
                {t("+971 45 866 200")}
              </a>
            </div>
          </div>

          <div className="item">
            <div className="top">
              <span className="icon">
                <WhatsappIcon />
              </span>
            </div>

            <div className="bottom">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank">
                {t(whatsappNumberText)}
              </a>
            </div>
          </div>

          <div className="item">
            <div className="top">
              <span className="icon">
                <LocationIcon />
              </span>
            </div>
            <div className="bottom">
              <p>
                {t("Office 106, Building 3, Dubai Hills")} <br />{" "}
                {t("Business Park, Dubai Hills Estate")}
              </p>
            </div>
          </div>
          <div className="item">
            <div className="top">
              <span className="icon">
                <MailIcon />
              </span>
            </div>
            <div className="bottom">
              <a href="mailto:info@stage-luxuryproperties.com">
                info@stage-luxuryproperties.com
              </a>
            </div>
          </div>
        </div>
        <div className="social">
          <a href="https://www.facebook.com/stageproperties/" target="_blank">
            <span className="icon">
              <Facebook />
            </span>
          </a>
          <a href="https://twitter.com/stageproperties" target="_blank">
            <span className="icon">
              <Twitter />
            </span>
          </a>

          <a href="https://www.instagram.com/stageproperties/" target="_blank">
            <span className="icon">
              <Instagram />
            </span>
          </a>
          <a
            href="https://ae.linkedin.com/company/stage-properties-brokers-llc"
            target="_blank"
          >
            <span className="icon">
              <LinkedIn />
            </span>
          </a>

          <a href="https://www.youtube.com/@stageproperties" target="_blank">
            <span className="icon">
              <Youtube />
            </span>
          </a>

          <a href="https://www.tiktok.com/@stageproperties" target="_blank">
            <span className="icon">
              <Tiktok />
            </span>
          </a>
        </div>
        <SubscribeNewsletter
          title={t(
            "or leave your contact information and we will get back to you at the earliest"
          )}
          type="contact-form"
        />
      </div>
    </div>
  );
};

export default ContactInfo;
