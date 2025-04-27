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
import { supabase } from '@/lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { updateManagerInfo } from '@/app/redux/Employee/accountInfo/accountInfoActions';

export default function OnBoarding1({ navigation }: OnBoarding1Props) {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const dispatch = useDispatch();
    useExitAppOnBackPress();

    const onboardingUser = useSelector((state: any) => state.onboardingReducer);

    const handleClick = async (option: string) => {
        dispatch(updateManagerInfo({
            number: onboardingUser.number,
        }))
        const { error: error1 } = await supabase.from('managers').upsert({
            id: onboardingUser.id,
            number: onboardingUser.number,
        });

        if (error1) {
            console.log('Error saving manager data:', error1.message);
        }
        else {
            console.log('Successfully saved manager data');
        }

        if (option === 'event') {
            navigation.navigate('AddEvent', { mode: OperationType.CREATE, eventData: undefined });
        } else {
            navigation.navigate('RenderManagerTabs', { activeTab: 'ManagerDashboard' });
        }
    }


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
                    onPress={() => { handleClick('event') }}
                    icon={
                        <IconwithContainer
                            iconName="chevron-forward-outline"
                            onPress={() => { handleClick('event') }}
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
                    onPress={() => { handleClick('browse') }}
                    icon={
                        <IconwithContainer
                            iconName="chevron-forward-outline"
                            onPress={() => { handleClick('browse') }}
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
