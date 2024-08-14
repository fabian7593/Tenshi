
import s3 from 'tenshi/config/AWSS3Config';
import ConfigManager  from "tenshi/config/ConfigManager";

export async function uploadFile(file : Express.Multer.File, filename: string, isPublic: boolean) : Promise<any>{
    const config = ConfigManager.getInstance().getConfig();
    let urlBucket : string = "";
    if(isPublic){
        urlBucket = config.FILE_STORAGE.AWS.BUCKET_NAME + config.FILE_STORAGE.AWS.PUBLIC_FOLDER;
    }else{
        urlBucket = config.FILE_STORAGE.AWS.BUCKET_NAME;
    }
   
    const params = {
        Bucket: urlBucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

    try {
        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        throw new Error("Error Uploading file from S3");
    }
}


export async function getFile(filename: string): Promise<string> {
    const config = ConfigManager.getInstance().getConfig();
    let urlBucket: string = config.FILE_STORAGE.AWS.BUCKET_NAME;
    
    const params = {
        Bucket: urlBucket,
        Key: filename,
        Expires: config.FILE_STORAGE.AWS.MINUTES_LIMIT_PRIVATE_FILE,
    };

    try {
        const signedUrl = s3.getSignedUrl('getObject', params);
        return signedUrl;
    } catch (error) {
        throw new Error("Error fetching file from S3");
    }
}