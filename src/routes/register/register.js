'use strict';

const express = require('express');
const parameters = require('../../parameters');
const query = require('./register.query');
const bcrypt = require('bcryptjs');
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
        const hashedPassword = await bcrypt.hash(params.password, 0);

        if (!await query.registerUser(params.email, params.name, params.firstname, hashedPassword)) {
            res.status(400).json({ msg: "account already exists" });
        } else {
            const token = jwt.sign({ password: hashedPassword }, process.env.SECRET);

            res.json({ token });
        }
    } catch (err) {
        req.app.error('register', req, res, err.toString());
    }
});

module.exports = router;
