const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    pw: process.env.PW,
    salt: process.env.SALT
};