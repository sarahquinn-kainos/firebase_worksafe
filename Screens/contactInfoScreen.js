import React, { useState, useEffect } from 'react'
import { Flex, VStack, HStack, Center, NativeBaseProvider, Text, Button, FormControl, Input, Select, TextField, Card, Spacer } from "native-base"
import { addSubCollectionToExistingDocumentById, getUserSubCollectionDocById } from '../Javascript/firestore'
import { auth } from '../firebase'
import { useForm, Controller } from "react-hook-form";
import { isValidNumber } from 'react-native-phone-number-input';


const PageData = () => {
    const [currentContactDoc, setCurrentContactDoc] = useState({});
    const user = auth.currentUser;

    function getCurrentInfo() {
        getUserSubCollectionDocById('ContactInfo', user.uid).then(data => {
            console.log(data)
            setCurrentContactDoc(data)
        })
    }

    useEffect(() => {
        getCurrentInfo();
    }, []);

    const EditContactInfoForm = () => {
        //react-hook-form config --> for error handling 
        const { control, handleSubmit, reset, formState: { errors } } = useForm({
            defaultValues: {
                userPrimaryPhone: '',
                emergencyContact1Name: '',
                emergencyContact1Phone: '',
                emergencyContact1Relationship: '',
            }
        });

        const [isSubmitted, setIsSubmitted] = useState('') // initiate state variables at this level

        // alert message when form is submitted 
        useEffect(() => {
            if (isSubmitted == 'success') {
                alert("Contact Details successfully updated");
                setIsSubmitted('')
            }
            else if (isSubmitted == 'fail') {
                alert("There was an error submitting  your form. Contact Details could not be updated");
            }
            reset();
        }, [isSubmitted])

        // START Firestore FUNCTION 
        const saveFormData = data => {
            //const user = auth.currentUser;
            var formDataJSON = {
                "personal_phone": data.userPrimaryPhone,
                "emergencyContacts": {
                    "contactInfo": {
                        "full_name": data.emergencyContact1Name,
                        "phone": data.emergencyContact1Phone,
                        "relationship": data.emergencyContact1Relationship
                    }
                }
            }
            try {
                addSubCollectionToExistingDocumentById('Users', 'ContactInfo', user.uid, formDataJSON);
                setIsSubmitted('success');
                getCurrentInfo();
            }
            catch {
                (err) => {
                    setIsSubmitted('fail');
                    console.log(err)
                }
            }
            console.log(isSubmitted)
        }
        // END FUNCTION 


        //input form
        return (
            <Center>
                <FormControl>
                    <VStack margin={"10"}>
                        <br />
                        <Center><Text bold color={"black"}>Update Contact Information</Text></Center>
                        <br />
                        <FormControl.Label>Phone Number</FormControl.Label>
                        {/* User Phone */}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                validate: (value) => isValidNumber(value)
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="Phone Number"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="userPrimaryPhone"
                        />
                        {
                            errors.userPrimaryPhone?.type === 'validate' && <Text>Must be a valid UK Phone Number.</Text> ||
                            errors.userPrimaryPhone?.type === 'required' && <Text>Field is Required.</Text>
                        }
                        <FormControl.HelperText>Must include country code (e.g +4475123...)</FormControl.HelperText>

                        <br /><br />
                        <Center><Text bold color={"black"}>Primary Emergency Contact Information</Text></Center>
                        <br />
                        {/* Primary Contact Name */}
                        <Controller
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="Full Name"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="emergencyContact1Name"
                        />
                        {
                            errors.emergencyContact1Name?.type === 'required' && <Text>Field is Required.</Text>
                        }
                        <br />
                        {/* Primary Contact Relationship */}
                        <Controller
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="Relationship"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="emergencyContact1Relationship"
                        />
                        <FormControl.HelperText>Mother, Father, Sibling, Partner, etc.</FormControl.HelperText>
                        {
                            errors.emergencyContact1Relationship?.type === 'required' && <Text>Field is Required.</Text>
                        }
                        <br />
                        {/* Primary Contact Phone */}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                validate: (value) => isValidNumber(value)
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="Phone Number"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="emergencyContact1Phone"
                        />
                        {
                            errors.emergencyContact1Phone?.type === 'validate' && <Text>Must be a valid UK Phone Number.</Text> ||
                            errors.emergencyContact1Phone?.type === 'required' && <Text>Field is Required.</Text>
                        }
                        <br />
                        <HStack>
                        </HStack>
                    </VStack>
                </FormControl>
                <br></br>
                <Center>
                    <Button onPress={handleSubmit(saveFormData)}>
                        <Text bold color={"white"}>Save</Text>
                    </Button>
                </Center>
            </Center>
        )
    }

    const CurrentContactInfo = () => {

        const EmergencyContacts = () => {
            return (
                <VStack mt="4">
                    <Text bold>Emergency Contact Information</Text>
                    <VStack>
                        <HStack pt="1">
                            <Text >Phone Number:  </Text>
                            <Text>{currentContactDoc?.emergencyContacts?.contactInfo &&
                                currentContactDoc.emergencyContacts.contactInfo.full_name}</Text>
                        </HStack>
                    </VStack>
                    <VStack>
                        <HStack pt="1">
                            <Text >Relationship:  </Text>
                            <Text>{currentContactDoc?.emergencyContacts?.contactInfo &&
                                currentContactDoc.emergencyContacts.contactInfo.relationship}</Text>
                        </HStack>
                    </VStack>
                    <VStack>
                        <HStack pt="1">
                            <Text >Name:  </Text>
                            <Text>{currentContactDoc?.emergencyContacts?.contactInfo &&
                                currentContactDoc.emergencyContacts.contactInfo.phone}</Text>
                        </HStack>
                    </VStack>
                </VStack>
            )
        }


        return (

            <Center>
                <Card mt="5">
                    <VStack>
                        <Text bold>Personal Contact Information</Text>
                        <HStack>
                            <Text>Phone Number:  </Text>
                            <br /><br />
                            <Text>{currentContactDoc?.personal_phone &&
                                currentContactDoc.personal_phone}</Text>
                        </HStack>
                    </VStack>
                    <EmergencyContacts />
                </Card>
            </Center>
        )

    }
    return (
        <Flex>
            <CurrentContactInfo />
            <Spacer />
            <EditContactInfoForm />
        </Flex>
    )

}

const userContactInfoScreen = () => {

    return (
        <NativeBaseProvider>
            <PageData />
        </NativeBaseProvider>
    )

}

export default userContactInfoScreen