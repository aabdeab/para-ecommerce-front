import React, { useState } from "react";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import type HeaderProps from "../types/header";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/Components/ui/navigation-menu"; // Import NavigationMenu components

const categories = [
  "Skin Care",
  "Hair Care",
  "Vitamins",
  "Baby Care",
  "Personal Hygiene",
  "Medical Devices",
];

const Header: React.FC<HeaderProps> = ({
  className = "",
  cartItems = 0,
  onCartClick,
  onSearch,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Collection", href: "/collection" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
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
          {/* Logo Section */}
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center max-w-2xl mx-8">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-8">
                {navigationItems.map((item) =>
                  item.label === "Collection" ? (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <ul className="flex flex-col">
                          {categories.map((cat) => (
                            <li key={cat}>
                              <NavigationMenuLink
                                href={`/collection?category=${encodeURIComponent(
                                  cat
                                )}`}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                              >
                                {cat}
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 whitespace-nowrap"
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop Search */}
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

          {/* Actions Section */}
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            {/* Search Button - Mobile only */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User Account */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
              <User size={20} />
              <span className="hidden lg:inline font-medium">Account</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 bg-blue-600 text-black px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              aria-label={`Shopping cart with ${cartItems} items`}
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItems > 99 ? "99+" : cartItems}
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
      </div>
    </header>
  );
};

export default Header;

