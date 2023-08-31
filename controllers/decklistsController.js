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

const activeDecklist = async (req, res) => {
    try {
        let pullCards = await knex('decklist_cards')
            .join('cards', 'decklist_cards.card_id', '=', 'cards.id')
            .where({ 'decklist_cards.decklist_id': req.params.decklistId })
            .select('cards.*');

        const pullCardIds = await knex('decklist_cards').where({ 'decklist_cards.decklist_id': req.params.decklistId }).select('*');
        const pullCardTypesPromises = pullCardIds.map(async (card) => {
            const types = await knex('types')
                .join('card_types', 'types.id', '=', 'card_types.type_id')
                .where({ 'card_types.card_id': card.card_id })
                .select('types.name')
                // console.log("types", types)
            card.types = types.map((typeObj) => typeObj.name)
            return card
        })
        const pullCardTypes = await Promise.all(pullCardTypesPromises)

        const pullCardColorIdPromises = pullCardIds.map(async (card) => {
            const colorId = await knex('colors')
                .join('card_color_ids', 'colors.id', '=', 'card_color_ids.color_id')
                .where({ 'card_color_ids.card_id': card.card_id })
                .select('colors.name')
            card.colorIdentity = colorId.map((colorObj) => colorObj.name)
            return card
        })
        const pullCardColorIds = await Promise.all(pullCardColorIdPromises)
        
        pullCards = pullCards.map((card) => {
            const typesIndex = pullCardTypes.findIndex((typeObj) => typeObj.card_id === card.id)
            card.types = pullCardTypes[typesIndex].types
            // console.log("typesIndex", typesIndex)
            const colorIdIndex = pullCardColorIds.findIndex((colorObj) => colorObj.card_id === card.id)
            card.colorIdentity = pullCardColorIds[colorIdIndex].colorIdentity
            return card
        })
        // console.log("pullCards", pullCards)

        let decklist = {};
        const decklistInfo = await knex('decklists').where({ 'decklists.id': req.params.decklistId }).select('*')
        decklist.name = decklistInfo[0].name;
        decklist.cards = pullCards;

        res.status(200).json(decklist);
    } catch (err) {
        res.status(500).send(`Error retrieving decklists: ${err}`)
    }
}

const addCard = async (req, res) => {
    const cardId = await knex('cards').where({ name: req.body.cardName }).select('id').first()
    await knex('decklist_cards')
        .insert({
            "decklist_id": req.params.decklistId,
            "card_id": cardId.id
        })
        .then(() => {
            res.status(200).json({ message: 'Card added successfully to the decklist.' });
        })
        .catch((error) => {
            console.error('Error adding card:', error);
            res.status(500).json({ error: 'An error occurred while adding the card to the decklist.' });
        });
}

module.exports = {
    getAllDecklists,
    createDecklist,
    delDecklist,
    activeDecklist,
    addCard
}