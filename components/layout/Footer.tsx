import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/70 backdrop-blur-sm shadow-inner">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-500">&copy; {new Date().getFullYear()} Mohiro. All rights reserved.</p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
            <Link to="/terms-of-service" className="hover:text-accent-pink transition duration-300">利用規約</Link>
            <span className="mx-2">|</span>
            <Link to="/privacy-policy" className="hover:text-accent-pink transition duration-300">プライバシーポリシー</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
