const express = require('express');
const router = express.Router();
const mtg = require('mtgsdk')

// partial name match https://docs.magicthegathering.io/#advancedcards_get_by_name
// mtg.card.where({ name: 'cathar' })
//     .then(results => {
//         const cardNames = new Set(results.map((card) => card.name).sort());
//             console.log(cardNames);
//     })

router
    .route('/')
    .get((req, res) => {
        mtg.card.where({ name: req.query.name })
            .then(results => {
                console.log(results)
                if (results.length === 0) {
                    return res.status(204).json(['no cards found']);
                }
                const cardNamesSet = new Set(results.map((card) => card.name).sort());
                const cardNamesArray = Array.from(cardNamesSet);
                const searchResults = cardNamesArray.slice(0, 15)
                res.status(200).json(searchResults);
            })
    })

module.exports = router;