import mariadb from 'mariadb';
import ConfigManager  from "tenshi/config/ConfigManager";
const config = ConfigManager.getInstance().getConfig();

//Maria DB Config
const pool = mariadb.createPool({
  host: config.DB.HOST,
  user: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  port: config.DB.PORT,
  connectionLimit: 150,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci'
});

export default pool;
