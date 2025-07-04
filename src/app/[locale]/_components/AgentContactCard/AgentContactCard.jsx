'use client'
import React from "react";
import MailIcon from "../../../../../assets/Icons/mail.svg";
import Whatsapp from "../../../../../assets/Icons/whatsapp_white.svg";
import { whatsappNumber } from "@/app/[locale]/_utils/contants";
import {useRouter} from '@/i18n/routing';

const AgentContactCard = ({ contactText,pageType }) => {
    const router = useRouter()
    const emailHandler = () => {
        if(pageType === 'OFFPLAN'){
            document.getElementById("form").scrollIntoView({ behavior: "smooth"})
        }else{
            router.push('/contact-us')
        }
        
    }
  return (
    <div className="agentContactCard">
      {/* <div className="top">
            <div className="left">
                <div className="imageContainer">
                    <Image 
                        src={'/Placeholder.webp'}
                        fill={true}
                        // objectFit='cover'
                        alt='Agent_photo'
                    />
                </div>
            </div>

            <div className="right">
                <h1 className="name">Agent name</h1>
                <h6 className="title">Property consultant</h6>
            </div>
        </div> */}

      <div className="bottom">
        <h3 className="contactTitle">We are available</h3>
        <div className="buttons">
          <div className="buttonContainer">
            {/* <a href="#form" onClick={(e)=>e.preventDefault()}> */}
              <button onClick={emailHandler}>
                <span className="icon">
                  <MailIcon />
                </span>
                <span className="text">EMAIL US</span>
              </button>
            {/* </a> */}
          </div>

          <div className="buttonContainer">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${
                contactText
                  ? encodeURIComponent(contactText)
                  : "window?.location?.href"
              }`}
              target="_blank"
            >
              <button>
                <span className="icon">
                  <Whatsapp />
                </span>
                <span className="text">WHATSAPP</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentContactCard;
