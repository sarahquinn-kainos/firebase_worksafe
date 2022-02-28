import { createDrawerNavigator } from "@react-navigation/drawer";
import { auth } from '../firebase'
import accountManageScreen from "../Screens/accountManage";
import covidCheckPointModal from "../Screens/covidCheckpointModal";
import scheduleManageScreen from "../Screens/adminScreens/manageSchedules";


const Drawer = createDrawerNavigator();

function screenWithDrawerNav(defaultFirstScreen, isAdmin) {
    if (isAdmin){
        return (
            <Drawer.Navigator initialRouteName='Main'>
                <Drawer.Screen name="Home" component={defaultFirstScreen} />
                <Drawer.Screen name="Manage Schedule" component={scheduleManageScreen} />
                <Drawer.Screen name="Manage Account" component={accountManageScreen} />
                <Drawer.Screen name="COVID Checkpoint" component={covidCheckPointModal} />
            </Drawer.Navigator>
        );
    }
    else{
        return (
            <Drawer.Navigator initialRouteName='Main'>
                <Drawer.Screen name="Home" component={defaultFirstScreen} />
                <Drawer.Screen name="Manage Account" component={accountManageScreen} />
                {/* <Drawer.Screen name="COVID Checkpoint" component={covidCheckPointModal} /> */}
            </Drawer.Navigator>
        );
    }
}


export default screenWithDrawerNav;