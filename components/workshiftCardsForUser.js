import { Card, Center, Text, VStack, HStack, Button } from 'native-base';
import { getShiftDataBetweenDatesForUser } from '../Javascript/firestore';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { auth } from '../firebase';


function workshiftCardsUserView() {

    const user = auth.currentUser
    const user_id = user.uid
    const [currentInfo, setcurrentInfo] = useState("");
    const [fetched, setFetched] = useState(false)
    const navigator = useNavigation();
    const isFocused = useIsFocused(); //when we navigate back or see this page after submitting a shift 
    //use this const to trigger a refresh of the data


    async function getParams() {
        // get the params passed into storage via the modal on prvious screen 
        var params = await AsyncStorage.getItem('show_shifts_params').then((result) => {
            console.log("result from async = " + result)
            if (result) {
                return JSON.parse(result)
            } else {
                return null
            }
        })
        if (params != null) {
            var start = new Date(params.query_date)
            var weekIncrement = Number(params.query_weeks);
            var end = new Date(params.query_date)
            end.setDate(end.getDate() + (weekIncrement * 7)) // add number of weeks to start date for end date
            return [start, end]
        } else {
            return [null, null]
        }
    }

    async function getCurrentInfo(start, end) {
        var data = await getShiftDataBetweenDatesForUser(start, end, user_id).then((result) => {
            return (result)
        })
        console.log("data: " + data)
        return data;
    }

    // const editShift = (id) => {
    //     console.log(id)
    //     AsyncStorage.setItem('current_shift_id', id)
    //     navigator.navigate('Manage Shifts')
    // }

    useEffect(async () => {
        
        var [start, end] = await getParams()
        console.log(start)
        console.log(end)
        if (start != null && end != null){
            await getCurrentInfo(start, end).then((data) => {
                setcurrentInfo(data)
                setFetched(true)
            })
        }
    }, [isFocused]);

    useEffect(async () => {
        if (currentInfo.length == 0 && fetched) {
            alert("No shifts exist for dates selected.")
            navigator.navigate('Manage Schedule')
        }
    }, [fetched]);




    console.log(currentInfo)
    return (
        <Center>
            <VStack mt="4">

                {currentInfo ?
                    currentInfo.map((d) => {
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
                                                {/* <Button small transparent onPress={() => {
                                                        editShift(shift_id)}
                                                        }>Request Change</Button> */}
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


export default workshiftCardsUserView;