import React, { useState } from 'react'
import { auth } from '../../firebase'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Box, Button, FormControl, Input } from "native-base"
import { useNavigation } from '@react-navigation/core'
import firebase from 'firebase';
import { writeDocumentToCollection } from '../../Javascript/firestore';
import viewSchedule from './viewSchedule';


export function ShiftScheduleOptions() {

    const navigation = useNavigation();
    // const navigation = useNavigation();
    // const user = auth.currentUser;

    // const { control, handleSubmit, reset, formState: { errors } } = useForm({
    //     defaultValues: {
    //         "uid": "",
    //         "date": "",
    //         "start_datetime": "",
    //         "end_datetime": ""
    //     }
    // });

    // // START Firestore FUNCTION 
    // const saveFormData = data => {
    //     //date format for inputs is : Date().toISOString();
    //     // need to use react native datepicker: "expo install @react-native-community/datetimepicker"
    //     var formDataJSON = {
    //         "uid": "",
    //         "date": "",
    //         "start_time": "",
    //         "end_time": ""
    //     }

    //     try {
    //         //add doc to firebase collection WorkshiftSchedules('Users', 'CovidStatus', user.uid ,null, formDataJSON);
    //         //DEV TEST getCovidDataForUserLastSevenDays(user.uid);
    //     }
    //     catch {
    //         (err) => {
    //             console.log(err)
    //         }
    //     } 
    //     reset(); //reset form
    //     //refresh/reset page similar to contact data form 
    //     // alert/toast to indicate the shift is added to the schedule 
    // }
    // // END FUNCTION 

    const submitNewShift = () => {

        const shift_date = new Date('2022-03-01');
        const shift_start_time = new Date('2022-02-16T09:00:00Z');
        const shift_end_time = new Date('2022-03-01T16:00:00Z');
        const worker_uid = 's5CaeMidYmhsQHZs4SP55KhIF453';
        const documentData = {
        "uid": worker_uid,
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
            </Center>
        </NativeBaseProvider>
    )

}

export default shiftManageScreen