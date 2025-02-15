import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { event_row } from './BaseClasses';

export type RootStackParamList = {
    Auth: undefined;
    ManagerSignUp: undefined;
    RenderManagerTabs: undefined;
    RenderEmployeeTabs: undefined;
    Employee: undefined;
    EmployeeSignUp: undefined;
    EmployeeSettings: undefined;
    EmployeeProfile: undefined;
    EmployeeHeader: undefined;
    ManagerProfile: undefined;
    AddEvent: undefined;
    EmployeeEventScreen: event_row;
    Onboarding: { email: string, password: string, name: string };
    Onboarding1: { email: string, password: string, name: string, option: string };
    ManagerEventScreen: { title: string; startDate: string; endDate: string; location: string; eventCategory: string; eventImage: string; eventDescription: string; eventSalary: string; managerId: string; id: string };
    EmployeeInbox: undefined;
    SignUp: undefined;
    ManagerDashboard: undefined;
    Phone: undefined;
};

export type ManagerListBase = {
    ManagerDashboard: undefined;
    ManagerProfile: undefined;
    RenderManagerTabs: undefined;
    ManagerHeader: undefined;
    ManagerMyEvents: undefined;
    ManagerChat: undefined;
    ManagerSettings: undefined;
    AddEvent: undefined;
}
export type EmployeeListBase = {
    EmployeeSettings: undefined;
    Employee: undefined;
    EmployeeSignUp: undefined;
    EmployeeProfile: undefined;
    EmployeeHeader: undefined;
    EmployeeInbox: undefined;
}

// Export types for screen components with props
export type EmployeeEventScreenProps = NativeStackScreenProps<RootStackParamList, 'EmployeeEventScreen'>;
export type ManagerEventScreenProps = NativeStackScreenProps<RootStackParamList, 'ManagerEventScreen'>;
export type OnBoardingProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;
export type OnBoarding1Props = NativeStackScreenProps<RootStackParamList, 'Onboarding1'>;

export type NavigationProps =
    | NativeStackScreenProps<RootStackParamList, keyof RootStackParamList>

type TabNavigationProps = BottomTabNavigationProp<ManagerListBase, keyof ManagerListBase>;

export type ManagerHeaderScreenProps = {
    navigation: TabNavigationProps;
};

export type EmployeeHeaderScreenProps = {
    navigation: BottomTabNavigationProp<EmployeeListBase, keyof EmployeeListBase>;
};

