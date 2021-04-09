'use strict';

const db = require('../../config/db');
const bcrypt = require('bcryptjs');

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
 * @returns {[User]}
 */
async function getAllUsers() {
    const connection = await db.getConnection();
    let users;

    try {
        users = await (async () => {
            const query = 'SELECT * FROM `user`';
            const [rows] = await connection.execute(query);
            const users = new Array(rows.length);

            for (const [i, r] of Object.entries(rows))
                users[i] = new User(r.id, r.email, r.password, r.created_at, r.firstname, r.name);
            return users;
        })();
    } finally {
        connection.release();
    }
    return users;
}

module.exports = {
    getAllUsers
};
