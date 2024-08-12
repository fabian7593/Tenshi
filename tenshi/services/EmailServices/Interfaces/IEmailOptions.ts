export interface IEmailOptions {
    toMail: string;
    subject: string;
    message: string;
    attachments?: Array<{
        filename: string;  // File name
        path?: string;     // path of the archive
        content?: Buffer;  // Buffer content
    }>;               
}

