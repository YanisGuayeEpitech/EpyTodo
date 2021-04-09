'use strict';

const db = require('../../config/db');

/** Registers a user to the database
 * 
 *  @param {string} email
 *  @param {string} mail
 *  @param {string} firstName
 *  @param {string} hashedPassword
 */
async function registerUser(email, name, firstName, hashedPassword) {
    const connection = await db.getConnection();
    const query = 'INSERT `user` (`email`, `password`, `name`, `firstname`) VALUES (?, ?, ?, ?)';

    await connection.execute(query, [email, hashedPassword, name, firstName]);
}

module.exports = { registerUser };
