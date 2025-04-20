import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Button } from '@rneui/themed';
import { useTheme } from '../../ThemeContext';
import { OnBoarding1Props } from '@/app/RootLayoutHelpers';
import IconwithContainer from '@/components/IconwithContainer';
import { OperationType } from '@/app/globalConstants';
import useExitAppOnBackPress from '@/hooks/useExitAppOnBackPress';

export default function OnBoarding1({ navigation }: OnBoarding1Props) {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    useExitAppOnBackPress();


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.heading}>Let's Get Started</Text>
                <Button
                    title="Create Event"
                    titleStyle={{
                        color: theme.secondaryColor,
                        textAlign: 'center',
                        flex: 1,
                    }}
                    buttonStyle={styles.primaryButton}
                    containerStyle={{
                        borderRadius: 50,
                        backgroundColor: 'transparent',
                        width: '100%',
                        borderColor: theme.secondaryColor,
                        borderWidth: 1,
                    }}
                    onPress={() => { navigation.navigate('AddEvent', { mode: OperationType.UPDATE, eventData: undefined }) }}
                    icon={
                        <IconwithContainer
                            iconName="chevron-forward-outline"
                            onPress={() => { navigation.navigate('AddEvent', { mode: OperationType.UPDATE, eventData: undefined }) }}
                        />
                    }
                    iconPosition='right'
                />
                <Button
                    title="Browse Profiles"
                    titleStyle={{
                        color: theme.secondaryColor,
                        textAlign: 'center',
                        flex: 1,
                    }}
                    buttonStyle={styles.primaryButton}
                    containerStyle={{
                        borderRadius: 50,
                        backgroundColor: 'transparent',
                        width: '100%',
                        borderColor: theme.secondaryColor,
                        borderWidth: 1,
                    }}
                    onPress={() => { navigation.navigate('RenderManagerTabs', { activeTab: 'ManagerDashboard' }) }}
                    icon={
                        <IconwithContainer
                            iconName="chevron-forward-outline"
                            onPress={() => { navigation.navigate('RenderManagerTabs', { activeTab: 'ManagerDashboard' }) }}
                        />
                    }
                    iconPosition='right'
                />
            </View>
        </ScrollView>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: theme.backgroundColor,
        flexGrow: 1,
        justifyContent: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: 15,
    },
    subheading: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.secondaryColor,
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        color: theme.primaryColor,
        marginBottom: 16,
    },
    textInputCont: {
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 50,
        backgroundColor: theme.lightGray1,
        width: "100%"
    },
    textInput: {
        backgroundColor: "transparent",
        width: "100%",
        borderBottomWidth: 0,
        fontSize: 16,
        color: theme.secondaryColor,
    },
    primaryButton: {
        backgroundColor: "transparent",
        padding: 10,
    },
});
