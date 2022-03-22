import { auth } from '../firebase'
import { firestore } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';


async function getSingleDocByDocId(collection, documentID) {
    const user = auth.currentUser; // user is signed into app 
    var result;
    if (user) {
        // get data from firestore with a snapshot 
        const getUserDocument = async () => {
            const snapshot = await firestore
                .collection(collection).doc(documentID).get()
            const myDoc = snapshot.data()
            return (myDoc)
        }
        result = await getUserDocument().then(function (response) {
            return response
        })
    }
    return result;
}

async function getUserDisplayName(documentID) {
    const user = auth.currentUser;
    var result;
    if (user) {
        result = await getSingleDocByDocId('Users', documentID).then(function (response) {
            return response
        })
    }
    var full_name = result.first_name + " " + result.surname;
    return full_name;
}

async function getUserIsAdmin(documentID) {
    const user = auth.currentUser;
    var result;
    if (user) {
        result = await getSingleDocByDocId('Users', documentID).then(function (response) {
            return response
        })
    }
    var account_type = result.account_type;
    var isAdmin = false;
    if (account_type == "admin" || account_type == "super_user"){
        isAdmin = true;
    }
    return isAdmin;
}


async function getCovidDataForUserLastSevenDays(id) {
    var result;

    var end = new Date().toISOString();
    var start = new Date();
    start.setDate(start.getDate() - 7);
    start = start.toISOString();
    console.log(start, end)

    // mapping for firestore object - returns a promise of multiple docs 
    const collectIdsAndDocs = (doc) => {
        return { id: doc.id, ...doc.data() };
    };

    if (id) {
        // get data from firestore with a snapshot 
        const getUserDocument = async () => {
            const snapshot = await firestore
                .collection('Users').doc(id)
                .collection('CovidStatus')
                .where('timestamp', '>=', start)
                .where('timestamp', '<=', end)
                .get()
            console.log(snapshot)
            const myDocs = snapshot.docs.map(collectIdsAndDocs);
            return (myDocs)
        }
        result = await getUserDocument().then(function (response) {
            return response;
        })
    }
    console.log(result)
    return result;
}

async function getShiftDataBetweenDates(start, end) {
    var result;

    // mapping for firestore object - returns a promise of multiple docs 
    const collectIdsAndDocs = (doc) => {
        return { id: doc.id, ...doc.data() };
    };

    // The Firestore documentation mentions in its “Query limitations” section:
    // In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field.
    // this is why we are using 'date'' as well as 'start_datetime' and 'end_datetime' in our firestore document

    if (start && end) {
        // get data from firestore with a snapshot between dates input by user
        async function getUserDocument() {
            const snapshot = await firestore
                .collection('WorkshiftSchedules')
                .orderBy("date", "asc")
                .where('date', '>=', start)
                .where('date', '<=', end)
                .get();
            console.log(snapshot)
            var myDocs = snapshot.docs.map(collectIdsAndDocs);
            // myDocs = await mapNames(myDocs).then(function (mappedResponse) {
            //     return mappedResponse
            // })
            return myDocs
        }
        //get firestore data
        result = await getUserDocument().then(function (response) {
            return response
        })
    }
    console.log(result)
    return result;
}

async function getShiftDataBetweenDatesForUser(start, end, uid) {
    var result;
    console.log(start + " \n" + end + " \n" + uid)

    // mapping for firestore object - returns a promise of multiple docs 
    const collectIdsAndDocs = (doc) => {
        return { id: doc.id, ...doc.data() };
    };

    // The Firestore documentation mentions in its “Query limitations” section:
    // In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field.
    // this is why we are using 'date'' as well as 'start_datetime' and 'end_datetime' in our firestore document

    if (start && end && uid) {
        //console.log("\n\n LOG \n\n Type of: uid = ")
        //console.log(typeof uid)
        // get data from firestore with a snapshot between dates input by user
        async function getDocument() {
            const snapshot = await firestore
                .collection('WorkshiftSchedules')
                .orderBy("date", "asc")
                .where('date', '>=', start)
                .where('date', '<=', end)
                .where('staff_uids', 'array-contains', uid)
                .get();
            console.log(snapshot)
            var myDocs = snapshot.docs.map(collectIdsAndDocs);
            return myDocs
        }
        //get firestore data
        result = await getDocument().then(function (response) {
            return response
        })
    }
    console.log(result)
    return result;
}

async function isUserWorkingToday() {
    const uid = auth.currentUser.uid
    var shift_result;
    var checkpoint_result;

    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    var end = new Date();
    end.setUTCHours(23, 59, 59, 999);
    console.log(start + " \n" + end + " \n" + uid)
    if (start && end && uid) {
        // get data from firestore with current current UID and start, end today from 00:00 - 23:59
        async function getShifts() {
            const snapshot = await firestore
                .collection('WorkshiftSchedules')
                .where('date', '>=', start)
                .where('date', '<=', end)
                .where('staff_uids', 'array-contains', uid)
                .get()
                .then(response => {
                    return response
                });
            console.log(snapshot)
            return snapshot
        }
        async function getCovidDoc() {
            const snapshot = await firestore
                .collection('CovidCheckpoints')
                .where('timestamp', '>=', start)
                .where('timestamp', '<=', end)
                .where('uid', '==', uid)
                .get()
                .then(response => {
                    return response
                });
            console.log(snapshot)
            return snapshot
        }
        //get firestore data
        shift_result = await getShifts().then(function (response) {
            return response
        })
        checkpoint_result = await getCovidDoc().then(function (response) {
            return response
        })
        //if there are no shifts scheduled then return false - not triggering checkpoint modal 
        if (shift_result.empty) {
            return false
        } else {
            // if data is returned for checkpoint data for current user + todays date - do not re-trigger
            if (!(checkpoint_result.empty)) {
                return false
            } else {
                return true
            }
        }
    }
}

async function getUserSubCollectionDocById(subCollection, id) {
    const user = auth.currentUser;
    var result;
    if (user) {
        // get data from firestore with a snapshot 
        const getUserDocument = async () => {
            const snapshot = await firestore
                .collection('Users').doc(id).collection(subCollection).doc(id).get()
            const myDoc = snapshot.data()
            return (myDoc)
        }
        result = await getUserDocument().then(function (response) {
            return response
        })
    }
    return result;
}


async function getUsersCollection() {
    const user = auth.currentUser;
    var result;

    // mapping for firestore object - returns a promise of multiple docs 
    const collectIdsAndDocs = (doc) => {
        return { id: doc.id, ...doc.data() };
    };

    if (user) {
        // get data from firestore with a snapshot 
        const getUserDocument = async () => {
            const snapshot = await firestore
                .collection('Users').get();
            const myDocs = snapshot.docs.map(collectIdsAndDocs);
            return (myDocs)
        }
        result = await getUserDocument().then(function (response) {
            return response;
        })
    }
    return result;
}


function writeDocumentToCollection(collection, id, document) {
    // to identify docs with ID collection 
    if (id) {
        //const [ thisDoc, setThisDoc ] = useState(document);
        const ref = firestore.collection(collection);

        async function addDocument() {
            await ref.doc(id).set(document).then(
                console.log("Document Pushed to Collection: " + collection)
            ).catch((err) => {
                console.error(err);
            }
            );
        }
        addDocument();
    }
    else {
        //const [ thisDoc, setThisDoc ] = useState(document);
        const ref = firestore.collection(collection);

        async function addDocument() {
            await ref.doc().set(document).then(
                console.log("Document Pushed to Collection: " + collection)
            ).catch((err) => {
                console.error(err);
            }
            );
        }
        addDocument();
    }

}



function addSubCollectionToExistingDocumentById(collection, subCollection, id, subId, documentData) {
    const ref = firestore.collection(collection);

    async function addSubCollecionToDoc() {
        if (subId) {
            await ref.doc(id).collection(subCollection).doc(subId).set(documentData)
                .then(() => {
                    console.log("Sub-Collection has been added to Firestore. [Collection: " + collection + ", Document ID:" + id + "]")
                }).catch((err) => {
                    console.error(err);
                });
        } else {
            await ref.doc(id).collection(subCollection).doc().set(documentData)
                .then(() => {
                    console.log("Sub-Collection has been added to Firestore. [Collection: " + collection)
                }).catch((err) => {
                    console.error(err);
                });
        }


    }
    addSubCollecionToDoc();

}

export {
    getSingleDocByDocId,
    getUsersCollection,
    writeDocumentToCollection,
    addSubCollectionToExistingDocumentById,
    getUserSubCollectionDocById,
    getCovidDataForUserLastSevenDays,
    getShiftDataBetweenDates,
    getShiftDataBetweenDatesForUser,
    getUserDisplayName,
    isUserWorkingToday,
    getUserIsAdmin
}