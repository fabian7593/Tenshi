import { IEmailTransporter } from './Interfaces/IEmailTransporter';
import { IEmailOptions } from './Interfaces/IEmailOptions';
import { EmailTransporterFactory } from './EmailTransporterFactory';
import { ConstLogs } from '@TenshiJS/consts/Const';
import logger from '@TenshiJS/utils/logger';

export default class EmailService {
    private static instance: EmailService;
    private transporter: IEmailTransporter;

    private constructor(transporterType: string) {
        this.transporter = EmailTransporterFactory.createEmailTransporter(transporterType);
    }

    public static getInstance(transporterType: string): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService(transporterType);
        }
        return EmailService.instance;
    }

    public async sendEmail(options: IEmailOptions) {
        try {
            console.log(options);
            await this.transporter.sendMail(options);
            
        } catch (error) {
            await logger(ConstLogs.LOG_ERROR, `EmailService.sendEmail: ` + error);
        }
    }
}
