

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const users= require('./database').users;


passport.serializeUser(function(user,done){
    console.log('serializing');
    console.log(user);
    done(null,user.id);
})



passport.deserializeUser(function(userId,done){
    console.log('deserializing');
    users.findAll({where:{id:userId}}).then(function(user){
        done(null,user[0].dataValues);
    })

})



passport.use(new LocalStrategy(function(username,password,done){

    //define the local strategy

    users.findAll({where:{username:username,password:password}}).then(function(user){
        if(user!=0){
            console.log(user[0].dataValues)
            done(null,user[0].dataValues);
        }
        else{
            done(null,false);
        }
    })




}))


module.exports= passport;