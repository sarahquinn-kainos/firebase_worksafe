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
import { NativeBaseProvider } from "native-base";
import * as serviceWorkerRegistration from "./src/serviceWorkerRegistration"


const Stack = createNativeStackNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = 'white';

function StackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={loginScreen} options={{ headerTitle: "WorkSafe Login", headerTitleAlign: 'center' }} />
      <Stack.Screen name="Home" component={homeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={registerScreen} options={{ headerTitle: "Register a New Account", headerTitleAlign: 'center' }} />
      <Stack.Screen name="AdminDash" component={adminDashboard} options={{ headerShown: false }} />
      <Stack.Screen name="AccountManage" component={accountManageScreen} />
      <Stack.Screen name="ForgotPassword" component={forgotPassword} options={{ headerTitle: "Forgot My Password", headerTitleAlign: 'center' }} />
      <Stack.Screen name="CovidCheckpoint" component={covidCheckPointModal} options={{ headerShown: false }} />
      <Stack.Screen name="VerifiedHome" component={showVerifiedHome} options={{ headerShown: false }} />
      <Stack.Screen name="UnverifiedHome" component={showUnerifiedHome} options={{ headerShown: false }} />
      <Stack.Screen name="UserContactInfo" component={userContactInfoScreen} />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

serviceWorkerRegistration.register();

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
//import { getMessaging, onMessage } from "@firebase/messaging";
import firebase from 'firebase';
const messaging = firebase.messaging();

let pushToken;
messaging
  .getToken({
    vapidKey: "BAzh7ng33f6yBUMmCZIoDsW2SalS1aq0k0dMECSSxebw3c-Q4XUpVT2VH6YPYizeAROwiE0oLQ37ZrXefY6wXvQ",
    serviceWorkerRegistration: registration,
  })
  .then((currentToken) => {
    if (currentToken) {
      console.log("FCM token> ", currentToken);
      pushToken = currentToken;
    } else {
      console.log("No Token available");
    }
  })
  .catch((error) => {
    console.log("An error ocurred while retrieving token. ", error);
  });



//const messaging = getMessaging();
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  const { title, ...options } = payload.notification;
  function showNotification() {
    Notification.requestPermission(function (result) {
      if (result === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification(payload.notification.title, {
            body: payload.notification.body,
            tag: payload.notification.tag,
          });
        });
      }
    });
  }
  showNotification();
});

