const fs = require('fs');
const express = require('express');
const { v4: uuid } = require('uuid');
const router = express.Router();
const decklistsController = require('../controllers/decklistsController');


router
    .route('/')
    .get(decklistsController.getAllDecklists)
    .post(decklistsController.createDecklist)

router
    .route('/:decklistId')
    .get(decklistsController.getDecklistId)
    // .delete(decklistsController.deleteDecklistId)
    // .put(decklistsController.editDecklistId)


    router
    .route('/:decklistId/cards/:cardId')
module.exports = router;