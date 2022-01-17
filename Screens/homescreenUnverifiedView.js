import React from 'react'
//import { StyleSheet, Text, View, Image } from 'react-native'
import { auth } from '../firebase'
import { firestore } from '../firebase'
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import {
    Flex,
    Center,
    Heading,
    ScrollView,
    VStack,
    Divider,
    Box,
    NativeBaseProvider,
  } from "native-base"

const sendResetPasswordEmail = () => {
    const user = auth.currentUser;
    const email = user.email;
    auth.sendPasswordResetEmail(email).then(
        alert("Email sent to " + email)
    )
        .catch(error => alert(error.message))
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
        // <KeyboardAvoidingView
        //     style={styles.container}
        //     behaviour="padding">
        //         <Text>Default Home Screen</Text>
        //         <br></br>
        //         <Text>Your email address has not been verified</Text>
        //         <Text>Please check your inbox and spam folders.</Text>
        //         <View
        //             style={styles.buttonContainer}>
        //             <TouchableOpacity
        //                 onPress={sendResetPasswordEmail}
        //                 style={[styles.button]}>
        //                 <Text style={styles.buttonText}>Re-send Verification Email</Text>
        //             </TouchableOpacity>
        //         </View>
        // </KeyboardAvoidingView>
        <NativeBaseProvider>
        <Center flex={1} px="3">
          <Example />
        </Center>
      </NativeBaseProvider>

    )
}
export default showUnerifiedHome


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     buttonContainer: {
//         width: '60%',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 40
//     },
//     button: {
//         backgroundColor: '#2B9AF6',
//         width: '100%',
//         padding: 15,
//         borderRadius: 10,
//         marginTop: 10,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: 'white',
//         fontWeight: '600',
//         fontSize: 14
//     }
// })