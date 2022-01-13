import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import {getSingleDocByDocId, getUsersCollection} from '../Javascript/firestore'

const showVerifiedHome = () => {

    const user = auth.currentUser;
    if (user) {
        getSingleDocByDocId(user.uid).then(function (result){
            console.log(result)
        })
        getUsersCollection().then(function (result){
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