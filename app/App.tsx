import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Auth from './(tabs)/Onboarding/Auth';
import { useColorScheme } from '@/hooks/useColorScheme';
import ManagerDashboard from './(tabs)/Manager/Manager';
import ManagerSignUp from './(tabs)/Manager/ManagerSignUp';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployeeSignUp from './(tabs)/Employee/EmployeeSignup';
import EmployeeProfile from './(tabs)/Employee/EmployeeProfile';
import Employee from './(tabs)/Employee/Employee';
import { SnackbarProvider } from '@/components/SnackBar';
import { EmployeeListBase, ManagerListBase, RootStackParamList } from './RootLayoutHelpers';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomNavigation from '@/components/BottomNavigation';
import ManagerHeader from '@/components/ManagerHeader';
import EmployeeHeader from '@/components/EmployeeHeader';
import ManagerChat from './(tabs)/Manager/ManagerChat';
import ManagerProfile from './(tabs)/Manager/ManagerProfile';
import EmployeeSettings from './(tabs)/Employee/EmployeeSettings';
import ManagerSettings from './(tabs)/Manager/ManagerSettings';
import AddEvent from './(tabs)/Manager/AddEvent';
import EmployeeInbox from './(tabs)/Employee/EmployeeInbox';
import ManagerMyEvents from './(tabs)/Manager/ManagerMyEvents';
import EmployeeEventScreen from './(tabs)/Employee/EmployeeEventScreen';
import ManagerEventScreen from './(tabs)/Manager/ManagerEventScreen';
import SignUp from './(tabs)/Onboarding/SignUp';
import OnBoarding from './(tabs)/Onboarding/Onboarding';
import OnBoarding1 from './(tabs)/Onboarding/Onboarding1';
import Phone from './(tabs)/Onboarding/PhoneVerification/Phone';
import PhoneFinal from './(tabs)/Onboarding/PhoneVerification/PhoneFinal';
import ProfileUpdateScreen from './(tabs)/Onboarding/Profile/ProfileUpdateScreen';
import Questions from './(tabs)/Onboarding/Questions/Question';
import QuestionFinal from './(tabs)/Onboarding/Questions/QuestionFinal';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<ManagerListBase>();
const Tab1 = createBottomTabNavigator<EmployeeListBase>();

export default function App() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    function RenderEmployeeTabs() {
        return (<Tab1.Navigator
            initialRouteName="Employee"
            tabBar={(props) => <BottomNavigation {...props} />}
        >
            <Tab1.Screen name="Employee" component={Employee} options={({ navigation }) => ({
                title: 'Home', headerBackVisible: false, headerRight: () => <EmployeeHeader navigation={navigation} />,
            })} />
            <Tab1.Screen name="EmployeeSettings" component={EmployeeSettings} options={({ navigation }) => ({
                title: 'Profile', headerBackVisible: false, headerRight: () => <EmployeeHeader navigation={navigation} />,
            })} />

        </Tab1.Navigator>)
    };

    function RenderManagerTabs() {
        return (
            <Tab.Navigator
                initialRouteName="ManagerDashboard"
                tabBar={(props) => <BottomNavigation {...props} />}
            >
                <Tab.Screen name="ManagerDashboard" component={ManagerDashboard} options={({ navigation }) => ({
                    title: 'Home', headerTitle: "Manager", headerBackVisible: false, headerRight: () => <ManagerHeader navigation={navigation} />,
                })} />
                <Tab.Screen name="ManagerMyEvents" component={ManagerMyEvents} options={({ navigation }) => ({
                    title: 'My Events', headerBackVisible: false, headerRight: () => <ManagerHeader navigation={navigation} />,
                })} />
                <Tab.Screen name="ManagerChat" component={ManagerChat} options={({ navigation }) => ({
                    title: 'Chat', headerBackVisible: false, headerRight: () => <ManagerHeader navigation={navigation} />,
                })} />
                <Tab.Screen name="ManagerSettings" component={ManagerSettings} options={({ navigation }) => ({
                    headerRight: () => <ManagerHeader navigation={navigation} />, title: "Profile"
                })} />
            </Tab.Navigator>
        )
    };


    return (
        <SnackbarProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack.Navigator initialRouteName="Auth">
                    <Stack.Screen name="Auth" component={Auth} options={{ headerBackVisible: false }} />
                    <Stack.Screen name="SignUp" component={SignUp} options={{ headerBackVisible: false }} />
                    <Stack.Screen name="Onboarding" component={OnBoarding} options={{ headerBackVisible: false }} />
                    <Stack.Screen name="Onboarding1" component={OnBoarding1} options={{ headerBackVisible: false }} />
                    <Stack.Screen name="Phone" component={Phone} options={{ headerBackVisible: false }} />
                    <Stack.Screen name="PhoneFinal" component={PhoneFinal} options={{ headerBackVisible: false }} />
                    <Stack.Screen name="ProfileUpdateScreen" component={ProfileUpdateScreen} options={{ headerBackVisible: false }} />
                    <Stack.Screen name="Questions" component={Questions} options={{ headerBackVisible: false }} />
                    <Stack.Screen name="QuestionFinal" component={QuestionFinal} options={{ headerBackVisible: false }} />
                    <Stack.Screen
                        name="ManagerSignUp"
                        component={ManagerSignUp}
                        options={{ title: 'Manager Sign-Up' }} />
                    <Stack.Screen
                        name="EmployeeSignUp"
                        component={EmployeeSignUp}
                        options={{ title: 'Employee Sign-Up' }} />
                    <Stack.Screen
                        name="EmployeeEventScreen"
                        component={EmployeeEventScreen}
                        options={{ title: 'Event Details' }} />
                    <Stack.Screen
                        name="EmployeeProfile"
                        component={EmployeeProfile}
                        options={{ title: 'Your Profile' }} />
                    <Stack.Screen
                        name="ManagerProfile"
                        component={ManagerProfile}
                        options={{ title: 'Your Profile' }} />
                    <Stack.Screen
                        name="AddEvent"
                        component={AddEvent}
                        options={{ title: 'Create Event' }} />
                    <Stack.Screen
                        name="RenderManagerTabs"
                        component={RenderManagerTabs}
                        options={{ headerShown: false }} />
                    <Stack.Screen
                        name="RenderEmployeeTabs"
                        component={RenderEmployeeTabs}
                        options={{ headerShown: false }} />
                    <Stack.Screen
                        name='EmployeeInbox'
                        component={EmployeeInbox}
                        options={{ title: 'Inbox' }}
                    />
                    <Stack.Screen
                        name='ManagerEventScreen'
                        component={ManagerEventScreen}
                        options={{ title: 'Event Details' }}
                    />
                </Stack.Navigator>
                <StatusBar style="auto" />
            </ThemeProvider >
        </SnackbarProvider>
    );
}

