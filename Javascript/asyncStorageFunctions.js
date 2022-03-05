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
        // data = data.split(',') // convert back to an array 
        data = JSON.parse(data)
        console.log(data)
        return data;
    })
}

const getDataFromAsyncByLabel = (label) => {
    const getData = async () => {
        try {
            var data = await AsyncStorage.getItem(label)
            return data;
        } catch (err) {
            console.log(err)
        }
    }
    getData().then((data)=>{
        return data;
    })
}

const getWorkshiftDataFromAsync = async () => {
    var data;
    const getData = async () => {
        try {
            var data = await AsyncStorage.getItem('workshiftData')
            return data;
        } catch (err) {
            console.log(err)
        }
    }
    data = await getData()
    return data;
}

export {
    getSelectedUsersFromAsync,
    getWorkshiftDataFromAsync,
    getDataFromAsyncByLabel
}
