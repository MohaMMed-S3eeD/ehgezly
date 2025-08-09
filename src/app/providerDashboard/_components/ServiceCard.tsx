"use client";
import { Service } from "@prisma/client";
import React, { useActionState, useEffect } from "react";
import { Clock, DollarSign, Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteService, editService } from "../_actions/Service.action";
import { toast } from "sonner";
import Link from "next/link";

type EditServiceState = Awaited<ReturnType<typeof editService>>;
type DeleteServiceState = Awaited<ReturnType<typeof deleteService>>;
const initialState: EditServiceState | DeleteServiceState | null = null;

const ServiceCard = ({ service }: { service: Service }) => {
  const [stateEdit, actionEdit, isPendingEdit] = useActionState(
    editService,
    initialState
  );
  const [stateDelete, actionDelete, isPendingDelete] = useActionState(
    deleteService,
    initialState
  );
  useEffect(() => {
    if (stateEdit?.success) {
      toast.success(stateEdit?.message[0]);
    } else if (stateEdit && !stateEdit.success) {
      const values = Object.values(stateEdit.message).flat();
      values.map((value) => toast.error(value));
    }
  }, [stateEdit]);
  useEffect(() => {
    if (stateDelete?.success) {
      toast.success(stateDelete?.message[0]);
    } else if (stateDelete && !stateDelete.success) {
      const values = Object.values(stateDelete.message).flat();
      values.map((value) => toast.error(value));
    }
  }, [stateDelete]);
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        Service
      </div>
      <h3 className="mt-1 line-clamp-1 text-base font-semibold">
        {service.title}
      </h3>
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
      <div className="mt-4 flex items-center gap-2 justify-around">
        <Dialog>
          <DialogTrigger>
            <Pencil className="size-4" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>

              <form action={actionEdit} className="space-y-4 my-2">
                <Input type="text" name="id" defaultValue={service.id} hidden />
                <Input
                  type="text"
                  name="title"
                  placeholder="Title"
                  defaultValue={service.title}
                />
                <Input
                  type="text"
                  name="description"
                  placeholder="Description"
                  defaultValue={service.description}
                />
                <Input
                  type="number"
                  name="price"
                  placeholder="Price"
                  defaultValue={service.price}
                />
                <Input
                  type="number"
                  name="duration"
                  placeholder="Duration"
                  defaultValue={service.duration}
                />
                <Button type="submit" className="w-full">
                  {isPendingEdit ? "Saving..." : "Save"}
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <Trash className="size-4" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                service and remove it from your offerings.
              </DialogDescription>
              <form action={actionDelete} className="space-y-4 my-2">
                <Input type="text" name="id" defaultValue={service.id} hidden />
                <Button type="submit" className="w-full">
                  {isPendingDelete ? "Deleting..." : "Delete"}
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Link href={`/providerDashboard/addSlot/${service.id}`}>
          <Plus className="size-4" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
