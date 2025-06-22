const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieparser = require('cookie-parser');
const PORT = process.env.PORT || 3000;


const staffRoutes = require('./routes/staffRoutes');
const teamRoutes = require('./routes/team/teamRoutes');


const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.listen(process.env.PORT || 8082, '0.0.0.0', () => {
  console.log(`event running on port ${process.env.PORT||8082}`);
});
//app.use(cors({origin: 'http://0.0.0.0',credentials: true}));
app.use(cors({origin: (origin, callback) => {callback(null, true);},credentials: true}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());


app.use('/api',authMiddleware,staffRoutes);
app.use('/api',authMiddleware,teamRoutes);
app.get('/api/staff/health', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app ; 