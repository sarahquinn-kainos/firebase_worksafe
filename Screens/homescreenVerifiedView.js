import React, { useState, useEffect, Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import { getSingleDocByDocId, getUsersCollection } from '../Javascript/firestore'
import screenWithDrawerNav from '../components/drawerNav'

const showVerifiedHomeScreenContent = () => {
    const [currentUserDoc, setCurrentUserDoc] = useState(null);
    const [email, setEmail] = useState('');
    const user = auth.currentUser;

    if (!currentUserDoc) {
        getSingleDocByDocId(user.uid).then(result => {
            setCurrentUserDoc(result);
            setEmail(result.email)}
        );
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

const showVerifiedHome = () => {
    return screenWithDrawerNav(showVerifiedHomeScreenContent)
}

export default showVerifiedHome