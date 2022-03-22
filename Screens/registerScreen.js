import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { KeyboardAvoidingView, Center, NativeBaseProvider, Text, Button, Input, VStack } from "native-base"
import { writeDocumentToCollection } from '../Javascript/firestore'


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

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function validatePassword(password) {
        var minNumberofChars = 6;
        var maxNumberofChars = 16;
        var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if (!(password.length < minNumberofChars || password.length > maxNumberofChars)) {
            if (!regularExpression.test(password)) {
                alert("Password should contain at least one number and one special character.");
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }

    }

    // create a new user in firebase 
    const handleSignUp = () => {
        if (validatePassword(password)) {
            auth
                .createUserWithEmailAndPassword(email, password).then((userCredentials) => {
                    const displayName = capitalizeFirstLetter(fName) + " " + capitalizeFirstLetter(sName);
                    const uid = userCredentials.user.uid;
                    if (userCredentials.user) {
                        userCredentials.user.sendEmailVerification();
                        userCredentials.user.updateProfile({
                            displayName: displayName
                        }).then(() => {
                            var newUserDoc = {
                                "account_type": "standard",
                                "email": email,
                                "first_name": capitalizeFirstLetter(fName),
                                "surname": capitalizeFirstLetter(sName)
                            };
                            writeDocumentToCollection('Users', uid, newUserDoc);
                            navigation.navigate('Home');
                            console.log(userCredentials.user.displayName)
                        })
                    }
                })
                .catch(error => alert(error.message))
        }
    }

    const backToLogin = () => {
        navigation.navigate("Login");
    }


    return (
        //Input fields &  Buttons
        <NativeBaseProvider>
            <KeyboardAvoidingView>
                <VStack space={4} alignItems="center">
                    <Center mx="auto" w="80%" px="45" py="50" >
                        <Input
                            w="100%"
                            placeholder="First Name"
                            value={fName}
                            onChangeText={text => setFName(text)}>
                        </Input>
                        <Text>{"\n"}</Text>
                        <Input
                            w="100%"
                            placeholder="Surname"
                            value={sName}
                            onChangeText={text => setSName(text)}>
                        </Input>
                        <Text>{"\n"}</Text>
                        <Input
                            w="100%"
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}>
                        </Input>
                        <Text>{"\n"}</Text>
                        <Input
                            w="100%"
                            placeholder="Password"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            secureTextEntry>
                        </Input>
                        <Text>{"\n"}</Text>
                        <Button
                            w="100%"
                            onPress={handleSignUp}>
                            <Text>Register</Text>
                        </Button>
                        <Text>{"\n"}</Text>
                        <Button
                            w="100%"
                            onPress={backToLogin}>
                            <Text>Back to Login</Text>
                        </Button>
                    </Center>
                </VStack>
            </KeyboardAvoidingView>
        </NativeBaseProvider>
    )
}

export default registerScreen
