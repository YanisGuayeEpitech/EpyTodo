'use strict';

const util = require('../../util');
const bcrypt = require('bcryptjs');

/**
 *  Check if user and password exists.
 * 
 *  @param {string} email
 *  @param {string} password
 *  @returns {boolean} true if user and password exists in database.
 */
async function checkUser(email, password) {
    return await util.withConnection(async connection => {
        const query = "SELECT `password` FROM `user` WHERE `email` = ?";
        const [rows] = await connection.execute(query, [email]);

        return rows.length > 0 && await bcrypt.compare(password, rows[0].password.toString());
    });
}

module.exports = { checkUser };
