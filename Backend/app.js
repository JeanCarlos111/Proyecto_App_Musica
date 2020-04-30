'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// Load Routes
var user_routes = require('./Routes/userRoute');
var artist_routes = require('./Routes/artistRoute');
var album_routes = require('./Routes/albumRoute');
var song_routes = require('./Routes/songRoute');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar Cabeceras Http 

app.use((req,res,next)=>{
 res.header('Access-Control-Allow-Origin','*');
 res.header('Access-Control-Allow-Headers','Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Access-Control-Allow-Request-Method');
 res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
 res.header('Allow','GET,POST,OPTIONS,PUT,DELETE')

 next();
});

// Rutas Base 
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);
module.exports = app;