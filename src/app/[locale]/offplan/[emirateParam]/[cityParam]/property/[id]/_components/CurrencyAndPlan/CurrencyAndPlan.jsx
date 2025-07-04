import 'server-only'

import React from 'react'
import PaymentPlan from './PaymentPlan'
import PropertyContactForm from '@/app/[locale]/_components/PropertyContactForm/PropertyContactForm'
import Image from 'next/image'
// import ContactForm from '@/app/components/ContactForm/ContactForm'
import ContactAgentForm from '@/app/[locale]/_components/ContactAgentForm/ContactAgentForm'

const CurrencyAndPlan = async ({offplanData}) => {

    const payment_plans = offplanData?.attributes?.payment_plans

    if(!payment_plans?.[0]?.plans.length) return null

    return (
    <div className='currencyAndPlan' id="form">
        <div className="wrapper">
            <div className="paymentPlan">
                {payment_plans?.map((item,key) => (
                    <PaymentPlan key={key} paymentInfo={item}/>
                ))}
            </div>
            <div className="gradientLine">
              <Image src="/gradientLine.png" fill alt="GradientLine" />
            </div>

            {/* <ContactForm formRef={formRef} title="Connect With Us Now" projectName={offplanData?.attributes?.project_name} pageName={offplanData?.attributes?.slug}/> */}
        </div>
    </div>
  )
}

export default CurrencyAndPlan