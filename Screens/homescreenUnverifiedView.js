import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native'

const sendResetPasswordEmail = () => {
    const user = auth.currentUser;
    const email = user.email;
    auth.sendPasswordResetEmail(email).then(
        alert("Email sent to " + email)
    )
        .catch(error => alert(error.message))
}

const showUnerifiedHome = () => {

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behaviour="padding">
                <Text>Default Home Screen</Text>
                <br></br>
                <Text>Your email address has not been verified</Text>
                <Text>Please check your inbox and spam folders.</Text>
                <View
                    style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={sendResetPasswordEmail}
                        style={[styles.button]}>
                        <Text style={styles.buttonText}>Re-send Verification Email</Text>
                    </TouchableOpacity>
                </View>
        </KeyboardAvoidingView>

    )
}
export default showUnerifiedHome


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: '#2B9AF6',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14
    }
})