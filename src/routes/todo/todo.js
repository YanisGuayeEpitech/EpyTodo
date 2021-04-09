'use strict';

const express = require('express');
const query = require('./todo.query');
const util = require('../../util');
const parameters = require('../../parameters');

const router = express.Router();

router.use(require('../../middleware/auth'));

router.get('/', async (req, res) => {
    try {
        res.json(await query.getAll());
    } catch (err) {
        util.internalError('GET /todo', req, res, err.toString());
    }
});

router.get('/:id', async (req, res) => {
    const id = util.parseInt(req.params.id);

    if (id === null) {
        next();
        return;
    }
    try {
        const todo = await query.getById(id);

        if (todo)
            res.json(todo);
        else
            res.status(404).json({ msg: "Not found" });
    } catch (err) {
        util.internalError(`GET /todo/${id}`, req, res, err.toString());
    }
});

router.post('/', async (req, res) => {
    let params;

    try {
        params = parameters.get(req.body, ['title', 'description', 'due_time', 'user_id', 'status']);
    } catch (msg) {
        res.status(400).json({ msg });
        return;
    }
    try {
        const todo = await query.add(params.title, params.description, params.due_time, params.user_id, params.status);

        if (todo)
            res.json(todo);
        else
            res.status(500).json({ msg: "Failed to add todo item" });
    } catch (err) {
        util.internalError(`POST /todo`, req, res, err.toString());
    }
});

router.put('/:id', async (req, res) => {
    const id = util.parseInt(req.params.id);

    if (id == null) {
        res.status(400).json({ msg: "Invalid id" });
        return;
    }
    try {
        const data = parameters.getOptional(req.body, ['title', 'description', 'due_time', 'user_id', 'status']);

        const todo = await query.update(id, data);

        if (todo)
            res.json(todo);
        else
            res.status(404).json({ msg: "Not found" });
    } catch (err) {
        util.internalError(`PUT /todo/${id}`, req, res, err.toString());
    }
})

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
        util.internalError(`DELETE /todo/${id}`, req, res, err.toString());
    }
})

module.exports = router;
