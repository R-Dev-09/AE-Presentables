const bcrypt = require('bcryptjs');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const db = new JsonDB(new Config('backend/db/users.json', true, false, '/'));
const pDB = require('./presentables').db;

exports.signupUser = (event, arg) => {
    const {email, password} = arg;
    try {
        db.getData(`/${email}`);
        event.reply('signedup', 'User already exists!');
    } catch (error) {
        bcrypt.hash(password, 10).then(hash => {
            db.push(`/${email}`, {password: hash});
            pDB.push(`/${email}/presentables`, []);
            event.reply('signedup', 'Signup successful');
        }).catch(error => {
            console.log(error);
            event.reply('signedup', error);
        });
    }
};

exports.loginUser = (event, arg) => {
    const {email, password} = arg;
    try {
        fetchedUser = db.getData(`/${email}`);
        bcrypt.compare(password, fetchedUser.password).then(result => {
            if (!result) {
                event.reply('loggedin', 'Invalid email or password');
            } else {
                event.reply('loggedin', 'Login successful');
            }
        }).catch(error => {
            console.log(error);
            event.reply('loggedin', 'Authentication failed');
        });
    } catch (error) {
        console.log(error);
        event.reply('loggedin', 'Authentication failed');
    }
};