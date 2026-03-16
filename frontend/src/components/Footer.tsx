import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Leaf, Shield, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <span className="font-bold text-xl">PureSkin</span>
            </div>
            <p className="text-gray-400 mb-4">
              Cosmétique naturelle pour étudiants. 
              Une peau saine sans se ruiner.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Produits</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/produits/nettoyant" className="text-gray-400 hover:text-white transition-colors">
                  Nettoyant visage doux
                </Link>
              </li>
              <li>
                <Link href="/produits/creme" className="text-gray-400 hover:text-white transition-colors">
                  Crème hydratante légère
                </Link>
              </li>
              <li>
                <Link href="/produits/serum" className="text-gray-400 hover:text-white transition-colors">
                  Sérum anti-boutons
                </Link>
              </li>
              <li>
                <Link href="/produits/masque" className="text-gray-400 hover:text-white transition-colors">
                  Masque purifiant
                </Link>
              </li>
              <li>
                <Link href="/packs" className="text-gray-400 hover:text-white transition-colors">
                  Packs routines
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/routine" className="text-gray-400 hover:text-white transition-colors">
                  Ma routine personnalisée
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog cosmétique
                </Link>
              </li>
              <li>
                <Link href="/guide-examens" className="text-gray-400 hover:text-white transition-colors">
                  Guide spécial examens
                </Link>
              </li>
              <li>
                <Link href="/diagnostic-peau" className="text-gray-400 hover:text-white transition-colors">
                  Diagnostic de peau
                </Link>
              </li>
              <li>
                <Link href="/programme-fidelite" className="text-gray-400 hover:text-white transition-colors">
                  Programme fidélité
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/a-propos" className="text-gray-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/avis" className="text-gray-400 hover:text-white transition-colors">
                  Avis clients
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/livraison" className="text-gray-400 hover:text-white transition-colors">
                  Livraison & Retours
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-400 text-sm">contact@pureskin-etudiant.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-gray-400 text-sm">01 23 45 67 89</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-gray-400 text-sm">Paris, France</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Leaf className="w-4 h-4 text-green-500" />
              <span>100% naturel</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Vegan & cruelty-free</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-green-500" />
              <span>Made with love</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="text-green-500">✓</span>
              <span>Sans parabènes</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="text-green-500">✓</span>
              <span>Testé dermatologiquement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 PureSkin Étudiant. Tous droits réservés.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/cgv" className="hover:text-white transition-colors">
                CGV
              </Link>
              <Link href="/confidentialite" className="hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
