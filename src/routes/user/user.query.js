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

/**
 * Updates an user's data.
 * 
 * @param {number} id The users's numerical id, must be an integer.
 * @param {{[string]: string?}} data
 * @returns {User?}
 */
async function update(id, data) {
    return await util.withConnection(async connection => {
        // get current user values
        const user = await getById(id);
        if (user === null)
            return null;

        // put all the values to update in an array
        const strings = new Array(data.length);
        const toUpdate = {};
        let i = 0;

        for (const key in data) {
            toUpdate[key] = util.defaulted(user[key], data[key]);
            strings[i++] = `\`${key}\` = ?`;
        }

        // perform update
        const query = `UPDATE \`user\` SET ${strings.join(', ')} WHERE \`id\` = ?`;
        await connection.execute(query, [...Object.values(toUpdate), id]);

        // update and return user object
        return Object.assign(user, toUpdate);
    })
}

/**
 * Removes an user by id.
 * 
 * @param {number} id The user's numerical id, must be an integer.
 * @returns {boolean}
 */
async function remove(id) {
    return await util.withConnection(async connection => {
        const query = 'DELETE FROM `user` WHERE `id` = ?';
        const [rows] = await connection.execute(query, [id]);

        return rows.affectedRows > 0;
    });
}

module.exports = { getAll, getById, getByEmail, remove, update };
