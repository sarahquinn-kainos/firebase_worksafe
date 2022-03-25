import React, { useState, useEffect } from 'react'
import { Modal, VStack, HStack, Center, NativeBaseProvider, Text, Button, Flex, Spacer } from "native-base"
import { getUsersCollection, getUserSubCollectionDocById } from '../../Javascript/firestore';


function viewStaffDetails() {
    const [usersArr, setUsersArray] = useState("");
    const [currentContactDoc, setCurrentContactDoc] = useState({});
    const [showModal, setShowModal] = useState(false);

    function getUserInfo() {
        getUsersCollection().then(data => {
            console.log(data)
            setUsersArray(data);
        })
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    const showDetails = (uid) => {
        try {
            getUserSubCollectionDocById('ContactInfo', uid).then(data => {
                setCurrentContactDoc(data)
                setShowModal(true)
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    const DetailsModal = () => {
        return (
            <Center>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Contact Details</Modal.Header>
                        <Modal.Body>
                            {currentContactDoc ?
                                <Center>
                                    <VStack mt="4">
                                        <Text fontSize="lg" bold>Personal Contact Information</Text>
                                        <HStack>
                                            <Text>Phone Number:  </Text>
                                            <Text>{currentContactDoc?.personal_phone ?
                                                currentContactDoc.personal_phone :
                                                null}</Text>
                                        </HStack>
                                        <Text>{"\n"}</Text>
                                        <Text fontSize="lg" bold>Emergency Contact Information</Text>
                                        <VStack>
                                            <HStack pt="1">
                                                <Text >Name:  </Text>
                                                <Text>{currentContactDoc?.emergencyContacts?.contactInfo ?
                                                    currentContactDoc.emergencyContacts.contactInfo.full_name :
                                                    null}</Text>
                                            </HStack>
                                        </VStack>
                                        <VStack>
                                            <HStack pt="1">
                                                <Text >Relationship:  </Text>
                                                <Text>{currentContactDoc?.emergencyContacts?.contactInfo ?
                                                    currentContactDoc.emergencyContacts.contactInfo.relationship :
                                                    null}</Text>
                                            </HStack>
                                        </VStack>
                                        <VStack>
                                            <HStack pt="1">
                                                <Text >Phone Number:  </Text>
                                                <Text>{currentContactDoc?.emergencyContacts?.contactInfo ?
                                                    currentContactDoc.emergencyContacts.contactInfo.phone :
                                                    null}</Text>
                                            </HStack>
                                        </VStack>
                                    </VStack>
                                </Center>
                                : <Center>
                                    <VStack>
                                        <Text>This user has not entered any contact information.</Text>
                                    </VStack>
                                </Center>
                            }

                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </Center>
        )
    }






    // Options to View or Create a shift (View screen will allow edit option)
    const Selection = () => {
        return (
            <>
                <Flex flexWrap={'wrap'}>
                    {usersArr ?
                        usersArr.map((d, index) => {
                            var uid = d.id;
                            var full_name = d.first_name + " " + d.surname;
                            return (
                                <>
                                    <Button w={300} variant={'outline'} onPress={() => { showDetails(uid) }}>
                                        <Text>{full_name}</Text>
                                    </Button>
                                    <Text>{"\n"}</Text>
                                </>
                            )
                        }) : null}
                </Flex>
            </>
        );
    }

    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <Selection />
                <DetailsModal />
            </Center>
        </NativeBaseProvider>
    )
}




export default viewStaffDetails





