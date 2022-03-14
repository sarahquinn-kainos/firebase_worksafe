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

exports.getUserWorkingToday = functions.https.onRequest(async (request, response) => {
    const uid = "FqBES2jj2VeAxD5qpJMtWm6Yarr2" //request.body.uid;
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    var end = new Date();
    end.setUTCHours(23, 59, 59, 999);
    console.log("start: " + start)
    console.log("end: " + end)
    try {
        const snapshot = await admin.firestore().collection('WorkshiftSchedules')
            .where('date', '>=', start)
            .where('date', '<=', end)
            .where('staff_uids', 'array-contains', uid)
            .get().then(data => {
                return data
            })
        if (snapshot.empty){
            response.send(false)
        }else{
            response.send(true)
        }
    } catch (err) {
        console.log(err)
        response.status(500).send(err)
    }
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