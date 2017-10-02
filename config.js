'use strict';

const HOST = "localhost:5432";

const DB = {
    DATABASE: "[DATABASE_NAME]",
    USERNAME: "[USERNAME]",
    PASSWORD: "[SECRET]"
};

const DB_DRIVER = "postgres";

const DEFAULT_DATABASE_URL = `${DB_DRIVER}://${DB.USERNAME}:${DB.PASSWORD}@${HOST}/${DB.DATABASE}`;
const DEFAULT_SERVER_PORT = 1234;

process.env.PWD = process.cwd();

const EMAIL_CRED = {
    USERNAME: '',
    PASSWORD: ''
};

const CONFIG = {
    DATABASE_URL: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    SERVER_PORT: process.env.PORT || DEFAULT_SERVER_PORT,
    EMAIL_CRED
};

module.exports = CONFIG;
