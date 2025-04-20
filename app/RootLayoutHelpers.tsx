import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { event_row } from './BaseClasses';
import { OperationValue } from './globalConstants';

export type RootStackParamList = {
    Auth: undefined;
    ManagerSignUp: undefined;
    RenderManagerTabs: { activeTab?: string };
    RenderEmployeeTabs: undefined;
    Employee: undefined;
    EmployeeSignUp: undefined;
    EmployeeSettings: undefined;
    EmployeeProfile: undefined;
    EmployeeHeader: undefined;
    ManagerProfile: undefined;
    EmployeeEventScreen: { mode: OperationValue; eventData?: event_row };
    Onboarding: undefined;
    Onboarding1: undefined;
    ManagerEventScreen: event_row;
    EmployeeInbox: undefined;
    SignUp: undefined;
    ManagerDashboard: undefined;
    Phone: undefined;
    PhoneFinal: undefined;
    ProfileUpdateScreen: { name1: string };
    Questions: undefined;
    QuestionFinal: undefined;
    AddEvent: { mode: OperationValue; eventData?: event_row };
};

export type ManagerListBase = {
    ManagerDashboard: undefined;
    ManagerProfile: undefined;
    RenderManagerTabs: { activeTab?: string };
    ManagerHeader: undefined;
    ManagerMyEvents: undefined;
    ManagerChat: undefined;
    ManagerSettings: undefined;
    AddEvent: { mode?: OperationValue; eventData?: event_row };
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
export type ProfileUpdateScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'ProfileUpdateScreen'>;
export type PhoneProps = NativeStackScreenProps<RootStackParamList, 'Phone'>;
export type AddEventProps = NativeStackScreenProps<RootStackParamList, 'AddEvent'>;


type TabNavigationProps = BottomTabNavigationProp<ManagerListBase, keyof ManagerListBase>;

export type ManagerHeaderScreenProps = {
    navigation: TabNavigationProps;
};

export type EmployeeHeaderScreenProps = {
    navigation: BottomTabNavigationProp<EmployeeListBase, keyof EmployeeListBase>;
};



export type NavigationProps =
    | NativeStackScreenProps<RootStackParamList, keyof RootStackParamList>

