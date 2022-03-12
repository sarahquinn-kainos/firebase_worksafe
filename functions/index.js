const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

const createTest = (message => {
    return admin.firestore().collection('testNotification')
    .add(message)
    .then(doc => {
        console.log('TEST notification added: ', doc)
    })
})


exports.onCovidCheckpointCreated = functions.firestore
    .document('CovidCheckpoints/{DocId}')
    .onCreate(doc => {
        const checkpointInstance = doc.data();
        const message = {
            content: "TEST content",
            user: checkpointInstance.uid,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createTest(message)
    })