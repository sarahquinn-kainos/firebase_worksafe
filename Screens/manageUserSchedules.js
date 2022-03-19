import React, { useState, useEffect } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Select, CheckIcon, Button, FormControl, Input } from "native-base"
import { useNavigation } from '@react-navigation/core'
import { getDataFromAsyncByLabel } from '../Javascript/asyncStorageFunctions';
import dateTimePicker from '../components/datePicker';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


function manageUserSchedule() {
    const navigation = useNavigation();
    const isFocused = useIsFocused
    useEffect(async () => {
        AsyncStorage.clear();
    }, [isFocused]);

    // Options to View or Create a shift (View screen will allow edit option)
    const Options = () => {

        return (
            <VStack space={4} alignItems="center">
                <Heading textAlign="center" mb="10">
                    Manage Schedule
                </Heading>
                <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                    <Button variant="ghost" onPress={() => { navigation.navigate('Select Shifts') }}><Text bold color="white">View My Schedule</Text></Button>
                </Center>
            </VStack>
        )
    }

    

    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <Options />
            </Center>
        </NativeBaseProvider>
    )
}




export default manageUserSchedule