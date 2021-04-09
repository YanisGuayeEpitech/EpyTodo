'use strict';

const express = require('express');
const parameters = require('../parameters');
const jwt = require('jsonwebtoken');
const query = require('../routes/login/login.query')

const router = express.Router();

router.use(async (req, res, next) => {
    let token;

    try {
        token = parameters.get(req.body, ['token']).token;
    } catch (err) {
        res.status(401).json({ msg: "No token, authorization denied" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        try {
            if (query.checkUser(decoded.email, decoded.password)) {
                next();
                return;
            }
        } catch (err) {
            req.app.error('auth', req, res, err.toString());
        }
    } catch (err) {
    }
    res.status(401).json({ msg: "Token is not valid" });
})

module.exports = router;
