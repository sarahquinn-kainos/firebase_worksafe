import { getSingleDocByDocId } from '../Javascript/firestore';
import React, { useState, useEffect } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Box, Button, FormControl, Input, HStack, ScrollView } from "native-base"
import { useNavigation } from '@react-navigation/core'
import { writeDocumentToCollection } from '../Javascript/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dateTimePicker from './datePicker';
import userSelection from './userSelection';
import { getDataFromAsyncByLabel, getSelectedUsersFromAsync } from '../Javascript/asyncStorageFunctions';
import timePicker from './timePicker';
import displaySingleWorkshiftCard from './singleWorkshiftCard';


function shiftFormScreen() {
    const [currentDocData, setCurrentDocData] = useState({})
    const [docID, setDocID] = useState('')
    const [header, setheader] = useState('')
    const navigator = useNavigation();

    useEffect(async () => {
        try {
            await AsyncStorage.getItem('current_shift_id').then((result) => {
                if (result == undefined) {
                    setheader('Create New Shift')
                } else {
                    setDocID(result)
                    setheader('Edit Shift')
                }

            })
        } catch (err) {
            console.log(err)
        }
    }, []);

    useEffect(async () => {
        if (docID) {
            try {
                await getSingleDocByDocId('WorkshiftSchedules', docID).then((data) => {
                    setCurrentDocData(data)
                })
            } catch (err) {
                console.log(err)
            }

        }
    }, [docID]);

    useEffect(async () => {
        console.log(currentDocData)
    }, [currentDocData]);

    const CurrentShift = () => {
        if (currentDocData
            && (Object.keys(currentDocData).length != 0
                || Object.getPrototypeOf(currentDocData) != Object.prototype)) {
            console.log(currentDocData)
            console.log('IF')
            return displaySingleWorkshiftCard(currentDocData)
        } else {
            return null
        }

    }

    async function submitShift() {
        try {
            await formatDocument().then((data) => {
                if (docID == '') {
                    try {
                        //generate a new ID for a new shift with null param
                        writeDocumentToCollection('WorkshiftSchedules', null, data);
                        alert("Shift Created")
                        navigator.navigate('Manage Schedule')
                    }
                    catch {
                        (err) => {
                            console.log(err)
                        }
                    }
                } else {
                    try {
                        //update existing shift with ID
                        writeDocumentToCollection('WorkshiftSchedules', docID, data);
                        alert("Shift Updated")
                        navigator.navigate('Manage Schedule')
                    }
                    catch {
                        (err) => {
                            console.log(err)
                        }
                    }
                }
            })
        } catch {
            (err) => {
                console.log(err)
            }
        }
    }


    async function formatDocument() {

        var shift_date;
        var shift_start_time;
        var shift_end_time;
        var worker_details;
        var worker_uids = [];
        var documentData;

        function convertTimeToShiftDateTime(value) {
            var timeValues = value.replace(/["']/g, "").split(":")
            var dateValue = new Date(shift_date);
            var hours = Number(timeValues[0])
            var mins = Number(timeValues[1])
            dateValue.setHours(hours)
            dateValue.setMinutes(mins)
            return dateValue
        }

        await getSelectedUsersFromAsync().then((response) => {
            console.log('users: ')
            console.log(response)
            worker_details = response
            response.forEach(user => {
                worker_uids.push(user.uid)
            });
        })
        await getDataFromAsyncByLabel('shift_date').then((response) => {
            console.log('shift_date: ')
            console.log(response)
            shift_date = response
        })
        await getDataFromAsyncByLabel('shift_start_time').then((response) => {
            console.log('shift_start_time: ')
            console.log(response)
            shift_start_time = convertTimeToShiftDateTime(response)
        })
        await getDataFromAsyncByLabel('shift_end_time').then((response) => {
            console.log('shift_end_time: ')
            console.log(response)
            shift_end_time = convertTimeToShiftDateTime(response)
        })
        if (shift_date && shift_end_time && shift_start_time && worker_details && worker_uids) {
            shift_date = new Date(shift_date)
            documentData = {
                "staff": worker_details,
                "staff_uids": worker_uids,
                "date": shift_date,
                "start_datetime": shift_start_time,
                "end_datetime": shift_end_time
            }
            console.log(documentData)
        }
        return documentData
    }

    const ShiftEntryForm = () => {

        return (
            <VStack space={4} alignItems="center" mt={40} mb={20}>
                <Center flex={1} px="3">
                    {currentDocData ? <CurrentShift />
                        : null}
                    <Text>{"\n"}</Text>
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



    return (
        <>
            <ScrollView>
                <ShiftEntryForm/>
            </ScrollView>
        </>
    )

}

export default shiftFormScreen