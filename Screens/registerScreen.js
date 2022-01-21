import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { StyleSheet, Text, View } from 'react-native'

import { writeDocumentToCollection} from '../Javascript/firestore'


const registerScreen = () => {


    // const for storing user input fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fName, setFName] = useState('')
    const [sName, setSName] = useState('')

    const navigation = useNavigation()

    // change page after login 
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                if (user.uid == "vJ1wPthO22eyMQ6iu8ukcZVwQWB3") { // replace with role value later
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
        auth
            .createUserWithEmailAndPassword(email, password).then((userCredentials) => {
                const displayName = fName;
                const uid = userCredentials.user.uid;
                if (userCredentials.user) {
                    userCredentials.user.sendEmailVerification();
                    userCredentials.user.updateProfile({
                        displayName: displayName
                    }).then(() => {
                        var newUserDoc = {
                            "account_type": "standard",
                            "email": email,
                            "first_name": fName,
                            "surname": sName
                        };
                        writeDocumentToCollection('Users', uid ,newUserDoc);
                        navigation.navigate('Home');
                        console.log(userCredentials.user.displayName)
                    })
                }
            })
            .catch(error => alert(error.message))
    }

    const backToLogin = () => {
        navigation.navigate("Login");
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
                    placeholder="First Name"
                    value={fName}
                    onChangeText={text => setFName(text)}
                    style={styles.input}>
                </TextInput>

                <TextInput
                    placeholder="Surname"
                    value={sName}
                    onChangeText={text => setSName(text)}
                    style={styles.input}>
                </TextInput>
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
                    onPress={handleSignUp}
                    style={[styles.button]}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={backToLogin}
                    style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default registerScreen

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
