"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addService } from "../_actions/Service.action";
import { toast } from "sonner";
import CloudinaryUploader from "@/components/Upload/CloudinaryUploader";
import Image from "next/image";

type AddServiceState = Awaited<ReturnType<typeof addService>>;
const initialState: AddServiceState | null = null;

const AddServicePage = () => {
  const [state, action, isPending] = useActionState(addService, initialState);

  // For live preview
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message[0]);
    } else if (state && !state.success) {
      const values = Object.values(state.message).flat();
      values.map((value) => toast.error(value));
    }
  }, [state]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Add Service</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new service offering.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5 h-full">
        <div className="md:col-span-3 h-full">
          <div className="rounded-xl border bg-card/50 shadow-sm h-full">
            <div className="border-b px-4 py-3">
              <div className="text-sm font-medium">Preview</div>
            </div>
            <div className="p-4">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md border bg-muted">
                {image ? (
                  <Image
                    src={image}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="text-base font-semibold">
                    {title || "Service title"}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {description || "Service description"}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 font-medium backdrop-blur">
                      Price: {price ? `${price} EGP` : "-"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 font-medium backdrop-blur">
                      Duration: {duration ? `${duration} min` : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          className="md:col-span-2 space-y-4 rounded-xl border bg-card/50 p-4 shadow-sm md:sticky md:top-4 h-fit"
          action={action}
        >
          <input type="hidden" name="image" value={image} />
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Home Cleaning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              name="description"
              placeholder="Briefly describe your service"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <CloudinaryUploader onUploadComplete={({ url }) => setImage(url)} folder="app-uploads/services" />
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price (EGP)
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="250"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium">
              Duration (minutes)
            </label>
            <Input
              id="duration"
              name="duration"
              type="number"
              placeholder="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 w-full">
            <Button
              type="submit"
              variant="secondary"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServicePage;
