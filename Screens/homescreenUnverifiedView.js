import React from 'react'
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
              <IconButton icon={<Icon as={<MaterialIcons name='favorite' />} size='sm' color="white" />} />
              <IconButton icon={<Icon as={<MaterialIcons name='search' />}
              color="white" size='sm'  />} />
              <IconButton icon={<Icon as={<MaterialIcons name='more-vert' />} size='sm' color="white" />} />
            </HStack>
          </HStack>
  
      </>
    )
  }
  

export function Example() {
    return (
      <Box flex="1" safeAreaTop>
        <ScrollView>
          <VStack space={2.5} w="100%" px="3">
            {/* flexDirection -> row */}
            <Heading size="md">row</Heading>
            <Flex
              direction="row"
              mb="2.5"
              mt="1.5"
              _text={{
                color: "coolGray.800",
              }}
            >
              <Center size="16" bg="primary.100">
                100
              </Center>
              <Center size="16" bg="primary.200">
                200
              </Center>
              <Center bg="primary.300" size="16">
                300
              </Center>
              <Center size="16" bg="primary.400">
                400
              </Center>
            </Flex>
            <Divider />
            {/* flexDirection -> column */}
            <Heading size="md">column</Heading>
  
            <Flex
              direction="column"
              mb="2.5"
              mt="1.5"
              _text={{
                color: "coolGray.800",
              }}
            >
              <Center size="16" bg="primary.100">
                100
              </Center>
              <Center size="16" bg="primary.200">
                200
              </Center>
              <Center bg="primary.300" size="16">
                300
              </Center>
              <Center size="16" bg="primary.400">
                400
              </Center>
            </Flex>
            <Divider />
            {/* flexDirection -> row-reverse */}
            <Heading size="md">row-reverse</Heading>
            <Flex
              direction="row-reverse"
              mb="2.5"
              mt="1.5"
              _text={{
                color: "coolGray.800",
              }}
            >
              <Center size="16" bg="primary.100">
                100
              </Center>
              <Center size="16" bg="primary.200">
                200
              </Center>
              <Center bg="primary.300" size="16">
                300
              </Center>
              <Center size="16" bg="primary.400">
                400
              </Center>
            </Flex>
            <Divider />
            {/* flexDirection -> column-reverse */}
            <Heading size="md">column-reverse</Heading>
            <Flex
              direction="column-reverse"
              mb="2.5"
              mt="1.5"
              _text={{
                color: "coolGray.800",
              }}
            >
              <Center size="16" bg="primary.100">
                100
              </Center>
              <Center size="16" bg="primary.200">
                200
              </Center>
              <Center bg="primary.300" size="16">
                300
              </Center>
              <Center size="16" bg="primary.400">
                400
              </Center>
            </Flex>
            <Divider />
          </VStack>
        </ScrollView>
      </Box>
    )
  }

const showUnerifiedHome = () => {

    return (

        <NativeBaseProvider>
        <AppBar/>
        <Center mt="15%">
                <Text>Default Home Screen</Text>
                <br></br>
                <Text>Your email address has not been verified</Text>
                <Text>Please check your inbox and spam folders.</Text>
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