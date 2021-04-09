'use strict';

const express = require('express');
const parameters = require('../../parameters');
const query = require('./login.query');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/', async (req, res) => {
    let params;

    try {
        params = parameters.get(req.body, ['email', 'password']);
    } catch (msg) {
        res.status(400).json({ msg });
        return;
    }

    try {
        if (!await query.checkUser(params.email, params.password)) {
            res.status(400).json({ msg: "Invalid Credentials" });
        } else {
            const token = jwt.sign({ email: params.email, password: params.password }, process.env.SECRET);

            res.json({ token });
        }
    } catch (err) {
        req.app.error('login', req, res, err.toString());
    }
});

module.exports = router;
