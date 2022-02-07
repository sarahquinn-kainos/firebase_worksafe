import React from 'react'
import { auth } from '../firebase'
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native'
import { NativeBaseProvider, Button, Text, Center } from "native-base";
import accountManageScreen from './accountManage';
import covidCheckPointModal from './covidCheckpointModal';
import { createDrawerNavigator, DrawerContentScrollView, } from "@react-navigation/drawer";
import screenWithDrawerNav from '../components/drawerNav';

//const Drawer = createDrawerNavigator();

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

const adminDashboard = () => {

    const user = auth.currentUser;
    if (user) {

        return (
            <NativeBaseProvider>
                {/* this function creates the screen we have defined above with a drawer navigation. */}
                {screenWithDrawerNav(adminHome, true)}
            </NativeBaseProvider>
        )
    }

}

export default adminDashboard
