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

async function getCovidDataForUserLastSevenDays(id){
    var result;

    var end = new Date().toISOString();
    var start = new Date();
    start.setDate(start.getDate()-7);
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

async function getUserSubCollectionDocById(subCollection, id){
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


function writeDocumentToCollection(collection, uid, document) {
    //const [ thisDoc, setThisDoc ] = useState(document);
    const ref = firestore.collection(collection);
    
    async function addDocument() {
      await ref.doc(uid).set(document).then(
          console.log("Document Pushed to Collection: " + collection)
      ).catch((err) => {
            console.error(err);
          }
      );
    }
    addDocument();
  }

function addSubCollectionToExistingDocumentById(collection, subCollection, id, subId, documentData){
    const ref = firestore.collection(collection);
    
    async function addSubCollecionToDoc() {
        if(subId){
            await ref.doc(id).collection(subCollection).doc(subId).set(documentData)
            .then(()=>{
                console.log("Sub-Collection has been added to Firestore. [Collection: "+ collection + ", Document ID:" + id + "]")
            }).catch((err) => {
                console.error(err);
              } );
        }else{
            await ref.doc(id).collection(subCollection).doc().set(documentData)
            .then(()=>{
                console.log("Sub-Collection has been added to Firestore. [Collection: "+ collection )
            }).catch((err) => {
                console.error(err);
              } );
        }
      
     
    }
    addSubCollecionToDoc();

} 

export {getSingleDocByDocId, getUsersCollection, writeDocumentToCollection, addSubCollectionToExistingDocumentById, getUserSubCollectionDocById, getCovidDataForUserLastSevenDays}