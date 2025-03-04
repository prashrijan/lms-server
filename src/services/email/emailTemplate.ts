import { conf } from "../../conf/conf";

export const userActivationURLEmailTemplate = ({ email, url, fName }) => {
    let message = {
        from: `Readify <${conf.smtpEmail}>`,
        to: `${email}`,
        subject: "Activate Your New Readify Account",
        text: `Hello, ${fName}. Please click the link below to activate your new Readify account. ${url}.`,
        html: `
            <p>Your account has been created. Please click the button below to activate your new Readify account.</p>
            <a href="${url}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: green; text-decoration: none; border-radius: 5px;">Activate Now</a>
            <p>Regards,<br/>Readify</p>
        `,
    };

    return message;
};
export const userActivationNotificationTemplate = ({ email, fName }) => {
    let message = {
        from: `Readify <${conf.smtpEmail}>`,
        to: `${email}`,
        subject: "Your Readify Account Has Been Activated",
        text: `Hello, ${fName}. Your Readify account has been successfully activated. You can now log in and start using our services.`,
        html: `
            <p>Your account has been successfully activated. You can now log in and start using our services.</p>
            <p>Regards,<br/>Readify</p>
        `,
    };

    return message;
};
