"use client";

import { useState } from "react";
import { Menu, X, User, Shield } from "lucide-react";
import Link from "next/link";
import { CartButton } from "./CartButton";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            style={{ cursor: 'pointer' }}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/logo.svg" 
                alt="PureSkin Étudiant Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900">PureSkin</span>
              <span className="text-sm text-gray-600">Étudiant</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              style={{ cursor: 'pointer' }}
            >
              Accueil
            </Link>
            <Link 
              href="/produits" 
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              style={{ cursor: 'pointer' }}
            >
              Produits
            </Link>
            <Link 
              href="/routine" 
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              style={{ cursor: 'pointer' }}
            >
              Routine
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              style={{ cursor: 'pointer' }}
            >
              Blog
            </Link>
            <Link 
              href="/avis" 
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              style={{ cursor: 'pointer' }}
            >
              Avis
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/account" 
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium rounded-lg hover:bg-gray-50 px-3 py-2"
              style={{ cursor: 'pointer' }}
            >
              <User className="w-5 h-5" />
              <span>Mon Compte</span>
            </Link>
            <Link 
              href="/admin/login" 
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors text-sm rounded-lg hover:bg-gray-50 px-2 py-2"
              style={{ cursor: 'pointer' }}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <CartButton onClick={onCartClick} />
            <button 
              onClick={() => window.location.href = '/cart'}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors font-medium hover:shadow-lg transform hover:scale-105"
              style={{ cursor: 'pointer' }}
            >
              Commander
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ cursor: 'pointer' }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                style={{ cursor: 'pointer' }}
              >
                Accueil
              </Link>
              <Link 
                href="/produits" 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                style={{ cursor: 'pointer' }}
              >
                Produits
              </Link>
              <Link 
                href="/routine" 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                style={{ cursor: 'pointer' }}
              >
                Routine
              </Link>
              <Link 
                href="/blog" 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                style={{ cursor: 'pointer' }}
              >
                Blog
              </Link>
              <Link 
                href="/avis" 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                style={{ cursor: 'pointer' }}
              >
                Avis
              </Link>
              <div className="flex items-center space-x-4 pt-4">
                <Link 
                  href="/account" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium rounded-lg hover:bg-gray-50 px-3 py-2"
                  style={{ cursor: 'pointer' }}
                >
                  <User className="w-5 h-5" />
                  <span>Mon Compte</span>
                </Link>
                <Link 
                  href="/admin/login" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors text-sm rounded-lg hover:bg-gray-50 px-2 py-2"
                  style={{ cursor: 'pointer' }}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                <CartButton onClick={onCartClick} />
              </div>
              <button 
                onClick={() => window.location.href = '/cart'}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors font-medium w-full"
                style={{ cursor: 'pointer' }}
              >
                Commander
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
