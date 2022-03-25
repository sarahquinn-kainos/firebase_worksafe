import { Card, Center, Text, VStack, HStack, Button, Input, Modal, FormControl, TextArea } from 'native-base';
import { getAdminUids, getShiftDataBetweenDatesForUser, getSingleDocByDocId, writeDocumentToCollection } from '../Javascript/firestore';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { auth } from '../firebase';


function workshiftCardsUserView() {

    const user = auth.currentUser
    const user_id = user.uid
    const user_display_name = user.displayName
    const [currentInfo, setcurrentInfo] = useState("");
    const [fetched, setFetched] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedShift, setSelectedShift] = useState()
    const [reqMessage, setReqMessage] = useState('')
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

    function requestScheduleChange(shift_start) {
        setSelectedShift(shift_start);
        setShowModal(true);
    }

    async function submitRequest() {
        try {
            var admins = await getAdminUids().then(response => {
                return response
            })
            var email_content = {
                toUids: admins,
                template: {
                    name: 'shiftChangeRequest',
                    data: {
                        worker_name: user_display_name,
                        shift_date: selectedShift,
                        message_data: reqMessage
                    }
                }
            }
            writeDocumentToCollection('mail', null, email_content).then((response)=>{
                console.log(response)
                alert('Request Submitted.')
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    const ChangeModal = () => {
        const setValue = e =>{
            setReqMessage(e.currentTarget.value)
        }
        return (
            <Center>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Request Shift Change?</Modal.Header>
                        <Modal.Body>
                            <FormControl>
                            <TextArea value={reqMessage} onChange={setValue}/>
                                {/* <Input
                                w="100%"
                                placeholder="Optional Message"
                                //value = {reqMessage}
                                onChangeText={text => setReqMessage(text)}
                                >
                            </Input> */}
                                {/* <TextInput
                                    style={{ height: 40 }}
                                    placeholder="Type here to translate!"
                                    onChangeText={newText => setText(newText)}
                                    defaultValue={text}
                                /> */}
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>
                                    Cancel
                                </Button>
                                <Button onPress={() => {
                                    setShowModal(false);
                                    submitRequest();
                                }}>
                                    Submit Request
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Center>
        )
    }

    return (
        <Center>
            {ChangeModal()}
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
                                            <Button onPress={() => { requestScheduleChange((date + " @ " + startTime)) }}>Request Change</Button>
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