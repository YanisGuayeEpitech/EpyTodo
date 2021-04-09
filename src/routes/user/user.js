'use strict';

const express = require('express');
const parameters = require('../../parameters');
const query = require('./user.query');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(require('../../middleware/auth'));

router.get('/', async (req, res) => {
    try {
        res.json(await query.getAllUsers());
    } catch (err) {
        req.app.error('user', req, res, err.toString());
    }
});

module.exports = router;
