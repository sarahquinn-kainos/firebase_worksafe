import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase';
import { NativeBaseProvider, Button, Text, Select, Box, CheckIcon, Center, VStack, Divider, Heading } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core'
import dateTimePicker from '../../components/datePicker';
import { getDataFromAsyncByLabel } from '../../Javascript/asyncStorageFunctions';
import { getUserIsAdmin } from '../../Javascript/firestore';



const selectShifts = () => {
    const navigation = useNavigation();
    const uid = auth.currentUser.uid;
    const [weeks, setWeeks] = useState('1')
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(async () => {
        await getUserIsAdmin(uid).then((result) => {
            setIsAdmin(result)
            console.log(result)
        })
    }, []);

    const showShiftsThisWeek = async () => {
        // https://stackoverflow.com/questions/4156434/javascript-get-the-first-day-of-the-week-from-current-date
        var startOfWeek = new Date();
        var day = startOfWeek.getDay() || 7; // Get current day number, converting Sun. to 7
        if (day !== 1)                // Only manipulate the date if it isn't Mon.
            startOfWeek.setHours(-24 * (day - 1));   // Set the hours to day number minus 1
        //   multiplied by negative 24
        console.log(startOfWeek)
        var request;
        try {
            request = {
                "query_date": startOfWeek,
                "query_weeks": 1
            }
            console.log(request)
            AsyncStorage.setItem('show_shifts_params', JSON.stringify(request))
            if (isAdmin) { //Admin view of all shifts 
                navigation.navigate('View Schedule')
            } else { // standard user's view of their own shifts
                navigation.navigate('View User Schedule')
            }
        }
        catch (err) {
            console.log(err)
            alert("An error occured.")
        }
    }

    const showShifts = async () => {
        var viewFromDate;
        var request;
        await getDataFromAsyncByLabel('view_from_date').then((response) => {
            console.log(response)
            viewFromDate = response;
        })
        try {
            if (viewFromDate != null && weeks != null) {
                request = {
                    "query_date": viewFromDate,
                    "query_weeks": weeks
                }
                console.log(request)
                AsyncStorage.setItem('show_shifts_params', JSON.stringify(request))
                if (isAdmin) { //Admin view of all shifts 
                    navigation.navigate('View Schedule')
                } else { // standard user's view of their own shifts
                    navigation.navigate('View User Schedule')
                }
            } else {
                alert("Please Select Values")
            }

        } catch (err) {
            console.log(err)
            alert("An error occured.")
        }
    }

    // query params for pulling back workshift schedules 
    const SelectStartDate = () => {

        return (
            <VStack space={4} alignItems="center">
                <Box>
                    <Center>
                        <Heading>This Week</Heading>
                    </Center>
                    <Text>{"\n"}</Text>
                    <Button onPress={() => {
                        showShiftsThisWeek();
                    }}>
                        Go
                    </Button>
                    <Text>{"\n"}</Text>
                    <Divider />
                    <Text>{"\n"}</Text>
                    <Center>
                        <Heading>Search Dates</Heading>
                    </Center>
                    <Text>{"\n"}</Text>
                    <Text>Number of weeks to show (default is 1):</Text>
                    <Select accessibilityLabel="# of weeks" placeholder="# of weeks" defaultValue={weeks} _selectedItem={{
                        endIcon: <CheckIcon size="5" />
                    }} mt={1} onValueChange={value => setWeeks(value)}>
                        <Select.Item label="1" value="1" />
                        <Select.Item label="2" value="2" />
                        <Select.Item label="3" value="3" />
                        <Select.Item label="4" value="4" />
                    </Select>
                    <Text>{"\n"}</Text>
                    <Text>From:</Text>
                    <Center>
                        {dateTimePicker('view_from_date')}
                    </Center>
                    <Text>{"\n"}</Text>
                    <Button onPress={() => {
                        showShifts();
                    }}>
                        Go
                    </Button>
                </Box>
            </VStack>
        )
    }

    const user = auth.currentUser;
    if (user) {

        return (
            <NativeBaseProvider>
                <Center mx={3} flex={1}>
                    <SelectStartDate />
                </Center>
            </NativeBaseProvider>
        )
    }

}

export default selectShifts
