require('dotenv').config();
const cors = require('cors');

const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const router = require('./routes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cors());
app.use('/', router);
router.use(errors());
//app.use(errorHandler);

app.listen(PORT);
