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

const createDecklist = async (req, res) => {
    try {

        if (req.body.name.length === 0) {
            return res.status(400).json({ message: "Please pick a name" })
        }

        const nameCheck = await knex('decklists').where({ name: req.body.name })

        if (nameCheck.length > 0) {
            return res.status(400).json({ message: "Decklist name is in use. Please pick another name" })
        }

        const newdecklist = {
            name: req.body.name,
            user_id: req.params.userId
        };

        await knex('decklists').insert(newdecklist);
        const newDecklist = await knex('decklists').where({
            name: req.body.name,
            user_id: req.params.userId
        }).first();

        res.status(201).json(newDecklist);
        console.log(`Created new decklist: ${req.body.name}`);
    }
    catch (error) {
        console.log('POST error:', error);
        res.status(500).json({ message: "Unable to create new decklist" })
    }
}

const delDecklist = async (req, res) => {
    const decklistId = req.params.decklistId
    try {
        await knex('decklists').where({ id: decklistId }).del()
        res.status(204).json({ message: `${decklistId} has been deleted` })
        console.log(`${decklistId} has been deleted`);
    }
    catch (error) {
        console.error('Delete error:', error);
    };
}

const activeDecklist = (req, res) => {
    knex('decklist_cards')
        .select("*")
        .where({ deck_id: req.params.decklistId })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) =>
            res.status(400).send(`Error retrieving decklists: ${err}`)
        );
}

module.exports = {
    getAllDecklists,
    createDecklist,
    delDecklist,
    activeDecklist
}