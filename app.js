require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require('celebrate');
const mainRouter = require("./routes/index");
const errorHandler = require("./middleware/error-handler");
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then (() => {
    console.log("Connected to DB");
})
.catch(console.error);

app.use(express.json());
app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Listening on ${PORT}`);
});