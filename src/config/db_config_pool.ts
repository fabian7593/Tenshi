import mariadb from 'mariadb';
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3307'),
  connectionLimit: 150,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci'
});

export default pool;
