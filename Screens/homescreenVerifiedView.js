import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import getSingleDocByDocId from '../Javascript/firestore'

const showVerifiedHome = () => {

    const user = auth.currentUser;
    if (user) {
        // get data from firestore with a snapshot 
        // const getUserDocument = async () => {
        //     const snapshot = await firestore
        //         // WHOLE COLLECTION
        //         //.collection('Users').get();
        //         //const myDocs = snapshot.docs.map(collectIdsAndDocs);

        //         //SINGLE DOCUMENT
        //         .collection('Users').doc(user.uid).get()
        //     const myDocs = snapshot.data()
        //     return (myDocs)
        // }

        // getUserDocument().then(function (response) {
        //     console.log(response)
        // })
        getSingleDocByDocId(user.uid).then(function (result){
            console.log(result)
        })
        

        return (
            <View>
                <Text>Default Home Screen</Text>
                <Text>Your email address has been verified.</Text>
            </View>
        )
    }
}

export default showVerifiedHome