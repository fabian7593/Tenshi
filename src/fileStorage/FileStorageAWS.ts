import IFileStorage from "./IFileStorage";
import s3 from '@config/awsS3Config';
import { config } from '@index/index';

export default class FileStorageAWS implements IFileStorage{
    
    public async uploadFile(file: Express.Multer.File, filename: string): Promise<any> {
        const params = {
            Bucket: config.AWS.BUCKET_NAME,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype, 
           // ACL: 'public-read', // opcional, establece los permisos de acceso al objeto
          };
    
          const result = await s3.upload(params).promise();
          return result.Location;
    }
}