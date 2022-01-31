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
                <VStack space={4} alignItems="center">
                    <Center mx="auto" w="80%" px="45" py="50">
                        <Input
                            w="100%"
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}>
                        </Input>
                        <Text>{"\n"}</Text>
                        <Text>{"\n"}</Text>
                        <Button
                            w="100%"
                            onPress={sendResetPasswordEmail}>
                            <Text>Send Reset</Text>
                        </Button>
                    </Center>
                </VStack>
            </KeyboardAvoidingView>
        </NativeBaseProvider>
    );
}

export default forgotPassword