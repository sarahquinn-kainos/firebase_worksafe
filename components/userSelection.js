import { Card, Checkbox, Text, HStack, ScrollView, VStack } from 'native-base';
import { getUsersCollection } from '../Javascript/firestore';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


function userSelection() {

    const [usersArr, setUsersArray] = useState("")
    const [groupValue, setGroupValue] = useState([]);

    //set selectedUsers checkbox group in async storage to access in other components

    useEffect(async () => {
        if (groupValue.length > 0) {
            var objArr = new Array;
            try {
                usersArr.map((doc) => {
                    var uid = doc.id;
                    var display_name = doc.first_name + ' ' + doc.surname
                    var data = {
                        "uid": uid,
                        "display_name": display_name
                    }
                    if (groupValue.includes(uid)) {
                        objArr.push(data)
                    }
                })
                console.log(objArr)
                await AsyncStorage.setItem('selectedUsers', JSON.stringify(objArr))
                console.log(groupValue)
            } catch (err) {
                console.log(err)
            }
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
                    <Text>Staff Selected: ({groupValue.length})</Text>
                    <Text>{"\n"}</Text>
                    <VStack>
                        <Checkbox.Group onChange={setGroupValue} value={groupValue} accessibilityLabel="choose users">
                            {usersArr ?
                                usersArr.map((d, index) => {
                                    var uid = d.id;
                                    var full_name = d.first_name + " " + d.surname;
                                    var staff_data = {
                                        "uid": uid,
                                        "display_name": full_name
                                    }
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