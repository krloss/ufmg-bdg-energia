const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./config/routes');

const app = express();

mongoose.connect('mongodb+srv://bdg-energia:bdg-3n3rg14@cluster0-ebp6n.gcp.mongodb.net/dbEnergia?retryWrites=true&w=majority',
{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(4321);
