import React from 'react'
import Image from 'next/image'

const TeamCard = ({teamData}) => {
  const alternativeText = teamData?.attributes?.image?.data?.attributes?.alternativeText
  const name = teamData?.attributes?.name
  return (
    <div className='teamCard'>
        <div className="imageContainer">
            <Image 
                src={teamData?.attributes?.image?.data?.attributes?.url?teamData?.attributes?.image?.data?.attributes?.url:'/avatar.svg'}
                fill={true}
                alt={alternativeText || name}
            />
             <div className="info">
            <h3 className="name">{teamData?.attributes?.name}</h3>
        </div>
        </div>
    </div>
  )
}

export default TeamCard