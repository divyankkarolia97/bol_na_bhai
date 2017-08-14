const CONFIG = require('./config');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(CONFIG.DATABASE_URL);
const users= sequelize.define('usersdata',{
    email: Sequelize.DataTypes.STRING,
    name: Sequelize.DataTypes.STRING,
    username: Sequelize.DataTypes.STRING,
    password: Sequelize.DataTypes.STRING,
    profile_image: Sequelize.DataTypes.STRING(1)
},{
    timestamps:false
})

const feedbacks = sequelize.define('feedbacks',{
    username: Sequelize.DataTypes.STRING,
    feedback: Sequelize.DataTypes.TEXT,

},{
    timestamps:false
})



sequelize.sync().then(function(){
    console.log('database is ready');
})


module.exports ={
    users,feedbacks
}