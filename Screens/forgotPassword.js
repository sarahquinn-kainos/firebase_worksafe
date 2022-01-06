import React, { useState, Component } from 'react';
import { Text, View, Alert } from 'react-native';
import {auth} from '../firebase'
import { StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';



const forgotPassword = () => {

    const navigation = useNavigation();

    const sendResetPasswordEmail = () => {
        auth.sendPasswordResetEmail(email)
        .catch(error => alert(error.message)).then(
            alert("Form Submitted."),
            navigation.navigate('Login')
        )
    }
    const [email, setEmail] = useState('')

    return (

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
            </View>
            <View
                style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={sendResetPasswordEmail}
                    style={[styles.button]}>
                    <Text style={styles.buttonText}>Send Password Reset Email</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default forgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    inputContainer : {
        width: '80%',
    },
    input : {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10
    },
    buttonContainer : {
        width : '60%', 
        justifyContent:'center',
        alignItems: 'center',
        marginTop : 40
    },
    button : {
        backgroundColor : '#2B9AF6',
        width : '100%',
        padding: 15,
        borderRadius : 10,
        marginTop : 10,
        alignItems : 'center',
    },
    buttonOutline : {
        backgroundColor : 'white',
        borderColor: '#2B9AF6',
        borderWidth : 2,
    },
    buttonText: {
        color : 'white',
        fontWeight : '600',
        fontSize : 14
    },
    buttonOutlineText : {
        color : '#2B9AF6',
        fontWeight : '600',
        fontSize : 14
    },
})