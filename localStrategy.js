

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const users= require('./database').users;

//bcrypt
const bcrypt = require('bcrypt');

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

const validPassword = function(password, hash) {
  return bcrypt.compareSync(password, hash);
};

passport.use(new LocalStrategy(function(username,password,done){

    //define the local strategy

    users.findAll({where:{username:username}}).then(function(user){
      console.log('USER', user);
        if(user!=0 && validPassword(password, user[0].dataValues.password)){
            console.log(user[0].dataValues)
            done(null,user[0].dataValues);
        }
        else{
            done(null,false);
        }
    })




}))


module.exports= passport;