'use strict';

const db = require('../../config/db');
const bcrypt = require('bcryptjs');

/** Registers a user to the database
 * 
 *  @param {string} email
 *  @param {string} mail
 *  @param {string} firstName
 *  @param {string} password 
 *  @returns {boolean} true if the user was registered, false otherwise.
 */
async function registerUser(email, name, firstName, password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const connection = await db.getConnection();
    const query = 'INSERT `user` (`email`, `password`, `name`, `firstname`) VALUES (?, ?, ?, ?)';

    try {
        await connection.execute(query, [email, hashedPassword, name, firstName]);
    } catch (err) {
        // check for duplicate entry error
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062)
            return false;
        // if not, trigger an internal server error by rethrowing err
        throw err;
    }
    return true;
}

module.exports = { registerUser };
