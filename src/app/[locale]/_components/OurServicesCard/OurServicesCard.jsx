import OurServiceIcon1 from '../../../../../assets/Icons/our-service-initial.svg'
import OurServiceIcon2 from '../../../../../assets/Icons/our-service-1.svg'
import OurServiceIcon3 from '../../../../../assets/Icons/our-service-2.svg'
import OurServiceIcon4 from '../../../../../assets/Icons/our-service-3.svg'
import OurServiceIcon5 from '../../../../../assets/Icons/our-service-4.svg'
import OurServiceIcon6 from '../../../../../assets/Icons/our-service-5.svg'

const OurServicesCard = ({data,icon}) => {
  return (
    <div className='ourServicesCard gradientBorder'>
         <span className="icon">
            {
                data?.id === 1 ? <OurServiceIcon1/> : data?.id === 2 ? <OurServiceIcon2/> : data?.id === 3 ? <OurServiceIcon3/> : data?.id === 4 ? <OurServiceIcon4/> : data?.id === 5 ? <OurServiceIcon5/> :data?.id === 6 ? <OurServiceIcon6/>: null
            }
         </span>
        <h3 className="title">{data?.title}</h3>
        <p className="description">{data?.description}</p>
    </div>
  )
}

export default OurServicesCard