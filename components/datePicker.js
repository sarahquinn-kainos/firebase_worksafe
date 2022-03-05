import { useState, useEffect } from 'react';
import { Button, VStack } from 'native-base';
import SimplerDatePicker from '@cawfree/react-native-simpler-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dateTimePicker = (label) => {
    const [date, setDate] = useState(new Date());
    // set min and max dates - 1 year either side of current date 
    const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))

    //set date in async storage to access in other components
    useEffect(async () => {
        try {
            await AsyncStorage.setItem(label, date)
        } catch (err) {
            console.log(err)
        }
    }, [date]);



    const onChange = (selectedDate) => {
        setDate(selectedDate);
    };

    // const onSubmit = () => {
    //     if (date >= minDate && date <= maxDate) {
    //         console.log('Valid Date')
    //     } else {
    //         console.log('Invalid Date')
    //     }

    // }

    const onSubmit = async() => {
        try {
            await AsyncStorage.getItem(label).then((result)=>{
                console.log(result)
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <VStack>
                <SimplerDatePicker
                    onDatePicked={onChange}
                />
                {/* <Button onPress={onSubmit}>Get Date from Storage</Button> */}
            </VStack>
        </>
    );
};

export default dateTimePicker;