import React from 'react'
import { auth } from '../firebase'
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native'
import { NativeBaseProvider, Button, Text, Center, VStack, HStack, Divider, Image } from "native-base";
import accountManageScreen from './accountManage';
import covidCheckPointModal from './covidCheckpointModal';
import { createDrawerNavigator, DrawerContentScrollView, } from "@react-navigation/drawer";
import screenWithDrawerNav from '../components/drawerNav';
import adminSummary from '../components/adminDashboard';

//const Drawer = createDrawerNavigator();

const adminHome = () => {
    // current user's account vlaues 
    const user = auth.currentUser;
    const email = user.email
    var logo = require("../media/logo.png")
    return (
        <VStack space={4} alignItems="center">
            <Center mx="auto" w="95%" px="45" py="30" >
                <Center>
                    {logo ?
                        <Image size={150} resizeMode={"contain"} borderRadius={100} source={logo} alt="WorkSafe" />
                        : null}
                </Center>
                <Text>{"\n"}</Text>
                <Text bold>ADMIN</Text>
                <Text>{"\n"}</Text>
                <Divider />
                <Text>{"\n"}</Text>
                <HStack>
                    <Text bold textAlign="center">Verified Email: </Text>
                    <Text>{email}</Text>
                </HStack>
                <Text>{"\n"}</Text>
                {/* <Button minW={"100%"}
                    onPress={() => { navigation.navigate('Manage User Schedule') }}>
                    <Text bold color="white">Manage My Schedule</Text>
                </Button> */}
                <Text>{"\n"}</Text>
                <Divider />
                <Text>{"\n"}</Text>
                {adminSummary()}

            </Center>
        </VStack>
    )

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
