import AsyncStorage from '@react-native-async-storage/async-storage';

const getSelectedUsersFromAsync = () => {
    const getData = async () => {
        try {
            var data = await AsyncStorage.getItem('selectedUsers')
            return data;
        } catch (err) {
            console.log(err)
        }
    }
    getData().then((data)=>{
        data = data.split(',') // convert back to an array 
        console.log(data)
        return data;
    })
}

const getDatesFromAsync = () => {
    const getData = async () => {
        try {
            var data = await AsyncStorage.getItem('datePickerInput')
            return data;
        } catch (err) {
            console.log(err)
        }
    }
    getData().then((data)=>{
        data = data.split(',') // convert back to an array 
        console.log(data)
        return data;
    })
}

export {
    getSelectedUsersFromAsync
}
