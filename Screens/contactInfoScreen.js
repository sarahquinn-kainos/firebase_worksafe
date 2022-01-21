import React, { useState } from 'react'
import { VStack, HStack, Center, NativeBaseProvider, Text, Box, Button, FormControl, Input, Card } from "native-base"


const userContactInfoScreen = () => {

    // const for storing user input fields
    const [userPrimaryPhone, setUserPrimaryPhone] = useState('')
    const [emergencyContact1Name, setEmergencyContact1Name] = useState('')
    const [emergencyContact1Relationship, setEmergencyContact1Relationship] = useState('')
    const [emergencyContact1Phone, setEmergencyContact1Phone] = useState('')
    const [formData, setData] = useState({});

    return (
        //Input fields &  Buttons
        <NativeBaseProvider>
            <Center flex={1} >
                {/* VALIDATION EXAMPLE */}
                {/* <Card bgColor={"muted.500"}> */}
                    <FormControl>
                        {/* <VStack width="90%" mx="3">
                            <FormControl isRequired>
                                <FormControl.Label _text={{ bold: true }}>Name</FormControl.Label>
                                <Input bgColor={"white"}
                                    placeholder="John"
                                    onChangeText={(value) => setData({ ...formData, name: value })}
                                />
                                <FormControl.HelperText _text={{ fontSize: 'xs' }}>
                                    Name should contain atleast 3 character.
                                </FormControl.HelperText>
                                <FormControl.ErrorMessage _text={{ fontSize: 'xs' }}>Error Name</FormControl.ErrorMessage>
                            </FormControl>
                        </VStack> */}
                        <VStack margin={"10"}>
                            <br />
                            <Center><Text bold color={"black"}>Personal Contact Information</Text></Center>
                            <br />
                            <Input bgColor={"white"}
                                placeholder="Phone Number"
                                value={userPrimaryPhone}
                                onChangeText={text => setUserPrimaryPhone(text)}>
                            </Input>
                            <br />
                            <Center><Text bold color={"black"}>Primary Emergency Contact Information</Text></Center>
                            <br />
                            <Input bgColor={"white"}
                                placeholder="Full Name"
                                value={emergencyContact1Name}
                                onChangeText={text => setEmergencyContact1Name(text)}>
                            </Input>
                            <br />
                            <Input bgColor={"white"}
                                placeholder="Relationship"
                                value={emergencyContact1Phone}
                                onChangeText={text => setEmergencyContact1Phone(text)}>
                            </Input>
                            <br />
                            <Input bgColor={"white"}
                                placeholder="Phone Number"
                                value={emergencyContact1Relationship}
                                onChangeText={text => setEmergencyContact1Relationship(text)}
                                secureTextEntry>
                            </Input>
                            <br />
                            <HStack>
                            </HStack>
                        </VStack>
                    </FormControl>
                {/* </Card> */}
                <br></br>
                <Center>
                    <Button>
                        <Text bold color={"white"}>Save</Text>
                    </Button>
                </Center>
            </Center>
        </NativeBaseProvider>
    )
}

export default userContactInfoScreen