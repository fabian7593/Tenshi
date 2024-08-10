
import { Document } from '@entity/Document';

export function setNameDocument (file : Express.Multer.File,  documentBody : Document ): Document{
    let fileName : string = file.originalname; 
    const extension = fileName.split('.').pop(); 
    documentBody.extension = extension!;

    const formatDate = new Date().toLocaleDateString('es-ES').replace(/\//g, '') + new Date().toLocaleTimeString('es-ES').replace(/:/g, '');

    const name = documentBody.action_type + "__" + documentBody.table +  "__" + documentBody.id_for_table;
    fileName = name + "__" + documentBody.type + "__" + formatDate;

    documentBody.file_name = fileName;
    documentBody.title = fileName + documentBody.action_type + "__" + formatDate;
    documentBody.code = fileName + documentBody.action_type + "__" + formatDate;

    return documentBody;
}