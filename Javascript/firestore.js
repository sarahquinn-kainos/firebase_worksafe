import { auth } from '../firebase'
import { firestore } from '../firebase'


const getSingleDocByDocId = async (documentID) => {
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
            console.log(response);
            return response
        })
    }
    return result;
}


function getUsersCollection(){
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
        getUserDocument().then(function (response) {
            console.log(response);
            result = response;
        })
    }
    return result;
}

export default getSingleDocByDocId