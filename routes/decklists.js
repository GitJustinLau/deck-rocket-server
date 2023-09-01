const router = require('express').Router();
const decklistsController = require('../controllers/decklistsController');


router
    .route('/user/:userId')
    .get(decklistsController.getAllDecklists)
    .post(decklistsController.createDecklist)

router
    .route('/:decklistId')
    .get(decklistsController.activeDecklist)
    .delete(decklistsController.delDecklist)

router
    .route('/:decklistId/card')
    .post(decklistsController.addCard)
    .patch(decklistsController.removeCard)
    
module.exports = router;