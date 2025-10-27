import nodemailer from "nodemailer";
import 'dotenv/config';
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";



export const verifyEmail = async (token,email) => {
    try {
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
        const mailConfigurations = {
        from: process.env.EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: VERIFICATION_EMAIL_TEMPLATE(token),
        category: "Email Verification",
    }    

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent successfully: " + info.response);
            console.log(info);
        }
    });
    } catch (error) {
        console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error.message}`);
    }
}
