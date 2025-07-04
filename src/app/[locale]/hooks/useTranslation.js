// useTranslationAuto.js

import { useState, useEffect } from 'react';

const useTranslationAuto = ({ text, locale }) => {
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!text || !locale) {
      return;
    }

    if(locale === 'en') {
      setTranslatedText(text);
      return
    }

    const fetchTranslation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}translate?locale=${locale}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              dev_id: 'true',
            },
            body: JSON.stringify({ text }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setTranslatedText(data.translatedText);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchTranslation();
  }, [text, locale]);

  return { translatedText, loading, error };
};

export default useTranslationAuto;

// const { translatedText, loading, error } = useTranslationAuto({ text: title, locale });