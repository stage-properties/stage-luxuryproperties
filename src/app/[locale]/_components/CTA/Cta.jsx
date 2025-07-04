import { Link } from '@/i18n/routing';

function CTA({data, style}) {

    const pageURL = data?.attributes?.pageUR
    const heading = data?.attributes?.heading
    const subheading = data?.attributes?.subheading
    const buttonTxt = data?.attributes?.buttonTxt
    const buttonURL = data?.attributes?.buttonURL || 'http://google.com/'

    return (
        <div id="cta" className="gradientBorder wrapper" style={{...style}}>
            <h2 className="heading">{heading}</h2>
            <h5 className="subheading">{subheading}</h5>
            <Link target="_blank" href={buttonURL}>
                <button className="globalBtn" style={{width: 'fit-content'}}>
                {buttonTxt}
                </button>
            </Link>
        </div>
    )
}

export default CTA