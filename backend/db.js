
require('dotenv').config();
const mysql = require('mysql2');

//const connection = mysql.createconnection({
 // host: 'localhost',
 // user: 'root',
 // password: '',
 // database: 'carrer_nest',
//  waitForConnections: true,
//  connectionLimit: 10,
//  queueLimit: 0,
//  enableKeepAlive: true,
 // keepAliveInitialDelay: 10000 // in milliseconds
//});


 let connection;

 try {
   connection = mysql.createconnection({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0,
     enableKeepAlive: true,
     keepAliveInitialDelay: 10000,
   });

   console.log('✅ MySQL connection created successfully.');
 } catch (error) {
   console.error('❌ Error creating MySQL connection:', error);
//   process.exit(1); // optional: stop app if DB fails
 }
module.exports = connection;

