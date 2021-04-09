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
    const query = "SELECT `password` FROM `user` WHERE `email` = ?";

    try {
        let [rows] = await connection.execute(query, [email]);

        return rows.length && await bcrypt.compare(password, rows[0].password.toString());
    } catch (err) {
        throw err;
    }
}

module.exports = { checkUser };
