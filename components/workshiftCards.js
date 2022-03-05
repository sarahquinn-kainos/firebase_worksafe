import { auth } from '../firebase'
import { Card, Center, NativeBaseProvider, Text, VStack, HStack } from 'native-base';
import { getShiftDataBetweenDates, getUserDisplayName } from '../Javascript/firestore';
import { useState, useEffect } from 'react';


function workshiftCardsAdminView() {

    const isAdmin = true;
    //const [currentShiftDoc, setShiftDoc] = useState({});
    const [currentInfo, setcurrentInfo] = useState("");
    //const [staffNames, setStaffNames] = useState([]);

    // TEMP static values for testing and development
    const start = new Date('2022-02-15T00:00:00Z');
    const end = new Date('2022-03-28T23:59:00Z');

    function getCurrentInfo() {
        getShiftDataBetweenDates(start, end).then(data => {
            console.log(data)
            setcurrentInfo(data)
        })
    }

    //     useEffect(() => {
    //     async function getData(){
    //         await getShiftDataBetweenDates(start, end).then(data => {
    //             setcurrentInfo(data)
    //         })
    //     }
    //     getData().then(()=>{
    //         console.log(currentInfo)
    //     })
    // }, [currentInfo]);

    useEffect(() => {
        getCurrentInfo()
    }, []);



    if (isAdmin) {
        return (
            <Center>
                <VStack mt="4">

                    {currentInfo ?
                        currentInfo.map((d, index) => {
                            var date = d.date.toDate().toLocaleDateString();
                            var startTime = d.start_datetime.toDate().toLocaleTimeString('en-gb')
                            var endTime = d.end_datetime.toDate().toLocaleTimeString('en-gb')
                            var staff_array = d.staff;
                            console.log(staff_array)
                            var staff_string = staff_array.toString()

                            return (
                                <Card id={index} style={{ width: 300 }}>
                                    <Center>
                                        <VStack>
                                            <HStack pt="1">
                                                <Center><Text> {date}</Text></Center>
                                            </HStack>
                                            <HStack pt="1">
                                                <Text >Start:  </Text>
                                                <Text> {startTime}</Text>
                                            </HStack>
                                            <HStack pt="1">
                                                <Text >End:  </Text>
                                                <Text> {endTime}</Text>
                                            </HStack>
                                            <VStack pt="1">
                                                <Text >Staff:  </Text>
                                                {staff_array}
                                            </VStack>
                                        </VStack>
                                    </Center>
                                </Card>
                            )
                        }) : null}
                    <Text>{"\n"}</Text>
                    <Text>{"\n"}</Text>
                </VStack>
            </Center>
        );
    }
}


export default workshiftCardsAdminView;