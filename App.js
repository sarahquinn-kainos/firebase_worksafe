import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import loginScreen from './Screens/loginScreen';
import homeScreen from './Screens/homeScreen';
import adminDashboard from './Screens/adminDashboard';
import registerScreen from './Screens/registerScreen';
import forgotPassword from './Screens/forgotPassword';
import accountManageScreen from './Screens/accountManage';
import userContactInfoScreen from './Screens/contactInfoScreen';
import covidCheckPointModal from './Screens/covidCheckpointModal';
import showVerifiedHome from './Screens/homescreenVerifiedView';
import showUnerifiedHome from './Screens/homescreenUnverifiedView';
import { NativeBaseProvider} from "native-base";
import * as serviceWorkerRegistration from "./src/serviceWorkerRegistration"
import viewSchedule from './Screens/adminScreens/viewSchedule';


const Stack = createNativeStackNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = 'white';

function StackNav() {
  return (
    <Stack.Navigator>
    <Stack.Screen name="Login" component={loginScreen} options={{ headerTitle: "WorkSafe Login", headerTitleAlign: 'center' }} />
    <Stack.Screen name="Home" component={homeScreen} options={{ headerShown: false }}  />
    <Stack.Screen name="Register" component={registerScreen} options={{ headerTitle: "Register a New Account", headerTitleAlign: 'center' }} />
    <Stack.Screen name="AdminDash" component={adminDashboard} options={{ headerShown: false }}  />
    <Stack.Screen name="AccountManage" component={accountManageScreen}/>
    <Stack.Screen name="ForgotPassword" component={forgotPassword} options={{ headerTitle: "Forgot My Password", headerTitleAlign: 'center' }} />
    <Stack.Screen name="CovidCheckpoint" component={covidCheckPointModal} options={{ headerShown: false }} />
    <Stack.Screen name="VerifiedHome" component={showVerifiedHome} options={{ headerShown: false }} />
    <Stack.Screen name="UnverifiedHome" component={showUnerifiedHome} options={{ headerShown: false }} />
    <Stack.Screen name="UserContactInfo" component={userContactInfoScreen} />
    <Stack.Screen name="adminViewSchedule" component={viewSchedule} options={{ headerShown: false }} />
  </Stack.Navigator>
  );
}


export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StackNav/>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

serviceWorkerRegistration.register();

