import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-web'

const loginScreen = () => {

    // get data from firestore 
    const getUserAccountType = async () => {
        const user = auth.currentUser;
        const snapshot = await firestore
            .collection('Users').doc(user.uid).get();
        const myDoc = snapshot.data()
        const account_type = myDoc.account_type
        return account_type;
    }


    // const for storing user input fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()
    const forgotPassword = () => {
        navigation.navigate("ForgotPassword");
    }

    // change page after login 
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if (user) {

                const account_type = await getUserAccountType();
                console.log("\n\n===LOG===\n ACCOUNT TYPE : " + account_type)
                if (account_type == "super_user" || account_type == "admin") { // replace with role value later
                    navigation.replace("AdminDash")
                } else {
                    navigation.replace("Home")
                }
            }
        })

        return unsubscribe
    }, [])

    // create a new user in firebase 
    const handleSignUp = () => {
        navigation.replace("Register")
    }


    // login with firebase auth 
    const handleLogin = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with:', user.email);
                console.log('User ID:', user.uid);
            })
            .catch(error => alert(error.message))
    }

    return (
        //Input fields &  Buttons
        <KeyboardAvoidingView
            style={styles.container}
            behaviour="padding">
            <View
                style={styles.inputContainer}
                behaviour="padding">
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}>
                </TextInput>

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry>
                </TextInput>

            </View>
            <View
                style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
                <Text onPress={forgotPassword}
                    style={{ paddingTop: 50, justifyContent: 'center', alignItems: 'center' }}>Forgot Password</Text>
            </View>
        </KeyboardAvoidingView>
    )
}

export default loginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10
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
    buttonOutline: {
        backgroundColor: 'white',
        borderColor: '#2B9AF6',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14
    },
    buttonOutlineText: {
        color: '#2B9AF6',
        fontWeight: '600',
        fontSize: 14
    },
})
