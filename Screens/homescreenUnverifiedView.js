import React, { useState, useEffect} from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { Text, Center, NativeBaseProvider, VStack, Button } from "native-base"


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

            <VStack space={4} alignItems="center">
                <Center mx="auto" w="80%" px="45" py="50" >
                    <Text>Hello {displayName}!</Text>
                    <Text>{"\n"}</Text>
                    <Text>Your email address has not been verified</Text>
                    <Text>Please check your inbox and spam folders.</Text>
                    <Text>{"\n"}</Text>
                    <Button minW={"100%"}
                        onPress={sendResetPasswordEmail}>
                        <Text bold color="white">Re-send Verification Email</Text>
                    </Button>
                    <Text>{"\n"}</Text>
                    <Button minW={"100%"}
                        onPress={() => { navigation.navigate('AccountManage') }}>
                        <Text bold color="white">Manage My Profile</Text>
                    </Button>
                    <Text>{"\n"}</Text>
                </Center>
            </VStack>
        </NativeBaseProvider>
    )

}

export default showUnerifiedHome