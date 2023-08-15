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
        mtg.card.where({ name: req.body.name })
            .then(results => {
                if (!results) {
                    return res.status(404).json({ error: 'no cards with this name!' });
                }
                const cardNamesSet = new Set(results.map((card) => card.name).sort());
                const cardNamesArray = Array.from(cardNamesSet)
                res.status(200).json(cardNamesArray);
            })
    })

module.exports = router;