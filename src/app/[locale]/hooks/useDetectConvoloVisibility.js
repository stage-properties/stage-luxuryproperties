import { useEffect, useState } from 'react';

const useDetectConvoloVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      const callButton = document.querySelector("callbutton"); // Select the callbutton element
      if (callButton) {
        const visibility = window.getComputedStyle(callButton).visibility;
        if (visibility === "visible") {
          console.log("✅ Convolo Call Button is now visible!");
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    // Use MutationObserver to detect style changes
    const observer = new MutationObserver(() => checkVisibility());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Initial check in case it's already loaded
    checkVisibility();

    return () => observer.disconnect(); // Cleanup observer
  }, []);

  return isVisible;
};

export default useDetectConvoloVisibility