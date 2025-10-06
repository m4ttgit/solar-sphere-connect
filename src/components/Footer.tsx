
import React from 'react';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-solar-800">
              Solar<span className="text-solar-600">Hub</span>
            </h3>
            <p className="text-gray-600 max-w-xs">
              Connecting communities with trusted solar businesses for a sustainable future.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Directory</h4>
            <ul className="space-y-2">
              <FooterLink href="/directory" label="Browse All" />
              <FooterLink href="/directory/installers" label="Solar Installers" />
              <FooterLink href="/directory/manufacturers" label="Manufacturers" />
              <FooterLink href="/directory/consultants" label="Consultants" />
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Company</h4>
            <ul className="space-y-2">
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/privacy-policy" label="Privacy Policy" />
              <FooterLink href="/terms" label="Terms of Service" />
              <FooterLink href="/contact" label="Contact" />
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2 text-solar-600" />
                <span>123 Green Street, Solar City</span>
              </li>
              <li className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2 text-solar-600" />
                <a href="mailto:hello@solarhub.com" className="hover:text-solar-600 transition-colors">hello@solarhub.com</a>
              </li>
              <li className="flex items-center text-gray-600">
                <Phone size={16} className="mr-2 text-solar-600" />
                <a href="tel:+1234567890" className="hover:text-solar-600 transition-colors">(123) 456-7890</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SolarHub. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <li>
      <a 
        href={href} 
        className="text-gray-600 hover:text-solar-600 transition-colors duration-300"
      >
        {label}
      </a>
    </li>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <a 
      href="#" 
      className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 hover:text-solar-600 hover:bg-solar-50 border border-gray-200 transition-all duration-300"
    >
      {icon}
    </a>
  );
};

export default Footer;
