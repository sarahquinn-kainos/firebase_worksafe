import React, { useState, useEffect, setState, state} from 'react'
import { auth } from '../firebase'
import { MaterialIcons } from '@expo/vector-icons';
import {
    Box,
    Heading,
    AspectRatio,
    Image,
    Text,
    Center,
    HStack,
    Stack,
    NativeBaseProvider,VStack, Button, IconButton, Icon, StatusBar 
  } from "native-base"
import { render } from 'react-dom';
import { ActivityIndicator } from 'react-native-web';
import { TextPropTypes } from 'react-native';

  
const sendResetPasswordEmail = () => {
    const user = auth.currentUser;
    const email = user.email;
    auth.sendPasswordResetEmail(email).then(
        alert("Email sent to " + email)
    )
        .catch(error => alert(error.message))
}
function AppBar(){
    return (
      <>
          <StatusBar backgroundColor="#3700B3" barStyle="light-content" />
  
          <Box safeAreaTop backgroundColor="#6200ee" />
  
          <HStack bg='#6200ee' px="1" py="3" justifyContent='space-between' alignItems='center'>
            <HStack space="4" alignItems='center'>
              <IconButton icon={<Icon size="sm" as={<MaterialIcons name='menu' />} color="white" />} />
              <Text color="white" fontSize="20" fontWeight='bold'>Home</Text>
            </HStack>
            <HStack space="2">
              <IconButton icon={<Icon as={<MaterialIcons name='search' />}
              color="white" size='sm'  />} />
              <IconButton icon={<Icon as={<MaterialIcons name='more-vert' />} size='sm' color="white" />} />
            </HStack>
          </HStack>
  
      </>
    )
  }
  
const showUnerifiedHome = () => {
    const user = auth.currentUser;
    const [displayName, setdisplayName] = useState(user.displayName ? user.displayName : '');

    useEffect(() => {
        if (user.displayName) {
            setdisplayName(user.displayName)
        }
       }, []);

        return (

            <NativeBaseProvider>
            <AppBar/>
            <Center mt="15%">
                    <Text>Hello {displayName}!</Text>
                    <br></br>
                    <Text>Your email address has not been verified</Text>
                    <Text>Please check your inbox and spam folders.</Text>
                    <br/>
                    <Center>
                        <Button 
                                onPress={sendResetPasswordEmail}>
                            <Text color="white">Re-send Verification Email</Text>
                        </Button>
                    </Center>
            </Center>
          </NativeBaseProvider>
        )
    
    }
    
export default showUnerifiedHome