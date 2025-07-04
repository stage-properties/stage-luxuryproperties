'use client';
import React, { useEffect, useRef } from 'react';

const HubSpotForm = ({form_img, form_img_alt, title, hubspot_form_id}) => {
  const formRef = useRef(null);

  useEffect(() => {
    // Function to load external scripts
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        // Check if the script is already loaded
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = src;
          script.type = 'text/javascript';
          script.charset = 'utf-8';
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        } else {
          resolve();
        }
      });
    };

    // Load the HubSpot Forms script
    loadScript('//js.hsforms.net/forms/embed/v2.js')
      .then(() => {
        if (window.hbspt) {
          window.hbspt.forms.create({
            portalId: '8757339',
            formId: hubspot_form_id,
            target: `#${formRef.current.id}`,
          });
        }
      })
      .catch((error) => {
        console.error('Error loading HubSpot Forms script:', error);
      });

    // Cleanup function to remove the form if the component unmounts
    return () => {
      if (formRef.current) {
        formRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="form-wrapper">
      <div className="form-section">
        <div className="form-image">
          <img src={form_img} alt={form_img_alt} />
        </div>
        <div className="form-container" id="form-container">
          <h2>Prices &amp; Payment Terms</h2>
          <p>
            Please enter your details to request the prices, floor plans &amp;
            payment terms for {title}.
          </p>
          {/* Embed the iframe */}
          <div className='iframe'>
            <div id="hubspot-form" ref={formRef}></div>
          </div>
        </div>
      </div>
    </div>
)
};

export default HubSpotForm;