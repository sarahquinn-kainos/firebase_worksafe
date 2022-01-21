import React, { useState, useEffect, setState, state } from 'react'
import { auth } from '../firebase'
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core'
import {
    Box,
    Heading,
    AspectRatio,
    Image,
    Text,
    Center,
    HStack,
    Stack,
    NativeBaseProvider, VStack, Button, IconButton, Icon, StatusBar
} from "native-base"


const sendResetPasswordEmail = () => {
    const user = auth.currentUser;
    const email = user.email;
    auth.sendPasswordResetEmail(email).then(
        alert("Email sent to " + email)
    )
        .catch(error => alert(error.message))
    }

const showUnerifiedHome = () => {
    const user = auth.currentUser;
    const navigation = useNavigation();
    const [displayName, setdisplayName] = useState(user.displayName ? user.displayName : '');

    useEffect(() => {
        if (user.displayName) {
            setdisplayName(user.displayName)
        }
    }, []);

    return (

        <NativeBaseProvider>
            <Center mt="15%">
                <Text>Hello {displayName}!</Text>
                <br></br>
                <Text>Your email address has not been verified</Text>
                <Text>Please check your inbox and spam folders.</Text>
                <br />
                <Center>
                    <Button minW={"100%"}
                        onPress={sendResetPasswordEmail}>
                        <Text bold color="white">Re-send Verification Email</Text>
                    </Button>
                    <br />
                    <Button minW={"100%"}
                        onPress={()=>{navigation.navigate('AccountManage')}}>
                        <Text bold color="white">Manage My Profile</Text>
                    </Button>
                </Center>
            </Center>
        </NativeBaseProvider>
    )

}

export default showUnerifiedHome