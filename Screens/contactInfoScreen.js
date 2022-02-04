import React, { useState, useEffect } from 'react'
import { ScrollView, Flex, VStack, HStack, Center, NativeBaseProvider, Text, Spacer, Button, FormControl, Input, Divider } from "native-base"
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
                addSubCollectionToExistingDocumentById('Users', 'ContactInfo', user.uid, user.uid, formDataJSON);
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
                        <Divider />
                        <Text>{"\n"}</Text>
                        <Center><Text fontSize="lg" bold color={"black"}>Update Contact Information</Text></Center>
                        <Text>{"\n"}</Text>
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
                            errors.userPrimaryPhone?.type === 'validate' ?
                                <Text>Must be a valid UK Phone Number.</Text> :
                                null
                                    ||
                                    errors.userPrimaryPhone?.type === 'required' ?
                                    <Text>Field is Required.</Text> :
                                    null
                        }
                        <FormControl.HelperText><Text>Must include country code (e.g +4475123...)</Text></FormControl.HelperText>

                        <Text>{"\n"}</Text>
                        <Center><Text bold color={"black"}>Primary Emergency Contact Information</Text></Center>
                        <Text>{"\n"}</Text>
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
                            errors.emergencyContact1Name?.type === 'required' ? <Text>Field is Required.</Text> : null
                        }
                        <Text>{"\n"}</Text>
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
                        <FormControl.HelperText><Text>Mother, Father, Sibling, Partner, etc.</Text></FormControl.HelperText>
                        {
                            errors.emergencyContact1Relationship?.type === 'required' ? <Text>Field is Required.</Text> : null
                        }
                        <Text>{"\n"}</Text>
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
                            errors.userPrimaryPhone?.type === 'validate' ?
                                <Text>Must be a valid UK Phone Number.</Text> :
                                null
                                    ||
                                    errors.userPrimaryPhone?.type === 'required' ?
                                    <Text>Field is Required.</Text> :
                                    null
                        }
                        <FormControl.HelperText><Text>Must include country code (e.g +4475123...)</Text></FormControl.HelperText>
                        <Text>{"\n"}</Text>
                        <Button onPress={handleSubmit(saveFormData)}>
                            <Text bold color={"white"}>Save</Text>
                        </Button>
                    </VStack>
                </FormControl>
            </Center>
        )
    }

    const CurrentContactInfo = () => {

        return (
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
            <ScrollView>
                <PageData />
            </ScrollView>
        </NativeBaseProvider>
    )

}

export default userContactInfoScreen