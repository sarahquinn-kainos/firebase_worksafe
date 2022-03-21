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

const addCloseContactNotification = (message) => {
    return admin.firestore().collection('CloseContactNotifications')
        .add(message)
        .then(doc => {
            console.log('Close Contact Warning added: ', doc)
        })
}


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
        var notification_document;


        var alert_level = messageData.alert_level;
        var alert_message = messageData.alert_message;
        var positive_user_uid = messageData.user;
        var positive_user_display_name = messageData.user_display_name;
        var checkpoint_date = messageData.time.toDate(); // checkpoint date
        checkpoint_date.setUTCHours(0, 0, 0, 0);
        var start = messageData.time.toDate(); // 5 days before checkpoint
        start.setDate(start.getDate() - 5)
        var end = messageData.time.toDate(); // 5 days after checkpoint
        end.setDate(end.getDate() + 5)
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);
        console.log("start: " + start)
        console.log("end: " + end)

        // CREATE SCHEDULE NOTIFICATIONS IN FIRESTORE 'SCHEDULEWARNINGS' COLLECTION

        try {
            // get workshift data from firestore with a snapshot - 5 days either side of checkpoint 
            async function getDocument() {
                const snapshot = await admin.firestore()
                    .collection('WorkshiftSchedules')
                    .where('date', '>=', start)
                    .where('date', '<=', end)
                    .where('staff_uids', 'array-contains', positive_user_uid)
                    .get();
                console.log(snapshot)
                return snapshot
            }
            //get firestore data for affected shifts
            resultSnapshot = await getDocument().then(function (response) {
                return response
            })
            // if any shifts ARE affected:
            if (!resultSnapshot.empty) {
                result = await getDocument().then(function (response) {
                    mappedResponse = response.docs.map(collectIdsAndDocs);
                    return mappedResponse
                })
                var warning_notification_array = []

                result.forEach((doc) => {
                    var message = {
                        positive_user_name: positive_user_display_name,
                        positive_user_id: positive_user_uid, // user whose checkpoint caused the notification
                        shift_id: doc.id, // id of the shift
                        shift_date: doc.date,
                        shift_start: doc.start_datetime,
                        alert_level: alert_level, //from the covid notification document 
                        alert_message: alert_message,
                        shift_staff: doc.staff,
                        staff_uids: doc.staff_uids
                    }
                    // add warning to array
                    warning_notification_array.push(message)

                })
                // set doc data to write to collection 
                notification_document = {
                    shift_warnings: warning_notification_array,
                }

                //write array of warnings to the schedule warnings collection for notifications 
                addScheduleWarning(notification_document)

                // ADD ALERTS TO THE SHIFT DOCUMENTS IN FIRESTORE 'WORKSHIFTSCHEDULES' COLLECTION
                resultSnapshot.forEach((document) => {
                    const doc = document.data();
                    var alert_data = {
                        alert_level: alert_level,
                        alert_message: alert_message
                    }
                    var alert_array = []
                    const current_alert_array = doc.alerts;
                    if (current_alert_array) { // append to existing alerts if any exist 
                        alert_array = current_alert_array;
                    }
                    alert_array.push(alert_data)
                    document.ref.update({
                        "alerts": alert_array
                    })
                })
            }
        }
        catch (err) {
            console.log(err)
            response.status(500).send(err)
        }

        if (messageData.title == "Positive COVID-19 Checkpoint"){
            try {
            // get workshift data from firestore with a snapshot - 5 days BEFORE checkpoint only
            async function getDocumentPreviousDates() {
                const snapshot = await admin.firestore()
                    .collection('WorkshiftSchedules')
                    .where('date', '>=', start)
                    .where('date', '<=', checkpoint_date)
                    .where('staff_uids', 'array-contains', positive_user_uid)
                    .get();
                console.log(snapshot)
                return snapshot
            }
            //get firestore data for affected shifts
            newResultSnapshot = await getDocumentPreviousDates().then(function (response) {
                return response
            })
            // affected staff who have come into close contact on previous shifts (last 5 days) 
            var affected_staff_array = []
            newResultSnapshot.forEach((document) => {
                const doc = document.data();
                doc.staff_uids.forEach((id) => {
                    if (id != positive_user_uid) { // avoid duplication of notification  
                        affected_staff_array.push(id)
                    }
                })
            })

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }

            // for every staff member in array - add notification to collection 
            if (affected_staff_array.length > 0) {
               
                  var unique_ids = affected_staff_array.filter(onlyUnique);
                  console.log("\n\nAffected staff (unique): " + unique_ids); 
                  //let unique_ids = [new Set(affected_staff_array)]
                  
                  unique_ids.forEach((contact) => {
                    var data = {
                        staff_id: contact,
                        positive_contact_id: positive_user_uid,
                        date: checkpoint_date
                    }
                    addCloseContactNotification(data)
                })
            }
        } catch (err) {
            console.log(err)
            response.status(500).send(err)
        }

        }
    })