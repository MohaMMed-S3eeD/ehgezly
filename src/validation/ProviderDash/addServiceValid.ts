import { z } from "zod";


const addServiceValid = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: z.number().min(1, { message: "Price is required" }),
    duration: z.number().min(1, { message: "Duration is required" }),
});

export default addServiceValid;