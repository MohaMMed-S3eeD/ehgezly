"use client";
import React, { useActionState, useMemo, useState } from "react";
import type { Service, Slot } from "@prisma/client";
import { bookSlot } from "@/app/services/_actions/Booking.action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ServiceWithSlots = Service & { slots: Slot[] };

interface Props {
  service: ServiceWithSlots;
}

function formatTimeRange(startISO: string | Date, endISO: string | Date) {
  try {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const dayStr = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(start);
    const startStr = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(start);
    const endStr = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(end);
    return `${dayStr} • ${startStr} - ${endStr}`;
  } catch {
    return `${String(startISO)} - ${String(endISO)}`;
  }
}

const initialState: Awaited<ReturnType<typeof bookSlot>> | null = null;

const ServiceDetails: React.FC<Props> = ({ service }) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [state, action, isPending] = useActionState(bookSlot, initialState);

  const availableSlots = useMemo(() => {
    const now = new Date();
    return (service.slots || [])
      .filter((s) => !s.isBooked && new Date(s.endTime) > now)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  }, [service.slots]);

  React.useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message[0] || "تم الحجز بنجاح");
      setSelectedSlotId(null);
    } else {
      (state.message || []).forEach((m) => toast.error(m));
    }
  }, [state]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{service.title}</h1>
        {service.description ? (
          <p className="mt-2 text-muted-foreground">{service.description}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1">
            Price: <span className="font-medium">{Number(service.price)} EGP</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1">
            Duration: <span className="font-medium">{service.duration} min</span>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Available slots</h2>
        {availableSlots.length > 0 ? (
          <ul className="space-y-2">
            {availableSlots.map((slot) => (
              <li
                key={slot.id}
                className={`flex items-center justify-between rounded-lg border p-3 text-sm ${
                  selectedSlotId === slot.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className="text-left"
                >
                  {formatTimeRange(slot.startTime as unknown as string, slot.endTime as unknown as string)}
                </button>
                <input
                  type="radio"
                  name="selectedSlot"
                  checked={selectedSlotId === slot.id}
                  onChange={() => setSelectedSlotId(slot.id)}
                  aria-label="Select this slot"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No slots available right now
          </div>
        )}
      </div>

      <form action={action} className="flex items-center gap-3" aria-label="Book service">
        <input type="hidden" name="serviceId" value={service.id} />
        <input
          type="hidden"
          name="slotId"
          value={selectedSlotId || ""}
          aria-label="Selected slot"
        />
        <Button type="submit" disabled={!selectedSlotId || isPending}>
          {isPending ? "Booking..." : "Book"}
        </Button>
      </form>
    </div>
  );
};

export default ServiceDetails;


