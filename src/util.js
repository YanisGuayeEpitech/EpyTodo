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

/**
 * Reports an internal server error.
 * 
 * @param {string} path The route in which the error occured.
 * @param {import('express').Request} req  The Request.
 * @param {import('express').Response} res The Response.
 * @param {any} err The error object.
 */
function internalError(path, req, res, err) {
    console.error(`[ERROR] at '${path}' from '${req.ip}': ${err}`);
    res.status(500).json({ msg: "internal server error" });
};

module.exports = { parseInt, withConnection, internalError };
