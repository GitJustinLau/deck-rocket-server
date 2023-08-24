const router = require("express").Router();
const usersController = require('../controllers/usersController');


router.post('/register', usersController.registerUser);

// ## POST /api/users/login
// -   Generates and responds a JWT for the user to use for future authorization.
// -   Expected body: { email, password }
// -   Response format: { token: "JWT_TOKEN_HERE" }
router.post('/login', usersController.loginUser);

// ## GET /api/users/current
// -   If no valid JWT is provided, this route will respond with 401 Unauthorized.
// -   Expected headers: { Authorization: "Bearer JWT_TOKEN_HERE" }
router.get('/current', usersController.currentUser);

module.exports = router;