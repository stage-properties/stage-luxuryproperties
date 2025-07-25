import React from "react";
import parse from "html-react-parser";
const page = () => {
  const htmlContent = `<p><span style="font-size:14px">At Stage Properties, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and protect your information when you use our website.</span></p>

  <p><br />
  <span style="font-size:14px">By accessing or using www.stage-luxuryproperties.com, you agree to the practices described in this Privacy Policy. If you do not agree with our practices, please do not use our website.</span><br />
  <br />
  <span style="font-size:16px"><strong>1. INFORMATION WE COLLECT</strong></span><br />
  <span style="font-size:14px">1.1 Personal Information: We may collect personal information that you voluntarily provide to us, such as your name, email address, phone number, and other contact information.<br />
  <br />
  1.2 Property Information: We collect information related to properties you search for, inquire about, or list on our website, including property details, preferences, and geographic locations.<br />
  <br />
  1.3 Usage Information: We automatically collect information about how you use our website, including your IP address, browser type, device type, and other usage data.</span><br />
  <br />
  <span style="font-size:16px"><strong>2. HOW WE USE YOUR INFORMATION&nbsp;</strong></span><br />
  <span style="font-size:14px">2.1 Provide Services: We use your personal information to provide you with our services, including property listings and communication related to your inquiries or listings.<br />
  <br />
  2.2 Improve User Experience: We use your usage data to analyze and improve our website&#39;s performance, content, and user experience.<br />
  <br />
  2.3 Marketing: With your consent, we may use your information to send you promotional materials, updates, and offers about our services or third-party services that may be of interest to you.</span><br />
  <br />
  <span style="font-size:16px"><strong>3. SHARING YOUR INFORMATION&nbsp;</strong></span><br />
  <span style="font-size:14px">3.1 Service Providers: We may share your information with third-party service providers who assist us in operating our website, conducting our business, or providing services to you.<br />
  <br />
  3.2 Legal Compliance: We may disclose your information when required to comply with the law, enforce our site policies, or protect our or others&#39; rights, property, or safety.</span><br />
  <br />
  <span style="font-size:16px"><strong>4. SECURITY&nbsp;</strong></span><br />
  <span style="font-size:14px">We implement reasonable security measures to protect your information. However, please be aware that no method of data transmission over the internet is completely secure, and we cannot guarantee the security of your information.</span><br />
  <br />
  <span style="font-size:16px"><strong>5. YOUR CHOICES&nbsp;</strong></span><br />
  <span style="font-size:14px">You have the right to access, update, or delete your personal information. You can also opt-out of marketing communications at any time.</span><br />
  <br />
  <span style="font-size:16px"><strong>6. CHANGES TO THIS PRIVACY POLICY&nbsp;</strong></span><br />
  <span style="font-size:14px">We may update this Privacy Policy from time to time. The updated policy will be posted on our website with the &quot;Last Updated&quot; date.</span><br />
  <br />
  <span style="font-size:16px"><strong>7. CONTACT US&nbsp;</strong></span></p>
  

  
  <p><span style="font-size:14px">If you have any questions or concerns about this Privacy Policy, please contact us at:&nbsp;</span></p>
  
  <p>&nbsp;</p>
  
  <p><span style="font-size:14px">Office: <a href="tel:800%2078243" rel="noreferrer noopener" target="_blank">+971 800-207-8243 (Free Number)</a>&nbsp;<br />
  WhatsApp: <a href="https://wa.me/80078243" rel="noreferrer noopener" target="_blank">+971 800-207-8243</a>&nbsp;</span></p>
  
  <p><span style="font-size:14px">Email: <a href="mailto:info@stageproperties.com" rel="noreferrer noopener" target="_blank">info@stageproperties.com</a>&nbsp;</span></p>
  `;
  return (
    <div id="privacyPolicy">
      <div className="wrapper">
        <h1 className="mainHeading">PRIVACY POLICY</h1>
        <p className="lastUpdated">LAST UPDATED: 29/11/23</p>
        <div className="content">{parse(htmlContent)}</div>
      </div>
    </div>
  );
};

export default page;
