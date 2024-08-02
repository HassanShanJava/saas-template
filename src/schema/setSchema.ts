import { z } from "zod";

// Define a schema for a single set
const setSchema = z.object({
  time: z.number().min(1, { message: "Time must be at least 1 minute." }),
  rest: z.number().min(1, { message: "Rest must be at least 1 minute." }),
});

// Define the schema for the entire form
const formSchema = z.object({
  numberOfSets: z
    .number()
    .min(1, { message: "Number of sets must be at least 1." }),
  sets: z.array(setSchema),
});

export default formSchema;
