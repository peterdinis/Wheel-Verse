"use client"

import { useState, type FC } from "react";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="flex items-center"
          >
            <span className="text-3xl mr-1">🚲</span>
            WheelVerse
          </motion.div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/products" className="font-medium hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="/categories" className="font-medium hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/about" className="font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSearch}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Link href="/cart">
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Cart"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col p-4 space-y-4">
              <Link href="/" className="font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/products" className="font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              <Link href="/categories" className="font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>
              <Link href="/about" className="font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="Search for bikes..." 
                className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


export default Header