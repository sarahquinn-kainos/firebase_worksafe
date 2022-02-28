import { useState, useEffect } from 'react';
import { Button, Center, Input, NativeBaseProvider, VStack } from 'native-base';
import SimplerDatePicker from '@cawfree/react-native-simpler-date-picker';
import moment from 'moment';

const dateTimePicker = () => {
    const [date, setDate] = useState(new Date());
    // set min and max dates - 1 year either side of current date 
    const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))


    const onChange = (selectedDate) => {
        const date = new Date(selectedDate)
        setDate(selectedDate);
        console.log(date);
    };

    const onSubmit = () => {
        if (date >= minDate && date <=maxDate){
            console.log('Valid Date')
        }else{
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