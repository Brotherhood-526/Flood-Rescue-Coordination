import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button'


import logo from '@/assets/logo.png';

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="w-full fixed top-0 left-0 bg-white shadow z-50 ">
        <div className="flex justify-between items-center h-20 px-8 py-4">
          {/* Logo */}
         
            <img
              src={logo}
              alt="Flood Rescue Logo"
              className="h-12 w-auto"
            />
        

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Home */}
                <NavigationMenuItem>
                  <Link
                    to="/"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Trang chủ
                  </Link>
                </NavigationMenuItem>

                {/* Map */}
                <NavigationMenuItem>
                  <Link
                    to="/map"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Bản đồ
                  </Link>
                </NavigationMenuItem>

                {/* Search */}
                <NavigationMenuItem>
                  <Link
                    to="/search"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Tra cứu
                  </Link>
                </NavigationMenuItem>

                {/* Contact */}
                <NavigationMenuItem>
                  <Link
                    to="/contact"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Liên hệ
                  </Link>
                </NavigationMenuItem>

                {/* Usage Guide */}
                <NavigationMenuItem>
                  <Link
                    to="/guide"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Hướng dẫn sử dụng
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden md:block">
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Đăng nhập
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobile}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav className="md:hidden pb-4">
            <div className="space-y-2">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition"
                onClick={() => setMobileOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/map"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition"
                onClick={() => setMobileOpen(false)}
              >
                Bản đồ
              </Link>
              <Link
                to="/search"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition"
                onClick={() => setMobileOpen(false)}
              >
                Tra cứu
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition"
                onClick={() => setMobileOpen(false)}
              >
                Liên hệ
              </Link>
              <Link
                to="/guide"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition"
                onClick={() => setMobileOpen(false)}
              >
                Hướng dẫn sử dụng
              </Link>
              <div className="px-3 py-2 pt-4 border-t">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
