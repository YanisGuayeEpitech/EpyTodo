'use strict';

const db = require('./config/db');

/**
 * Parses if the given value is an integer. 
 * 
 * @param {any} value 
 * @returns {number?} The parsed integer, or null if not an int. 
 */
function parseInt(value) {
    if (isNaN(value))
        return null;
    const x = parseFloat(value);
    if ((x | 0) !== x)
        return null;
    return x;
}

/**
 * @template T
 * @param {(connection: import('mysql2').Pool) => PromiseLike<T>} onConnect 
 * @returns {T}
 */
async function withConnection(onConnect) {
    const connection = await db.getConnection();
    let result;

    try {
        result = await onConnect(connection);
    } finally {
        connection.release();
    }
    return result;
}

module.exports = { parseInt, withConnection };
