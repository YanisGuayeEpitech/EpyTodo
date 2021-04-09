'use strict';

const express = require('express');
const parameters = require('../../parameters');
const query = require('./register.query');
var jwt = require('jsonwebtoken');

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
        req.app.error('register', req, res, err.toString());
    }
});

module.exports = router;
