'use strict';

const express = require('express');
const parameters = require('../../parameters');
const query = require('./user.query');
const util = require('../../util');

const router = express.Router();

router.use(require('../../middleware/auth'));

router.get('/', async (req, res) => {
    try {
        res.json(await query.getAll());
    } catch (err) {
        req.app.error('user', req, res, err.toString());
    }
});

router.get('/:id', async (req, res, next) => {
    const id = util.parseInt(req.params.id);

    if (id === null) {
        next();
        return;
    }
    try {
        let user = await query.getById(id);

        if (user)
            res.json(user);
        else
            res.status(404).json({ msg: "Not found" });
    } catch (err) {
        req.app.error(`user/${id}`, req, res, err.toString());
    }
});

module.exports = router;
