'use strict';

const express = require('express');
const parameters = require('../../parameters');
const query = require('./register.query');
const jwt = require('jsonwebtoken');
const util = require('../../util');

const router = express.Router();

router.post('/', async (req, res) => {
    let params;

    try {
        params = parameters.get(req.body, ['email', 'name', 'firstname', 'password']);
    } catch (msg) {
        res.status(400).json({ msg });
        return;
    }

    try {
        if (!await query.registerUser(params.email, params.name, params.firstname, params.password)) {
            res.status(400).json({ msg: "account already exists" });
        } else {
            const token = jwt.sign({ email: params.email, password: params.password }, process.env.SECRET);

            res.json({ token });
        }
    } catch (err) {
        util.internalError('register', req, res, err.toString());
    }
});

module.exports = router;
