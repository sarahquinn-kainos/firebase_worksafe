import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { auth } from '../firebase';
import { Center, Text, VStack, HStack, Spinner, Box, Circle, Divider, Heading, Button } from 'native-base';
import displaySingleWorkshiftCard from './singleWorkshiftCard';
import { getShiftDataBetweenDates, getStaffCount } from '../Javascript/firestore';

function adminSummary() {
    //const isAdmin = true;
    const [currentInfo, setcurrentInfo] = useState("");
    const [nextShiftData, setNextShiftData] = useState();
    const [summaryData, setSummaryData] = useState({});
    const [staffCount, setStaffCount] = useState();
    const [fetched, setFetched] = useState(false)
    const navigator = useNavigation();
    const isFocused = useIsFocused(); //when we navigate back or see this page after submitting a shift 
    //use this const to trigger a refresh of the data


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

        //get workshift data to display in summary 
        var data = await getShiftDataBetweenDates(start, end).then((response) => {
            return response
        })
        return data;
    }

    useEffect(async () => {
        await getCurrentInfo().then(async (data) => {
            setcurrentInfo(data)
            setFetched(true)
            var hoursThisWeek = 0;
            var shiftsThisWeek = 0;
            data.forEach((doc) => {
                shiftsThisWeek += 1; // add to shift counter
                var start = doc.start_datetime.toDate()
                var end = doc.end_datetime.toDate()
                var staff_assigned = doc.staff_uids.length
                console.log(staff_assigned) // count staff on shift - multiply by hours of shift for total hours
                var hours = Math.abs(end - start) / 36e5; // find difference in hours between dates
                hoursThisWeek += (hours * staff_assigned); // add to total weekly hours counter
            })
            await getStaffCount().then((count) => {
                setStaffCount(count);
            })
            setSummaryData({
                hours: hoursThisWeek,
                shifts: shiftsThisWeek
            })
            setNextShiftData(data[0])
        })
    }, [isFocused]);

    //console.log(currentInfo)
    return (
        <>
            {staffCount ?
                <>
                    <Heading color="primary.800" pb={5}>Staff Count</Heading>
                    <VStack px={5}>
                        <Center>
                            <Circle size="40px" bg="primary.400" px={4} py={2}>
                                <Box _text={{
                                    fontWeight: "bold",
                                    fontSize: "lg",
                                    color: "white"
                                }}>
                                    {staffCount}
                                </Box>
                            </Circle>
                        </Center>
                    </VStack>
                </>
                : null}
            <Heading pt={5} color="primary.800" pb={5}>This Week</Heading>
            {summaryData ?
                <VStack>
                    <HStack>
                        <VStack px={5}>
                            <Center>
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
                            </Center>
                        </VStack>
                        <VStack px={5}>
                            <Center>
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
                            </Center>
                        </VStack>
                    </HStack>
                </VStack>
                : <Spinner />}
        </>
    );
}



export default adminSummary;