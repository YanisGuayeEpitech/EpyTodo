'use strict';

const express = require('express');
const parameters = require('../../parameters');
const db = require('../../config/db')

const router = express.Router();

router.post('/', (req, res) => {
    try {
        let params = parameters.get(req.body);

        db.registerUser(params.email, params.name, params.firstname, params.password)
            .then(() => res.json({ token: "TODO" }))
            .catch((msg) => req.app.error('register', req, res, msg));
    } catch (msg) {
        req.app.error('register', req, res, msg);
    }
});

module.exports = router;
