import { auth } from '../firebase'
import { Card, Center, NativeBaseProvider, Text, VStack, HStack, Button } from 'native-base';
import { getShiftDataBetweenDates, getUserDisplayName } from '../Javascript/firestore';
import { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import shiftFormScreen from './shiftForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


function workshiftCardsAdminView() {

    const isAdmin = true;
    const [currentInfo, setcurrentInfo] = useState("");
    const navigator = useNavigation();
    const isFocused = useIsFocused(); //when we navigate back or see this page after submitting a shift 
                                      //use this const to trigger a refresh of the data

    // TEMP static values for testing and development
    const start = new Date('2022-02-15T00:00:00Z');
    const end = new Date('2022-03-28T23:59:00Z');

    async function getCurrentInfo() {
        var data = await getShiftDataBetweenDates(start, end).then((result) => {
            return (result)
        })
        return data;
    }

    const editShift = (id) => {
        console.log(id)
        AsyncStorage.setItem('current_shift_id', id)
        navigator.navigate('Manage Shifts')
        
    }

    useEffect(async () => {
        await getCurrentInfo().then((data) => {
            setcurrentInfo(data)
        })
    }, [isFocused]);

    if (isAdmin) {
        console.log(currentInfo)
        return (
            <Center>
                <VStack mt="4">

                    {currentInfo ?
                        currentInfo.map((d, index) => {
                            var date = d.date.toDate().toLocaleDateString();
                            var startTime = d.start_datetime.toDate().toLocaleTimeString('en-gb')
                            var endTime = d.end_datetime.toDate().toLocaleTimeString('en-gb')
                            var staff_array = new Array;
                            var shift_id = d.id
                            staff_array = d.staff;


                            return (
                                <>
                                    <Card id={shift_id} style={{ width: 300 }}>
                                        <Center>
                                            <VStack>
                                                <Center><Text> {date}</Text></Center>
                                                <HStack pt="1">
                                                    <Text bold>Start:  </Text>
                                                    <Text> {startTime}</Text>
                                                </HStack>
                                                <HStack pt="1">
                                                    <Text bold>End:  </Text>
                                                    <Text> {endTime}</Text>
                                                </HStack>
                                                <Text>{"\n"}</Text>
                                                <VStack pt="1">
                                                    <Center><Text bold underline>Staff</Text></Center>
                                                    <Text>{"\n"}</Text>
                                                    <VStack>
                                                        {
                                                            staff_array ?
                                                                staff_array.map((staff) => {
                                                                    return (
                                                                        <Text>
                                                                            {staff.display_name}
                                                                        </Text>
                                                                    )
                                                                }) :
                                                                null}
                                                    </VStack>
                                                    <Text>{"\n"}</Text>
                                                    <Button small transparent onPress={() => {
                                                        editShift(shift_id)}
                                                        }>Edit</Button>
                                                </VStack>
                                            </VStack>
                                        </Center>
                                    </Card>
                                    <Text>{"\n"}</Text>
                                    <Text>{"\n"}</Text>
                                </>
                            )
                        }) : null}
                </VStack>
            </Center>
        );
    }
}


export default workshiftCardsAdminView;