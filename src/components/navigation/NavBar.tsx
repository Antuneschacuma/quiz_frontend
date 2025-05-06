'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MenuIcon, XIcon, SearchIcon, ShoppingBagIcon, UserIcon, SparklesIcon } from 'lucide-react';
import AppLogo from '../shared/AppLogo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Barra superior decorativa */}
      <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      {/* Navbar principal */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2 shadow-xl' : 'py-4'} bg-white/90 backdrop-blur-md border-b border-indigo-100`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            
            {/* Logo com efeito especial */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-2 bg-indigo-100 rounded-full opacity-70 group-hover:opacity-100 transition-all duration-300 blur-sm group-hover:blur-md" />
                <div className="relative flex items-center space-x-2">
                  <AppLogo />
                  <span className={`text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${isScrolled ? 'text-xl' : 'text-2xl'} transition-all`}>
                    Antunes'Home
                  </span>
                </div>
              </div>
            </Link>

            {/* Links de navegação */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { href: '/', label: 'Início' },
                { href: '/sobre', label: 'Sobre' },
                { href: '/servicos', label: 'Serviços' },
                { href: '/portfolio', label: 'Portfólio' },
                { href: '/blog', label: 'Blog' },
                { href: '/contactos', label: 'Contactos' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-indigo-600 w-0 group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Ícones de ação */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors relative">
                <SearchIcon className="w-5 h-5" />
              </button>
              
              <button className="p-2 rounded-full hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors relative">
                <UserIcon className="w-5 h-5" />
              </button>
              
              <button className="p-2 rounded-full hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors relative">
                <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </div>
                <ShoppingBagIcon className="w-5 h-5" />
              </button>
              
              <button className="flex items-center space-x-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                <SparklesIcon className="w-4 h-4" />
                <span>Premium</span>
              </button>
            </div>

            {/* Botão mobile */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white py-4 px-4 shadow-lg rounded-b-lg">
            <div className="flex flex-col space-y-3">
              {[
                { href: '/', label: 'Início' },
                { href: '/sobre', label: 'Sobre' },
                { href: '/servicos', label: 'Serviços' },
                { href: '/portfolio', label: 'Portfólio' },
                { href: '/blog', label: 'Blog' },
                { href: '/contactos', label: 'Contactos' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-200 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                    <SearchIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;