
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { AppTab } from '../types'; // Import AppTab

interface TermsProps {
  language: string;
  setActiveTab: (tab: AppTab) => void; // New prop
}

export const Terms: React.FC<TermsProps> = ({ language, setActiveTab }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">{t.terms} and Conditions</h1>
          <p className="text-sm md:text-lg font-medium text-slate-500">Last updated: November 24, 2025</p>
        </div>
        <button 
          type="button"
          onClick={() => setActiveTab('home')} // Navigate back to the home/dashboard tab
          className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
          title="Back to Home"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
        </button>
      </header>

      <div className="glass-panel rounded-[2rem] p-8 space-y-8 text-slate-300 leading-relaxed text-sm">
        <p>Welcome to Rox Studio! These terms and conditions outline the rules and regulations for the use of Rox Studio's website and services.</p>
        <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use Rox Studio if you do not agree to all of the terms and conditions stated on this page.</p>
        <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of the Republic of Zambia. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Accounts</h2>
        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
        <p>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Services</h2>
        <p>Rox Studio provides a range of AI-powered audio and file manipulation tools. While we strive for accuracy and high performance, we do not guarantee that the services will be uninterrupted, error-free, or meet your specific requirements. All generated content and processed files are provided "as is" without warranty of any kind.</p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Content and Usage</h2>
        <p>You are solely responsible for the text, audio, images, and other content you upload, process, or generate using Rox Studio. You agree not to use the Service for any unlawful or prohibited activities, including but not limited to:</p>
        <ul className="list-disc pl-5 space-y-2">
            <li>Generating or processing content that is defamatory, obscene, fraudulent, or harmful.</li>
            <li>Infringing on any intellectual property rights or proprietary rights of others.</li>
            <li>Uploading or processing malicious software, viruses, or any code designed to disrupt the Service.</li>
            <li>Attempting to gain unauthorized access to any part of the Service or its related systems.</li>
        </ul>
        <p>Rox Studio reserves the right to review, remove, or refuse any content that violates these terms, or to suspend or terminate accounts found to be in violation.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Intellectual Property</h2>
        <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Rox Studio and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Rox Studio.</p>
        <p>You retain all rights to the content you create and upload to the Service. By using our Text-to-Speech (TTS) feature, you grant Rox Studio a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, and display the input text solely for the purpose of generating the requested audio and storing it in your history (if applicable). This license terminates when you delete your content from the Service.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Subscription and Payments</h2>
        <p>Access to certain features and increased character quotas within Rox Studio may require a paid subscription. Subscription plans, pricing, and associated benefits are detailed on our "Premium" page. All payments for subscriptions are processed manually. By selecting a paid plan, you agree to follow the payment instructions provided on the "Premium" page and submit verifiable proof of payment.</p>
        <p>Your subscription will become active upon successful verification of your payment proof by our administration. Rox Studio reserves the right to approve or reject payment proofs at its sole discretion. Refunds are not guaranteed and will be handled on a case-by-case basis as per our refund policy (available upon request).</p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us for account deletion.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">7. Limitation Of Liability</h2>
        <p>In no event shall Rox Studio, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">8. Disclaimer</h2>
        <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.</p>
        <p>Rox Studio does not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">9. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of the Republic of Zambia, without regard to its conflict of law provisions.</p>
        <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">10. Changes to These Terms and Conditions</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">Contact Us</h2>
        <p>If you have any questions about these Terms and Conditions, please contact us:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>By email: <a href="mailto:markwell244@gmail.com" className="text-blue-400 hover:underline">markwell244@gmail.com</a></li>
          <li>By WhatsApp: <a href="https://wa.me/260765546444" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">+260765546444</a></li>
        </ul>
      </div>
    </div>
  );
};
