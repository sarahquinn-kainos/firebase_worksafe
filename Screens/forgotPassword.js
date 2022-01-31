import React, { useState, Component } from 'react';
import { auth } from '../firebase'
import { KeyboardAvoidingView, Center, NativeBaseProvider, Text, Button, Input, VStack } from "native-base"
import { useNavigation } from '@react-navigation/native';



const forgotPassword = () => {

    const navigation = useNavigation();

    const sendResetPasswordEmail = () => {
        auth.sendPasswordResetEmail(email)
            .catch(error => alert(error.message))
        navigation.navigate('Login')
    }
    const [email, setEmail] = useState('')

    return (

        <NativeBaseProvider>
            <KeyboardAvoidingView>
                <Center mx="auto" px="20" py="20">
                    <VStack>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}>
                        </Input>
                        <br/>
                        <Button
                            onPress={sendResetPasswordEmail}>
                            <Text>Send Reset</Text>
                        </Button>
                    </VStack>
                </Center>
            </KeyboardAvoidingView>
        </NativeBaseProvider>
    );
}

export default forgotPassword