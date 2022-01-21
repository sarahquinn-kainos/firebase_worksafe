import React, { useState } from 'react'
import { auth } from '../firebase'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Box, Button, FormControl, Input } from "native-base"
import { useNavigation } from '@react-navigation/core'
import firebase from 'firebase';

export function AccountOptions() {
    const navigation = useNavigation();
    return (
        <VStack space={4} alignItems="center">
            <Heading textAlign="center" mb="10">
                My Account
            </Heading>
            <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                <Button variant="ghost" onPress={() => { navigation.navigate('Home') }}><Text bold color="white">Update My Email</Text></Button>
            </Center>
            <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                {/* <Button variant="ghost" onPress={() => {navigation.navigate('Home')}}><Text bold color="white">My Contact Information</Text></Button> */}
                <NewPasswordModal />
            </Center>
            <Center w="64" h="12" bg="primary.500" rounded="md" shadow={3}>
                <Button variant="ghost" onPress={() => { navigation.navigate('UserContactInfo') }}><Text bold color="white">My Contact Info</Text></Button>
            </Center>
        </VStack>
    )
}


export function NewPasswordModal() {

    //modal starts as closed
    const [showModal, setShowModal] = useState(false)
    //input for passwords
    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')

     // reauthenticate before we allow user to change credentials 
    const verifyCurrentPassword = () => {
        const currentPass = window.prompt('Please enter current password');
        if (currentPass){
        const emailCred = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, currentPass);
        auth.currentUser.reauthenticateWithCredential(emailCred)
            .then(() => {
                //alert("success") //DEBUG
                setShowModal(true);
                //if verified successfully - open modal to enter new pw
            })
            .catch(err => {
                alert(err)
                console.log(err)
            });
        }
    }

    const updatePassword = () => {
        setShowModal(false)
        if (pass1 == pass2) { // passwords entered match?
            auth.currentUser.updatePassword(pass1).then(()=>{
                alert("Your password has been updated.")
                //reset input fields and close the modal window 
                setPass1('');
                setPass2('');
                setShowModal(false);
            }).catch((err)=>{alert(err)})  //errors from firebase Auth - e.g. password doesn't meet requirements 
        }
        else {
            alert("Passwords do not match.")
        }
    }

    // Returns a button which will trigger an update passwords modal (only if password re-verification is passed)
    return (
        <>
            <Button variant="ghost" onPress={verifyCurrentPassword}><Text bold color="white">Change My Password</Text></Button>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Body>
                        <FormControl>
                            <Input type="password" placeholder="Enter Password"
                                value={pass1}
                                onChangeText={text => setPass1(text)} />
                        </FormControl>
                        <FormControl>
                            <Input type="password" placeholder="Re-enter password"
                                value={pass2}
                                onChangeText={text => setPass2(text)} />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>
                                Cancel
                            </Button>
                            <Button onPress={updatePassword}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )

}

const accountManageScreen = () => {
    const user = auth.currentUser;

    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <AccountOptions />
            </Center>
        </NativeBaseProvider>
    )

}

export default accountManageScreen