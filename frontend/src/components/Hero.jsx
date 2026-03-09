import React from "react";
import { Button } from "./ui/button";

function Hero() {
  return (
    <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white ">
      <div className="max-w-7xl mx-auto px-2 lg:px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center ">
          <div className="">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Latest Electronics at Best Prices
            </h1>
            <p className="text-xl mb-6 text-blue-100  ">
              Discover cutting-edge technology with unbeatable deals on
              smartphones, laptop and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="cursor-pointer bg-white text-blue-600  hover:bg-gray-100">
                Shop Now
              </Button>

              <Button
                variant="outline"
                className="  cursor-pointer border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                View Deals
              </Button>
            </div>
          </div>
          <div className="relative  ">
            <div className="w-full h-125  overflow-hidden shadow-2xl ">
              <img
                src="/hero3.png"
                className="w-full object-center  bg-transparent h-full shadow-2xl"
                alt="hero_logo"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
