import { auth } from '../firebase'
import { firestore } from '../firebase'


async function getSingleDocByDocId(documentID){
    const user = auth.currentUser;
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


async function getUsersCollection(){
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

export {getSingleDocByDocId, getUsersCollection}