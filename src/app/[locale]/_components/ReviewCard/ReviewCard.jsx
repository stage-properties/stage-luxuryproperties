import React from 'react'
import StarIcon from "../../../../assets/Icons/star.svg"
const ReviewCard = ({data}) => {
  return (
    <div className='reviewCard gradientBorder'>
        <h1 className="name">{data?.author_name}</h1>
        <p className="description" title={data?.text}>{data?.text?.slice(0,120)} {data?.text?.length>120 && "..."}</p>
        <div className="stars">
            <span className="icon"><StarIcon/></span>
            <span className="icon"><StarIcon/></span>
            <span className="icon"><StarIcon/></span>
            <span className="icon"><StarIcon/></span>
            <span className="icon"><StarIcon/></span>
        </div>
    </div>
  )
}

export default ReviewCard