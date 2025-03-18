"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendMail = void 0;
const mailjet_1 = require("../config/mailjet");
const sendMail = (to, subject, htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield mailjet_1.mailjetClient
            .post("send", { version: "v3.1" })
            .request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAILJET_SENDER_EMAIL,
                        Name: "Your Project Name",
                    },
                    To: [
                        {
                            Email: to,
                            Name: to.split("@")[0], // استخدام الجزء الأول من البريد كاسم
                        },
                    ],
                    Subject: subject,
                    HTMLPart: htmlContent,
                },
            ],
        });
        console.log("Email sent successfully:", result.body);
        return { success: true, message: "Email sent successfully!" };
    }
    catch (error) {
        console.error("Error sending email:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.body) || error);
        return { success: false, message: "Failed to send email." };
    }
});
exports.sendMail = sendMail;
const sendVerificationEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;
    console.log("Verification URL:", verificationUrl);
    try {
        const result = yield mailjet_1.mailjetClient
            .post("send", { version: "v3.1" })
            .request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAILJET_SENDER_EMAIL,
                        Name: "Your Project",
                    },
                    To: [
                        {
                            Email: to,
                            Name: to.split("@")[0],
                        },
                    ],
                    Subject: "Email Verification",
                    HTMLPart: `<p>Click the link below to verify your email:</p>
                                   <a href="${verificationUrl}">clic here</a>`,
                },
            ],
        });
        console.log("Verification email sent:", result.body);
        return { success: true, message: "Email sent successfully!" };
    }
    catch (error) {
        console.error("Error sending email:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.body) || error);
        return { success: false, message: "Failed to send email." };
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
