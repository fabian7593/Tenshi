const AWS = require('aws-sdk');
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
import ConfigManager  from "tenshi/config/ConfigManager";
const config = ConfigManager.getInstance().getConfig();

// AWS CONFIG
AWS.config.update({
    accessKeyId:  config.FILE.AWS.ACCESS_KEY,
    secretAccessKey: config.FILE.AWS.SECRET_ACCESS_KEY,
    region: config.FILE.AWS.REGION, 
    Bucket: config.FILE.AWS.BUCKET_NAME,
  });
  
const s3 = new AWS.S3();
export default s3;