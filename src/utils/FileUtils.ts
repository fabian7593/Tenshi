
import { Document } from '@entity/Document';
import ConfigManager  from "tenshi/config/ConfigManager";


export function setNameDocument (file : Express.Multer.File,  documentBody : Document ): Document{
    
    let fileName : string = file.originalname; 
    const extension = fileName.split('.').pop(); 
    documentBody.extension = extension!;

    const formatDate = formatDateFunction();

    const name = documentBody.action_type + "__" + documentBody.table +  "__" + documentBody.id_for_table;
    fileName = name + "__" + documentBody.type + "__" + formatDate;

    documentBody.file_name = fileName;
    documentBody.title = fileName + documentBody.action_type + "__" + formatDate;
    documentBody.code = fileName + documentBody.action_type + "__" + formatDate;

    return documentBody;
}


const formatDateFunction = () => {
    const config = ConfigManager.getInstance().getConfig();
    try {
        const date = new Date();
        return date.toLocaleDateString(config.SERVER.FORMAT_DATE).replace(/\//g, '') + 
               date.toLocaleTimeString(config.SERVER.FORMAT_DATE).replace(/:/g, '');
    } catch (error) {
        return "";
    }
};