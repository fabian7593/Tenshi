import { IEmailTransporter } from './Interfaces/IEmailTransporter';
import { GmailTransporter } from './GmailTransporter';

export class EmailTransporterFactory {
    static createEmailTransporter(type: string): IEmailTransporter {
        switch (type) {
            case 'gmail':
                return new GmailTransporter();
            // Añade otros casos para diferentes transporters
            default:
                throw new Error(`Transporter type ${type} is not supported.`);
        }
    }
}
