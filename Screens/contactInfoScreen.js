import React, { useState, useEffect, useRef } from 'react'
import { VStack, HStack, Center, NativeBaseProvider, Text, Box, Button, FormControl, Input, Card } from "native-base"
import { addSubCollectionToExistingDocumentById } from '../Javascript/firestore'
import { auth } from '../firebase'
import { useForm } from "react-hook-form";

const EditContactInfoForm = () => {

    const [isSubmitted, setIsSubmitted] = useState('') // initiate state variables at this level
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (isSubmitted == 'success') {
            alert("Contact Details successfully updated");
            setIsSubmitted('')
        }
        else if (isSubmitted == 'fail') {
            alert("There was an error submitting  your form. Contact Details could not be updated");
        }
        setFormData({});
    }, [isSubmitted])

    const saveFormData = () => {

        const user = auth.currentUser;

        var formDataJSON = {
            "personal_phone": formData.userPrimaryPhone,
            "emergencyContacts": {
                "contactInfo": {
                    "full_name": formData.emergencyContact1Name,
                    "phone": formData.emergencyContact1Phone,
                    "relationship": formData.emergencyContact1Relationship
                }
            }
        }
        try {
            addSubCollectionToExistingDocumentById('Users', 'ContactInfo', user.uid, formDataJSON);
            setIsSubmitted('success');
        }
        catch {
            (err) => {
                setIsSubmitted('fail');
                console.log(err)
            }
        }
        console.log(isSubmitted)
    }

    //input form
    return (
        //Input fields &  Buttons
        <Center flex={1} >
            <FormControl>
                <VStack margin={"10"}>
                    <br />
                    <Center><Text bold color={"black"}>Personal Contact Information</Text></Center>
                    <br />
                    <Input bgColor={"white"}
                        placeholder="Phone Number"
                        onChangeText={(value) => setFormData({ ...formData, userPrimaryPhone: value })}>
                    </Input>
                    <br />
                    <Center><Text bold color={"black"}>Primary Emergency Contact Information</Text></Center>
                    <br />
                    <Input bgColor={"white"}
                        placeholder="Full Name"
                        onChangeText={(value) => setFormData({ ...formData, emergencyContact1Name: value })}>
                    </Input>
                    <br />
                    <Input bgColor={"white"}
                        placeholder="Relationship"
                        onChangeText={(value) => setFormData({ ...formData, emergencyContact1Relationship: value })}>
                    </Input>
                    <br />
                    <Input bgColor={"white"}
                        placeholder="Phone Number"
                        onChangeText={(value) => setFormData({ ...formData, emergencyContact1Phone: value })}
                        secureTextEntry>
                    </Input>
                    <br />
                    <HStack>
                    </HStack>
                </VStack>
            </FormControl>
            <br></br>
            <Center>
                <Button onPress={saveFormData}>
                    <Text bold color={"white"}>Save</Text>
                </Button>
            </Center>
        </Center>
    )

}

const userContactInfoScreen = () => {


    const [formData, setData] = useState({});

    return (
        <NativeBaseProvider>
            <EditContactInfoForm />
        </NativeBaseProvider>
    )

}

export default userContactInfoScreen