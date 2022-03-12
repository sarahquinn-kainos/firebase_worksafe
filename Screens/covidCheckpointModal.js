import React, { useState, useEffect } from 'react'
import { ScrollView, Flex, VStack, HStack, Center, NativeBaseProvider, Text, Spacer, Button, FormControl, Input, Divider, Modal, Radio } from "native-base"
import { addSubCollectionToExistingDocumentById, getCovidDataForUserLastSevenDays } from '../Javascript/firestore'
import { auth } from '../firebase'
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from '@react-navigation/core'
import { NavigationContainer } from '@react-navigation/native';


const CheckpointForm = () => {
    const user = auth.currentUser;
    const [modelIsOpen, setModalIsOpen] = useState(true)
    const navigation = useNavigation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            "diagnosed": false,
            "close_contact": false,
            "symptoms": false,
            "travelled": false,
            "self_isolating": false
        }
    });

    // START Firestore FUNCTION 
    const saveFormData = data => {
        var stamp = new Date().toISOString();
        const booleanValue = new Map([
            ["1", true],
            ["0", false]
          ]);
          //include uid in the document
        var formDataJSON = {
            "timestamp": stamp,
            "diagnosed": booleanValue.get(data.diagnosed),
            "close_contact": booleanValue.get(data.close_contact),
            "symptoms": booleanValue.get(data.symptoms),
            "travelled": booleanValue.get(data.travelled),
            "self_isolating": booleanValue.get(data.self_isolating)
        }

        try {
            //Update to write to main collection
            addSubCollectionToExistingDocumentById('Users', 'CovidStatus', user.uid ,null, formDataJSON);
            //DEV TEST getCovidDataForUserLastSevenDays(user.uid);
        }
        catch {
            (err) => {
                console.log(err)
            }
        } 
        reset(); //reset form
        navigation.navigate("Login")
    }
    // END FUNCTION 

    //input form
    return (
        <>
            <Modal isOpen={modelIsOpen} onClose={() => {
                alert("Checkpoint must be completed!")
            }}>
                <Modal.Content maxWidth="400px">
                    <Modal.Body>
                        <Center mt={5}>
                            <FormControl>
                                <VStack>
                                    <Center><Text bold fontsize="lg">COVID-19 Checkpoint</Text></Center>
                                    <Text>{"\n"}</Text>
                                    {/* Recently Diagnosed */}
                                    <Text>(1) Have you been diagnosed with Coronavirus (COVID-19) recently?</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Radio.Group
                                                alignItems="center"
                                                accessibilityLabel='diagnosed'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                value={value}>
                                                <HStack>
                                                    <Radio value="1" mx={2}>
                                                        YES
                                                    </Radio>
                                                    <Radio value="0" mx={2}>
                                                        NO
                                                    </Radio>
                                                </HStack>
                                            </Radio.Group>
                                        )}
                                        name="diagnosed"
                                    />
                                    {
                                        errors.diagnosed?.type === 'required' ? <Text>Field is Required.</Text> : null
                                    }
                                    <Text>{"\n"}</Text>
                                    {/* Close Contact */}
                                    <Text>(2) Have you been in close contact with a confirmed or probable case of Coronavirus (COVID-19)?</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Radio.Group
                                                alignItems="center"
                                                accessibilityLabel='close_contact'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                value={value}>
                                                <HStack mt={2}>
                                                    <Radio value="1" mx={2}>
                                                        YES
                                                    </Radio>
                                                    <Radio value="0" mx={2}>
                                                        NO
                                                    </Radio>
                                                </HStack>
                                            </Radio.Group>
                                        )}
                                        name="close_contact"
                                    />
                                    {
                                        errors.close_contact?.type === 'required' ? <Text>Field is Required.</Text> : null
                                    }
                                    <Text>{"\n"}</Text>
                                    {/* Symptoms */}
                                    <Text>(3) Have you developed any symptoms such as fever, cough, sore throat, fatigue or shortness of breath?</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Radio.Group
                                                alignItems="center"
                                                accessibilityLabel='symptoms'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                value={value}>
                                                <HStack mt={2}>
                                                    <Radio value="1" mx={2}>
                                                        YES
                                                    </Radio>
                                                    <Radio value="0" mx={2}>
                                                        NO
                                                    </Radio>
                                                </HStack>
                                            </Radio.Group>
                                        )}
                                        name="symptoms"
                                    />
                                    {
                                        errors.symptoms?.type === 'required' ? <Text>Field is Required.</Text> : null
                                    }
                                    <Text>{"\n"}</Text>
                                    {/* Travelled */}
                                    <Text>(4) Have you recently travelled overseas?</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Radio.Group
                                                alignItems="center"
                                                accessibilityLabel='travelled'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                value={value}>
                                                <HStack mt={2}>
                                                    <Radio value="1" mx={2}>
                                                        YES
                                                    </Radio>
                                                    <Radio value="0" mx={2}>
                                                        NO
                                                    </Radio>
                                                </HStack>
                                            </Radio.Group>
                                        )}
                                        name="travelled"
                                    />
                                    {
                                        errors.travelled?.type === 'required' ? <Text>Field is Required.</Text> : null
                                    }
                                    <Text>{"\n"}</Text>
                                    {/* Isolating */}
                                    <Text>(5) Have you been recommended to self-isolate or quarantine following Government advice / a registered health professional?</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Radio.Group
                                                alignItems="center"
                                                accessibilityLabel='self_isolating'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                value={value}>
                                                <HStack mt={2}>
                                                    <Radio value="1" mx={2}>
                                                        YES
                                                    </Radio>
                                                    <Radio value="0" mx={2}>
                                                        NO
                                                    </Radio>
                                                </HStack>
                                            </Radio.Group>
                                        )}
                                        name="self_isolating"
                                    />
                                    {
                                        errors.self_isolating?.type === 'required' ? <Text>Field is Required.</Text> : null
                                    }
                                    <Text>{"\n"}</Text>
                                    <Button onPress={handleSubmit(saveFormData)}>
                                        <Text bold color={"white"}>Submit</Text>
                                    </Button>
                                </VStack>
                            </FormControl>
                        </Center>

                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    )
}


const covidCheckPointModal = () => {

    return (
        <NativeBaseProvider>
            <CheckpointForm />
        </NativeBaseProvider>
    )

}

export default covidCheckPointModal