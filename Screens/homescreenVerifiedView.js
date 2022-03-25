import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { getSingleDocByDocId } from '../Javascript/firestore'
import { useNavigation } from '@react-navigation/core'
import { Text, Center, NativeBaseProvider, VStack, Button, Divider, HStack, Card, Image } from "native-base"
import screenWithDrawerNav from '../components/drawerNav'
import { isUserWorkingToday } from '../Javascript/firestore'
import { useIsFocused } from '@react-navigation/native';
import userScheduleSummary from '../components/dashboard'

const showVerifiedHomeScreenContent = () => {
    const [currentUserDoc, setCurrentUserDoc] = useState(null);
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const user = auth.currentUser;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    var logo = require("../media/logo.png")



    if (!currentUserDoc) {
        getSingleDocByDocId('Users', user.uid).then(result => {
            console.log(result)
            setCurrentUserDoc(result);
            setEmail(result.email)
            setDisplayName(user.displayName)
        }
        );
    }

    useEffect(async () => {
        await isUserWorkingToday().then(isWorking => {
            if (isWorking) {
                alert("You are scheduled to work today. \nPlease complete your checkpoint.")
                navigation.navigate("CovidCheckpoint")
            }
        });
    }, [isFocused]);



    return (
        <NativeBaseProvider>

            <VStack space={4} alignItems="center">
                <Center mx="auto" w="95%" px="45" py="30" >
                    {logo ?
                        <Image size={100} resizeMode={"contain"} borderRadius={100} source={logo} alt="WorkSafe" />
                        : null}
                    <Text>{"\n"}</Text>
                    <Text bold>Hello {displayName}!</Text>
                    <Text>{"\n"}</Text>
                    <Divider />
                    <Text>{"\n"}</Text>
                    <HStack>
                        <Text bold textAlign="center">Verified Email: </Text>
                        <Text>{email}</Text>
                    </HStack>
                    <Text>{"\n"}</Text>
                    <Button minW={"100%"}
                        onPress={() => { navigation.navigate('View Guidelines') }}>
                        <Text bold color="white">My Workplace Guidelines</Text>
                    </Button>
                    <Text>{"\n"}</Text>
                    <Button minW={"100%"}
                        onPress={() => { navigation.navigate('CovidCheckpoint') }}>
                        <Text bold color="white">Record COVID-19 Checkpoint</Text>
                    </Button>
                    <Text>{"\n"}</Text>
                    {userScheduleSummary()}
                    <Button minW={"100%"}
                        onPress={() => { navigation.navigate('Manage User Schedule') }}>
                        <Text bold color="white">My Schedule</Text>
                    </Button>
                </Center>
            </VStack>
        </NativeBaseProvider>
    )

}

const showVerifiedHome = () => {
    return screenWithDrawerNav(showVerifiedHomeScreenContent)
}

export default showVerifiedHome