
const userValidator = new (require('./user.validator'))();
const userService = new (require('./user.service'))();
const Validator = require('validatorjs');
const responses = require('./user.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);

module.exports = class userController {

  async signup(req , res ){
    let returnResponse  = {}  ; 

    let formData = {
      name : req.body.name , 
      contact_number : req.body.contact_number , 
      email : req.body.email, 
      password : req.body.password, 
      age : req.body.age , 
      courses : req.body.courses
    }
    let validation = new Validator( formData , userValidator.signup()); 

    if(validation.passes()){

      try {
        returnResponse = await userService.signup(formData); 
      } catch (error) {

        returnResponse = responseHandler.catch_error(error);

      }

    }
    else {
      returnResponse = responseHandler.failure("input_validation_failed" , validation.errors.errors);
    }

    res.status(returnResponse.status_code).send(returnResponse);
  }


  async login(req , res ){
    let returnResponse  = {}  ; 

    let formData = {
      email : req.body.email, 
      password : req.body.password
    }
    let validation = new Validator( formData , userValidator.login()); 

    if(validation.passes()){

      try {
        returnResponse = await userService.login(formData); 
      } catch (error) {

        returnResponse = responseHandler.catch_error(error);

      }

    }
    else {
      returnResponse = responseHandler.failure("input_validation_failed" , validation.errors.errors);
    }

    res.status(returnResponse.status_code).send(returnResponse);
  }

  async google_login( req , res){

    let returnResponse  = {}  ; 

    let formData = req.body ; 
    let validation = new Validator( formData , userValidator.google_login()); 

    if(validation.passes()){

      try {
        returnResponse = await userService.google_login(formData); 
      } catch (error) {

        returnResponse = responseHandler.catch_error(error);
      }

    }
    else {
      returnResponse = responseHandler.failure("input_validation_failed" , validation.errors.errors);
    }

    res.status(returnResponse.status_code).send(returnResponse);

    console.log(req.body) ; 
  }
}