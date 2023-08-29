const router = require('express').Router();
const mtg = require('mtgsdk')
const knex = require('knex')(require('../knexfile'));

// partial name match https://docs.magicthegathering.io/#advancedcards_get_by_name
// mtg.card.where({ name: 'cathar' })
//     .then(results => {
//         const cardNames = new Set(results.map((card) => card.name).sort());
//             console.log(cardNames);
//     })

router
    .route('/')
    .get(async (req, res) => {
        try {
            const searchResults = await mtg.card.where({ name: req.query.name })

            if (searchResults.length === 0) {
                return res.status(200).json(['no cards found']);
            }

            let cardIds = [];
            const cleanResults = searchResults.map((card) => {
                cardIds.push(card.id)
                return {
                    "id": card.id,
                    "name": card.name,
                    "manaCost": card.manaCost || null,
                    "cmc": card.cmc || null,
                    "colorIdentity": Array.isArray(card.colorIdentity) ? card.colorIdentity.join(',') : card.colorIdentity || null,
                    "imageUrl": card.imageUrl ? card.imageUrl : null,
                    "supertypes": Array.isArray(card.supertypes) ? card.supertypes.join(',') : card.supertypes || null
                }
            })

            // SELECT * FROM card WHERE id IN (1, 2, 3, 4, 5, 6)
            const dbCardIdsObj = await knex('cards').whereIn('id', cardIds).select('id')
            const dbCardIds = dbCardIdsObj.map((idObj) => idObj.id)
            const dbInputs = cleanResults.filter((card) => !dbCardIds.includes(card.id))
            const insertCards = dbInputs.map((card) => knex('cards').insert(card));
            await Promise.all(insertCards);

            const dbSearch = await knex('cards').whereIn('id', cardIds).select('name')
            const cardNamesSet = Array.from(new Set(dbSearch.map((card) => card.name).sort()));
            res.status(200).json(cardNamesSet);
        }
        catch (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred.' })
        }
    })

module.exports = router;