// components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="https://img.icons8.com/?size=100&id=cdYUlRaag9G9&format=png&color=000000" 
                alt="Docker Registry Dashboard Logo"
              />

            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-white">Docker Registry Dashboard</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <a
                href="https://github.com/mounirelbakkali1/docker-registry-visualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;