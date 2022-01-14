import React, { useState, useEffect, Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import { getSingleDocByDocId, getUsersCollection } from '../Javascript/firestore'



// class User extends Component {
//     constructor() {
//         super();
//         this.state = {
//             currentUserDoc: {}
//         }
//     }
// }



const showVerifiedHome = () => {
    const [currentUserDoc, setCurrentUserDoc] = useState(null);
    const [email, setEmail] = useState('');
    const user = auth.currentUser;

    if (!currentUserDoc) {
        getSingleDocByDocId(user.uid).then(result => {
            setCurrentUserDoc(result);
            setEmail(result.email)}
            // setCurrentUserDoc(result)}
        );

        //var currentUserDocJSON = JSON.parse(currentUserDoc);
        //console.log()
        //var myemail = currentUserDoc.email;
    }
    console.log(currentUserDoc)
    return (
        <View>
            <Text>Default Home Screen</Text>
            <Text>Your email address has been verified.</Text>

            <Text>{email}</Text>
        </View>
    )

}
export default showVerifiedHome