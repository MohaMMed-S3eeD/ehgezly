"use client";
import { Calendar } from "@/components/ui/calendar";
import React, { useActionState, useEffect, useState } from "react";
import TimeRangePicker from "../../_components/TimeRangePicker";
import { useParams } from "next/navigation";
import { addSlot } from "../../_actions/Slot.action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PrevSlots from "../../_components/PrevSlots";

type AddSlotState = Awaited<ReturnType<typeof addSlot>>;
const initialState: AddSlotState | null = null;
const AddSlotPage = () => {
  const params = useParams();
  const idService = params.idService as string;
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [state, action, isPending] = useActionState(addSlot, initialState);
  const y = date?.getFullYear();
  const m = date ? date.getMonth() : undefined;
  const d = date?.getDate();
  const parseHM = (v: string) => {
    const [hh, mm] = (v || "").split(":");
    const h = Math.max(0, Math.min(23, Number(hh || 0)));
    const mi = Math.max(0, Math.min(59, Number(mm || 0)));
    return { h, mi };
  };
  useEffect(() => {
    console.log(startTime, endTime, date);
  }, [startTime, endTime, date]);
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message[0]);
    }
    if (state?.success === false) {
      const values = Object.values(state.message).flat();
      values.map((value) => toast.error(value));
    }
  }, [state]);
  return (
    <div>
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Add Slot</h1>
        <p className="mt-1 text-muted-foreground">
          Create a new time slot for your service.
        </p>
        <div>
          <PrevSlots />
        </div>
        <form className="mt-6 space-y-4" action={action}>
          <input type="hidden" name="idService" value={idService} />
          {/**
           * نرسل التاريخ بصيغة محلية ثابتة YYYY-MM-DD بدل ISO لتجنب تحوّل اليوم حسب الـ timezone
           */}
          <input
            type="hidden"
            name="date"
            value={
              date
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                    2,
                    "0"
                  )}-${String(date.getDate()).padStart(2, "0")}`
                : ""
            }
          />
          {/** نمرّر فرق التوقيت من المتصفح بالدقائق لضبط التحويل على السيرفر */}
          <input
            type="hidden"
            name="tzOffset"
            value={
              date
                ? String(
                    new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      12,
                      0,
                      0,
                      0
                    ).getTimezoneOffset()
                  )
                : ""
            }
          />
          {/** فروقات التوقيت المحسوبة تحديدًا لوقت البداية والنهاية لمنع أي اختلافات أيام تغيّر التوقيت */}
          <input
            type="hidden"
            name="tzOffsetStart"
            value={
              y !== undefined && m !== undefined && d !== undefined && startTime
                ? String(
                    new Date(
                      y,
                      m,
                      d,
                      parseHM(startTime).h,
                      parseHM(startTime).mi,
                      0,
                      0
                    ).getTimezoneOffset()
                  )
                : ""
            }
          />
          <input
            type="hidden"
            name="tzOffsetEnd"
            value={
              y !== undefined && m !== undefined && d !== undefined && endTime
                ? String(
                    new Date(
                      y,
                      m,
                      d,
                      parseHM(endTime).h,
                      parseHM(endTime).mi,
                      0,
                      0
                    ).getTimezoneOffset()
                  )
                : ""
            }
          />
          <input type="hidden" name="startTime" value={startTime} />
          <input type="hidden" name="endTime" value={endTime} />
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Time</label>
            <TimeRangePicker
              startTime={startTime}
              endTime={endTime}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Slot"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSlotPage;
