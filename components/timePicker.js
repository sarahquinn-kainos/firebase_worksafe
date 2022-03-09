import { useState, useEffect } from 'react';
import {VStack, HStack} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const timePicker = (label) => {
    const [time, setTime] = useState('');

    //set time with label in async storage to access in other components
    useEffect(async () => {
        if (time) {
            try {
                console.log(label)
                console.log(typeof time)
                await AsyncStorage.setItem(label, JSON.stringify(time))
            } catch (err) {
                console.log(err)
            }
        }
    }, [time]);

    const TimeInput = () => {



        return (
            <>
                <input
                    defaultValue={time}
                    type="time"
                    step="60"
                    className="form-control"
                    placeholder="Time"
                    onChange={(x) => {setTime(x.currentTarget.value)}} 
                    min="00:00" 
                    max="23:59" />
            </>
        )
    }

    return (
        <VStack>
            <HStack width={200}>
                <TimeInput />
            </HStack>
        </VStack>
    );
};


export default timePicker;