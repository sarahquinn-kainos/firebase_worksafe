import React from 'react'
import { auth } from '../firebase'
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native'
import { NativeBaseProvider, Button, Text, Center } from "native-base";
import accountManageScreen from './accountManage';
import covidCheckPointModal from './covidCheckpointModal';
import { createDrawerNavigator, DrawerContentScrollView, } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

const adminHome = () => {
        // current user's account vlaues 
        const user = auth.currentUser;
        const email = user.email
        const displayName = user.displayName
    return (<Center>
        <Text>{displayName}</Text>
        <Text>{email}</Text>
    </Center>)

}


const DrawerNav = () => {
    return (
        <Drawer.Navigator >
            <Drawer.Screen name="Home" component={adminHome} />
            <Drawer.Screen name="Manage Account" component={accountManageScreen} />
            <Drawer.Screen name="COVID Checkpoint" component={covidCheckPointModal} />
        </Drawer.Navigator>
    );
}

const adminDashboard = () => {

    const navigation = useNavigation();
    const user = auth.currentUser;
    if (user) {
    



        return (
            <NativeBaseProvider>
                <DrawerNav />

            </NativeBaseProvider>
        )
    }

}

export default adminDashboard
