import React, { useState } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Box, Button, FormControl, Input } from "native-base"
import { useNavigation } from '@react-navigation/core'
import { writeDocumentToCollection } from '../../Javascript/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dateTimePicker from '../../components/datePicker';
import userSelection from '../../components/userSelection';
import { getSelectedUsersFromAsync } from '../../Javascript/asyncStorageFunctions';


export function ShiftScheduleOptions() {

    const navigation = useNavigation();

    
    
    const submitNewShift = () => {

        const shift_date = new Date('2022-03-01');
        const shift_start_time = new Date('2022-02-16T09:00:00Z');
        const shift_end_time = new Date('2022-03-01T16:00:00Z');
        const worker_uids = ['s5CaeMidYmhsQHZs4SP55KhIF453'];
        const documentData = {
        "staff": worker_uids,
        "date": shift_date,
        "start_datetime": shift_start_time,
        "end_datetime": shift_end_time
        }
        try {
            writeDocumentToCollection('WorkshiftSchedules', null, documentData);
            //DEV TEST getCovidDataForUserLastSevenDays(user.uid);
        }
        catch {
            (err) => {
                console.log(err)
            }
        } 
        //reset(); //reset form
        //navigation.navigate("Login")
    }

    // Update shift - faciliated by screen:
    // View Schedule (new screen to navigate to)
    //=====
    // Pull data for this week (monday start of week) based on current date (create some dummy shifts)
    // Make each a clickable card in a 7 column/row display ? (TBD)
    // Each element will link to the id of the shift document, 
    // and will in turn have a map with the full shift data available to display
    // this means we can use the ID to update the document when edited - the edit screen should just re-route to
    // the create shift screen - so make the form re-usable within the COMPONENT section


    return (
        <VStack space={4} alignItems="center">
            <Heading textAlign="center" mb="10">
                Create new Shift
            </Heading>
        </VStack>
    )
}

const shiftManageScreen = () => {

    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <ShiftScheduleOptions/>
                <Text>{"\n"}</Text>
                {dateTimePicker()}
                <Text>{"\n"}</Text>
                <Button onPress={getSelectedUsersFromAsync}>TEST</Button>
                <Text>{"\n"}</Text>
                {userSelection()}
            </Center>
        </NativeBaseProvider>
    )

}

export default shiftManageScreen