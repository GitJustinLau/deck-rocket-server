const router = require('express').Router();
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
                if (results.length === 0) {
                    return res.status(200).json(['no cards found']);
                }
                const cardNamesSet = new Set(results.map((card) => card.name).sort());
                const cardNamesArray = Array.from(cardNamesSet);
                res.status(200).json(cardNamesArray);
            })
            .catch(() => res.status(200).json(['no cards found']))
    })

module.exports = router;