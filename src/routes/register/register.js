'use strict';

const express = require('express');
const parameters = require('../../parameters');
const query = require('./register.query');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const params = parameters.get(req.body);
        const hashedPassword = await bcrypt.hash(params.password, 0);

        await query.registerUser(params.email, params.name, params.firstname, hashedPassword);
        res.json({ token: "TODO" });
    } catch (msg) {
        req.app.error('register', req, res, msg);
    }
});

module.exports = router;
