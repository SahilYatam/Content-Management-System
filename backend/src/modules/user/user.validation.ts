import { z } from "zod";

const signUpSchema = z.object({
    username: z.string().trim().min(3).max(30),
    name: z.string().trim().min(3).max(50),
    email: z.string().trim().email(),
    password: z.string().min(8),
});

const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
});


export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const userValidation = {
    signUpSchema,
    loginSchema
};
