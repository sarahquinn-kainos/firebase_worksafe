import React from 'react'
import { auth } from '../firebase'
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native'
import { NativeBaseProvider, Button, Text } from "native-base";

const adminDashboard = () => {

    const navigation = useNavigation();
    const user = auth.currentUser;
    if (user) {
        // current user's account vlaues 
        const email = user.email
        const displayName = user.displayName

        return (
                <NativeBaseProvider>
                    <Text>TEST</Text>
                    <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    </Button>
                </NativeBaseProvider>
        )
    }

}

export default adminDashboard
