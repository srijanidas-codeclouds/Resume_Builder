import { Origami, Twitter } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <div className="mt-8">
  <footer className="bg-gray-800 text-white py-10 px-4 w-full">
    {/* Top Section */}
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
      {/* Company Info */}
      <div className="mr-8">
        <div className="inline-flex gap-2 items-start mb-4">
            <Origami className="w-8 h-8 text-blue-400 mb-2 flex-1" />
            <h2 className="text-2xl font-semibold mb-2">CodeClouds</h2>
        </div>
        <p className="text-sm text-gray-400 mb-1">
          Your gateway to seamless coding collaboration.
        </p>
        <p className="text-sm text-gray-400">
          Join us on our mission to revolutionize coding collaboration.
        </p>
      </div>

      {/* Quick Links */}
      <div className="mt-6 md:mt-0">
        <h3 className="font-semibold text-gray-200 mb-3">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Shop
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              About
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div className="mt-6 md:mt-0">
        <h3 className="font-semibold text-gray-200 mb-3">Support</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              About Us
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Contact Us
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>

      {/* newsletter */}
      <div className="mt-6 md:mt-0">
        <div className="border-gray-700 pt-0">
        <div className="mx-auto">
            <h3 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h3>
            {/* Newsletter */}
            <form className="flex items-center mt-4 max-w-sm">
                <input
                type="email"
                placeholder="Enter your email"
                className="p-3 w-full text-sm border border-blue-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                />
                <button className="bg-blue-400 text-white px-6 py-3 text-sm rounded-r-sm border-white hover:bg-blue-800 transition-colors">
                Subscribe
                </button>
            </form>
        </div>
      </div>

      {/* Social Media */}
    <div className="pt-6 ">
      <div className="container mx-auto">
        <p className="text-gray-200 text-sm mb-4">Follow us on social media :</p>
        <ul className="flex  space-x-6 text-lg">
          <li>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-white transition"
            >
              <i className="fa-brands fa-x-twitter fa-bounce"></i>
            </a>
          </li>
          <li>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-white transition"
            >
              <i className="fa-brands fa-meta fa-bounce"></i>
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-white transition"
            >
              <i className="fa-brands fa-linkedin fa-bounce"></i>
            </a>
          </li>
          <li>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-white transition"
            >
              <i className="fa-brands fa-github fa-bounce"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
      </div>
      
    </div>

    {/* Bottom Copyright */}
    <div className="mt-8 border-t border-gray-700 pt-4">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        <p>&copy; 2025 CodeClouds. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>

  )
}

export default Footer