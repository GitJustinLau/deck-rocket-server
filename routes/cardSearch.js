const express = require('express');
const router = express.Router();
const mtg = require('mtgsdk')

// partial name match https://docs.magicthegathering.io/#advancedcards_get_by_name
mtg.card.where({ name: 'Archangel' })
    .then(results => {
        console.log(results)
    })

router
    .route('/')
    .get((req, res) => {
        mtg.card.where({ name: req.body.name })
            .then(results => {
                if (!results) {
                    return res.status(404).json({ error: 'no cards with this name!' });
                }
                res.status(200).json(results);
            })
    })

module.exports = router;