import React, { useState } from "react";
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import type HeaderProps from '../types/header';

const categories = [
  "Skin Care",
  "Hair Care",
  "Vitamins",
  "Baby Care",
  "Personal Hygiene",
  "Medical Devices"
];

const Header: React.FC<HeaderProps> = ({ 
  className = "", 
  cartItems = 0, 
  onCartClick, 
  onSearch 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Collection", href: "/collection" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" }
  ];
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className={`bg-white shadow-lg sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4">
        
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo Section - Always visible, fixed size */}
          <div className="flex-shrink-0 min-w-fit">
            <a href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 whitespace-nowrap">
                ParaShop
              </h1>
            </a>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex flex-1 justify-center max-w-2xl mx-8">
            <ul className="flex items-center space-x-8">
              {navigationItems.map((item) =>
                item.label === "Collection" ? (
                  <li key={item.label} className="relative group">
                    <a
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 whitespace-nowrap relative group"
                    >
                      {item.label}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                    {/* Dropdown */}
                    <ul className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                      {categories.map((cat) => (
                        <li key={cat}>
                          <a
                            href={`/collection?category=${encodeURIComponent(cat)}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {cat}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 whitespace-nowrap relative group"
                    >
                      {item.label}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Desktop Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Actions Section - Fixed size, priority order */}
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            
            {/* Search Button - Mobile only */}
            <button 
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User Account - Hidden on small screens */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
              <User size={20} />
              <span className="hidden lg:inline font-medium">Account</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 bg-blue-600 text-blac px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              aria-label={`Shopping cart with ${cartItems} items`}
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItems > 99 ? '99+' : cartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              {navigationItems.map((item) =>
                item.label === "Collection" ? (
                  <li key={item.label}>
                    <span className="block text-gray-700 font-medium py-2">Collection</span>
                    <ul className="pl-4">
                      {categories.map((cat) => (
                        <li key={cat}>
                          <a
                            href={`/collection?category=${encodeURIComponent(cat)}`}
                            className="block text-gray-700 hover:text-blue-600 py-1 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {cat}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              )}
              <li className="sm:hidden pt-2 border-t border-gray-200">
                <a
                  href="/account"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} />
                  My Account
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

