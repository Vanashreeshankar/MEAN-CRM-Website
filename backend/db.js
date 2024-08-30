const mongoose = require('mongoose');
require('dotenv').config();

const connectionString =`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.c9ygt.mongodb.net/crm_db`

mongoose.connect(connectionString)
.then(() => console.log('DB Connection Successfull'))
.catch((err) => {
    console.error(err);
});


module.exports = mongoose;
 
