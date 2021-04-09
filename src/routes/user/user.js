'use strict';

const express = require('express');
const query = require('./user.query');
const util = require('../../util');
const parameters = require('../../parameters');

const router = express.Router();

router.use(require('../../middleware/auth'));

router.get('/', async (req, res) => {
    try {
        res.json(await query.getAll());
    } catch (err) {
        util.internalError('GET /user', req, res, err.toString());
    }
});

router.get('/todos', async (req, res) => {
    try {
        const user = await query.getByEmail(res.locals.email);

        if (user)
            res.json(await query.getTodos(user.id));
        else
            res.status(404).json({ msg: "Not found" });
    } catch (err) {
        util.internalError(`DELETE /user/todos`, req, res, err.toString());
    }
})

router.get('/:id', async (req, res, next) => {
    const id = util.parseInt(req.params.id);

    if (id === null) {
        next();
        return;
    }
    try {
        const user = await query.getById(id);

        if (user)
            res.json(user);
        else
            res.status(404).json({ msg: "Not found" });
    } catch (err) {
        util.internalError(`GET /user/${id}`, req, res, err.toString());
    }
});

router.get('/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const user = await query.getByEmail(email);

        if (user)
            res.json(user);
        else
            res.status(404).json({ msg: "Not found" });
    } catch (err) {
        util.internalError(`GET /user/${email}`, req, res, err.toString());
    }
});

router.put('/:id', async (req, res) => {
    const id = util.parseInt(req.params.id);

    if (id == null) {
        res.status(400).json({ msg: "Invalid id" });
        return;
    }
    try {
        const data = parameters.getOptional(req.body, ['email', 'name', 'firstname', 'password']);
        const user = await query.update(id, data);

        if (user)
            res.json(user);
        else
            res.status(404).json({ msg: "Not found" });
    } catch (err) {
        util.internalError(`PUT /user/${id}`, req, res, err.toString());
    }
});

router.delete('/:id', async (req, res) => {
    const id = util.parseInt(req.params.id);

    if (id == null) {
        res.status(400).json({ msg: "Invalid id" });
        return;
    }
    try {
        if (await query.remove(id))
            res.json({ msg: `succesfully deleted record number: ${id}` });
        else
            res.status(404).json({ msg: "Not found" });
    } catch (err) {
        util.internalError(`DELETE /user/${id}`, req, res, err.toString());
    }
});

module.exports = router;
