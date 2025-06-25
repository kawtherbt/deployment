const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieparser = require('cookie-parser');
const PORT = process.env.PORT || 3000;


const workshopRoutes = require('./routes/workshopRoutes');
const QARoutes = require('./routes/QA/QARoutes');


const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.listen(process.env.PORT || 8090, '0.0.0.0', () => {
  console.log(`event running on port ${process.env.PORT||8090}`);
});
//app.use(cors({origin: 'http://0.0.0.0',credentials: true}));
app.use(cors({
  origin: 'http://planit-alb-726372627.us-east-1.elb.amazonaws.com', // or your real frontend domain
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());


app.use('/api',authMiddleware,workshopRoutes);
app.use('/api',authMiddleware,QARoutes);
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app ; 