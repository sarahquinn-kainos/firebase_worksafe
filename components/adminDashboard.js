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
                var staff_count = count;
                setSummaryData({
                    hours: hoursThisWeek,
                    shifts: shiftsThisWeek,
                    staff: staff_count
                })
                setNextShiftData(data[0])
            })
        })
    }, [isFocused]);

    //console.log(currentInfo)
    return (
        <>
            <Heading color="primary.800" pb={5}>This Week</Heading>
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
                        <VStack px={5}>
                            <Center>
                                <Text italic >Total Staff</Text>
                                <Circle size="40px" bg="primary.400" px={4} py={2}>
                                    <Box _text={{
                                        fontWeight: "bold",
                                        fontSize: "lg",
                                        color: "white"
                                    }}>
                                        {summaryData.staff}
                                    </Box>
                                </Circle>
                            </Center>
                        </VStack>
                    </HStack>
                </VStack>
                : <Spinner />}
            <Divider mt={5} />
            <VStack space={4} alignItems="center">
                <Center mt={5}>
                    <Heading bold color="primary.800">My Reports</Heading>
                </Center>
                <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                    <Button variant="ghost" ><Text bold color="white">My Staff</Text></Button>
                </Center>
                <Center w="64" h="12" bg="teal.500" rounded="md" shadow={3}>
                    <Button variant="ghost" ><Text bold color="white">COVID-19 - Staff Affected</Text></Button>
                </Center>
                <Center w="64" h="12" bg="teal.600" rounded="md" shadow={3}>
                    <Button variant="ghost" ><Text bold color="white">COVID-19 - Guidelines</Text></Button>
                </Center>
            </VStack>
        </>
    );
}



export default adminSummary;