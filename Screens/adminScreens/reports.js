import React, { useState, useEffect } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Select, CheckIcon, Button, FormControl, Input } from "native-base"
import { useNavigation } from '@react-navigation/core'
import { getDataFromAsyncByLabel } from '../../Javascript/asyncStorageFunctions';
import dateTimePicker from '../../components/datePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


function adminReports() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(async () => {
        AsyncStorage.clear();
    }, [isFocused]);

    // Options to View or Create a shift (View screen will allow edit option)
    const Options = () => {

        return (
            <VStack space={4} alignItems="center">
                <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                    <Button variant="ghost" onPress={()=>{navigation.navigate("View Staff Contact Details")}}><Text bold color="white">Staff Contact Details</Text></Button>
                </Center>
                {/* <Center w="64" h="12" bg="teal.500" rounded="md" shadow={3}>
                    <Button variant="ghost" ><Text bold color="white">COVID-19 - Staff Affected</Text></Button>
                </Center> */}
                {/* <Center w="64" h="12" bg="teal.600" rounded="md" shadow={3}>
                    <Button variant="ghost" ><Text bold color="white">COVID-19 - Guidelines</Text></Button>
                </Center> */}
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




export default adminReports





