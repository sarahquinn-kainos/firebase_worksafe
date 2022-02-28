import { useState, useEffect } from 'react';
import { Button, VStack } from 'native-base';
import SimplerDatePicker from '@cawfree/react-native-simpler-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dateTimePicker = () => {
    const [date, setDate] = useState(new Date());
    // set min and max dates - 1 year either side of current date 
    const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))

    //set date in async storage to access in other components
    useEffect(async () => {
        try {
            await AsyncStorage.setItem('datePickerInput', date)
        } catch (err) {
            console.log(err)
        }
    }, [date]);



    const onChange = (selectedDate) => {
        setDate(selectedDate);
    };

    const onSubmit = () => {
        if (date >= minDate && date <= maxDate) {
            console.log('Valid Date')
        } else {
            console.log('Invalid Date')
        }

    }

    return (
        <>
            <VStack>
                <SimplerDatePicker
                    onDatePicked={onChange}
                />
                <Button onPress={onSubmit}>Validate Input</Button>
            </VStack>
        </>
    );
};

export default dateTimePicker;