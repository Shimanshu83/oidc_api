const responses = require('./admin.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);

const { genPassword , validPassword } = require('../../util/passwordUtils'); 
const uuid = require('uuid');
const { signToken } = require('../../util/jwtUtil'); 
const adminModel = new ( require('./admin.model'))() ; 

module.exports = class adminService {
    constructor() {}

    async login(formData){

        // check if user exists or not 
        let userExist =  await adminModel.emailCheck(formData.email) ;

        if (userExist.length == 0){
            return responseHandler.failure('user_not_exist'); 
        }

        let adminObj = userExist[0] ; 

        // hash the password and check if it match with the password or not. 
        let passWordValid = validPassword(formData.password , adminObj.password) ; 

        if( passWordValid === false){
            return responseHandler.failure('password_do_not_match') ;
        }

        delete adminObj['password']
        delete adminObj['created_at']
        delete adminObj['updated_at']
 
        const payload = {
            uid : adminObj['uid'], 
            role : 'admin'
        }

        let jwtToken = await signToken(payload , '24h');   
        //adding role to the admin 
        adminObj['role'] = 'admin' ; 

        let responseData = {
            user : adminObj, 
            jwt_token : jwtToken
        }

        return responseHandler.success( 'admin_login_successfully' , responseData); 

    }

    /**
     * Functions returns total no of users in courses, 
     * Number of users per age wise.
     */
    async stats(){

        let userCountPerCourse =  adminModel.getCourseUserCount(); 
        let userCountPerAge = adminModel.getAgeUserCount(); 

        let userStatsData = await Promise.all([userCountPerCourse , userCountPerAge]); 

        if( userStatsData[0].length == 0 && userStatsData[1].length == 0){
            return responseHandler.failure('stats_not_found'); 
        }

        return responseHandler.success('stats_found' , userStatsData); 

    }
}