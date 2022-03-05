import { auth } from '../firebase'
import { firestore } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';


async function getSingleDocByDocId(documentID) {
    const user = auth.currentUser; // user is signed into app 
    var result;
    if (user) {
        // get data from firestore with a snapshot 
        const getUserDocument = async () => {
            const snapshot = await firestore
                .collection('Users').doc(documentID).get()
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
        result = await getSingleDocByDocId(documentID).then(function (response) {
            return response
        })
    }
    var full_name = result.first_name + " " + result.surname;
    return full_name;
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

    async function mapNames(data) {
        console.log(data)
        data.forEach((doc) => {
            console.log(doc) // valid document from snapshot 
            var staff = doc.staff // get staff array from document 
            console.log(staff) // valid array
            var staff_names = new Array
            // loping through each document in the retrieved snapshot - map each UID to a user's display name for UI 
            staff.forEach((user) => {
                getUserDisplayName(user).then((displayName) => {
                    staff_names.push(displayName)
                    console.log(staff_names) //valid array
                    doc.staff = staff_names
                })
            })
            console.log(doc)//valid object
        })
        console.log(data) // valid object 
        return data
    }

    // The Firestore documentation mentions in its “Query limitations” section:
    // In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field.
    // this is why we are using 'date'' as well as 'start_datetime' and 'end_datetime' in our firestore document

    if (start && end) {
        // get data from firestore with a snapshot between dates input by user
        async function getUserDocument(){
            const snapshot = await firestore
                .collection('WorkshiftSchedules')
                .where('date', '>=', start)
                .where('date', '<=', end)
                .get();
            console.log(snapshot)
            var myDocs = snapshot.docs.map(collectIdsAndDocs);
            return myDocs
        }
        
        //get firestore data
        result = await getUserDocument().then(function (response) {
            return response
        })

        //map data for user display names from UIDs
        result = await mapNames(result).then(function (mappedResponse) {
            AsyncStorage.setItem('workshiftData', mappedResponse)
            return mappedResponse
        })
    }
    console.log(result)
    return result;
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
    getUserDisplayName
}