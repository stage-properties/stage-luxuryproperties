import { useServerPathname } from '@/app/[locale]/_utils/useServerPathname'
import { fetchAPI } from '@/app/[locale]/_utils/fetch';
import CTA from '@/app/[locale]/_components/CTA/Cta';

async function CTAContainer({style}) {
    const {pathname} = useServerPathname()
    let ctas = await fetchAPI('/cta', "noCache");

    const cta = ctas?.data?.find((cta) => {
        return cta?.attributes?.pageURL === pathname || pathname.includes(cta?.attributes?.pageURL + '/page')
    });

    if(!cta) return null
    
    return (
        <CTA data={cta} style={style} />
    )
}

export default CTAContainer