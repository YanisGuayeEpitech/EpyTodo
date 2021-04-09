'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const query = require('../routes/login/login.query')
const util = require('../util');

const router = express.Router();

router.use(async (req, res, next) => {
    let token;

    // parse the auth token
    try {
        let header = req.header("Authorization");
        const re = /^\s*(?:\w+\s+)?([^\s]+)\s*$/
        token = header.match(re)[1];
    } catch (err) {
        res.status(401).json({ msg: "No token, authorization denied" });
        return;
    }

    // check if the token is valid
    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        try {
            if (await query.checkUser(decoded.email, decoded.password)) {
                next();
                return;
            }
        } catch (err) {
            util.internalError('auth', req, res, err.toString());
        }
    } catch (_) {
    }
    res.status(401).json({ msg: "Token is not valid" });
})

module.exports = router;
