import React, { useState, useEffect } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Select, CheckIcon, Button, FormControl, Input } from "native-base"
import { useNavigation } from '@react-navigation/core'
import { getDataFromAsyncByLabel } from '../../Javascript/asyncStorageFunctions';
import dateTimePicker from '../../components/datePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


function scheduleManageOptions() {
    const navigation = useNavigation();
    const isFocused = useIsFocused(); //when we navigate back or see this page after submitting a shift 
    //use this const to trigger a refresh of the data

    const [showStartDateModal, setShowStartDateModal] = useState(false)

    // Options to View or Create a shift (View screen will allow edit option)
    const Options = () => {

        return (
            <VStack space={4} alignItems="center">
                <Heading textAlign="center" mb="10">
                    Manage Schedule
                </Heading>
                <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                    <Button variant="ghost" onPress={() => { navigation.navigate('Manage Shifts') }}><Text bold color="white">Create New Shift</Text></Button>
                </Center>
                <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                    <Button variant="ghost" onPress={() => { setShowStartDateModal(true) }}><Text bold color="white">View Schedule</Text></Button>
                </Center>
            </VStack>
        )
    }

    //Modal to enter query params for pulling back workshift schedules 
    const SelectStartDateModal = () => {

        const [weeks, setWeeks] = useState('1')

        const showShifts = async () => {
            var viewFromDate;
            var request;
            await getDataFromAsyncByLabel('view_from_date').then((response) => {
                console.log(response)
                viewFromDate = response;
            })
            try {
                if (viewFromDate != null) {
                    request = {
                        "query_date": viewFromDate,
                        "query_weeks": weeks
                    }
                    console.log(request)
                    AsyncStorage.setItem('show_shifts_params', JSON.stringify(request))
                    navigation.navigate('View Schedule')

                } else {
                    alert("Please Select Values")
                }

            } catch (err) {
                console.log(err)
                alert("An error occured.")
                setShowStartDateModal(false)
            }
        }
        //modal starts as closed
        return (
            <>
                <Modal isOpen={showStartDateModal} onClose={() => setShowStartDateModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Body mt="10">
                            <Text>Number of weeks to show (default is 1):</Text>
                            <Select accessibilityLabel="# of weeks" placeholder="# of weeks" _selectedItem={{
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={value => setWeeks(value)}>
                                <Select.Item label="1" value="1" />
                                <Select.Item label="2" value="2" />
                                <Select.Item label="3" value="3" />
                                <Select.Item label="4" value="4" />
                            </Select>
                            <Text>From:</Text>
                            {dateTimePicker('view_from_date')}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onPress={() => {
                                setShowStartDateModal(false);
                                showShifts();
                            }}>
                                Search
                            </Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </>
        )
    }

    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <Options />
                <SelectStartDateModal />
            </Center>
        </NativeBaseProvider>
    )
}




export default scheduleManageOptions