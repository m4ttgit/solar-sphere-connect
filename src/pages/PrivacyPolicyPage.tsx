import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto pt-32 pb-16 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-solar-800 dark:text-white mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Information We Collect</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                submit business information, or contact us for support.
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Personal information (name, email, phone number)</li>
                <li>Business information for directory listings</li>
                <li>Usage data and analytics</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process business directory submissions</li>
                <li>Send important updates and notifications</li>
                <li>Improve our platform and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Information Sharing</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>With your consent</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Data Security</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Your Rights</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@solarsphereconnect.com" className="text-blue-600 hover:underline">
                  privacy@solarsphereconnect.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;