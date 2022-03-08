import React, { useState } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Box, Button, FormControl, Input } from "native-base"
import { useNavigation } from '@react-navigation/core'
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ScheduleManageOptions() {

    const navigation = useNavigation();

    return (
        <VStack space={4} alignItems="center">
            <Heading textAlign="center" mb="10">
                Manage Schedule 
            </Heading>
            <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                <Button variant="ghost" onPress={() => { navigation.navigate('Manage Shifts') }}><Text bold color="white">Create New Shift</Text></Button>
            </Center>
            <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                <Button variant="ghost" onPress={() => { navigation.navigate('View Schedule') }}><Text bold color="white">View Schedule</Text></Button>
            </Center>
        </VStack>
    )
}


const scheduleManageScreen = () => {
    AsyncStorage.clear();
    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <ScheduleManageOptions/>
            </Center>
        </NativeBaseProvider>
    )

}

export default scheduleManageScreen