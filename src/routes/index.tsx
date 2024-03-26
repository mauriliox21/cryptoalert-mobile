import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../pages/Welcome';
import SignUp from '../pages/SingUp';
import SignIn from '../pages/SignIn';
import Alerts from '../pages/Alerts';
import CreateAlert from '../pages/CreateAlert';
import { useUserRepository } from '../database/useUserRepository';
import { AxiosInstance } from '../config/AxiosInstace';

export type RootStackParamList = {
    Welcome: undefined;
    SignUp: undefined;
    SignIn: undefined;
    Alerts?: { refreshList: boolean, successMsg?: string};
    CreateAlert?: { idAlert: number };
};

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function TabRoutes(){

    const userRepository = useUserRepository();
    const userAuthenticate = !!userRepository.getName();
    
    AxiosInstance.defaults.headers.common['Authorization'] = "Bearer " + userRepository.getToken();

    return (
        <Tab.Navigator initialRouteName={userAuthenticate ? "Alerts" : "Welcome"}>
            <Tab.Screen name="Welcome" component={Welcome} options={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {display: "none"}}} />
            <Tab.Screen name="SignUp" component={SignUp} options={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {display: "none"}}} />
            <Tab.Screen name="SignIn" component={SignIn} options={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {display: "none"}}} />
            <Tab.Screen name="Alerts" initialParams={{refreshList: true}} component={Alerts} options={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {display: "none"}}} />
            <Tab.Screen name="CreateAlert" component={CreateAlert} options={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {display: "none"}}} />
        </Tab.Navigator>
    );
}