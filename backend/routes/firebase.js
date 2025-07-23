// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json'); // path to your downloaded JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
