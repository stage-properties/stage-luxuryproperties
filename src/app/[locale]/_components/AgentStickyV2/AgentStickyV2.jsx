"use client"
import React, { useEffect } from 'react'
import AgentContactCardV2 from '../AgentContactCard/AgentContactCardV2'
import ContactBtns from '../AgentContactCard/ContactBtns'
import {useSelector} from "react-redux";
import ContactForm from '../ContactForm/ContactForm';
import useScrollPosition from '../useScrollPosition/useScrollPosition';
import { secondaryFormTypeRent, secondaryFormTypeSale } from '@/app/[locale]/_utils/contants';
import { useTranslations } from 'next-intl';

const AgentStickyV2 = ({propertyData, configuration}) => {

  const t = useTranslations('secondary')

    const isContactModal = useSelector((state) => state?.contactModalRedux?.value)
    const position = useScrollPosition()  
    // const messageText = `Hi ${propertyData?.attributes?.agent_name} I came across Ref. No: ${propertyData?.attributes?.property_ref_no} for the property at ${propertyData?.attributes?.community?.data?.attributes?.community_name} on your website, and I'd like to gather more information about it.`
    const messageText = ''

    let offeringType = propertyData?.attributes?.offering_type?.data?.attributes?.type==="Sale"?"buy":"rent"
    let extraValues ={
      pageName:propertyData?.attributes?.slug,
      project_name:propertyData?.attributes?.property_ref_no + " " + propertyData?.attributes?.property_name 
    }
    useEffect(()=>{
        if(position<500){
            document.getElementById("sticky").scrollTop = 0
        }
    },[position])

    return (
    <>
    {
        isContactModal &&
        <ContactForm
        type={offeringType==="Sale"?secondaryFormTypeSale:secondaryFormTypeRent}
        title={t("Contact Us")}
        messageText={messageText}
        redux={true}
        extraValues={extraValues}
      />
    }
    <div id='sticky' className='agentStickyV2'>
        <ContactBtns propertyData={propertyData} configuration={configuration} />
        <AgentContactCardV2 type={offeringType==="Sale"?secondaryFormTypeSale:secondaryFormTypeRent} propertyData={propertyData}/>
    </div>
    </>
  )
}

export default AgentStickyV2