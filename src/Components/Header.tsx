import React, { useState } from "react";
import { Search, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/Components/ui/button";
import type HeaderProps from "../types/header";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/Components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

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
  onCartClick,
  onSearch,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
  ];

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className={`glass-effect sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-blue-600 rounded-xl rotate-2 transition-transform group-hover:rotate-3" />
              <div className="absolute inset-0 bg-blue-500 rounded-xl rotate-1 transition-transform group-hover:rotate-2" />
              <div className="relative bg-blue-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              ParaPharmacy
            </span>
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex items-center gap-6">
              {navigationItems.map((item) =>
                item.label === "Collection" ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger className="text-base font-medium text-gray-700 hover:text-blue-600">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-3 p-4">
                        {categories.map((category) => (
                          <li key={category}>
                            <Link
                              to={`/collection?category=${encodeURIComponent(category)}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.label}>
                    <Link
                      to={item.href}
                      className="text-base font-medium text-gray-700 hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-effect rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {user?.sub || 'User'}
                  </span>
                </div>
                {/* Admin Dashboard Link */}
                {(user?.roles?.includes('ADMIN') || user?.role === 'ADMIN') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:flex"
                    onClick={() => navigate('/admin/dashboard')}
                    title="Admin Dashboard"
                  >
                    Dashboard
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden sm:flex"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex"
                onClick={() => navigate('/Auth')}
              >
                Login
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

