import React from 'react'
import DropDownArrow from "../../../../../assets/Icons/dropdownArrow.svg"

function BlogControl() {
  return (
    <div className='blogControl'>
        <div className="wrapper">
            <h1 className="title">ALL BLOGS</h1>
            <div className="buttonContainer">
                <button className='globalBtn'>
                    <span className="text">CATEGORIES</span>
                    <span className="icon"><DropDownArrow/></span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default BlogControl