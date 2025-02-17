import mailjet from "node-mailjet";
import dotenv from "dotenv";

dotenv.config(); // تحميل المتغيرات من .env

export const mailjetClient = mailjet.apiConnect(
    process.env.MAILJET_API_KEY as string,
    process.env.MAILJET_SECRET_KEY as string
);
