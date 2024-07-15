const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB).then(()=> {
    console.log('Connected to MongoDB');  
    }).catch((err) => {
        console.error(err);
    }
);

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});