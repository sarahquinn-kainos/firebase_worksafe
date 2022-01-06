import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import {auth} from '../firebase'
//import firestore from '@react-native-firebase/firestore';
import {firestore} from '../firebase'

const homeScreen = () => {

    const user = auth.currentUser;
    if (user) {
        // current user's account vlaues 
        const email = user.email
        const displayName = user.displayName

        // set up firestore collectio for processing 
        //const usersCollection  = [firestore.collection('Users')];
        const userDocument = JSON.stringify(firestore
        .collection('Users')
        .doc('odA8yCoMwpbjAy0fgFIV'));
        return (
            <View>
                <Text>Default Home Screen</Text>
                <Text>{email}</Text>
                <Text>{displayName}</Text>
                <Text>{userDocument}</Text>
            </View>
        )
    }
    
}

export default homeScreen

const styles = StyleSheet.create({})
