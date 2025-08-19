import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div>
      <Box />
      <div>
        <footer className=" dark:text-white text-black py-8 md:py-12 mt-13">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Ehgezly</h3>
                <p className="dark:text-gray-400 text-gray-500 mb-4">
                  Your trusted platform for connecting with skilled
                  professionals to get any task done.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="#"
                    className="dark:text-gray-400 text-gray-500 hover:text-white"
                  >
                    Facebook
                  </Link>
                  <Link
                    href="#"
                    className="dark:text-gray-400 text-gray-500 hover:text-white"
                  >
                    Twitter
                  </Link>
                  <Link
                    href="#"
                    className="dark:text-gray-400 text-gray-500 hover:text-white"
                  >
                    Instagram
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="dark:text-gray-400 text-gray-500 hover:text-white"
                    >
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="dark:text-gray-400 text-gray-500 hover:text-white"
                    >
                      Become a Tasker
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="dark:text-gray-400 text-gray-500 hover:text-white"
                    >
                      Find Taskers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="dark:text-gray-400 text-gray-500 hover:text-white"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 dark:text-gray-400 text-gray-500">
                  <li>support@ehgezly.com</li>
                  <li>+1 (555) 123-4567</li>
                  <li>123 Main St, City, State 12345</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="dark:text-gray-400 text-gray-500 text-sm">
                © 2024 Ehgezly. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link
                  href="#"
                  className="dark:text-gray-400 text-gray-500 hover:text-white text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="dark:text-gray-400 text-gray-500 hover:text-white text-sm"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;

const Box = () => {
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto rounded-2xl pt-6 md:pt-4  md:pl-4 h-auto md:h-[40vh] bg-gray-100 dark:bg-black/50 bg-blur-sm">
      <div className="flex-1 flex flex-col gap-3 md:gap-4 justify-center items-center md:items-start text-center md:text-left m-4 md:m-10">
        <h1 className="text-2xl md:text-4xl font-bold">Ready to Start?</h1>
        <p className="text-sm md:text-base text-gray-400">
          Sign up today and connect with top taskers to get your job done.
        </p>
        <div className="flex gap-3 md:gap-4 justify-center md:justify-start flex-wrap">
          <Link
            href="#"
            className="text-sm bg-[#8EEA80] text-black px-4 py-2 rounded-2xl"
          >
            Become A Tasker
          </Link>
          <Link href="#" className="text-sm bg-white/20 px-4 py-2 rounded-2xl">
            View All Taskers
          </Link>
        </div>
      </div>
      <div className="flex-1 w-full h-48 md:h-full flex justify-center md:justify-end items-center mt-6 md:mt-0">
        <Image
          src="https://res.cloudinary.com/dtvr83fb3/image/upload/v1755492803/Screenshot_2025-08-18_074907-removebg-preview_upscayl_4x_upscayl-standard-4x_avcukq.png"
          alt="img"
          width={200}
          height={200}
          className="w-full h-full  object-right object-contain rounded-2xl"
        />
      </div>
    </div>
  );
};
