"use client";
import React, { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addService } from "../_actions/Service.action";
import { toast } from "sonner";
import TimeRangePicker from "../_components/TimeRangePicker";

type AddServiceState = Awaited<ReturnType<typeof addService>>;
const initialState: AddServiceState | null = null;

const AddServicePage = () => {
  const [state, action, isPending] = useActionState(addService, initialState);
  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message[0]);
    } else if (state && !state.success) {
      const values = Object.values(state.message).flat();
      values.map(value => toast.error(value));
    }
  }, [state]);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Add Service</h1>
      <p className="mt-1 text-muted-foreground">
        Create a new service offering.
      </p>

      <form className="mt-6 space-y-4" action={action}>
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input id="title" name="title" placeholder="e.g. Home Cleaning" />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Input
            id="description"
            name="description"
            placeholder="Briefly describe your service"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Price (EGP)
          </label>
          <Input id="price" name="price" type="number" placeholder="250" />
        </div>
        <div className="space-y-2">
          <label htmlFor="duration" className="text-sm font-medium">
            Duration (minutes)
          </label>
          <Input id="duration" name="duration" type="number" placeholder="60" />
        </div>
        <TimeRangePicker />
        <div className="pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add Service"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddServicePage;
