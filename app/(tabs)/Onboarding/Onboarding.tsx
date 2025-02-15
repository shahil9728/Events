import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useTheme } from '../../ThemeContext';
import { OnBoardingProps } from '@/app/RootLayoutHelpers';
import { ActivityIndicator } from 'react-native';
import IconwithContainer from '@/components/IconwithContainer';

export default function OnBoarding({ route, navigation }: OnBoardingProps) {
    const { email, password, name } = route.params;
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const handleOptionSelect = (option: string) => {
        setIsLoading(true);
        setSelectedOption(option);
        setTimeout(() => {
            setIsLoading(false);
            if (option === 'work') {
                navigation.navigate('Phone')
                setSelectedOption(null);
            }
            else {
                navigation.navigate('Onboarding1', {
                    email,

                    password,
                    name,
                    option,
                })
                setSelectedOption(null);
            }
        }, 1000);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                        <IconwithContainer onPress={() => { handleOptionSelect('work') }}>
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
                        <IconwithContainer onPress={() => { handleOptionSelect('hire') }}>
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
        padding: 16,
        backgroundColor: theme.backgroundColor,
        flexGrow: 1,
        justifyContent: 'center',
    },
    buttonRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginVertical: 20,
        gap: 10,
    },
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
    },
    subheading: {
        fontSize: 14,
        textAlign: 'center',
        color: theme.secondaryColor,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.primaryColor,
        textAlign: 'center',
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
    pickerContainer: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: theme.lightGray1,
        width: "100%"
    },
    picker: {
        color: theme.secondaryColor,
    },
    selectedSkillsBanner: {
        color: theme.primaryColor,
        textAlign: 'center',
        marginVertical: 10,
    },
    primaryButton: {
        justifyContent: 'flex-start',
        backgroundColor: "transparent",
        padding: 10,
        paddingHorizontal: 10,
    },
    primaryButtonTitle: {
        textAlign: 'center',
        flex: 1,
    },
    secondaryButton: {
        backgroundColor: theme.secondaryColor,
        padding: 15,
        marginTop: 10,
        borderRadius: 10,
    },
    IconContainer: {
        backgroundColor: theme.lightGray1,
        borderRadius: 50,
        width: 50,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
