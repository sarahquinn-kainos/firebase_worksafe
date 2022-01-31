import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { KeyboardAvoidingView, Center, NativeBaseProvider, Text, Button, Input, VStack } from "native-base"

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
        <NativeBaseProvider>
            <KeyboardAvoidingView>
                <VStack space={4} alignItems="center">
                    <Center mx="auto" w="80%" px="45" py="50" >
                        <Input
                            w="100%"
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}>
                        </Input>
                        <br />
                        <Input
                            w="100%"
                            placeholder="Password"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            secureTextEntry>
                        </Input>
                    </Center>
                    <Center mx="auto" w="80%" px="45">
                        <Button  w="100%"
                            onPress={handleLogin}>
                            <Text >Login</Text>
                        </Button>
                        <br />
                        <Button  w="100%"
                            onPress={handleSignUp}>
                            <Text>Register</Text>
                        </Button>
                        <br />
                        <Text onPress={forgotPassword}>Forgot Password</Text>
                    </Center>
                </VStack>
            </KeyboardAvoidingView>
        </NativeBaseProvider>
    )
}

export default loginScreen