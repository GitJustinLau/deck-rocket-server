const knex = require('knex')(require('../knexfile'));

const getdecklists = (req,res) => {
    knex('warehouses')
        .select("*")
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) =>
            res.status(400).send(`Error retrieving warehouses: ${err}`)
        );
}

//list of decklists functions
const getAllDecklists = (req, res) => {
    const decklistsData = getdecklists().map((deck) => {
        return {
            "id": deck.id,
            "title": deck.title,
        }
    })
    res.status(200).json(decklistsData);
};

const createDecklist = (req, res) => {
    const decklistsData = getdecklists();
    const newdecklist = {
        id: uuid(),
        ...req.body,
    };

    decklistsData.push(newdecklist);
    savedecklists(decklistsData);
    res.status(201).json(newdecklist);
}







//single decklist functions
const getDecklistID = (req, res) => {
    const decklistsData = getdecklists();
    const currdecklistId = req.params.decklistId;
    const decklist = decklistsData.find(decklist => decklist.id === currdecklistId);

    if (!decklist) {
        return res.status(404).json({ error: 'decklist not found' });
    }

    res.status(200).json(decklist);
}



module.exports = {
    getAllDecklists,
    createDecklist,
    getDecklistID
}