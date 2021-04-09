'use strict';

/** Fetches and transforms (if necessary) any value in the request's body. */
const parameters = {
    email: function (value) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(value))
            throw `invalid email ${value}`;
        return value;
    }
}

/**
 * @param {any} body The request's body.
 * @param {[string]} keys
 * @returns {[string]}
 */
function getParameters(body, keys) {
    let values = {};

    for (let key of keys) {
        let value = body[key];

        if (value === undefined || value === null)
            throw `missing parameter '${key}'`;
        if (parameters.hasOwnProperty(key))
            value = parameters[key](value);
        values[key] = value;
    }
    return values;
}

module.exports = { get: getParameters };
