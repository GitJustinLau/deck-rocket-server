const knex = require('knex')(require('../knexfile'));

const getAllDecklists = (req, res) => {
    knex('decklists')
        .select("*")
        .where({ user_id: req.params.userId })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) =>
            res.status(400).send(`Error retrieving decklists: ${err}`)
        );
}

const createDecklist = (req, res) => {
    const newdecklist = {
        name: req.body.name,
        user_id: req.params.userId
    };
    knex('decklists')
        .insert(newdecklist)
        .then((result) => {
            return knex('decklists').where({
                name: req.body.name,
                user_id: req.params.userId
            }).first();
        })
        .then((res) => {
            res.status(201).json(res);
            console.log('Created new decklist');
        })
        .catch((error) => {
            console.log('POST error:', error);
            res.status(500).json({ message: "Unable to create new decklist" })
        })
}

module.exports = {
    getAllDecklists,
    createDecklist
}