import { getSingleDocByDocId } from '../Javascript/firestore';
import React, { useState } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Box, Button, FormControl, Input, HStack } from "native-base"
import { useNavigation } from '@react-navigation/core'
import { writeDocumentToCollection } from '../Javascript/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dateTimePicker from './datePicker';
import userSelection from './userSelection';
import { getDataFromAsyncByLabel, getSelectedUsersFromAsync } from '../Javascript/asyncStorageFunctions';
import timePicker from './timePicker';


function shiftFormScreen(id) {
    const [docData, setDocData] = useState({})
    const [currentDocData, setCurrentDocData] = useState({})
    const [docID, setDocID] = useState('')
    const [header, setheader] = useState('')


    // useEffect(async () => {
    //     try {
    //         await getSingleDocByDocId('WorkshiftSchedules', docID).then((data) => {
    //             setCurrentDocData(data)
    //         })
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }, [docID]);

    // useEffect(async () => {
    //     if (docID != '') {
    //         try {
    //             //generate a new ID for a new shift with null param
    //             writeDocumentToCollection('WorkshiftSchedules', null, documentData);
    //         }
    //         catch {
    //             (err) => {
    //                 console.log(err)
    //             }
    //         }
    //     } else {
    //         try {
    //             //update existing shift with ID
    //             writeDocumentToCollection('WorkshiftSchedules', docID, documentData);
    //         }
    //         catch {
    //             (err) => {
    //                 console.log(err)
    //             }
    //         }
    //     }
    // }, [docData]);


    async function submitShift() {
        var shift_date;
        var shift_start_time;
        var shift_end_time;
        var worker_uids;
        var documentData;
        await getSelectedUsersFromAsync().then((response) => {
            console.log('users: ')
            console.log(response)
            worker_uids = response
        })
        await getDataFromAsyncByLabel('shift_date').then((response) => {
            console.log('shift_date: ')
            console.log(response)
            shift_date = response
        })
        await getDataFromAsyncByLabel('shift_start_time').then((response) => {
            console.log('shift_start_time: ')
            console.log(response)
            shift_start_time = response
        })
        await getDataFromAsyncByLabel('shift_end_time').then((response) => {
            console.log('shift_end_time: ')
            console.log(response)
            shift_end_time = response
        })
        if (shift_date && shift_end_time && shift_start_time && worker_uids) {
            documentData = {
                "staff": worker_uids,
                "date": shift_date,
                "start_datetime": shift_start_time,
                "end_datetime": shift_end_time
            }
            console.log(documentData)
            setDocData(documentData)
        }
        return documentData
    }

    const ShiftEntryForm = () => {

        return (
            <VStack space={4} alignItems="center">
                <Center flex={1} px="3">
                    <Heading>{header ? header : null}</Heading>
                    <Text>{"\n"}</Text>
                    <VStack>
                        {dateTimePicker('shift_date')}
                    </VStack>
                    <Text>{"\n"}</Text>
                    <HStack>
                        <Text pt={2}>Start  </Text>
                        {timePicker('shift_start_time')}
                    </HStack>
                    <Text>{"\n"}</Text>
                    <HStack>
                        <Text pt={2}>End  </Text>
                        {timePicker('shift_end_time')}
                    </HStack>
                    <Text>{"\n"}</Text>
                    {userSelection()}
                    <Text>{"\n"}</Text>
                    <Button onPress={submitShift}>Submit</Button>
                </Center>
            </VStack>
        )
    }


    // if (id == undefined) {
    //     setheader('Create a Shift')
    // } else {
    //     setDocID(id)
    //     setheader('Edit a Shift')
    // }



    return (
        <>
            <ShiftEntryForm />
        </>
    )

}

export default shiftFormScreen