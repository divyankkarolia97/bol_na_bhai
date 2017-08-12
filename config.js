const DB ={

    DATABASE:"",
    USERNAME:"",
    PASSWORD:""

}

const CONFIG ={
    DATABASE_URL: process.env.DATABASE_URL | `postgres://${DB.USERNAME}:${DB.PASSWORD}@localhost:5432/${DB.DATABASE}`,
    SERVER_PORT: process.env.PORT | 1234
}


module.exports = CONFIG;