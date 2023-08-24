const router = require('express').Router();
const decklistsController = require('../controllers/decklistsController');


router
    .route('/:userId')
    .get(decklistsController.getAllDecklists)
    .post(decklistsController.createDecklist)

router
    .route('/:decklistId')

    
module.exports = router;