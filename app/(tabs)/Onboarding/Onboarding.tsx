import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Button } from '@rneui/themed';
import { useTheme } from '../../ThemeContext';
import { OnBoardingProps } from '@/app/RootLayoutHelpers';
import { ActivityIndicator } from 'react-native';
import IconwithContainer from '@/components/IconwithContainer';
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '@/app/redux/Employee/onboarding/onboardingActions';
import { supabase } from '@/lib/supabase';
import { setEmployeeId, setManagerId, updateManagerInfo } from '@/app/redux/Employee/accountInfo/accountInfoActions';
import { UserRole } from '../employeeConstants';

export default function OnBoarding({ navigation }: OnBoardingProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const onboardingUser = useSelector((state: any) => state.onboardingReducer);


    const handleOptionSelect = async (option: string) => {
        setIsLoading(true);
        setSelectedOption(option);
        if (option === 'work') {
            dispatch(setRole(UserRole.EMPLOYEE));
            dispatch(setEmployeeId(onboardingUser.id));
            const { error } = await supabase
                .from('users')
                .upsert({
                    id: onboardingUser.id,
                    user_type: UserRole.EMPLOYEE,
                });

            if (error) {
                console.log('Error saving user data:', error.message);
            }
            else {
                console.log('Successfully saved user role data');
            }

            navigation.navigate('ProfileUpdateScreen', { name1: onboardingUser.name });
            setSelectedOption(null);
        }
        else {
            dispatch(setRole(UserRole.MANAGER));
            dispatch(setManagerId(onboardingUser.id));
            const { error } = await supabase
                .from('users')
                .upsert({
                    id: onboardingUser.id,
                    user_type: UserRole.MANAGER,
                });

            const { error: error1 } = await supabase.from('managers').upsert({
                id: onboardingUser.id,
                email: onboardingUser.email,
                name: onboardingUser.name,
            });

            if (error1) {
                console.log('Error saving manager data:', error1.message);
            }
            else {
                console.log('Successfully saved manager data');
            }

            if (error) {
                console.log('Error saving user data:', error.message);
            }
            else {
                dispatch(updateManagerInfo({
                    id: onboardingUser.id,
                    email: onboardingUser.email,
                    name: onboardingUser.name,
                }));
                console.log('Successfully saved user role data');
            }

            navigation.navigate('Onboarding1');
            setSelectedOption(null);
        }
        setIsLoading(false);
    }

    return (
        <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}
        >
            <View style={styles.buttonRow}>
                <Button
                    title="Find Event"
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
                    onPress={() => { handleOptionSelect('work') }}
                    icon={isLoading && selectedOption === 'work' ? (
                        <IconwithContainer>
                            <ActivityIndicator size="small" color={theme.primaryColor} />
                        </IconwithContainer>
                    ) : (
                        <IconwithContainer
                            iconName="chevron-forward-outline"
                            onPress={() => { handleOptionSelect('work') }}
                        />
                    )}
                    iconPosition='right'
                />
                <Button
                    title="Find Talent"
                    titleStyle={{
                        color: theme.secondaryColor,
                        textAlign: 'center',
                        flex: 1,
                    }}
                    buttonStyle={styles.primaryButton}
                    containerStyle={{
                        borderRadius: 50,
                        borderColor: theme.secondaryColor,
                        borderWidth: 1,
                        backgroundColor: 'transparent',
                        width: '100%',
                    }}
                    onPress={() => { handleOptionSelect('hire'); }}
                    icon={isLoading && selectedOption === 'hire' ? (
                        <IconwithContainer>
                            <ActivityIndicator size="small" color={theme.primaryColor} />
                        </IconwithContainer>
                    ) : (
                        <IconwithContainer
                            iconName="chevron-forward-outline"
                            onPress={() => { handleOptionSelect('hire') }}
                        />)}
                    iconPosition='right'
                />
            </View>
        </ScrollView>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: theme.backgroundColor,
        justifyContent: 'center',
    },
    buttonRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
    },
    primaryButton: {
        justifyContent: 'flex-start',
        backgroundColor: "transparent",
        padding: 10,
        paddingHorizontal: 10,
    },
});
