import React from "react";
import CardCustomer from "./CardCustomer";

const Customer = () => {
  return (
    <section>
      <div
        id="Header"
        className="flex flex-col gap-4 min-h-screen justify-center items-center text-center"
      >
        <div>
          <h1>What Our Customers Are Saying</h1>
          <p>
            Discover why our clients love us! Read real testfnonials from
            satisfied customers who have experienced our top-notch services and
            see how we&apos;ve made their lives easier
          </p>
        </div>
        <div>
          <p>Excellent</p>
          <p className="flex gap-1 ">
            <span className="text-white px-1 bg-[#269C54]">★</span>
            <span className="text-white px-1 bg-[#269C54]">★</span>
            <span className="text-white px-1 bg-[#269C54]">★</span>
            <span className="text-white px-1 bg-[#269C54]">★</span>
            <span className="text-white px-1  bg-gradient-to-r from-[#269C54] from-50% to-gray-500 to-50% ">
              ★
            </span>
          </p>
          <p>Trustpilot</p>
        </div>
      </div>
      <div id="Cards">
        <CardCustomer />
      </div>
    </section>
  );
};

export default Customer;
