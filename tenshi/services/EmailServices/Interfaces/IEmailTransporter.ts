import { IEmailOptions } from "./IEmailOptions";

export interface IEmailTransporter {
    sendMail(options: IEmailOptions): Promise<boolean>;
}
