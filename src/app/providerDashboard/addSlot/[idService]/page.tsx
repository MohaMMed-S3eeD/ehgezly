"use client";
import { Calendar } from "@/components/ui/calendar";
import React, { useActionState, useEffect, useState } from "react";
import TimeRangePicker from "../../_components/TimeRangePicker";
import { useParams } from "next/navigation";
import { addSlot } from "../../_actions/Slot.action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type AddSlotState = Awaited<ReturnType<typeof addSlot>>;
const initialState: AddSlotState | null = null;
const AddSlotPage = () => {
  const params = useParams();
  const idService = params.idService as string;
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [state, action, isPending] = useActionState(addSlot, initialState);
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

        <form className="mt-6 space-y-4" action={action}>
          <input type="hidden" name="idService" value={idService} />
          <input type="hidden" name="date" value={date?.toISOString() || ""} />
          <input type="hidden" name="startTime" value={startTime} />
          <input type="hidden" name="endTime" value={endTime} />
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Time
            </label>
            <TimeRangePicker
              startTime={startTime}
              endTime={endTime}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Date
            </label>
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
