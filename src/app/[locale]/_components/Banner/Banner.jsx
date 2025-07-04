import HP from '@/app/[locale]/_components/Banner/HP/HP'
import MPU from '@/app/[locale]/_components/Banner/MPU/MPU'
import LDR from '@/app/[locale]/_components/Banner/LDR/LDR'

const Banner = ({type, imageBannerClass}) => {

    switch (type) {
        case 'HP':
            return <HP imageBannerClass={imageBannerClass} type={'HP'} />
        case 'MPU':
            return <MPU imageBannerClass={imageBannerClass} type={'MPU'} />
        case 'LDR':
            return <LDR imageBannerClass={imageBannerClass} type={'LDR'} />
    }
}

export default Banner