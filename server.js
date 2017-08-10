const express = require('express');
const app = express();


//login configuration
const bp = require('body-parser');
const cp = require('cookie-parser');
const passport = require('./localStrategy');

const session = require('express-session');



//exported database;
const database = require('./database')

//setting the view engine
app.set('view engine','hbs');

//setting up multer
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './userImages')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.body.username+'.jpg');
    }
})

var upload = multer({ storage: storage });

//passport configuration



app.use(cp('TheSecret'));
app.use(session({
    secret:'TheSecret',
    resave:'false',
    saveUninitialized:true
}))


app.use(bp.urlencoded({extended:true}));
app.use(bp.json());


app.use(passport.initialize());
app.use(passport.session());


//path handlers
app.get('/',function(req,res){
    res.render('profile');
})

app.get('/login',function(req,res){
    res.render('login');
})

app.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:'/login'}))



app.get('/signup',function(req,res){
    res.render('signup');
})
app.post('/signup',upload.single('avatar'),function(req,res){
    console.log(req.file);
    console.log(req.body);
//
    database.users.findOrCreate({where:{username:req.body.username},defaults:{name:req.body.name,password:req.body.password,profile_image:req.file.path}}).spread(function(user,created){
        console.log(user);
        console.log(created);
        if(created===false){
            res.render('signup');

        }
        else{
            res.redirect('/');
        }
    })

//
})


app.get('/confess:username',function(req,res){
    console.log(req.params);
    res.render('profile');
})


app.listen(1234,function(){
    console.log('server started listening on http://localhost:1234');
})