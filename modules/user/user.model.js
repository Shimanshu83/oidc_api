const knex = require('../../config/kenx'); 

module.exports = class userModel {
    
    constructor() {} 

    emailCheck(email){
        return knex('users').where('email' , email) 
    }

    phoneCheck(phone_number){
        return knex('users').where('contact_number' ,phone_number ) 
    }

    insertUser( formData ){
        return knex('users').insert(formData)
    }

    

    

}