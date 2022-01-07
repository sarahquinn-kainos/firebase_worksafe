import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import showVerifiedHome from './homescreenVerifiedView'
import showUnverifiedHome from './homescreenUnverifiedView'

const homeScreen = () => {
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

            //FIELD VALUE ONLY
            //console.log(myDocs.account_type);
            return myDocs;
        }

        getUserDocument();

        if (user.emailVerified) {
            return(showVerifiedHome())
            
        } else {
            return(showUnverifiedHome())
        }
    }

}

export default homeScreen

const styles = StyleSheet.create({})
