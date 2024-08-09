import { z } from "zod";

export const membersSchema = z.object({
  id: z.number(),
  name: z.string(),
});
