//This class is a test connection with the DB

import mariadb from 'mariadb';
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3307') 
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
