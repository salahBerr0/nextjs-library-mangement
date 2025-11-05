"use client";
import { BookOpen, Heart, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
      <footer className="w-full mx-auto px-4 py-12 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image src='/headingWw.png' alt='heading logo image' height={200} width={70} className='h-auto w-auto'/>
              </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover a world of knowledge with our extensive collection of books. 
              From classic literature to modern bestsellers, we have something for every reader.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Made with love for book lovers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Browse Books</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Popular Books</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">New Arrivals</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">About Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-gray-400">support@onlinelibrary.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-gray-400">123 Library St, Book City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Online Library. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Cookie Policy</a>
          </div>
        </div>
      </footer>
  );
}