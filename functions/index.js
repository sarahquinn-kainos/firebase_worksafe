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

const addCovidNotification = (message => {
    return admin.firestore().collection('CovidNotifications')
        .add(message)
        .then(doc => {
            console.log('COVID Notification added: ', doc)
        })
})

const addScheduleWarning = (message => {
    return admin.firestore().collection('ScheduleWarnings')
        .add(message)
        .then(doc => {
            console.log('Schedule Warning added: ', doc)
        })
})

const collectIdsAndDocs = (doc) => {
    return { id: doc.id, ...doc.data() };
};


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
                alert_message: "Worker: " + checkpointInstance.user_display_name + ", has tested positive for COVID-19.",
                body: "Please open WorkSafe to view details and affected shifts.",
                user: checkpointInstance.uid,
                user_display_name: checkpointInstance.user_display_name,
                time: timestamp,
                alert_level: "high"
            }
            //alert is HIGH as user cannot work and shifts are affected 
            return addCovidNotification(message)
        }
        if (self_isolating) {
            const message = {
                header: "COVID-19 WorkSafe Alert",
                title: "Isolating - COVID-19 Checkpoint",
                alert_message: "Worker: " + checkpointInstance.user_display_name + ", is isolating from COVID-19.",
                body: "Please open WorkSafe to view details and affected shifts.",
                user: checkpointInstance.uid,
                user_display_name: checkpointInstance.user_display_name,
                time: timestamp,
                alert_level: "high"
            }
            //alert is HIGH as user cannot work and shifts are affected 
            return addCovidNotification(message)
        }
        if (close_contact || symptoms) {
            const message = {
                header: "COVID-19 WorkSafe Alert",
                title: "Risk - COVID-19 Checkpoint",
                alert_message: "Worker: " + checkpointInstance.user_display_name + ", is a possible risk for COVID-19.", 
                body: "Please open WorkSafe to details and affected shifts.",
                user: checkpointInstance.uid,
                user_display_name: checkpointInstance.user_display_name,
                time: timestamp,
                alert_level: "medium"
            }
            //alert is MEDIUM as user may be OK to work - manual decision if shifts are affected by admin
            return addCovidNotification(message)
        }
        if (travelled) {
            const message = {
                header: "COVID-19 WorkSafe Alert",
                title: "Travel - COVID-19 Checkpoint",
                alert_message: "Worker: " + checkpointInstance.user_display_name + ", has recently travelled.",
                body: "Please open WorkSafe to view details and contact the worker for more information if required.",
                user: checkpointInstance.uid,
                user_display_name: checkpointInstance.user_display_name,
                time: timestamp,
                alert_level: "low"
            }
            //alert is LOW as majority of travel advice has been reduced - manual decision if shifts are affected by admin
            return addCovidNotification(message)
        }
    })

exports.onCovidNotificationCreated = functions.firestore
    .document('CovidNotifications/{DocId}')
    .onCreate(async doc => {
        var result;
        var resultSnapshot;
        const messageData = doc.data();
        var alert_level = messageData.alert_level;
        var alert_message = messageData.alert_message;
        var affected_uid = messageData.user;
        var start = messageData.time.toDate(); // 5 days before checkpoint
        start.setDate(start.getDate() - 5)
        var end = messageData.time.toDate(); // 5 days after checkpoint
        end.setDate(start.getDate() + 5)
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);
        console.log("start: " + start)
        console.log("end: " + end)
        try {
            // get data from firestore with a snapshot 
            async function getDocument() {
                const snapshot = await admin.firestore()
                    .collection('WorkshiftSchedules')
                    .where('date', '>=', start)
                    .where('date', '<=', end)
                    .where('staff_uids', 'array-contains', affected_uid)
                    .get();
                console.log(snapshot)
                return snapshot
            }
            //get firestore data for affected shifts
            resultSnapshot = await getDocument().then(function (response) {
                return response
            })
            // if any shifts ARE affected:
            if (!resultSnapshot.empty){
                result = await getDocument().then(function (response) {
                    mappedResponse = response.docs.map(collectIdsAndDocs);
                    return mappedResponse
                })
                result.forEach((doc)=>{
                    var message = {
                        affected_user: affected_uid, // user whose checkpoint caused the notification
                        shift_id: doc.id, // id of the shift
                        alert_level: alert_level,
                        shift_staff: doc.staff_uids
                    }
                    return addScheduleWarning(message)
                })
                // add warnng to the shift doc too 
                resultSnapshot.forEach((doc) =>{
                    //store all alert messages for shift in array
                    var message_array = []
                    message_array.push(alert_message) // add current alert message to array
                    // avoid overwriting higher level alert!
                    // if no existing alerts on shift - push new alert values 
                    if (!(doc.hasOwnProperty("alert_level"))){
                        doc.ref.update({
                            "alert_level": alert_level,
                            "alert_message": message_array
                        })
                    }else{    
                         // get existing alert messages to append to array, if any exist
                        if (doc.hasOwnProperty("alert_message")){
                            doc.alert_message.forEach((message) => {
                                message_array.push(message)
                            })
                        }
                        // existing AND new alert level same value? No Comparison logic needed
                        if (doc.alert_level == alert_level){
                            doc.ref.update({
                                "alert_level": alert_level,
                                "alert_message":alert_message
                            })
                        }
                        // existing alert more severe than new alert? keep existing value
                        else if (
                            (doc.alert_level == "high" && (alert_level == "medium" || alert_level == "low"))||
                            (doc.alert_level == "medium" && alert_level == "low")
                            ){
                            doc.ref.update({
                                "alert_level": doc.alert_level,
                                "alert_message": message_array
                            })
                        }
                        // if current alert lower than new alert - set value of new alert 
                        else if (
                            (doc.alert_level == "low" && (alert_level == "medium" || alert_level == "high"))||
                            (doc.alert_level == "medium" && alert_level == "high")
                            ){
                            doc.ref.update({
                                "alert_level": alert_level,
                                "alert_message": message_array
                            })
                        }
                    }
                })
            }   
        }
        catch (err) {
            console.log(err)
            response.status(500).send(err)
        }
    })