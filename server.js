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

app.use('/userImages',express.static(__dirname+'/userImages'));

///////////user profile
app.get('/',function(req,res){
    if(req.user == null){
        res.redirect('/login');
    }
    else{
        //render the profile page

        database.confessions.findAll({where:{username:req.user.username}}).then(function(data){
            for(ele of data){
                if(ele.dataValues.anonymous=='t'){
                    ele.dataValues.flag = true;
                }
                else{
                    ele.dataValues.flag = false;
                }
            }
            res.render('adminProfile',{name:req.user.name,username:req.user.username,path:req.user.profile_image,confessionsdata:data})

        })



    }

})

//////////user confessions
app.get('/confess:username',function(req,res){
    if(req.user==null){
        res.redirect('/login');
    }
    else{
        database.users.findOne({where:{username:req.params.username}}).then(function(user){
            if(user== null){
                res.send('no user found '+req.params.username );
            }
            else{
                res.render('confess',{user:user.name,username:user.username})
            }
        })


    }


})

app.post('/confess',function(req,res){
    let flag;
    if(req.body.anonymous==='on'){
        flag='t';
    }else{
        flag='f';
    }
    database.confessions.create({username:req.body.to,confession:req.body.confession,confesserUsername:req.user.username,anonymous:flag});
    res.send('<h1>successfully confessed</h1>');
})


//////////handling login requests
app.get('/login',function(req,res){
    res.render('login');
})

app.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:'/login'}))


///////////handling new user requests
app.get('/signup',function(req,res){
    res.render('signup');
})
app.post('/signup',upload.single('avatar'),function(req,res){

    database.users.findOrCreate({where:{username:req.body.username},defaults:{name:req.body.name,password:req.body.password,profile_image:req.file.path}}).spread(function(user,created){
        console.log(created);
        if(created==false){
            res.render('signup');

        }
        else{
            res.redirect('/login');
        }
    })

//
})


app.get('/:username',function(req,res){
    database.users.findAll({where:{username:req.params.username}}).then(function(user){
        console.log(user);
        if(user!=0){

            res.render('profile',{name:user[0].dataValues.name,username:user[0].dataValues.username,path:user[0].dataValues.profile_image});
        }
        else{
            res.send('<h1>no user found</h1>');
        }
    })
})

app.post('/logout',function(req,res){
    req.logout();
    res.redirect('/login');
})

app.listen(CONFIG.SERVER_PORT,function(){
    console.log(`server started listening on http://localhost:${CONFIG.SERVER_PORT}`);
})