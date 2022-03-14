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

// exports.getUserWorkingToday = functions.https.onRequest(async (request, response) => {
//     console.log("req: " + JSON.stringify(request))
//     console.log("body: " + JSON.stringify(request.body))
//     //console.log("query: " + request.query.data.uid)
//     //console.log("params: " + request.params)
//     //const uid = request.body.data.uid;
//     var start = new Date();
//     start.setUTCHours(0, 0, 0, 0);
//     var end = new Date();
//     end.setUTCHours(23, 59, 59, 999);
//     console.log("start: " + start)
//     console.log("end: " + end)
//     response.send((request))
//     // try {
//     //     const snapshot = await admin.firestore().collection('WorkshiftSchedules')
//     //         .where('date', '>=', start)
//     //         .where('date', '<=', end)
//     //         .where('staff_uids', 'array-contains', uid)
//     //         .get().then(data => {
//     //             return data
//     //         })
//     //     if (snapshot.empty){
//     //         response.send(false)
//     //     }else{
//     //         response.send(true)
//     //     }
//     // } catch (err) {
//     //     console.log(err)
//     //     response.status(500).send(err)
//     // }
// });

const addNotification = (message => {
    return admin.firestore().collection('MailNotification')
        .add(message)
        .then(doc => {
            console.log('Mail Notification added: ', doc)
        })
})


exports.onCovidCheckpointCreated = functions.firestore
    .document('CovidCheckpoints/{DocId}')
    .onCreate(doc => {
        const checkpointInstance = doc.data();
        var close_contact = checkpointInstance.close_contact;
        var diagnosed = checkpointInstance.diagnosed;
        var self_isolating = checkpointInstance.self_isolating;
        var symptoms = checkpointInstance.symptoms;
        var travelled = checkpointInstance.travelled;
        var timestamp = checkpointInstance.timestamp;
        // IF in order of priority - most important checkpoint metrics first - 
        // message will change depending on primary issue recorded 
        // i.e. positive result takes precendence over symptoms
        if (diagnosed) {
            const message = {
                header: "COVID-19 WorkSafe Alert",
                title: "Positive COVID-19 Checkpoint",
                body: "Worker: " + checkpointInstance.user_display_name + ", has tested positive for COVID-19. Please open WorkSafe to view details and affected shifts.",
                user: checkpointInstance.uid,
                user_display_name: checkpointInstance.user_display_name,
                time: timestamp,
                alert_level: "high"
            }
            //alert is HIGH as user cannot work and shifts are affected 
            return addNotification(message)
        }
        if (self_isolating) {
            const message = {
                header: "COVID-19 WorkSafe Alert",
                title: "Isolating - COVID-19 Checkpoint",
                body: "Worker: " + checkpointInstance.user_display_name + ", is isolating from COVID-19. Please open WorkSafe to view details and affected shifts.",
                user: checkpointInstance.uid,
                user_display_name: checkpointInstance.user_display_name,
                time: timestamp,
                alert_level: "high"
            }
            //alert is HIGH as user cannot work and shifts are affected 
            return addNotification(message)
        }
        if (close_contact || symptoms) {
            const message = {
                header: "COVID-19 WorkSafe Alert",
                title: "Risk - COVID-19 Checkpoint",
                body: "Worker: " + checkpointInstance.user_display_name + ", is a possible risk for COVID-19. Please open WorkSafe to details and affected shifts.",
                user: checkpointInstance.uid,
                user_display_name: checkpointInstance.user_display_name,
                time: timestamp,
                alert_level: "medium"
            }
            //alert is MEDIUM as user may be OK to work - manual decision if shifts are affected by admin
            return addNotification(message)
        }
        if (travelled) {
            const message = {
                header: "COVID-19 WorkSafe Alert",
                title: "Travel - COVID-19 Checkpoint",
                body: "Worker: " + checkpointInstance.user_display_name + ", has recently travelled. Please open WorkSafe to view details and contact the worker for more information if required.",
                user: checkpointInstance.uid,
                user_display_name: checkpointInstance.user_display_name,
                time: timestamp,
                alert_level: "low"
            }
            //alert is LOW as majority of travel advice has been reduced - manual decision if shifts are affected by admin
            return addNotification(message)
        }
    })