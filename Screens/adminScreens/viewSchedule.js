import React from 'react'
import { auth } from '../../firebase';
import { NativeBaseProvider, Button, Text, Center } from "native-base";
import screenWithDrawerNav from '../../components/drawerNav';
import workshiftCardsAdminView from '../../components/workshiftCards';

const ViewScheduleHome = () => {
    return (
    <Center>
        <Text>Test</Text>
       {workshiftCardsAdminView()}
    </Center>
    )
}

const viewSchedule = () => {

    const user = auth.currentUser;
    if (user) {

        return (
            <NativeBaseProvider>
                {/* this function creates the screen we have defined above with a drawer navigation. */}
                <ViewScheduleHome/>
            </NativeBaseProvider>
        )
    }

}

export default viewSchedule
