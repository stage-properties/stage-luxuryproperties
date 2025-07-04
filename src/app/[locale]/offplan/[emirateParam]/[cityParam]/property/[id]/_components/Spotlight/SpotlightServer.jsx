import { convertMyCurrency, formatNumberToArabic, square_feet_to_square_meter, numberFormat } from "@/app/[locale]/_utils/utils";
import Image from "next/image";
import React from "react";
import PriceIcon from '../../../../../../../../../../assets/Icons/price.svg';
import BedroomIcon from '../../../../../../../../../../assets/Icons/bedIcon.svg';
import AreaIcon from '../../../../../../../../../../assets/Icons/area.svg';
import Handover from '../../../../../../../../../../assets/Icons/handover.svg';
import { useTranslations, useLocale } from 'next-intl';

const SpotlightServer = ({ offplanData, available_units, currency, areaUnit }) => {
  const t = useTranslations('offplan_single');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : "ltr";

  const project_name = offplanData?.attributes?.project_name;
  const developer_name = offplanData?.attributes?.developer?.data?.attributes?.developer_name;
  const alternative_text = offplanData?.attributes?.featured_image?.data?.attributes?.alternativeText || `${project_name} by ${developer_name}`;

  const aed_to_usd_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_usd_exchange_rate || 0.27;
  const aed_to_eur_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_eur_exchange_rate || 0.25;
  const aed_to_gbp_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_gbp_exchange_rate || 0.25;
  const aed_to_inr_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_inr_exchange_rate || 23.53;
  const aed_to_rub_exchange_rate = offplanData?.configuration?.data?.attributes?.aed_to_rub_exchange_rate || 24.91;

  // Use the passed in redux values via props (instead of using useSelector)
  const unit_area = offplanData?.attributes?.area_starting_from 
    ? Math.round(Number(offplanData?.attributes?.area_starting_from) * (areaUnit === 'ft²' ? 1 : square_feet_to_square_meter))
    : t('ask_for_area');

  const price = offplanData?.attributes?.starting_price 
    ? (
        isRTL 
        ? formatNumberToArabic(convertMyCurrency({
              value: offplanData?.attributes?.starting_price, 
              aed_to_inr_exchange_rate, 
              currency, 
              aed_to_usd_exchange_rate, 
              aed_to_gbp_exchange_rate, 
              aed_to_eur_exchange_rate, 
              aed_to_rub_exchange_rate
            }), true)
        : numberFormat(convertMyCurrency({
              value: offplanData?.attributes?.starting_price, 
              currency, 
              aed_to_inr_exchange_rate, 
              aed_to_eur_exchange_rate, 
              aed_to_gbp_exchange_rate, 
              aed_to_usd_exchange_rate, 
              aed_to_rub_exchange_rate
            }))
      )
    : t('ask_for_price');

  const calcHandoverInfoText = () => {
    const { ready_to_move_in, handover_info, handover_quarter } = offplanData?.attributes || {};
    let s = '';
    if (ready_to_move_in) s += 'Ready To Move In';
    if (handover_info) s += ' ' + handover_info;
    if (handover_quarter) s += " " + handover_quarter;
    return s === '' ? t('Ask for handover info') : s;
  };

  return (
    <div className="spotlight" dir={direction}>
      <div className="imageContainer">
        {offplanData?.attributes?.featured_image?.data?.attributes?.url && (
          <>
            <Image 
              src={offplanData?.attributes?.featured_image?.data?.attributes?.url} 
              fill 
              alt={alternative_text} 
            />
            <div className="gradient-left"></div>
            <div className="gradient-right"></div>
          </>
        )}

        <div className="info">
          <div className="gradient"></div>
          <div className="wrapper">
            <h1 className="mainHeading">{offplanData?.attributes?.project_name}</h1>
            <div className="gradientLine">
              <Image src="/gradientLine.png" fill alt="GradientLine" />
            </div>
            <ul className="list">
              <li className={`item ${isRTL ? 'ar' : ''}`}>
                <div className={`left ${isRTL ? 'ar' : ''}`}>
                  <span className="icon">
                    <PriceIcon />
                  </span>
                </div>
                <div className="right">
                  {!offplanData?.attributes?.starting_price ? (
                    <span className="value">{t('ask_for_price')}</span>
                  ) : (
                    isRTL 
                      ? <span className="value">{price} {t(currency.toLowerCase())}</span> 
                      : <span className="value">{t(currency.toLowerCase())} {price}</span>
                  )}
                  <span className="label">{t('starting_price')}</span>
                </div>
              </li>
              <li className={`item ${isRTL ? 'ar' : ''}`}>
                <div className={`left ${isRTL ? 'ar' : ''}`}>
                  <span className="icon">
                    <BedroomIcon />
                  </span>
                </div>
                <div className="right">
                  {!offplanData?.attributes?.available_units ? (
                    <span className="value">{t('Ask for available units')}</span>
                  ) : (
                    <span className="value">{available_units}</span>
                  )}
                  <span className="label">{t('Available units')}</span>
                </div>
              </li>
              <li className={`item ${isRTL ? 'ar' : ""}`}>
                <div className={`left ${isRTL ? 'ar' : ''}`}>
                  <span className="icon">
                    <AreaIcon />
                  </span>
                </div>
                <div className="right">
                  {!offplanData?.attributes?.area_starting_from ? (
                    <span className="value">{t('Ask for area')}</span>
                  ) : (
                    <span className="value">
                      {isRTL 
                        ? formatNumberToArabic(unit_area) 
                        : numberFormat(unit_area)
                      }
                    </span>
                  )}
                  <span className="label">{t('Area from')} ({t(areaUnit)})</span>
                </div>
              </li>
              <li className={`item ${isRTL ? 'ar' : ''}`}>
                <div className={`left ${isRTL ? 'ar' : ''}`}>
                  <span className="icon">
                    <Handover />
                  </span>
                </div>
                <div className="right">
                  <span className="value">{calcHandoverInfoText()}</span>
                  <span className="label">{t("Handover")}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotlightServer;