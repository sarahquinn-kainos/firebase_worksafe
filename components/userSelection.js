import { Card, Checkbox, Text, HStack, ScrollView, VStack } from 'native-base';
import { getUsersCollection } from '../Javascript/firestore';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


function userSelection() {

    const [usersArr, setUsersArray] = useState("")
    const [groupValue, setGroupValue] = useState([]);

    //set selectedUsers checkbox group in async storage to access in other components

    useEffect(async () => {
        try {
            await AsyncStorage.setItem('selectedUsers', groupValue)
            console.log(groupValue)
        } catch (err) {
            console.log(err)
        }
    }, [groupValue]);


    function getUserInfo() {
        getUsersCollection().then(data => {
            console.log(data)
            setUsersArray(data);
        })
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <>
            <Card style={{ width: 300 }}>
                <ScrollView>
                    <Text>Selected: ({groupValue.length})</Text>
                    <Text>{"\n"}</Text>
                    <VStack>
                    <Checkbox.Group onChange={setGroupValue} value={groupValue} accessibilityLabel="choose users">
                            {usersArr ?
                                usersArr.map((d, index) => {
                                    var uid = d.id;
                                    var full_name = d.first_name + " " + d.surname;
                                    return (
                                            // <Checkbox value={uid ? uid : null}>
                                            //     {full_name ? full_name : null}
                                            // </Checkbox>
                                            <Checkbox value={uid ? uid : null}>
                                            {full_name ? full_name : null}
                                        </Checkbox>
                                    )
                                }) : null}
                        </Checkbox.Group>
                    </VStack>
                </ScrollView>
            </Card>
        </>
    );
}


export default userSelection;