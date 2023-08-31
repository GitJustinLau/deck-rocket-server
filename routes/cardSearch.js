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
            const dbCardsTable = searchResults.map((card) => {
                const { id, name, manaCost, cmc, imageUrl, power, toughness } = card;
                cardIds.push(id)
                return {
                    id,
                    name,
                    manaCost,
                    cmc,
                    imageUrl,
                    power,
                    toughness
                }
            })

            let cardTypes = [];
            const dbcardTypes = searchResults.map((card) => {
                const { id, types, supertypes, subtypes } = card;
                const currCardTypes = []
                types && types.forEach(value => {
                    cardTypes.push(value)
                    currCardTypes.push(value)
                });
                supertypes && supertypes.forEach(value => {
                    cardTypes.push(value)
                    currCardTypes.push(value)
                });
                subtypes && subtypes.forEach(value => {
                    cardTypes.push(value)
                    currCardTypes.push(value)
                });
                return {
                    id,
                    "types": currCardTypes
                }
            })

            const dbColorIdentity = searchResults.map((card) => {
                const { id, colorIdentity } = card;

                return {
                    id,
                    colorIdentity
                }
            })

            // insert types into types table
            cardTypes = Array.from(new Set(cardTypes))
            const dbcardTypesObj = await knex('types').whereIn('name', cardTypes).select('name')
            const dbcardTypesNames = dbcardTypesObj.map((typesObj) => typesObj.name)
            const dbcardTypesInputs = cardTypes.filter((type) => !dbcardTypesNames.includes(type))
            const insertTypes = dbcardTypesInputs.map((type) => knex('types').insert({ "name": type }));
            await Promise.all(insertTypes);

            // insert cards into cards table
            const dbCardIdsObj = await knex('cards').whereIn('id', cardIds).select('id')
            const dbCardIds = dbCardIdsObj.map((idObj) => idObj.id)
            const dbCardsTableInputs = dbCardsTable.filter((card) => !dbCardIds.includes(card.id))
            const insertCards = dbCardsTableInputs.map((card) => knex('cards').insert(card));
            await Promise.all(insertCards);

            // inserts relationship between cards and types tables
            const insertCardTypes = dbcardTypes.filter((card) => !dbCardIds.includes(card.id)).map((card) => {
                return (card.types.map((type) => {
                    return (knex('types').where({ 'name': type }).select('id')
                        .then((result) => knex('card_types').insert({ "card_id": card.id, "type_id": result[0].id }))
                    )
                }))
            })
            await Promise.all(insertCardTypes);

            const insertCardColorIdentity = dbColorIdentity.filter((card) => !dbCardIds.includes(card.id) && card.colorIdentity).map((card) => {
                return (card.colorIdentity.map((color) => {
                    return (knex('colors').where({ 'name': color }).select('id')
                        .then((result) => knex('card_color_ids').insert({ "card_id": card.id, "color_id": result[0].id }))
                    )
                }))
            })
            await Promise.all(insertCardColorIdentity);

            //return card names in response
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