'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../Models/user');
var jwt = require('../Services/jwt');

function AddUser(req, res) {
  var user = new User();
  var params = req.body;

  console.log(params)

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = params.role;
  user.image = 'null';

  if (params.password) {
    //Encriptar contrasena
    bcrypt.hash(params.password, null, null, function (err, hash) {
      user.password = hash;

      if (user.name != null && user.surname != null && user.email != null) {
        //Guardar Usuario
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: 'Error al guardar el Usuario' });
          } else {
            if (!userStored) {
              res.status(404).send({ message: 'No se ha registrado el usuario' });
            } else {
              res.status(200).send({ user: userStored });
            }
          }
        });
      } else {
        res.status(200).send({ message: 'Rellena todos los campos' })
      }
    });

  }
  else {
    res.status(200).send({ message: 'Introduce la contrasena' })
  }
}

function loginUser(req, res) {
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500).send({ message: 'Error en la peticion' });
    } else {
      if (!user) {
        res.status(404).send({ message: 'El Usuario no existe' });
      } else {
        //Comprobar la contrasena
        bcrypt.compare(password, user.password, function (err, check) {
          if (check) {
            //Devolver los datos del usuarios Logeado
            if (params.gethash) {
              //Devolver un Token jwt 
              res.status(200).send({
                token: jwt.createToken(user)
              });
            } else {
              res.status(200).send({ user });
            }
          } else {
            res.status(404).send({ message: 'El Usuario no ha podido logearse' });
          }
        });
      }
    }
  });
}

function updateUser(req, res) {

  var userId = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: 'El Usuario no ha podido Actualizar' });
    } else {
      if (!userUpdated) {
        res.status(404).send({ message: 'El Usuario no ha podido Actualizar' });
      } else {
        res.status(200).send({ user: userUpdated });
      }
    }
  });

}

function uploadImage(req, res) {
  
  var userId = req.params.id;
  var file_name = 'No subido...';
  if (req.files) {
    var file_path = req.files.image.path;
   
    var file_split = file_path.split('/');
    var file_name = file_split[2];

    var ext_split = file_name.split('.');
    var file_ext = ext_split[1];
    
    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') 
    {

      User.findOneAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
        if (!userUpdated) 
        {
          res.status(404).send({ message: 'El Usuario no ha podido Actualizar' });
          console.log(userUpdated);
        } else 
        {
          res.status(200).send({image: file_name ,user: userUpdated });
        }

      });
    } 
      else 
      {
       res.status(404).send({ message: 'Extension de imagen no valida' });
      }
    } 
    else 
    {
    res.status(404).send({ message: 'No has Subido ninguna Imagen...' });
    }

}

function getImageFile (req,res){
 var imageFile = req.params.imageFile;
 var path_file = './uploads/users/'+imageFile;
 fs.exists(path_file, function(exists){
   if(exists){
    res.sendFile(path.resolve(path_file));
   }else{
     res.status(200).send({message:'No existe la imagen...'});
   }
 });
  
}


module.exports = {
  AddUser,
  loginUser,
  uploadImage,
  updateUser,
  getImageFile
};
