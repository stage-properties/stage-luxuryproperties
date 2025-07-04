function Tags({ data, locale="en" }) {

  return (
    <div id='tags'>
      {data.map(({ label, label_ar, url }, index) => (
        <div className="buttonContainer" style={{border: '1px solid white', borderRadius: '2rem', marginRight: locale === 'ar' ? 'unset': '0.8rem', marginLeft: locale === 'ar' ? '0.8rem' : 'unset'}} key={index}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {locale === 'ar' ? label_ar ?? label : label}
          </a>
        </div>
      ))}
    </div>
  );
}

export default Tags;