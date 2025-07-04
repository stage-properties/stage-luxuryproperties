import { useState, useEffect } from 'react';

const useIsMobile = ({maxWidth}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Define mobile device detection logic
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent)) {
        setIsMobile(true);
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setIsMobile(true);
      } else if (window.innerWidth <= maxWidth) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;