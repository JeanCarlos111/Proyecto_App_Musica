'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.connect('mongodb://localhost:27017/Music', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
}, (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log('La conexion a la BD fue correcta');
    app.listen(port, function () {
      console.log("Servidor del API Rest Musica Esuchando en http://localhost:" + port);
    });
  }
});
