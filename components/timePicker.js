import { useState, useEffect } from 'react';
import { Button, Input, VStack, HStack, Text, FormControl } from 'native-base';
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from '@react-native-async-storage/async-storage';

const timePicker = (label) => {
    const [time, setTime] = useState({});

    //set time with label in async storage to access in other components
    useEffect(async () => {
        try {
            console.log(label)
            console.log(time)
            await AsyncStorage.setItem(label, JSON.stringify(time))
        } catch (err) {
            console.log(err)
        }
    }, [time]);

    function isNumeric(num) {
        return !isNaN(num)
    }

    //validate hour entry for 24 hour format
    const isValidHour = (value) => {
        if (isNumeric(value)) {
            if (value < 0 || value > 23) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    };
    //validate hour entry for 24 hour format
    const isValidMins = (value) => {
        if (isNumeric(value)) {
            if (value < 0 || value > 59) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    };

    const saveTime = data => {
        var formDataJSON = {
            "hour": data.hour,
            "min": data.mins
        }
        setTime(formDataJSON)
        //console.log(formDataJSON)
    }

    const FormInput = () => {


        //react-hook-form config --> for error handling 
        const { control, handleSubmit, reset, formState: { errors } } = useForm({
            defaultValues: {
                hours: '',
                mins: ''
            }
        });
        return (
            <FormControl>
                <VStack>
                    <HStack>
                        <Text>{"\n"}</Text>
                        {/* Hours */}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                validate: (value) => isValidHour(value)
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="00"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="hour"
                        />
                        {" : "}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                validate: (value) => isValidMins(value)
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="00"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="mins"
                        />
                    </HStack>
                    <VStack>
                        {
                            errors.hour?.type === 'validate' ?
                                <Text>Invalid Hour</Text> :
                                null
                                    ||
                                    errors.hour?.type === 'required' ?
                                    <Text>Required.</Text> :
                                    null
                        }
                        {
                            errors.hour?.type === 'validate' ?
                                <Text>Invalid minutes</Text> :
                                null
                                    ||
                                    errors.hour?.type === 'required' ?
                                    <Text>Required.</Text> :
                                    null
                        }
                    </VStack>
                    <FormControl.HelperText><Text>24 hour format</Text></FormControl.HelperText>
                </VStack>
                <Button onPress={handleSubmit(saveTime)}>
                    <Text bold color={"white"}>Save</Text>
                </Button>
            </FormControl>
        )

    }

    return (
        <VStack>
            <HStack width={100}>
                <FormInput />
            </HStack>
        </VStack>
    );
};


export default timePicker;