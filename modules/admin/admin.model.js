const knex = require('../../config/kenx'); 

module.exports = class adminModel {
    
    constructor() {} 

    emailCheck(email){
        return knex('admin').where('email' , email) 
    }

    insertAdminUser( formData ){
        return knex('admin').insert(formData)
    }

    getCourseUserCount(){
        return knex('users')
        .select('courses')
        .count('* as user_count')
        .groupBy('courses'); 
    }

    getAgeUserCount(){
        return knex('users')
        .select('age')
        .count('* as user_count')
        .groupBy('age'); 
    }

    

}