import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const userSchema = z.object({
  first_name: z.string().max(50, "First name must not exceed 50 characters").optional(),
  last_name: z.string().max(50, "Last name must not exceed 50 characters").optional(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format").optional(),
  bio: z.string().max(250, "Bio must not exceed 250 characters").optional(),
  profile_picture: z.string().url("Profile picture must be a valid URL").optional(),
  location: z.string().max(100, "Location must not exceed 100 characters").optional(),
});
export class AccountValidation {
    
    static validateUserData = (req : Request, res: Response, next: NextFunction) => {
        const { data } = req.body;
        try {
            userSchema.parse(data); 
            // if everything is valid, return the data itself
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
    };
}

