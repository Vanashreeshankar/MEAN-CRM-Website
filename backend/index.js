const express = require('express');
const cors = require('cors');
const mongoose = require('./db');

const bodyParser = require('body-parser');

const handleError = require('./errorhandler');
//routers

const dashboardRoute = require('./routes/dashboard');
const userRoute = require('./routes/users');
const clientRoute = require('./routes/clients');
const ticketRoute = require('./routes/tickets');
const tokenRoute = require('./routes/token');

const app = express();



app.use(cors(
    Credentials = true,
    origin= ['http//localost:4200', 'http://127.0.0.1:4200']
));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/dashboard', dashboardRoute);
app.use('/users', userRoute);
app.use('/clients', clientRoute);
app.use('/tickets', ticketRoute);
app.use('/token', tokenRoute);





app.use("*",(req,res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    handleError(error,res);
})

module.exports = app;