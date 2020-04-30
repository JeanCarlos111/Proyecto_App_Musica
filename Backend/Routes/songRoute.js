'use strict'

var express = require('express');
var SongController = require('../Controllers/SongController');

var api = express.Router();
var md_auth = require('../middleware/autenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir:'./uploads/songs'});

api.get('/song/:id',md_auth.ensureAuth,SongController.getSong);
api.get('/songs/:album?',md_auth.ensureAuth,SongController.getSongs);
api.post('/song/',md_auth.ensureAuth,SongController.addSong);
api.put('/song/:id',md_auth.ensureAuth,SongController.updateSong);
api.delete('/song/:id',md_auth.ensureAuth,SongController.deleteSong);

api.post('/upload-file-song/:id',[md_auth.ensureAuth,md_upload], SongController.uploadFile);

api.get('/get-song-file/:songFile',SongController.getSongFile);

module.exports = api;
