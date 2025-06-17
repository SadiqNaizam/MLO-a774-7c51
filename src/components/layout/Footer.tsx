import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  console.log('Footer component loaded');

  const footerLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Contact Support', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">FoodDelivery Inc.</h5>
            <p className="text-sm">
              Delivering happiness, one meal at a time. Your favorite local restaurants, right at your doorstep.
            </p>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Quick Links</h5>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-primary dark:hover:text-primary-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Connect With Us</h5>
            <p className="text-sm mb-2">
              Follow us on social media for updates and promotions.
            </p>
            {/* Placeholder for social media icons - using text for now */}
            <div className="flex space-x-4">
              <a href="#" className="text-sm hover:text-primary dark:hover:text-primary-foreground">Facebook</a>
              <a href="#" className="text-sm hover:text-primary dark:hover:text-primary-foreground">Twitter</a>
              <a href="#" className="text-sm hover:text-primary dark:hover:text-primary-foreground">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} FoodDelivery Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;