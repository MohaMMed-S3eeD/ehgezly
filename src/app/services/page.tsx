import React from "react";
import { getServices } from "../providerDashboard/_actions/Service.action";

const page = async () => {
  const services = await getServices();
  console.log(services);
  return (
    <div>
      <h1>Services</h1>
      <div>
        {services.data?.map((service) => (
          <div key={service.id}>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <p>{service.price}</p>
            <p>{service.duration}</p>
            <p>{service.providerId}</p>
            <p>{service.createdAt.toLocaleDateString()}</p>
            <p>
              {service.slots.map((slot) => (
                <p key={slot.id}>
                  {slot.startTime.toLocaleTimeString()} -{" "}
                  {slot.endTime.toLocaleTimeString()}
                  {slot.isBooked ? "Booked" : "Available"}
                </p>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
