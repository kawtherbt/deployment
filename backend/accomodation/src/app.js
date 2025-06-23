const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieparser = require('cookie-parser');
const PORT = process.env.PORT || 3000;


const accomodationRoutes = require('./routes/accomodationRoutes'); 

const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.listen(process.env.PORT || 8083, '0.0.0.0', () => {
  console.log(`Auth running on port ${process.env.PORT||8083}`);
});

//app.use(cors({origin: 'http://0.0.0.0',credentials: true}));
app.use(cors({origin: (origin, callback) => {callback(null, true);},credentials: true}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use('/api',authMiddleware,accomodationRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));


module.exports = app ; 