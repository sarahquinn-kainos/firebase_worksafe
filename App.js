import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import loginScreen from './Screens/loginScreen';
import homeScreen from './Screens/homeScreen';
import adminDashboard from './Screens/adminHome';
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
import shiftManageScreen from './Screens/adminScreens/scheduleShift';
import scheduleManageScreen from './Screens/adminScreens/manageSchedules';
import manageUserSchedule from './Screens/manageUserSchedules';
import viewScheduleForuser from './Screens/viewScheduleForUser';
import selectShifts from './Screens/adminScreens/viewScheduleForm';
import viewScheduleAlerts from './Screens/adminScreens/viewScheduleWithAlertsOnly';
import viewStaffDetails from './Screens/adminScreens/reportStaffDetails';
import manageGuidelines from './Screens/adminScreens/manageCovidGuidance';
import viewGuidelinesForUser from './Screens/viewGuidelines';


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
    <Stack.Screen name="Work Guidelines" component={manageGuidelines}/>
    <Stack.Screen name="ForgotPassword" component={forgotPassword} options={{ headerTitle: "Forgot My Password", headerTitleAlign: 'center' }} />
    <Stack.Screen name="CovidCheckpoint" component={covidCheckPointModal} options={{ headerShown: false }} />
    <Stack.Screen name="VerifiedHome" component={showVerifiedHome} options={{ headerShown: false }} />
    <Stack.Screen name="UnverifiedHome" component={showUnerifiedHome} options={{ headerShown: false }} />
    <Stack.Screen name="UserContactInfo" component={userContactInfoScreen} options={{ headerTitle: "My Contact Details", headerTitleAlign: 'center' }} />
    <Stack.Screen name="Select Shifts" component={selectShifts} options={{headerBackTitleVisible: true }} />
    <Stack.Screen name="View Schedule" component={viewSchedule} options={{headerBackTitleVisible: true }} />
    <Stack.Screen name="View Staff Contact Details" component={viewStaffDetails} options={{headerBackTitleVisible: true }} />
    <Stack.Screen name="View Schedule Alerts" component={viewScheduleAlerts} options={{headerBackTitleVisible: true }} />
    <Stack.Screen name="Manage Schedule" component={scheduleManageScreen} options={{ headerBackTitle: false , headerBackTitleVisible: true}} />
    <Stack.Screen name="Manage Shifts" component={shiftManageScreen} options={{ headerShown: true , headerBackTitleVisible: true}} />
    <Stack.Screen name="View Guidelines" component={viewGuidelinesForUser} options={{ headerTitle: "Workplace Guidelines", headerShown: true , headerBackTitleVisible: true}} />
    <Stack.Screen name="View User Schedule" component={viewScheduleForuser} options={{ headerTitle: "My Schedule", headerShown: true , headerBackTitleVisible: true}} />
    <Stack.Screen name="Manage User Schedule" component={manageUserSchedule}  options={{ headerTitle: "My Schedule", headerShown: true , headerBackTitleVisible: false}} />
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

