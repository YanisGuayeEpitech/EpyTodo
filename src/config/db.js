'use strict';

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

/** Registers a user to the database
 * 
 *  @param {string} email
 *  @param {string} mail
 *  @param {string} firstName
 *  @param {string} password
 */
async function registerUser(email, name, firstName, password) {
    await pool.execute('INSERT `user` (`email`, `password`, `name`, `firstname`) VALUES (?, ?, ?, ?)', [email, password, name, firstName]);
}

module.exports = {
    registerUser
};
