import React, { useState, useEffect } from 'react'
import { Modal, VStack, Center, Heading, NativeBaseProvider, Text, Card, Button, FormControl, TextArea, Input, Divider, CloseIcon } from "native-base"
import { useIsFocused } from '@react-navigation/native';
import { auth } from '../firebase';
import { getGuidelinesCollection } from '../Javascript/firestore';


function viewGuidelinesForUser() {
    const isFocused = useIsFocused();
    const [currentData, setCurrentData] = useState([]);

    function getCurrentInfo() {
        getGuidelinesCollection().then(data => {
            console.log(data)
            setCurrentData(data);
        })
    }

    useEffect(() => {
        getCurrentInfo();
    }, [isFocused]);

    const CurrentPosts = () => {
        if (currentData.length > 0) {
            return (
                <>
                    {currentData ?
                        currentData.map((doc) => {
                            return (
                                <Card w={300} py={5}>
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


    return (
        <NativeBaseProvider>
            <Text>{"\n\n"}</Text>
            <Center flex={1} px="3">
                {currentData ?
                    <CurrentPosts />
                    : null}
            </Center>
        </NativeBaseProvider>
    )
}




export default viewGuidelinesForUser