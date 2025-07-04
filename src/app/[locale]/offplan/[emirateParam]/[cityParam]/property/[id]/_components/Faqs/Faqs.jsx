'use client'
import React, { useState } from 'react'
import AccordionItem from './AccordionItem'
import GradientLine from '@/app/[locale]/_components/GradientLine/GradientLine'

const Faqs = ({faqsData}) => {
    const [open,setOpen] = useState(0)
    const toggleAccordion = (index) => {
        if(open === index){
            return setOpen(null)
        }
        setOpen(index)
    }
  return (
    <div className='faqsSection'>
        <div className="wrapper">
            <h1 className="mainHeading">Faqs</h1>
            <div className="accordionContainer">
            {faqsData?.map((item,index) => (
                <AccordionItem key={index} data={item} open={open === index} toggle={() => toggleAccordion(index)}/>
            ))}

            </div>
            <GradientLine width={"80%"}/>
        </div>
    </div>
  )
}

export default Faqs