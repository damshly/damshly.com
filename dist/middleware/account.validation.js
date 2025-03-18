"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountValidation = void 0;
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    first_name: zod_1.z.string().max(50, "يجب ألا يتجاوز الاسم الأول 50 حرفًا").optional(),
    last_name: zod_1.z.string().max(50, "يجب ألا يتجاوز الاسم الأخير 50 حرفًا").optional(),
    date_of_birth: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "يجب أن يكون التنسيق YYYY-MM-DD").optional(),
    bio: zod_1.z.string().max(250, "يجب ألا تتجاوز السيرة الذاتية 250 حرفًا").optional(),
    profile_picture: zod_1.z.string().url("يجب أن يكون رابط الصورة صحيحًا").optional(),
    location: zod_1.z.string().max(100, "يجب ألا تتجاوز الموقع 100 حرف").optional(),
});
class AccountValidation {
}
exports.AccountValidation = AccountValidation;
AccountValidation.validateUserData = (req, res, next) => {
    const { data } = req.body;
    try {
        userSchema.parse(data);
        // إذا كان كل شيء صحيحًا، يُرجع البيانات نفسها
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.errors });
            console.log(error);
            // في حالة وجود أخطاء، يُرجع قائمة بالأخطاء
            return;
        }
    }
    next();
};
