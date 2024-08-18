
import { Document } from '@entity/Document';
import ConfigManager  from "tenshi/config/ConfigManager";


/**
 * Sets the name of a document and updates the document object with the new name and other properties.
 *
 * @param {Express.Multer.File} file - The file object containing information about the uploaded file.
 * @param {Document} documentBody - The document object to update.
 * @return {Document} - The updated document object.
 */
export function setNameDocument (file : Express.Multer.File,  documentBody : Document ): Document{
    // Extract the original file name from the file object.
    let fileName : string = file.originalname; 

    // Extract the file extension from the file name.
    const extension = fileName.split('.').pop(); 

    // Update the extension property of the document object.
    documentBody.extension = extension!;

    // Get the current date and time in a formatted string.
    const formatDate = formatDateFunction();

    // Construct the name of the document using various properties of the document object.
    const name = (!documentBody.title ? (documentBody.action_type + "__" + documentBody.table +  "__" + documentBody.id_for_table) : documentBody.title).replace(/ /g, "_");

    // Construct the file name using the name and other properties of the document object.
    fileName = name + "__" + documentBody.type + "__" + formatDate;

    // Update the file name and title properties of the document object.
    documentBody.file_name = fileName + "." + extension;
    documentBody.title = (!documentBody.title ? name : documentBody.title);
    documentBody.description = (!documentBody.description ? "" : documentBody.description);
    documentBody.is_public = (!documentBody.is_public ? false : documentBody.is_public);

    // Update the code property of the document object.
    documentBody.code = fileName.toUpperCase();

    // Return the updated document object.
    return documentBody;
} 

/**
 * This function returns the current date and time in a formatted string.
 * 
 * @return {string} The formatted date and time string.
 */
const formatDateFunction = () => {
    // Get the configuration object
    const config = ConfigManager.getInstance().getConfig();

    try {
        // Create a new Date object
        const date = new Date();

        // Format the date part of the date-time string
        const formattedDate = date.toLocaleDateString(config.SERVER.FORMAT_DATE)
            .replace(/\//g, ''); // Remove slashes from the formatted date string

        // Format the time part of the date-time string
        const formattedTime = date.toLocaleTimeString(config.SERVER.FORMAT_DATE)
            .replace(/:/g, ''); // Remove colons from the formatted time string

        // Concatenate the formatted date and time strings
        const formattedDateTime = formattedDate + formattedTime;

        return formattedDateTime;
    } catch (error) {
        // Return an empty string if an error occurs
        return "";
    }
}

