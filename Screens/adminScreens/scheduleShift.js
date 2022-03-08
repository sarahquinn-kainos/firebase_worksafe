import React, { useState } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Box, Button, FormControl, Input } from "native-base"
import { useNavigation } from '@react-navigation/core'
import { writeDocumentToCollection } from '../../Javascript/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dateTimePicker from '../../components/datePicker';
import userSelection from '../../components/userSelection';
import { getDataFromAsyncByLabel, getSelectedUsersFromAsync } from '../../Javascript/asyncStorageFunctions';
import timePicker from '../../components/timePicker';
import shiftFormScreen from '../../components/shiftForm';


const ShiftInputForm = () => {

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
            {shiftFormScreen()}
        </VStack>
    )
}

const submitNewShift = () => {

    const shift_date = new Date('2022-03-03');
    const shift_start_time = new Date('2022-03-03T09:00:00Z');
    const shift_end_time = new Date('2022-03-03T16:00:00Z');
    const worker_uids = [
        {
            "uid": "RJYGSDIE8gW9mE6mA5PUrJ54x9H3",
            "display_name": "Bob Smith"
        },
        {
            "uid": "FiTihOWCAue4B0n2EAkpM4rJEpm2",
            "display_name": "Sarah Bing"
        }
    ];
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
}

const getTime = async () =>{
    await getDataFromAsyncByLabel('start_time').then((data) => {
        console.log(data)
    })

}

const shiftManageScreen = () => {
    //AsyncStorage.clear();
    return (
        <NativeBaseProvider>
           { <Center flex={1} px="3">
               <ShiftInputForm/>
            </Center>}
        </NativeBaseProvider>
    )

}

export default shiftManageScreen