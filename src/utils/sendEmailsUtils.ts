import nodemailer from 'nodemailer';
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_AUTH_USER, 
        pass: process.env.EMAIL_AUTH_PASSWORD      
    }
});

export function sendMail(toMail: string, subject: string, message: string): Promise<boolean> {
    const mailOptions = {
        from: process.env.EMAIL_FROM,      
        to: toMail,  
        subject: subject,      
        html: message
    };

    return new Promise<boolean>((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
               // console.error('Error sending email:', error);
                resolve(false); 
            } else {
                //console.log('Email sent:', info.response);
                resolve(true); 
            }
        });
    });
}


export function replaceCompanyInfoEmails(htmlTemplate: string): string{
    const htmlBody = htmlTemplate
    .replace(/\{\{ companyDomain \}\}/g, process.env.COMPANY_DOMAIN!)
    .replace(/\{\{ companyName \}\}/g, process.env.COMPANY_NAME!)
    .replace(/\{\{ companyLogo \}\}/g, process.env.COMPANY_LOGO!)
    .replace(/\{\{ mainColor \}\}/g, process.env.COMPANY_MAIN_COLOR!);

    return htmlBody;
}