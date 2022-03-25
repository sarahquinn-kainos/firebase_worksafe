import React, { useState, useEffect } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Card, Button, FormControl, TextArea, Input, Divider, CloseIcon, ScrollView } from "native-base"
import { useNavigation } from '@react-navigation/core'
import { getDataFromAsyncByLabel } from '../../Javascript/asyncStorageFunctions';
import dateTimePicker from '../../components/datePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { auth } from '../../firebase';
import { writeDocumentToCollection, getGuidelinesCollection, removeGuidelinePost } from '../../Javascript/firestore';


function manageGuidelines() {
    const isFocused = useIsFocused();
    const [showModal, setShowModal] = useState();
    const [showModal2, setShowModal2] = useState();
    const [docID, setDocID] = useState();
    const [currentData, setCurrentData] = useState([]);
    const user = auth.currentUser.uid;
    const [title, setTitle] = useState();
    const [details, setDetails] = useState();

    function getCurrentInfo() {
        getGuidelinesCollection().then(data => {
            console.log(data)
            setCurrentData(data);
        })
    }

    useEffect(() => {
        getCurrentInfo();
    }, [isFocused]);


    async function deleteItem() {
        await removeGuidelinePost(docID)
        //delete doc from collection
        alert('Item removed from Database.')
        setShowModal2(false);
        setCurrentData([])
        getCurrentInfo();
    }

    const CurrentPosts = () => {
        if (currentData.length > 0) {
            return (
                <>
                    {currentData ?
                        currentData.map((doc) => {
                            return (
                                <Card w={300} py={5}>
                                    <Button w={50} size={"xs"} onPress={() => {
                                        setDocID(doc.id);
                                        setShowModal2(true);
                                    }}>
                                        <Text>Delete</Text>
                                    </Button>
                                    <VStack>
                                        <Center>
                                            <Text fontSize="lg" bold>{doc.title}</Text>
                                            <Divider />
                                            <Text >{doc.message}</Text>
                                        </Center>
                                    </VStack>
                                </Card>
                            )
                        }) : null}
                </>
            )

        }
        else {
            return (<></>)
        }

    }

    function addItem() {
        //write doc to collection
        if (title && details) {
            var docData = {
                title: title,
                message: details,
                author: user
            }
            writeDocumentToCollection('guidelines', null, docData);
            alert('Item added to Database');
            setShowModal(false);
            setDetails('');
            setTitle('');
            getCurrentInfo();

        }


    }

    const addNewItemModal = () => {
        const setTitleValue = e => {
            setTitle(e.currentTarget.value)
        }
        const setDetailsValue = e => {
            setDetails(e.currentTarget.value)
        }
        return (
            <Center>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Add Post</Modal.Header>
                        <Modal.Body>
                            <FormControl>
                                <Text>Title</Text>
                                <Input value={title} onChange={setTitleValue} />
                                <Text>{"\n"}</Text>
                                <Text>Details</Text>
                                <TextArea value={details} onChange={setDetailsValue} />
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>
                                    Cancel
                                </Button>
                                <Button onPress={() => {
                                    setShowModal(false);
                                    addItem();
                                }}>
                                    Submit
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Center>
        )
    }

    const deleteItemModal = () => {
        return (
            <Center>
                <Modal isOpen={showModal2} onClose={() => setShowModal2(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Confirm Delete?</Modal.Header>
                        <Modal.Body>
                            <Text>Please press 'Confirm' to delete this post from the Guidelines Database.</Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal2(false) }}>
                                    Cancel
                                </Button>
                                <Button onPress={() => {
                                    setShowModal2(false);
                                    deleteItem();
                                }}>
                                    Confirm
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Center>
        )
    }




    return (
        <NativeBaseProvider>
            <Center pt={10}>
                <Button onPress={() => { setShowModal(true) }}>Create Post</Button>
            </Center>
            <ScrollView>
            {addNewItemModal()}
            {deleteItemModal()}
            
            <Text>{"\n\n"}</Text>
            <Center flex={1} px="3" pt={5}>
                {currentData ?
                    <CurrentPosts />
                    : null}
            </Center>
                
            </ScrollView>
            
        </NativeBaseProvider>
    )
}




export default manageGuidelines