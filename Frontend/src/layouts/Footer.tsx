import React from 'react';
import zaloIcon from '../assets/icon/zalo.png';
import googleIcon from '../assets/icon/google.png';
import facebookIcon from '../assets/icon/facebook.png';
import vector1 from '../assets/footerbg/Vector1.svg';
import vector2 from '../assets/footerbg/Vector2.svg';
import vector3 from '../assets/footerbg/Vector3.svg';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full text-white overflow-hidden">
      <div className="absolute z-0"/>
      
      <div className="absolute top-0 left-0 w-full z-10 inset-0 z-0 w-full h-full" >
        <img 
          src={vector1}
          alt=""
          className="absolute top-0 left-0 w-full h-full"
        />
        <img 
          src={vector2}
          alt=""
          className="absolute top-0 left-0 w-full h-full"
        />
        <img 
          src={vector3}
          alt=""
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <div className="relative z-20 pt-44 pb-8 px-4">
        <div className="flex justify-center items-center gap-4 mb-8">
          <a
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg border-2 border-blue-500"
            aria-label="Zalo"
          >
            <img 
              src={zaloIcon}
              alt="Zalo" 
              className="w-8 h-8 object-contain"
              loading="lazy"
            />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg border-2 border-blue-500"
            aria-label="Google Plus"
          >
            <img 
              src={googleIcon}
              alt="Google Plus" 
              className="w-8 h-8 object-contain"
              loading="lazy"
              style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))' }}
            />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg border-blue-500"
            aria-label="Facebook"
          >
            <img 
              src={facebookIcon}
              alt="Facebook" 
              className="w-8 h-8 object-contain"
              loading="lazy"
            />
          </a>
        </div>

        <nav className="flex justify-center items-center gap-6 md:gap-10 mb-6 flex-wrap">
          <a
            href="#home"
            className="!text-white hover:!text-gray-400 transition-colors duration-300 text-base md:text-lg !font-semibold"
          >
            Home
          </a>
          <a
            href="#about"
            className="!text-white hover:!text-gray-400 transition-colors duration-300 text-base md:text-lg !font-semibold"
          >
            About
          </a>
          <a
            href="#services"
            className="!text-white hover:!text-gray-400 transition-colors duration-300 text-base md:text-lg !font-semibold"
          >
            Services
          </a>
          <a
            href="#team"
            className="!text-white hover:!text-gray-400 transition-colors duration-300 text-base md:text-lg !font-semibold"
          >
            Team
          </a>
          <a
            href="#contact"
            className="!text-white hover:!text-gray-400 transition-colors duration-300 text-base md:text-lg !font-semibold"
          >
            Contact
          </a>
        </nav>
        <div className="text-center text-white text-sm md:text-base font-medium">
          ©2026 Brotherhood 5.26 | All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;