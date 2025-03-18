import { mailjetClient } from "../config/mailjet";

export const sendMail = async (to: string, subject: string, htmlContent: string) => {
    try {
        const result = await mailjetClient
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
                                Name: to.split("@")[0], // Use the first part of the email as a name
                            },
                        ],
                        Subject: subject,
                        HTMLPart: htmlContent,
                    },
                ],
            });

        console.log("Email sent successfully:", result.body);
        return { success: true, message: "Email sent successfully!" };
    } catch (error: any) {
        console.error("Error sending email:", error.response?.body || error);
        return { success: false, message: "Failed to send email." };
    }
};

export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;
    console.log("Verification URL:", verificationUrl);

    try {
        const result = await mailjetClient
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
                                   <a href="${verificationUrl}">Click here</a>
                                   <p>Or copy and paste this link in your browser: {${verificationUrl}}</p>`
                                   ,
                    },
                ],
            });

        console.log("Verification email sent:", result.body);
        return { success: true, message: "Email sent successfully!" };
    } catch (error: any) {
        console.error("Error sending email:", error.response?.body || error);
        return { success: false, message: "Failed to send email." };
    }
};
