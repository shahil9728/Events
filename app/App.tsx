import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
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
import { Image, TouchableOpacity, View } from 'react-native';
import { Icon } from '@rneui/themed';
import { ICONTYPE, OperationType } from './globalConstants';
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://d3559d0823994858922f2c4ed755c639@app.glitchtip.com/12468",
});

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<ManagerListBase>();
const Tab1 = createBottomTabNavigator<EmployeeListBase>();

export default function App() {
    console.log("hii");
    const [appReady, setAppReady] = useState(false);
    const colorScheme = useColorScheme();

    const [fontsLoaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        const prepareSplash = async () => {
            await SplashScreen.preventAutoHideAsync();
        };
        prepareSplash();
    }, []);

    useEffect(() => {
        async function prepare() {
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppReady(true);
            }
        }
        prepare();
    }, []);

    useEffect(() => {
        if (appReady && fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [appReady, fontsLoaded]);

    if (!appReady || !fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <Image
                    source={require('../assets/images/logo1.png')}
                    style={{ width: 250, height: 250, resizeMode: 'contain' }}
                />
            </View>
        );
    }


    if (!fontsLoaded) {
        return null;
    }

    function RenderEmployeeTabs() {
        return (<Tab1.Navigator
            initialRouteName="Employee"
            screenOptions={({ navigation }) => ({
                headerTitle: () => (
                    <Image
                        source={require('../assets/images/headerLogo.png')}
                        style={{ width: 100, height: 30, resizeMode: 'contain' }}
                    />
                ),
                headerBackVisible: false,
                headerRight: () => <EmployeeHeader navigation={navigation} />,
            })}
            tabBar={(props) => <BottomNavigation {...props} />}
        >
            <Tab1.Screen name="Employee" component={Employee} options={{ title: 'Home' }} />
            <Tab1.Screen name="EmployeeSettings" component={EmployeeSettings} options={() => ({ title: 'Profile', })} />
        </Tab1.Navigator>)
    };

    function RenderManagerTabs() {
        return (
            <Tab.Navigator
                initialRouteName="ManagerDashboard"
                tabBar={(props) => <BottomNavigation {...props} />}
                screenOptions={({ navigation }) => ({
                    headerStyle: {
                        height: 90,
                    },
                    headerBackVisible: false,
                    headerTitle: () => (
                        <Image
                            source={require('../assets/images/headerLogo.png')}
                            style={{ width: 100, height: 30, resizeMode: 'contain' }}
                        />
                    ),
                    headerRight: () => <ManagerHeader navigation={navigation} />,
                })}
            >
                <Tab.Screen name="ManagerDashboard" component={ManagerDashboard} options={{ title: 'Home' }} />
                <Tab.Screen name="ManagerMyEvents" component={ManagerMyEvents} options={{ title: 'My Events' }} />
                {/* <Tab.Screen name="ManagerChat" component={ManagerChat} options={{ title: 'Chat' }} /> */}
                <Tab.Screen name="ManagerSettings" component={ManagerSettings} options={{ title: "Profile" }} />
            </Tab.Navigator>
        )
    };

    const headerOptions = {
        headerBackVisible: false,
        headerTitle: () => (
            <Image
                source={require('../assets/images/headerLogo.png')}
                style={{ width: 100, height: 30, resizeMode: 'contain' }}
            />
        ),
    };


    const screens: { name: keyof RootStackParamList; component: React.ComponentType<any> }[] = [
        { name: "Onboarding", component: OnBoarding },
        { name: "Onboarding1", component: OnBoarding1 },
        { name: "Phone", component: Phone },
        { name: "PhoneFinal", component: PhoneFinal },
        { name: "ProfileUpdateScreen", component: ProfileUpdateScreen },
        { name: "Questions", component: Questions },
        { name: "QuestionFinal", component: QuestionFinal },
    ];


    return (
        <SnackbarProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack.Navigator initialRouteName="Auth">
                    <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
                    <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                    {screens.map(({ name, component }) => (
                        <Stack.Screen key={name} name={name} component={component} options={headerOptions} />
                    ))}
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
                        initialParams={{ mode: OperationType.UPDATE }}
                        options={({ route }) => ({
                            title: route.params.mode === OperationType.UPDATE ? 'Update Event' : 'Create Event',
                        })}
                    />
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
                        name="ManagerEventScreen"
                        component={ManagerEventScreen}
                        options={({ navigation, route }) => ({
                            title: 'Event Details',
                            headerRight: () => {
                                return (
                                    <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { mode: OperationType.UPDATE, eventData: route.params })}>
                                        <Icon
                                            name="edit-2"
                                            type={ICONTYPE.FEATHER}
                                            color="white"
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                )
                            },
                        })}
                    />
                </Stack.Navigator>
                <StatusBar style="auto" />
            </ThemeProvider >
        </SnackbarProvider>
    );
}

