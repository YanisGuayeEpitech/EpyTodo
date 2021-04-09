'use strict';

const util = require('../../util');

/**
 * @constructor
 * @param {string} id 
 * @param {string} email
 * @param {string | Buffer} password
 * @param {string} created_at
 * @param {string} firstname
 * @param {string} name
 */
function User(id, email, password, created_at, firstname, name) {
    this.id = id;
    this.email = email;
    this.password = password.toString();
    this.created_at = created_at;
    this.firstname = firstname;
    this.name = name;
}

/**
 * Fetches all the registered users.
 * 
 * @returns {[User]}
 */
async function getAll() {
    return await util.withConnection(async connection => {
        const query = 'SELECT * FROM `user`';
        const [rows] = await connection.execute(query);
        const users = new Array(rows.length);

        for (const [i, r] of Object.entries(rows))
            users[i] = new User(r.id, r.email, r.password, r.created_at, r.firstname, r.name);
        return users;
    });
}

/**
 * Gets an user by id.
 * 
 * @param {number} id The user's numerical id, must be an integer.
 * @returns {User?}
 */
async function getById(id) {
    return await util.withConnection(async connection => {
        const query = 'SELECT * FROM `user` WHERE `id` = ?';
        const [rows] = await connection.execute(query, [id.toString()]);

        if (rows.length == 0)
            return null;
        const r = rows[0];
        return new User(r.id, r.email, r.password, r.created_at, r.firstname, r.name);
    });
}

/**
 * Gets an user by email.
 * 
 * @param {string} email The user's email.
 * @returns {User?}
 */
async function getByEmail(email) {
    return await util.withConnection(async connection => {
        const query = 'SELECT * FROM `user` WHERE `email` = ?';
        const [rows] = await connection.execute(query, [email]);

        if (rows.length == 0)
            return null;
        const r = rows[0];
        return new User(r.id, r.email, r.password, r.created_at, r.firstname, r.name);
    });
}

module.exports = { getAll, getById, getByEmail };
