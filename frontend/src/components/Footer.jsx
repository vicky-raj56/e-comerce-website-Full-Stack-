import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 ">
      <div className="max-w-7xl mx-auto md:flex md:justify-between   px-4 ">
        {/* info */}
        <div className="mb-6 md:mb-0">
          <Link to="/">
            <img src="/logo.png" alt="logo" className="w-30 h-20" />
          </Link>
          <p className=" text-sm capitalize">
            Powering Your World With the best in electronics
          </p>
          <p className="mt-1 text-sm capitalize">
            P123 electronics st, style city, my 10001
          </p>
          <p className="text-sm mt-1  ">Email: vickyraj563065@gmaail.com</p>
          <p>phone: (123) 456-4546</p>
        </div>

        {/* customer service link */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Customer Service</h3>
          <ul className="mt-2 text-sm space-y-2 cursor-pointer">
            <li>Contact Us</li>
            <li>Shipping & Returns </li>
            <li>FAQs</li>
            <li>Order Tracing</li>
            <li>Size Guide</li>
          </ul>
        </div>

        {/* social media link  */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex gap-2 cursor-pointer py-2 text-xl">
            <FaGithub  />
            <FaLinkedin />
            <FaInstagram />
            <FaFacebook />
          </div>
        </div>

        {/* Newsletter subscription */}
        <div>
          <h3 className="text-xl font-semibold ">Stay in the Loop</h3>
          <p>Subscribe to get spacial offers, free giveaways, and more</p>
          <form className="mt-4 flex gap-1 ">
            <input
              type="email"
              placeholder="enter your email..."
              className="w-full p-2 rounded-md border border-muted/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 "
            />
            <button className="bg-pink-600 text-white px-4 rounded-md hover:bg-red-700 cursor-pointer focus:outline-none  ">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <p className=" mt-10 border-b-2 border-white/30  "></p>
      <div className="flex items-center justify-center gap-1 pt-5 ">
        <p className="flex gap-2 items-center">
          <span className="text-lg"> &copy;</span>{" "}
          <span>{new Date().getFullYear()} </span>{" "}
          <span className="text-red-500/90">EKart.</span>
          <span>All rights reserved</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
