import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const userSchema = z.object({
  first_name: z.string().max(50, "يجب ألا يتجاوز الاسم الأول 50 حرفًا").optional(),
  last_name: z.string().max(50, "يجب ألا يتجاوز الاسم الأخير 50 حرفًا").optional(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "يجب أن يكون التنسيق YYYY-MM-DD").optional(),
  bio: z.string().max(250, "يجب ألا تتجاوز السيرة الذاتية 250 حرفًا").optional(),
  profile_picture: z.string().url("يجب أن يكون رابط الصورة صحيحًا").optional(),
  location: z.string().max(100, "يجب ألا تتجاوز الموقع 100 حرف").optional(),
});
export class AccountValidation {
    
    static validateUserData = (req : Request, res: Response, next: NextFunction) => {
        const { data } = req.body;
        try {
            userSchema.parse(data); 
            // إذا كان كل شيء صحيحًا، يُرجع البيانات نفسها
            return next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.errors });
                console.log(error);
                 // في حالة وجود أخطاء، يُرجع قائمة بالأخطاء
                return;
            }
        }
        next()
    };
}