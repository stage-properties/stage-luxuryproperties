const DeveloperCardHeader = ({ title, description, imageURL, alternativeText, style = {} }) => {
    return (
        <div className="_developerCardHeader gradientBorder" style={{...style}}>
            <div className="_left">
                <img className="_logo" src={imageURL ? imageURL : "/stage-default.png"} alt={alternativeText} />
            </div>
            <div className="_right">
                <div className="_content">
                    <h1 className="_title">{title}</h1>
                    <span className="_description">{description}</span>
                </div>
            </div>
        </div>
    );
}

export default DeveloperCardHeader;
