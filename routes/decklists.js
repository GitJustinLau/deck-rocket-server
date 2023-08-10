const fs = require('fs');
const express = require('express');
const { v4: uuid } = require('uuid');
const router = express.Router();


const decklistsFilePath = './data/users/1/decklists.json';

const getdecklists = () => {
    return JSON.parse(fs.readFileSync(decklistsFilePath));
}

const savedecklists = (decklistsData) => {
    fs.writeFileSync(decklistsFilePath, JSON.stringify(decklistsData));
}

router
    .route('/')
    .get((req, res) => {
        const decklistsData = getdecklists().map((vid) => {
            return {
                "id": vid.id,
                "title": vid.title,
                "channel": vid.channel,
                "image": vid.image
            }
        })
        res.status(200).json(decklistsData);
    })
    .post(validateCreatedecklist, (req, res) => {
        const decklistsData = getdecklists();
        const newdecklist = {
            id: uuid(),
            ...req.body,  
        };

        decklistsData.push(newdecklist);
        savedecklists(decklistsData);
        res.status(201).json(newdecklist);
    });

router
    .route('/:decklistId')
    .get((req, res) => {
        const decklistsData = getdecklists();
        const currdecklistId = req.params.decklistId;
        const decklist = decklistsData.find(decklist => decklist.id === currdecklistId);

        if (!decklist) {
            return res.status(404).json({ error: 'decklist not found' });
        }

        res.status(200).json(decklist);
    })

module.exports = router;