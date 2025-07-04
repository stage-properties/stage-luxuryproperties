const getTranslation = async ({text, locale }) => {
    
    if(locale === 'en') return text

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}translate?locale=${locale}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                dev_id: "true",
            },
            body: JSON.stringify({text: text}),
        });

        const { translatedText } = await res.json(); 
        return translatedText
}

export default getTranslation