'use strict';

const util = require('../../util');

/**
 * @typedef {'not started' | 'todo' | 'in progress' | 'done'} Status
 */

/**
 * @constructor
 * @param {string} id
 * @param {string} title
 * @param {string} description
 * @param {string} created_at
 * @param {string} due_time
 * @param {string} user_id
 * @param {Status} status
 */
function Todo(id, title, description, created_at, due_time, user_id, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.created_at = created_at;
    this.due_time = due_time;
    this.user_id = user_id;
    this.status = status;
}

/**
 * Fetches all the registered todos.
 * 
 * @returns {[Todo]}
 */
async function getAll() {
    return await util.withConnection(async connection => {
        const query = 'SELECT * FROM `todo`';
        const [rows] = await connection.execute(query);
        const todos = new Array(rows.length);

        for (const [i, r] of Object.entries(rows))
            todos[i] = new Todo(r.id, r.title, r.description, r.created_at, r.due_time, r.user_id, r.status);
        return todos;
    });
}

/**
 * Gets an todo by id.
 * 
 * @param {number} id The todo's numerical id, must be an integer.
 * @returns {Todo?}
 */
async function getById(id) {
    return await util.withConnection(async connection => {
        const query = 'SELECT * FROM `todo` WHERE `id` = ?';
        const [rows] = await connection.execute(query, [id.toString()]);

        if (rows.length == 0)
            return null;
        const r = rows[0];
        return new Todo(r.id, r.title, r.description, r.created_at, r.due_time, r.user_id, r.status);
    });
}

/**
 * Adds a new todo.
 * 
 * @param {string} id
 * @param {string} title
 * @param {string} description
 * @param {string} due_time
 * @param {string} user_id
 * @param {Status} status
 * @returns {Todo?}
 */
async function add(title, description, due_time, user_id, status) {
    return await util.withConnection(async connection => {
        const insertQuery = 'INSERT INTO `todo`\
        (`title`,`description`,`due_time`,`user_id`,`status`)\
        VALUES(?,?,?,?,?)';
        await connection.execute(insertQuery, [title, description, due_time, user_id, status]);

        const query = 'SELECT * from `todo` WHERE `id` = LAST_INSERT_ID()';
        let [rows] = await connection.execute(query);

        if (rows.length == 0)
            return null;
        const r = rows[0];
        return new Todo(r.id, r.title, r.description, r.created_at, r.due_time, r.user_id, r.status);
    })
}

/**
 * Updates an todo's data.
 * 
 * @param {number} id The todo's numerical id, must be an integer.
 * @param {{[string]: string?}} data
 * @returns {Todo?}
 */
async function update(id, data) {
    return await util.withConnection(async connection => {
        // get current todo values
        const todo = await getById(id);
        if (todo === null)
            return null;

        // put all the values to update in an array
        const strings = new Array(data.length);
        const toUpdate = {};
        let i = 0;

        for (const key in data) {
            toUpdate[key] = util.defaulted(todo[key], data[key]);
            strings[i++] = `\`${key}\` = ?`;
        }

        // perform update
        const query = `UPDATE \`todo\` SET ${strings.join(', ')} WHERE \`id\` = ?`;
        await connection.execute(query, [...Object.values(toUpdate), id]);

        // update and return todo object
        return Object.assign(todo, toUpdate);
    })
}

/**
 * Removes an todo by id.
 * 
 * @param {number} id The todo's numerical id, must be an integer.
 * @returns {boolean}
 */
async function remove(id) {
    return await util.withConnection(async connection => {
        const query = 'DELETE FROM `todo` WHERE `id` = ?';
        const [rows] = await connection.execute(query, [id]);

        return rows.affectedRows > 0;
    });
}

/**
 * Fetches all the todos associated with the given user id.
 * 
 * @param {number} user_id The user's numerical id, must be an integer.
 * @returns {[Todo]} The todo-list.
 */
async function getFromUser(user_id) {
    return await util.withConnection(async connection => {
        const query = 'SELECT \
            `todo`.`id`, `todo`.`title`, `todo`.`description`, `todo`.`due_time`, `todo`.`user_id`, `todo`.`status`\
            FROM `todo`\
            INNER JOIN `user`\
            ON `todo`.`user_id` = ? AND`todo`.`user_id` = `user`.`id`';
        const [rows] = await connection.execute(query, [user_id]);
        const todos = new Array(rows.length);

        for (const [i, r] of Object.entries(rows))
            todos[i] = new Todo(r.id, r.title, r.description, r.created_at, r.due_time, r.user_id, r.status);
        return todos;
    });
}

module.exports = { getAll, getById, add, update, remove, getFromUser };
