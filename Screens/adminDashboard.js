import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import { getSingleDocByDocId, getUsersCollection } from '../Javascript/firestore'

const adminDashboard = () => {
    const user = auth.currentUser;
    var currentUserDoc;
    if (user) {
        // current user's account vlaues 
        const email = user.email
        const displayName = user.displayName

        const getCurrentUserDoc = async () => {
            currentUserDoc = await getSingleDocByDocId(user.uid).then(function (result) {
                return result
            })
        }

        getCurrentUserDoc().then(function () {
            console.log(currentUserDoc)
        })

        getUsersCollection().then(function (result) {
            console.log(result)
        })

        return (
            <View>
                <Text>Default Home Screen</Text>
                <Text>{email}</Text>
                <Text>{displayName}</Text>

            </View>
        )
    }

}

export default adminDashboard

const styles = StyleSheet.create({})
