const express = require('express');
const app = express();

//loading configs
const CONFIG = require('./config');

//login configuration
const bp = require('body-parser');
const cp = require('cookie-parser');
const passport = require('./localStrategy');

const session = require('express-session');



//exported database;
const database = require('./database')

//setting the view engine

app.set('view engine','hbs');
const hbs = require('hbs');

hbs.registerPartials(__dirname+'/views/partials')


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
app.use('/',express.static(process.env.PWD+'/static'))
app.use('/userImages',express.static(process.env.PWD+'/userImages'));

///////////user profile
app.get('/',function(req,res){
    var logged = (req.user)? true: false;


    res.render('homepage',{logged});
})



app.get('/user',function(req,res){
    if(req.user == null){
        res.redirect('/login');
    }
    else{
        //render the profile page
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        database.feedbacks.findAndCountAll({where:{username:req.user.username}}).then(function(data){

            res.render('adminProfile',{name:req.user.name,username:req.user.username,path:req.user.profile_image,feedbacks:data.rows,totalMessages:data.count});

        })



    }

})

//////////user feedback
app.get('/feedback:username',function(req,res){
        database.users.findOne({where:{username:req.params.username}}).then(function(user){
            var logged = (req.user)? true: false;

            if(user== null){
                res.render('noUserFound',{logged});
            }
            else{
                res.render('feedback',{user:user.name,username:user.username,logged,path:user.profile_image})
            }
        })


})

app.post('/feedback',function(req,res){

    database.feedbacks.create({username:req.body.to,feedback:req.body.feedback});
    var logged = (req.user)? true: false;
    res.render('successFeedback',{logged});
})


//////////handling login requests
app.get('/login',function(req,res){
    res.render('login');
})

app.post('/login',passport.authenticate('local',{successRedirect:'/user',failureRedirect:'/login'}))


///////////handling new user requests
app.get('/register',function(req,res){
    res.render('register');
})
app.post('/register',upload.single('avatar'),function(req,res){
    console.log(req.body);
    database.users.findOrCreate({where:{username:req.body.username},defaults:{email:req.body.email,name:req.body.name,password:req.body.password,profile_image:req.file.path}}).spread(function(user,created){
        console.log(created);
        if(created==false){
            res.render('register',{message:'username already exists'});

        }
        else{
            res.redirect('/login');
        }
    })

})

app.post('/logout',function(req,res){
    req.logout();
    console.log('logging out')
    res.send('loggedOut');
})


//about us
app.get('/aboutus',function(req,res){
    var logged = (req.user)? true: false;
    res.render('aboutus', {logged});
})


app.post('/deleteMessage',function(req,res){
    console.log(req.body.feedbackId);
    database.feedbacks.destroy({where:{id:req.body.feedbackId}});
    res.send('deleted');

})


app.listen(CONFIG.SERVER_PORT,function(){
    console.log(`server started listening on http://localhost:${CONFIG.SERVER_PORT}`);
})