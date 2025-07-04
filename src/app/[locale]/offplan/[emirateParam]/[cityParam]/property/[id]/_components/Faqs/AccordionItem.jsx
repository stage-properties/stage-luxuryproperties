'use client'
import React from 'react'
import {Collapse} from 'react-collapse';
const AccordionItem = ({open,toggle,data}) => {
  return (
    <div className='accordionItem'>
        <div className="leftContainer">
            <h1 className="question">{data?.que}</h1>
            <Collapse isOpened={open}>
            <p className="answer">{data?.ans}</p>
            </Collapse>
        </div>
        <div className="rightContainer">
            <h1 onClick={toggle}>{open ? "-" : "+"}</h1>
        </div>
    </div>
  )
}

export default AccordionItem