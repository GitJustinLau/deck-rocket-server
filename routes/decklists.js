const router = require('express').Router();
const decklistsController = require('../controllers/decklistsController');


router
    .route('/:userId')
    .get(decklistsController.getAllDecklists)
    .post(decklistsController.createDecklist)

router
    .route('/:decklistId')
    .get(decklistsController.activeDecklist)
    .post(decklistsController.activeDecklist)
    .delete(decklistsController.delDecklist)
    
module.exports = router;