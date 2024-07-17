//This class is a test connection with the DB

import mariadb from 'mariadb';
import { default as config } from '../unbreakable-config';

const pool = mariadb.createPool({
  host: config.DB.HOST,
  user: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  port: config.DB.PORT 
});

(async () => {
  let conn;

  try {

    conn = await pool.getConnection();
    console.log('Successfull Connection EASY REST API LAND DB');
  } catch (err) {
    console.error('Error to connect EASY REST API LAND DB:', err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
})();
