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

function getParameters(body) {
    return new Proxy(parameters, {
        get: (target, param, receiver) => {
            let value = body[param];

            if (value === undefined || value === null)
                throw `missing parameter ${param}`;
            if (target.hasOwnProperty(param))
                value = target[param](value);
            return value;
        }
    });
}

module.exports = {
    /**
     * @param body The request's body.
     */
    get: getParameters,
};
