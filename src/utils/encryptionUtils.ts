import crypto from 'crypto';

/*
    Encryption Utils Class
    This class use aes-256-cbc, for Cipher the password &
    Decrypt these as well.
    You can add the Password salt into .env file, with this tag -> SALT=32FieldsPassword
*/

export function encryptPassword(password: string, encryptionKey: string): string | null {
    try {
        const iv = generateIV();
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), Buffer.from(iv, 'hex'));
        let encryptedPassword = cipher.update(password, 'utf8', 'hex');
        encryptedPassword += cipher.final('hex');
        return iv + ':' + encryptedPassword;
    } catch (error) {
        console.error('Error al cifrar la contraseña:', error);
        return null;
    }
}


export function decryptPassword(encryptedPassword: string | null, encryptionKey: string): string {
    if (encryptedPassword !== null) {
        const parts = encryptedPassword.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
        let password = decipher.update(encryptedText, 'hex', 'utf8');
        password += decipher.final('utf-8');
        return password;
    } else {
        return '';
    }
}

function generateIV(): string {
    const iv = crypto.randomBytes(16);
    return iv.toString('hex');
}
