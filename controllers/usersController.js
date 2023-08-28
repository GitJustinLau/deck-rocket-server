require("dotenv").config();
const knex = require('knex')(require('../knexfile'));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password) {
        return res.status(400).send("Please enter the required fields.");
    }

    const hashedPassword = bcrypt.hashSync(password);

    const newUser = {
        email,
        password: hashedPassword,
        username
    }

    knex('users')
        .insert(newUser)
        .then(() => {
            res.status(200).send("Registered successfully");
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("Failed registration");
        });

}


const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Please enter the required fields");
    }

    // Fetch the user by email
    knex('users')
        .where({ email: email })
        .first()
        .then((user) => {
            // If no email in DB, respond with 400
            if (!user) {
                return res.status(400).send("Invalid email");
            }

            // Validate the password
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if (!isPasswordCorrect) {
                return res.status(400).send("Invalid password");
            }

            // Sign the token and send to the user
            // 1: payload
            // 2: secret
            // 3: config (optional)
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.SECRET,
                { expiresIn: "3d" }
            );

            res.status(200).json({ token: token });
        })
        .catch(err => {
            res.status(400).send('Couldnt log you in');
        });
}

const currentUser = (req, res) => {
    // If there is no auth header provided

    // console.log(req.headers.authorization)

    if (!req.headers.authorization) {
        return res.status(401).send("Please include your JWT");
    }

    // Parse the bearer token
    const authHeader = req.headers.authorization;
    const authToken = authHeader.split(' ')[1];

    // console.log('Header: ', authHeader);
    // console.log('Token: ', authToken);

    jwt.verify(authToken, process.env.SECRET, (err, decoded) => {
        // console.log('Token: ', decoded);

        if (err) {
            return res.status(401).send("Invalid auth token");
        }

        knex('users')
            .where({ id: decoded.id })
            .first()
            .then(user => {
                delete user.password;
                res.json(user);
            })
            .catch(err => {
                res.send(500).send('Cant fetch user info');
            })
    });
}

module.exports = {
    registerUser,
    loginUser,
    currentUser
}