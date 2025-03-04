import nodemailer from "nodemailer";
import { conf } from "../../conf/conf";

export const emailTransporter = () => {
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: conf.smtpEmail,
            pass: conf.smtpPass,
        },
    });
};
