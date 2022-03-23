import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { getShiftDataBetweenDatesForUser } from '../Javascript/firestore';
import { auth } from '../firebase';
import { Center, Text, VStack, HStack, Spinner, Box, Circle, Divider, Heading } from 'native-base';
import displaySingleWorkshiftCard from './singleWorkshiftCard';

function userScheduleSummary() {
    const isAdmin = true;
    const [currentInfo, setcurrentInfo] = useState("");
    const [nextShiftData, setNextShiftData] = useState();
    const [summaryData, setSummaryData] = useState({});
    const [fetched, setFetched] = useState(false)
    const navigator = useNavigation();
    const isFocused = useIsFocused(); //when we navigate back or see this page after submitting a shift 
    //use this const to trigger a refresh of the data

    const current_uid = auth.currentUser.uid;


    async function getParams() {
        //params for firestore query - shift data for user
        var today = new Date()//.toISOString();
        var end = new Date();
        end.setDate(end.getDate() + 7);

        today.setUTCHours(0, 0, 0, 0); //start of today
        end.setUTCHours(23, 59, 59, 999); // end of 7th day
        return [today, end]
    }

    async function getCurrentInfo() {
        var [start, end] = await getParams()
        console.log(start)
        console.log(end)

        //get workshift data to display in summary 
        var data = await getShiftDataBetweenDatesForUser(start, end, current_uid).then((response) => {
            return response
        })
        console.log(data);
        return data;
    }

    useEffect(async () => {
        await getCurrentInfo().then((data) => {
            setcurrentInfo(data)
            setFetched(true)
            var hoursThisWeek = 0;
            var shiftsThisWeek = 0;
            data.forEach((doc) => {
                shiftsThisWeek += 1; // add to shift counter
                var start = doc.start_datetime.toDate()
                var end = doc.end_datetime.toDate()
                var hours = Math.abs(end - start) / 36e5; // find difference in hours between dates
                hoursThisWeek += hours; // add to total weekly hours counter
            })
            setSummaryData({
                hours: hoursThisWeek,
                shifts: shiftsThisWeek
            })
            setNextShiftData(data[0])
        })
    }, [isFocused]);

    if (isAdmin) {
        //console.log(currentInfo)
        return (
            <>
            <Heading color="primary.800" pb={5}>My Week</Heading>
                {summaryData ?
                    <VStack>
                        <HStack>
                            <VStack px={5}>
                                <Text italic>Hours</Text>
                                <Circle size="40px" bg="primary.400" px={4} py={2}>
                                    <Box _text={{
                                        fontWeight: "bold",
                                        fontSize: "lg",
                                        color: "white"
                                    }}>
                                        {summaryData.hours}
                                    </Box>
                                </Circle>
                            </VStack>
                            <VStack px={5}>
                                <Text italic>Shifts</Text>
                                <Circle size="40px" bg="primary.400" px={4} py={2}>
                                    <Box _text={{
                                        fontWeight: "bold",
                                        fontSize: "lg",
                                        color: "white"
                                    }}>
                                        {summaryData.shifts}
                                    </Box>
                                </Circle>
                            </VStack>
                        </HStack>
                    </VStack>
                    : <Spinner />}
                <Divider mt={5}/>
                <Center mt={5}>
                    <Text bold  color="primary.800">Next Scheduled Shift</Text>
                    <Box mt={-80}>
                        {nextShiftData ?
                            displaySingleWorkshiftCard(nextShiftData)
                            :
                            <Spinner />}
                    </Box>
                </Center>
            </>
        );
    }

}


export default userScheduleSummary;