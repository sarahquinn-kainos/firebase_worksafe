import { auth } from '../firebase'
import { Card, Center, NativeBaseProvider, Text, VStack, HStack } from 'native-base';
import { getShiftDataBetweenDates } from '../Javascript/firestore';
import { useState, useEffect } from 'react';


function workshiftCardsAdminView() {

    const isAdmin = true;
    const [currentShiftDoc, setShiftContactDoc] = useState({});
    const [currentInfoArr, setCurrentInfoArr] = useState("");
    const user = auth.currentUser;
    const start = new Date('2022-02-15T00:00:00Z');
    const end = new Date('2022-03-28T23:59:00Z');

    function getCurrentInfo() {
        getShiftDataBetweenDates(start, end).then(data => {
            console.log(data)
            setShiftContactDoc(data)
            setCurrentInfoArr((data));
        })
    }

    useEffect(() => {
        getCurrentInfo();
    }, []);

    if (isAdmin) {
        return (
            <NativeBaseProvider>
                <Center>
                    <VStack mt="4">

                        {currentInfoArr ?
                            currentInfoArr.map((d, index) => {
                                var date = d.date.toDate().toLocaleDateString();
                                var startTime = d.start_datetime.toDate().toLocaleTimeString('en-gb')
                                var endTime = d.end_datetime.toDate().toLocaleTimeString('en-gb')
                                var staff = d.uid
                                return (
                                    <Card id={index} style={{width:300}}>
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
                                                <HStack pt="1">
                                                    <Text >Staff:  </Text>
                                                    <Text> {staff}</Text>
                                                </HStack>
                                            </VStack>
                                        </Center>
                                    </Card>
                                )
                            }) : null}
                            <Text>{"\n"}</Text>
                            <Text>{"\n"}</Text>
                    </VStack>
                </Center>
            </NativeBaseProvider>
        );
    }
}


export default workshiftCardsAdminView;