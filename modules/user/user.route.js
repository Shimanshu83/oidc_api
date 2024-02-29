    const express = require('express');
    const route = express.Router();
    const userController =new(require('./user.controller'))();

    route.post('/signup' , userController.signup) ; 
    route.post('/login' , userController.login) ; 
    route.post('/google_login' , userController.google_login) ; 

    module.exports = route;