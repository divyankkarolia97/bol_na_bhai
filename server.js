//pings my heroku app


const http = require('http');
setInterval(function(){
    http.get('http://bolnabhai.herokuapp.com');
},300000);


const express = require('express');
const app = express();

//loading configs
const CONFIG = require('./config');

//login configuration
const bp = require('body-parser');
const cp = require('cookie-parser');
const passport = require('./localStrategy');

const session = require('express-session');

//configuring nodemailer
const nodemailer = require('nodemailer');

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
        //profile change
            res.render('adminProfile',{name:req.user.name,username:req.user.username,path:'/userImages/default-'+req.user.profile_image+'.png',feedbacks:data.rows,totalMessages:data.count});

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
                res.render('feedback',{user:user.name,username:user.username,logged,path:'/userImages/default-'+req.user.profile_image+'.png'})
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

app.post('/verifyCreds',function(req,res){

    database.users.findOne({where:{username:req.body.username}}).then(function(data){

        if(data==null){
            res.send('username');
        }
        else if(data.dataValues.password !== req.body.password){
            res.send('password');
        }else{
            res.send('success');
        }
    })


})

app.post('/login',passport.authenticate('local',{successRedirect:'/user',failureRedirect:'/login'}))


///////////handling new user requests
app.get('/register',function(req,res){
    res.render('register');
})

app.post('/usernameAvailable',function(req,res){
    database.users.findOne({where:{username:req.body.username}}).then(function(user){
        if(user==null){
            res.send('true');
        }else{
            res.send('false');
        }
    })
})

app.post('/register',upload.single('avatar'),function(req,res,next){
    if(req.file == undefined){
            req.file={};
            req.file.path = (Math.round(Math.random()*3)+1);
        }
    database.users.create({username:req.body.username,email:req.body.email,name:req.body.name,password:req.body.password,profile_image:req.file.path}).then(function(){
        next();
    })

},passport.authenticate('local',{successRedirect:'/user',failureRedirect:'/login'}));


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
    database.feedbacks.destroy({where:{id:req.body.feedbackId}});
    res.send('deleted');

})

app.get('/forgotPassword',function(req,res){
    res.render('forgotPassword');
})
app.post('/forgotPassword',function(req,res){
    res.render('emailSent');
})

app.post('/verifyEmail',function(req,res){

    database.users.findOne({where:{email:req.body.email}}).then(function(data){
        console.log()
        if(data == null){
            res.send('false');
        }else{
            let transporter = nodemailer.createTransport({
                service:"Gmail",
                auth:{
                    user:CONFIG.EMAIL_CRED.USERNAME,
                    pass:CONFIG.EMAIL_CRED.PASSWORD
                }
            })
            let mailOptions = {
                from: CONFIG.EMAIL_CRED.USERNAME, // sender address
                to: `${data.dataValues.email}`, // list of receivers
                subject: 'RECOVERY MAIL bonabhai.herokuapp.com', // Subject line
                text: `Here are  your credentials : \n\n\n\n\t USERNAME: ${data.dataValues.username} \n\t PASSWORD: ${data.dataValues.password} `, // plain text body

            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        }
    })

})

app.listen(CONFIG.SERVER_PORT,function(){
    console.log(`server started listening on http://localhost:${CONFIG.SERVER_PORT}`);
})