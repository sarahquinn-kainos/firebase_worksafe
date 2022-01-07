import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'

const showVerifiedHome = () => {

    const user = auth.currentUser;
    if (user) {
        // current user's account vlaues 
        const email = user.email
        const displayName = user.displayName

        // mapping for firestore object - returns a promise 
        const collectIdsAndDocs = (doc) => {
            return { id: doc.id, ...doc.data() };
        };


        // get data from firestore with a snapshot 
        const getUserDocument = async () => {
            const snapshot = await firestore
                // WHOLE COLLECTION
                //.collection('Users').get();
                //const myDocs = snapshot.docs.map(collectIdsAndDocs);

                //SINGLE DOCUMENT
                .collection('Users').doc(user.uid).get();
            const myDocs = snapshot.data()
            console.log(myDocs);

            //STORE DOC FIELD VALUES AS OBJECT - JSON
            const docData = {
                "email": myDocs.email,
                "account_type": myDocs.account_type
            }
            return JSON.stringify(docData);
        }

        const getDocumentData = async () => {
            const doc = await getUserDocument();
            const docJSON = JSON.parse(doc)
            const testFieldValue = docJSON.email
            console.log("doc data: " + (testFieldValue))

        }

        getDocumentData();





        return (
            <View>
                <Text>Default Home Screen</Text>
                <Text>Your email address has been verified.</Text>
            </View>
        )
    }
}

export default showVerifiedHome