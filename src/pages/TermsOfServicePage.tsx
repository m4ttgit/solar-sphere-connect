import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto pt-32 pb-16 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-solar-800 dark:text-white mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 dark:text-gray-300">
                By accessing and using Solar Sphere Connect, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Use License</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Permission is granted to temporarily access Solar Sphere Connect for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove copyright or proprietary notations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">User Accounts</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                When you create an account with us, you must provide accurate and complete information. 
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Business Listings</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                When submitting business information to our directory:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Information must be accurate and up-to-date</li>
                <li>You must have authorization to list the business</li>
                <li>We reserve the right to verify and moderate listings</li>
                <li>We may remove listings that violate our guidelines</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Prohibited Uses</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">You may not use our service:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>For any unlawful purpose</li>
                <li>To transmit spam or malicious content</li>
                <li>To impersonate others or provide false information</li>
                <li>To interfere with or disrupt the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Disclaimer</h2>
              <p className="text-gray-700 dark:text-gray-300">
                The materials on Solar Sphere Connect are provided on an 'as is' basis. 
                We make no warranties, expressed or implied, and hereby disclaim all other warranties 
                including implied warranties of merchantability, fitness for a particular purpose, 
                or non-infringement of intellectual property.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Limitations</h2>
              <p className="text-gray-700 dark:text-gray-300">
                In no event shall Solar Sphere Connect or its suppliers be liable for any damages 
                arising out of the use or inability to use the materials on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Revisions</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We may revise these terms of service at any time without notice. 
                By using this website, you agree to be bound by the current version of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-solar-700 dark:text-solar-400 mb-4">Contact Information</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@solarsphereconnect.com" className="text-blue-600 hover:underline">
                  legal@solarsphereconnect.com
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

export default TermsOfServicePage;