import { z } from "zod";

const addSlotValid = z.object({
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    date: z.string().min(1, { message: "Date is required" }),
    idService: z.string().min(1, { message: "Service is required" }),
});

export default addSlotValid;