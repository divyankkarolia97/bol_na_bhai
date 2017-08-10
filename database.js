const Sequelize = require('sequelize');
const sequelize = new Sequelize('somedatabase','divyank','dkarolia',{
    host:'localhost',
    dialect:'mysql'
});

const users= sequelize.define('confessUsers',{
    name: Sequelize.DataTypes.STRING,
    username: Sequelize.DataTypes.STRING,
    password: Sequelize.DataTypes.STRING,
    profile_image: Sequelize.DataTypes.STRING
},{
    timestamps:false
})

const confessions = sequelize.define('confessions',{
    username: Sequelize.DataTypes.STRING,
    confession: Sequelize.DataTypes.STRING,
    confesserUsername: Sequelize.DataTypes.STRING,
    anonymous: Sequelize.DataTypes.STRING
},{
    timestamps:false
})



sequelize.sync().then(function(){
    console.log('database is ready');
})


module.exports ={
    users,confessions
}