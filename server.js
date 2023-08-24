require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || process.argv[2] || 8080;

const decklistsRouter = require('./routes/decklists');
const cardSearchRouter = require('./routes/cardSearch');
const userRoutes = require("./routes/users");

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use(express.static('./public'));

// Routes
app.use('/users', userRoutes); //I did not make the users route or controller. From class example.
app.use('/decklists', decklistsRouter);
app.use('/cardSearch', cardSearchRouter);

app.listen(port, () => console.log(`Listening on ${port}`));