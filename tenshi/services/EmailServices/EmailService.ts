import { IEmailTransporter } from './Interfaces/IEmailTransporter';
import { IEmailOptions } from './Interfaces/IEmailOptions';
import { EmailTransporterFactory } from './EmailTransporterFactory';
import { ConstLogs } from 'tenshi/consts/Const';
import logger from 'tenshi/utils/logger';

export default class EmailService {
    private static instance: EmailService;
    private transporter: IEmailTransporter;

    private constructor(transporterType: string | null = null) {
        this.transporter = EmailTransporterFactory.createEmailTransporter(transporterType);
    }

    public static getInstance(transporterType: string | null = null): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService(transporterType);
        }
        return EmailService.instance;
    }

    public async sendEmail(options: IEmailOptions) {
        try {
            await this.transporter.sendMail(options);
            
        } catch (error) {
            await logger(ConstLogs.LOG_ERROR, `EmailService.sendEmail: ` + error);
        }
    }
}
