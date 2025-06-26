const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieparser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

const soireeRoutes = require('./routes/soireeRoutes'); 


const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
app.listen(process.env.PORT || 8088, '0.0.0.0', () => {
  console.log(`event running on port ${process.env.PORT||8088}`);
});
//app.use(cors({origin: 'http://0.0.0.0',credentials: true}));
app.use(cors({
  origin: 'http://planit-alb-1555598401.us-east-1.elb.amazonaws.com/api', // or your real frontend domain
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());


app.use('/soiree',authMiddleware,soireeRoutes);
app.get('/soiree/health', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app ; 