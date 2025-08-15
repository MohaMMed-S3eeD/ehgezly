import Image from "next/image";
import React from "react";

const CardCustomer = () => {
  return (
    <div>
      <div>
        <div>
          <Image
            src="/images/customer1.png"
            alt=""
            width={100}
            height={100}
            className="rounded-full"
          />
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
        <p>
          &quot;I was struggling to find a reliable and affordable moving
          company until I found this one. They were professional, efficient, and
          made the entire process stress-free. I highly recommend them!&quot;
        </p>
      </div>
      <div className="">
        <div className=" text-center text-gray-500 border-2 border-gray-300 rounded-lg p-4">
          Plaming
        </div>
      </div>
    </div>
  );
};

export default CardCustomer;
