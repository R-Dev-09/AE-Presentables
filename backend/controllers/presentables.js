const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const endecrypt = require('../endecrypt/endecrypt');
exports.db = new JsonDB(new Config('backend/db/presentables.json', true, false, '/'));

exports.createPresentable = (event, arg) => {
    try {
        const {creator, ...uePresentable} = arg;
        const ePresentable = endecrypt.endecrypt(uePresentable);
        this.db.push(`/${creator}/presentables[]`, ePresentable, true);
        event.reply('created', 'Creation successful');
    } catch (error) {
        console.log(error);
        event.reply('created', error);
    }
};

exports.getPresentables = (event, arg) => {
    try {
        const user = arg;
        const udPresentables = this.db.getData(`/${user}/presentables`);
        if (udPresentables.length <= 0) {
            event.reply('got', []);
        } else {
            const presentables = udPresentables.map(doc => {
                const deDoc = endecrypt.endecrypt(doc, true);
                return deDoc;
            });
            event.reply('got', presentables);
        }
    } catch (error) {
        console.log(error);
        event.reply('got', error);
    }
};

exports.deletePresentable = (event, arg) => {
    try {
        const { presId, user } = arg;
        this.db.delete(`/${user}/presentables[${presId}]`);
        event.reply('deleted', 'Deletion successful');
    } catch (error) {
        console.log(error);
        event.reply('deleted', error);
    }
};

exports.updatePresentable = (event, arg) => {
    const {creator, presId, ...uePresentable} = arg;
       try {
            const ePresentable = endecrypt.endecrypt(uePresentable);
            this.db.push(`/${creator}/presentables[${presId}]`, ePresentable, false);
            event.reply('updated', 'Updating successful');
        } catch (error) {
            console.log(error);
            event.reply('updated', error);
        }
};