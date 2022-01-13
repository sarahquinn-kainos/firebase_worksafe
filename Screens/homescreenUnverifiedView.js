import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'

const showUnerifiedHome = () => {
   
        return (
            <View>
                <Text>Default Home Screen</Text>
                <Text>Your email address has not been verified. Please check your inbox and spam folders.</Text>
            </View>
        )
    }
export default showUnerifiedHome