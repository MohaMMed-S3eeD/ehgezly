import { Service } from "@prisma/client";
import React from "react";
import { Clock, DollarSign } from "lucide-react";

const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Service</div>
      <h3 className="mt-1 line-clamp-1 text-base font-semibold">{service.title}</h3>
      {service.description ? (
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {service.description}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1">
          <DollarSign className="size-3.5 opacity-70" />
          <span className="font-medium">{String(service.price)} EGP</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1">
          <Clock className="size-3.5 opacity-70" />
          <span className="font-medium">{service.duration} min</span>
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
