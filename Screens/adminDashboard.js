import React from 'react'
import { auth } from '../firebase'
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native'
import { NativeBaseProvider, Button, Text, Center } from "native-base";

const adminDashboard = () => {

    const navigation = useNavigation();
    const user = auth.currentUser;
    if (user) {
        // current user's account vlaues 
        const email = user.email
        const displayName = user.displayName

        return (
            <NativeBaseProvider>
                <Center>
                    <Text>{displayName}</Text>
                    <Text>{email}</Text>
                </Center>
            </NativeBaseProvider>
        )
    }

}

export default adminDashboard
