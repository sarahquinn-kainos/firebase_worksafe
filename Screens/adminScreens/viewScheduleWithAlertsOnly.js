import React from 'react'
import { auth } from '../../firebase';
import { NativeBaseProvider, Button, Text, Center } from "native-base";
import screenWithDrawerNav from '../../components/drawerNav';
import workshiftCardsAdminView from '../../components/workshiftCards';

const ViewScheduleAlertsHome = () => {
    return (
    <Center>
       {workshiftCardsAdminView(true)}
    </Center>
    )
}

const viewScheduleAlerts = () => {

    const user = auth.currentUser;
    if (user) {

        return (
            <NativeBaseProvider>
                {/* this function creates the screen we have defined above with a drawer navigation. */}
                <ViewScheduleAlertsHome/>
            </NativeBaseProvider>
        )
    }

}

export default viewScheduleAlerts
