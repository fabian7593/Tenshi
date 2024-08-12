import { IEmailTransporter } from './Interfaces/IEmailTransporter';
import { GeneralTransporter } from './Transporters/GeneralTransporter';

export class EmailTransporterFactory {
    static createEmailTransporter(type: string | null = null): IEmailTransporter {
        switch (type) {
            case null:
                return new GeneralTransporter();
            // ADD OTHER CASES HERE
            default:
                throw new Error(`Transporter type ${type} is not supported.`);
        }
    }
}
