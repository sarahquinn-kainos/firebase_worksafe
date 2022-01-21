import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import loginScreen from './Screens/loginScreen';
import homeScreen from './Screens/homeScreen';
import adminDashboard from './Screens/adminDashboard';
import registerScreen from './Screens/registerScreen';
import forgotPassword from './Screens/forgotPassword';
import accountManageScreen from './Screens/accountManage'; 
import userContactInfoScreen from './Screens/contactInfoScreen';


const Stack = createNativeStackNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = 'white';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name="Login" component={loginScreen} options = {{ headerTitle : "WorkSafe Login", headerTitleAlign: 'center'}}/>
        <Stack.Screen name="Home" component={homeScreen} options = {{ headerTitle : "Home", headerTitleAlign: 'center'}}/>
        <Stack.Screen name="Register" component={registerScreen} options = {{ headerTitle : "Register a New Account", headerTitleAlign: 'center'}}/>
        <Stack.Screen name="AdminDash" component={adminDashboard} options = {{ headerTitle : "Home - Admin", headerTitleAlign: 'center'}}/>
        <Stack.Screen name="AccountManage" component={accountManageScreen} options = {{ headerTitle : "My Account", headerTitleAlign: 'center'}}/>
        <Stack.Screen name="ForgotPassword" component={forgotPassword} options = {{ headerTitle : "Forgot My Password", headerTitleAlign: 'center'}}/>
        <Stack.Screen name="UserContactInfo" component={userContactInfoScreen} options = {{ headerTitle : "My Contact Info", headerTitleAlign: 'center'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
