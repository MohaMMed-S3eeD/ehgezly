// import Image from "next/image";
import { CircleUser } from "lucide-react";
import React from "react";

const CardCustomer = () => {
  return (
    <div className="flex flex-col gap-4  p-4 rounded-lg border-2 ">
      <div className="flex flex-col gap-4">
        <div className="flex w-full justify-between items-center gap-4 ">
          <div className="flex gap-4 items-center">
            <CircleUser className="w-7 h-7" />
            <h3>John Doe</h3>
          </div>
          <div>
            <p className="flex gap-1 ">
              <span className="text-white px-1 bg-[#269C54]">★</span>
              <span className="text-white px-1 bg-[#269C54]">★</span>
              <span className="text-white px-1 bg-[#269C54]">★</span>
              <span className="text-white px-1 bg-[#269C54]">★</span>
              <span className="text-white px-1  bg-gradient-to-r from-[#269C54] from-50% to-gray-500 to-50% ">
                ★
              </span>
            </p>
          </div>
        </div>
        <p>
          I was struggling to find a reliable and affordable moving company
          until I found this one. They were professional, efficient, and made
          the entire process stress-free. I highly recommend them!
        </p>
      </div>
      <div className="flex  gap-4">
        <h1 className="p-1 rounded-lg border-1 border-gray-700 text-xs">
          Plaming
        </h1>
        <h1 className="p-1 rounded-lg border-1 border-gray-700 text-xs">
          Moving
        </h1>
      </div>
    </div>
  );
};

export default CardCustomer;
