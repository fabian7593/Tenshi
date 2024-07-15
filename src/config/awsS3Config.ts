const AWS = require('aws-sdk');
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
require('dotenv').config();

// Configuración del AWS SDK
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION, 
    Bucket: process.env.BUCKET_NAME,
  });
  
const s3 = new AWS.S3();
export default s3;