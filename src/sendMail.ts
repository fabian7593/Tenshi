//This class is a test connection with the DB
import * as fs from 'fs';

import {sendMail} from "./utils/sendEmailsUtils";

import path from 'path';
const templatesDir = path.join(__dirname, './templates');

const htmlTemplate : string = fs.readFileSync(path.join(templatesDir, 'register_email.html'), 'utf8');

(async () => {
   
    const htmlBody = htmlTemplate
    .replace(/\{\{ companyName \}\}/g, 'Unbreakable')
    .replace(/\{\{ userName \}\}/g, 'Fabian Rosales')
    .replace(/\{\{ confirmationLink \}\}/g, 'https://tudominio.com/confirmacion');
 
   
      if(!await sendMail("fabian7593@gmail.com", "prueba", htmlBody)){
        console.log("Error sending");
      }
    
})();