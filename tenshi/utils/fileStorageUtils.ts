
import s3 from 'tenshi/config/AWSS3Config';
import ConfigManager  from "tenshi/config/ConfigManager";

export async function uploadFile(file : Express.Multer.File, filename: string) : Promise<any>{
    const config = ConfigManager.getInstance().getConfig();

    const params = {
        Bucket: config.FILE.AWS.BUCKET_NAME,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype, 
       // ACL: 'public-read', // opcional, establece los permisos de acceso al objeto
      };

      const result = await s3.upload(params).promise();
      return result.Location;
}
