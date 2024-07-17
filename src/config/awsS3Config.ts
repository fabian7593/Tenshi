const AWS = require('aws-sdk');
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
import {config} from "@index/index";

// Configuración del AWS SDK
AWS.config.update({
    accessKeyId:  config.AWS.ACCESS_KEY,
    secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
    region: config.AWS.REGION, 
    Bucket: config.AWS.BUCKET_NAME,
  });
  
const s3 = new AWS.S3();
export default s3;