import React from 'react'
import ReviewCarousel from './ReviewCarousel'

const ReviewSection = async () => {
    const res =await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.NEXT_PUBLIC_STAGE_PLACE_ID}&fields=name,rating,reviews&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`)
    const fetchReviews = await res.json()
  return (
    <div className='reviewSection '>
        <h1 className="mainHeading">reviews</h1>

        <ReviewCarousel reviews={fetchReviews?.result?.reviews}/>
    </div>
  )
}

export default ReviewSection