import { useEffect, useState } from 'react';

export function useChromeTranslateDetection(originalLang = 'en') {
    const [isTranslated, setIsTranslated] = useState(false);

    useEffect(() => {
        // Create an observer to watch for changes to the <html> lang attribute.
        const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'lang') {
            const newLang = document.documentElement.getAttribute('lang');
            // If the lang attribute no longer matches the original, assume translation.
            setIsTranslated(newLang !== originalLang);
            }
        });
        });

        observer.observe(document.documentElement, { attributes: true });
        
        // Cleanup on unmount.
        return () => observer.disconnect();
    }, [originalLang]);

    return isTranslated;
}