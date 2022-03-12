import React, { useState, useEffect} from 'react'
import { auth } from '../firebase'
import { getSingleDocByDocId } from '../Javascript/firestore'
import { useNavigation } from '@react-navigation/core'
import { Text, Center, NativeBaseProvider, VStack, Button } from "native-base"
import screenWithDrawerNav from '../components/drawerNav'

const showVerifiedHomeScreenContent = () => {
    const [currentUserDoc, setCurrentUserDoc] = useState(null);
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const user = auth.currentUser;
    const navigation = useNavigation();

    if (!currentUserDoc) {
        getSingleDocByDocId('Users', user.uid).then(result => {
            console.log(result)
            setCurrentUserDoc(result);
            setEmail(result.email)
            setDisplayName(user.displayName)
        }
        );
    }

    //console.log(currentUserDoc)

    return (
        <NativeBaseProvider>

            <VStack space={4} alignItems="center">
                <Center mx="auto" w="80%" px="45" py="50" >
                    <Text>Hello {displayName}!</Text>
                    <Text>{"\n"}</Text>
                    <Text>Verified Email: {email}</Text>
                    <Text>{"\n"}</Text>
                    <Button minW={"100%"}
                        onPress={() => { navigation.navigate('AccountManage') }}>
                        <Text bold color="white">Manage My Profile</Text>
                    </Button>
                    <Button minW={"100%"}
                        onPress={() => { navigation.navigate('Manage User Schedule') }}>
                        <Text bold color="white">Manage My Schedule</Text>
                    </Button>
                    <Text>{"\n"}</Text>
                </Center>
            </VStack>
        </NativeBaseProvider>
    )

}

const showVerifiedHome = () => {
    return screenWithDrawerNav(showVerifiedHomeScreenContent)
}

export default showVerifiedHome