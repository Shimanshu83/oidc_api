const express = require('express');
const route = express.Router();
const adminController =new(require('./admin.controller'))();
const { authenticateJwt , isAdmin} = require('../../util/passportUtil'); 


route.post('/login' , adminController.login) ; 
route.get('/stats' , authenticateJwt , isAdmin , adminController.stats) ; 


module.exports = route;