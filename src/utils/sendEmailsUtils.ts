import nodemailer from 'nodemailer';
import {default as config} from "@root/unbreakable-config";

const transporter = nodemailer.createTransport({
    service: config.EMAIL.SERVICE,
    auth: {
        user: config.EMAIL.AUTH_USER, 
        pass: config.EMAIL.AUTH_PASSWORD     
    }
});

export function sendMail(toMail: string, subject: string, message: string): Promise<boolean> {
    const mailOptions = {
        from: config.EMAIL.EMAIL_FROM,      
        to: toMail,  
        subject: subject,      
        html: message
    };

    return new Promise<boolean>((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                resolve(false); 
            } else {
                resolve(true); 
            }
        });
    });
}


export function replaceCompanyInfoEmails(htmlTemplate: string): string{
    const htmlBody = htmlTemplate
    .replace(/\{\{ companyDomain \}\}/g, config.COMPANY.LANDING_PAGE)
    .replace(/\{\{ companyName \}\}/g, config.COMPANY.NAME)
    .replace(/\{\{ companyLogo \}\}/g, config.COMPANY.LOGO)
    .replace(/\{\{ mainColor \}\}/g,  config.COMPANY.MAIN_COLOR);

    return htmlBody;
}