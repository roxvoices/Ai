
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { AppTab } from '../types'; // Import AppTab

interface PrivacyProps {
  language: string;
  setActiveTab: (tab: AppTab) => void; // New prop
}

export const Privacy: React.FC<PrivacyProps> = ({ language, setActiveTab }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">{t.privacy} Policy</h1>
          <p className="text-sm md:text-lg font-medium text-slate-500">Last updated: November 24, 2025</p>
        </div>
        <button 
          onClick={() => setActiveTab('home')} // Navigate back to the home/dashboard tab
          className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
          title="Back to Home"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
        </button>
      </header>

      <div className="glass-panel rounded-[2rem] p-8 space-y-8 text-slate-300 leading-relaxed text-sm">
        <p>Rox Studio ("us", "we", or "our") operates the Rox Studio website (the "Service").</p>
        <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
        <p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from Rox Studio.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Information Collection and Use</h2>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">Types of Data Collected</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
            <ul className="list-circle pl-5 ml-4 space-y-1">
              <li>Email address</li>
              <li>First name and last name (if provided)</li>
              <li>Usage Data (e.g., character count for TTS, tool usage)</li>
            </ul>
          </li>
          <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
          <li><strong>Audio Data:</strong> When you use our Text-to-Speech (TTS) service, the text you input is sent to Google's Gemini API for synthesis. This text is processed by Google's models to generate audio. We do not store your raw audio inputs (if any for other tools) unless explicitly saved by you. Generated audio outputs are temporarily stored for playback and download, and may be stored in your personal "History" if you are a logged-in user.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Use of Data</h2>
        <p>Rox Studio uses the collected data for various purposes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide and maintain the Service</li>
          <li>To notify you about changes to our Service</li>
          <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
          <li>To provide customer support</li>
          <li>To monitor the usage of the Service</li>
          <li>To detect, prevent and address technical issues</li>
          <li>To manage your account, including character quotas and subscription levels.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Disclosure of Data</h2>
        <p>We will not share or sell your Personal Data to third parties for marketing purposes. We may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To comply with a legal obligation</li>
          <li>To protect and defend the rights or property of Rox Studio</li>
          <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
          <li>To protect the personal safety of users of the Service or the public</li>
          <li>To protect against legal liability</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Data Security</h2>
        <p>The security of your data is important to us. We implement appropriate technical and organizational measures to protect your Personal Data against unauthorized access, disclosure, alteration, or destruction. However, remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Service Providers</h2>
        <p>We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Google Gemini API:</strong> For Text-to-Speech synthesis. The text you submit for synthesis is sent to Google's API. Please refer to Google's own privacy policy for details on their data handling practices.</li>
          <li><strong>Supabase:</strong> For user authentication, profile management, persistent storage of user projects, and payment proof handling. Please refer to Supabase's privacy policy for details on their data handling practices.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Links to Other Sites</h2>
        <p>Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">7. Children's Privacy</h2>
        <p>Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">8. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>By email: <a href="mailto:markwell244@gmail.com" className="text-blue-400 hover:underline">markwell244@gmail.com</a></li>
          <li>By WhatsApp: <a href="https://wa.me/260765546444" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">+260765546444</a></li>
        </ul>
      </div>
    </div>
  );
};