import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const userSchema = z.object({
    id: z.number().int().positive(),
    username: z.string().min(3).max(20),
    email: z.string().email(), 
    password: z.string().min(8),
    first_name: z.string().min(1).max(50), 
    last_name: z.string().min(1).max(50), 
    date_of_birth: z.union([z.string().datetime(), z.null()]), 
    bio: z.union([z.string().max(255), z.null()]),
    privacy_settings: z.union([z.string(), z.null()]),
    profile_picture: z.union([z.string().url(), z.null()]),
    location: z.union([z.string().max(100), z.null()]), 
    contact_number: z.union([z.string().regex(/^\+\d{1,15}$/), z.null()]),
  });

  const registerUserSchema = userSchema.pick({
    username: true,
    email: true,
    password: true,
});

const loginSchema = userSchema.pick({
    email: true,
    password: true,
}).strict();
const profileSchema = userSchema.pick({
    username: true,
    first_name: true,
    last_name: true,
    date_of_birth: true,
    bio: true,
    profile_picture: true,
    location: true,
}).strict();
export class userValidation {
    static registerData = (req : Request, res: Response, next: NextFunction) => {
        try {
            const result = registerUserSchema.safeParse(req.body); 
            // if everything is valid, return the data itself
            if (!result.success) {
                res.status(400).json({ errors: result.error.format() });
            }

            return next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.errors });
                console.log(error);
                 // if there are errors, return a list of errors
                return;
            }
        }
        next()
    }
    static loginData = (req : Request, res: Response, next: NextFunction) => {
        try {
            const result = loginSchema.safeParse(req.body); 
            // if everything is valid, return the data itself
            if (!result.success) {
                res.status(400).json({ errors: result.error.format() });
            }

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.errors });
                console.log(error);
                 // if there are errors, return a list of errors
            }
        }
    }
    static profileData = (req : Request, res: Response, next: NextFunction) => {
        try {
            const result = profileSchema.safeParse(req.body); 
            // if everything is valid, return the data itself
            if (!result.success) {
                res.status(400).json({ errors: result.error.format() });
            }

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.errors });
                console.log(error);
                 // if there are errors, return a list of errors
            }
        }
        next()
    }
}

