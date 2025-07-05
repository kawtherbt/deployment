const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieparser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');

const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.listen(process.env.PORT || 8080, '0.0.0.0', () => {
  console.log(`Auth running on port ${process.env.PORT||8080}`);
});
//app.use(cors({origin: 'http://0.0.0.0',credentials: true}));
app.use(cors({
  origin: 'http://planit-alb-1128307560.us-east-1.elb.amazonaws.com/api', // or your real frontend domain
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use('/auth',authRoutes);
app.use('/auth',authMiddleware,entrepriseRoutes);
app.get('/auth/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app ; 