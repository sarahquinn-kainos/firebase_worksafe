import React from 'react'
import { auth } from '../firebase';
import { NativeBaseProvider, Button, Text, Center } from "native-base";
import screenWithDrawerNav from '../components/drawerNav';
import workshiftCardsUserView from '../components/workshiftCardsForUser';

const ViewScheduleHome = () => {
    return (
    <Center>
       {workshiftCardsUserView()}
    </Center>
    )
}

const viewScheduleForuser = () => {

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

export default viewScheduleForuser
