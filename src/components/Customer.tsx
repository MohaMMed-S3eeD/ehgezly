import React from "react";
import CardCustomer from "./CardCustomer";

const Customer = () => {
  return (
    <section className=" min-h-screen m-4">
      <div
        id="Header"
        className="flex gap-4 justify-between items-center text-center "
      >
        <div className="flex flex-2 flex-col gap-4 text-left">
          <h1 className="text-2xl font-bold">What Our Customers Are Saying</h1>
          <p className="text-gray-300 text-sm max-w-md">
            Discover why our clients love us! Read real testfnonials from
            satisfied customers who have experienced our top-notch services and
            see how we&apos;ve made their lives easier
          </p>
        </div>
        <div className="flex flex-1  gap-4">
          <p className="flex-1">Excellent</p>
          <p className="flex gap-1 ">
            <span className="text-white px-1 bg-[#269C54]">★</span>
            <span className="text-white px-1 bg-[#269C54]">★</span>
            <span className="text-white px-1 bg-[#269C54]">★</span>
            <span className="text-white px-1 bg-[#269C54]">★</span>
            <span className="text-white px-1  bg-gradient-to-r from-[#269C54] from-50% to-gray-500 to-50% ">
              ★
            </span>
          </p>
          <p className="flex-1">Trustpilot</p>
        </div>
      </div>
      <div id="Cards">
        <CardCustomer />
      </div>
    </section>
  );
};

export default Customer;
