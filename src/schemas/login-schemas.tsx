import { z } from 'zod'

export const loginFormSchema = z.object({
  username: z.string({ required_error: "Tidak boleh kosong" }),
  password: z.string({ required_error: "Tidak boleh kosong" }).min(8)
});

export type LoginForm = z.infer<typeof loginFormSchema>;