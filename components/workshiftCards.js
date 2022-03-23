import { Card, Center, Text, VStack, HStack, Button, Spinner, WarningTwoIcon, Modal, Divider } from 'native-base';
import { getShiftDataBetweenDates } from '../Javascript/firestore';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


function workshiftCardsAdminView() {

    const isAdmin = true;
    const [currentInfo, setcurrentInfo] = useState("");
    const [fetched, setFetched] = useState(false)
    const [showAlerts, setShowAlerts] = useState(false);
    const [alertData, setAlertData] = useState([]);
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

        var [start, end] = await getParams()
        console.log(start)
        console.log(end)
        if (start != null && end != null) {
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

    const viewAlerts = (alerts) => {
        setAlertData(alerts);
        setShowAlerts(true);
    }

    const AlertModal = () => {
        console.log(alertData)
        return (
            <Center>
                <Modal isOpen={showAlerts} onClose={() => setShowAlerts(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Alerts</Modal.Header>
                        <Modal.Body>
                            <VStack>
                                {alertData ?
                                    alertData.map((alert, index) => {
                                        return (
                                            <VStack py={3}>

                                                <HStack pb={2}>
                                                    <WarningTwoIcon size="sm" />
                                                    <Text bold>   {alert.alert_level}</Text>
                                                </HStack>
                                                <Center>
                                                    <Text>{alert.alert_message}</Text>
                                                    <Divider />
                                                </Center>
                                            </VStack>
                                        )
                                    })
                                    : null}

                            </VStack>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </Center>
        )
    }





    if (isAdmin) {
        console.log(currentInfo)
        return (
            <Center>
                <VStack mt="4">
                    <AlertModal />
                    {currentInfo ?
                        currentInfo.map((d, index) => {
                            var alerts = new Array;
                            alerts = d.alerts;
                            var date = d.date.toDate().toLocaleDateString();
                            var startTime = d.start_datetime.toDate().toLocaleTimeString('en-gb')
                            var endTime = d.end_datetime.toDate().toLocaleTimeString('en-gb')
                            var staff_array = new Array;
                            staff_array = d.staff;
                            var shift_id = d.id
                            var card_colour = "black";
                            //if any alerts present on the current shift
                            if (alerts) {
                                //alerts for cards
                                var alert_high = alerts.find((alert) => {
                                    if (alert.alert_level == 'high') {
                                        return true;
                                    }
                                })
                                var alert_medium = alerts.find((alert) => {
                                    if (alert.alert_level == 'medium') {
                                        return true;
                                    }
                                })
                                var alert_low = alerts.find((alert) => {
                                    if (alert.alert_level == 'low') {
                                        return true;
                                    }
                                })
                                if (alert_high) {
                                    card_colour = "red.600"
                                } else {
                                    if (alert_medium) {
                                        card_colour = "warning.500"
                                    } else {
                                        if (alert_low) {
                                            card_colour = "yellow.500"
                                        }
                                    }
                                }
                            }


                            return (
                                <>
                                    <Card id={shift_id} style={{ width: 300 }}>
                                        <Center>
                                            {(card_colour != 'black') ?
                                                <>
                                                    <Button onPress={() => {
                                                        viewAlerts(alerts)
                                                    }} size="sm" variant="outline" colorScheme="secondary">
                                                        <HStack>
                                                            <WarningTwoIcon color={card_colour} />
                                                            <Text>View Alerts</Text>
                                                        </HStack>
                                                    </Button>
                                                    <Text>{"\n"}</Text></>
                                                :
                                                null}
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
                                                        editShift(shift_id)
                                                    }
                                                    }>Edit</Button>
                                                </VStack>
                                            </VStack>
                                        </Center>
                                    </Card>
                                    <Text>{"\n"}</Text>
                                    <Text>{"\n"}</Text>
                                </>
                            )
                        }) : <Spinner />}
                </VStack>
            </Center>
        );
    }
}


export default workshiftCardsAdminView;