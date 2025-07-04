import Image from "next/image";
import React from "react";
import LinkedIn from "../../../../../assets/Icons/linkedin.svg"
import {useTranslations} from 'next-intl';

const LandscapeTeamCard = ({ data, locale }) => {
  
  const t = useTranslations('our_team');
  const t_contact_form = useTranslations('contact_form')

  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const alternativeText = data?.attributes?.image?.data?.attributes?.alternativeText
  const name = data?.attributes?.name

  return (
    <div className="landscapeTeamCard gradientBorder" dir={direction}>
      <div className="left">
        <div className="imageContainer">
          <Image src={data?.attributes?.image?.data?.attributes?.url?data?.attributes?.image?.data?.attributes?.url:"/avatar.svg"} fill={true} alt={alternativeText || name} />
        </div>
      </div>

      <div className={`right ${isRTL ? 'ar' : ''}`}>
        <h3 className="name">{data?.attributes?.name}</h3>
        <span className="title">{
        data?.attributes?.designation === 'Local Employee'? 
        t("Property Consultant"): 
        data?.attributes?.designation?.toLowerCase() === 'property advisor' ? t("Property Consultant") : t(data?.attributes?.designation)
        }</span>
        <h4 className="langHead">{t("Languages Spoken:")}</h4>
        <span className="language">
          {
            data?.attributes?.languages?.data?.map((item,index)=>{
              return(t_contact_form(item?.attributes?.language) + (index+1 !== data?.attributes?.languages?.data?.length ? ", ":""))
            })
          }
        </span>
        {
          data?.attributes?.linked_in&&
        <a href={data?.attributes?.linked_in} rel="noopener noreferrer" target="_blank" className="icon"  >
            <LinkedIn/>
        </a>
        }
      </div>
    </div>
  );
};

export default LandscapeTeamCard;
