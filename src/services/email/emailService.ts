import {
    userActivationNotificationTemplate,
    userActivationURLEmailTemplate,
} from "./emailTemplate.js";
import { emailTransporter } from "./transporter.js";
type emailObj = {
    email: string;
    url: string;
    fName: string;
};

export const sendActivationURLEmail = async (obj: emailObj) => {
    try {
        // get the transporter
        const transporter = emailTransporter();

        const info = await transporter.sendMail(
            userActivationURLEmailTemplate(obj)
        );

        return info.messageId;
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw new Error("Failed to send activation email");
    }
};

export const sendActivationNotificationEmail = async (obj: emailObj) => {
    try {
        let transporter = emailTransporter();

        const info = await transporter.sendMail(
            userActivationNotificationTemplate(obj)
        );
        return info.messageId;
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw new Error("Failed to activate account");
    }
};
