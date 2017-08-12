const DB ={

    DATABASE:"practiceDB",
    USERNAME:"divyank",
    PASSWORD:"dkarolia"

}

const CONFIG ={
    DATABASE_URL: process.env.DATABASE_URL || `postgres://${DB.USERNAME}:${DB.PASSWORD}@localhost:5432/${DB.DATABASE}`,
    SERVER_PORT: process.env.PORT || 1234
}
console.log(CONFIG);



module.exports = CONFIG;