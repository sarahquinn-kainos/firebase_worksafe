import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import loginScreen from './Screens/loginScreen';
import homeScreen from './Screens/homeScreen';
import adminDashboard from './Screens/adminDashboard';
import registerScreen from './Screens/registerScreen';
import forgotPassword from './Screens/forgotPassword';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name="Login" component={loginScreen} options = {{ headerTitle : "WorkSafe Login", headerTitleAlign: 'center'}}/>
        <Stack.Screen name="Home" component={homeScreen} options = {{ headerShown: false}}/>
        <Stack.Screen name="Register" component={registerScreen} options = {{ headerTitle : "Register a New Account", headerTitleAlign: 'center'}}/>
        <Stack.Screen name="AdminDash" component={adminDashboard} />
        <Stack.Screen name="ForgotPassword" component={forgotPassword} options = {{ headerTitle : "Forgot My Password", headerTitleAlign: 'center'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
