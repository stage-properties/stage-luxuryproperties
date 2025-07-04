import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from 'next-intl';

import Facebook from "../../../../../assets/Icons/facebook.svg"
import Twitter from "../../../../../assets/Icons/twitter.svg"
import Instagram from "../../../../../assets/Icons/instagram.svg"
import LinkedIn from "../../../../../assets/Icons/linkedin.svg"
import Youtube from "../../../../../assets/Icons/youtube.svg"
import Tiktok from "../../../../../assets/Icons/tiktok.svg"

import ListLink from "../Header/ListLink";
import Script from "next/script";

const Footer = () => {

  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'
  const t = useTranslations('footer')

  return (
    <div id="footer" dir={direction}>
     
      {/* <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K28H6GCD')
        `}
      </Script> */}
      <Script
        id="hs-script-loader"
        src="//js.hs-scripts.com/8757339.js"
        strategy="afterInteractive"
      ></Script>
      <div className="map">
        <Image src="/map.png" fill alt="Map" />
      </div>
      <div className="wrapper">
        <div className="left">
          <div className="logo">
            <Image src="/Stage_Logo_White.png" alt="Stage_logo" fill={true} />
          </div>
          <div className="social">
            <span
              className="icon"
              onClick={() =>
                window.open("https://www.facebook.com/stageproperties/")
              }
            >
              <Facebook />
            </span>
            <span
              className="icon"
              onClick={() => window.open("https://twitter.com/stageproperties")}
            >
              <Twitter />
            </span>
            <span
              className="icon"
              onClick={() =>
                window.open("https://www.instagram.com/stageproperties/")
              }
            >
              <Instagram />
            </span>
            <span
              className="icon"
              onClick={() =>
                window.open(
                  "https://ae.linkedin.com/company/stage-properties-brokers-llc"
                )
              }
            >
              <LinkedIn />
            </span>
            <span
              className="icon"
              onClick={() =>
                window.open("https://www.youtube.com/@stageproperties")
              }
            >
              <Youtube />
            </span>
            <span
              className="icon"
              onClick={() =>
                window.open("https://www.tiktok.com/@stageproperties")
              }
            >
              <Tiktok />
            </span>
          </div>
          <div className="links">
          </div>
          <span className="copyWright">
            {t('copyright')}
          </span>
        </div>
        <div className="right">
          <div className="linkItem">
            <ul>
              <ListLink
                path={"/buy/residential/properties-for-sale"}
                label={t('residential_for_sale')}
              />
              <ListLink
                path={"/rent/residential/properties-for-rent"}
                label={t("residential_for_rent")}
              />
              <ListLink path={"/offplan"} label={t("offplan")} />
              <ListLink path={"/blogs"} label={t("blogs")} />
              <ListLink
                path={"/buy/commercial/properties-for-sale"}
                label={t('commercial_for_sale')}
              />
              <ListLink
                path={"/rent/commercial/properties-for-rent"}
                label={t('commercial_for_rent')}
              />
            </ul>
          </div>
          <div className="linkItem">
            <ul>
              <ListLink path={"/developers"} label={t("developers")} />
              <ListLink path={"/areas-and-communities"} label={t("areas-and-communties")} />
              <ListLink path={"/mortgage-calculator"} label={t("mortgage-calculator")} />
              <ListLink path={"/our-team"} label={t("meet_our_team")} />
              <ListLink path={"/privacy-policy"} label={t("privacy_policy")} />
              <ListLink path={"/contact-us"} label={t('contact_us')} />
            </ul>
          </div>
        </div>
      </div>
      {/* <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K28H6GCD"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      /> */}
    </div>
  );
};

export default Footer;
