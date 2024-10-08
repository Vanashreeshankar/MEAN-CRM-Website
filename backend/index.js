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

const corsOptions = {
  origin: 'https://crm-frontend-website.vercel.app', // Update with your frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Preflight OPTIONS request

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
