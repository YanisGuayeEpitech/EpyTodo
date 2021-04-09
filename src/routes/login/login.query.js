'use strict';

const db = require('../../config/db');
const bcrypt = require('bcryptjs');

/**
 *  Check if user and password exists.
 * 
 *  @param {string} email
 *  @param {string} password
 *  @returns {boolean} true if user and password exists in database.
 */
async function checkUser(email, password) {
    const connection = await db.getConnection();
    let exists;

    try {
        exists = await (async () => {
            const query = "SELECT `password` FROM `user` WHERE `email` = ?";
            const [rows] = await connection.execute(query, [email]);

            return rows.length > 0 && await bcrypt.compare(password, rows[0].password.toString());
        })();
    } finally {
        connection.release();
    }
    return exists;
}

module.exports = { checkUser };
