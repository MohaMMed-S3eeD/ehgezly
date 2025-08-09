import { Slot } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { getSlots } from "../_actions/Slot.action";
const PrevSlots = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  useEffect(() => {
    const fetchSlots = async () => {
      const slots = await getSlots();
      if (slots.success) {
        setSlots(slots.data);
      }
      console.log(slots);
    };
    fetchSlots();
  }, []);
  return (
    <div>
      {slots.map((slot) => (
        <div key={slot.id} className="flex flex-col gap-2">
          <h1>
            {new Date(slot.startTime).toLocaleString(undefined, {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </h1>
          <h1>
            {new Date(slot.endTime).toLocaleString(undefined, {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default PrevSlots;
