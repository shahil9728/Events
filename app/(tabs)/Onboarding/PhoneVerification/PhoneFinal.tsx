import { NavigationProps } from '@/app/RootLayoutHelpers';
import { useTheme } from '@/app/ThemeContext'
import IconwithContainer from '@/components/IconwithContainer';
import useExitAppOnBackPress from '@/hooks/useExitAppOnBackPress';
import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native';
import { AnimatedImage } from 'react-native-animated-image';
import SuccessCheckmark from '@/components/SuccessCheckMark';


const PhoneFinal = ({ navigation }: NavigationProps) => {
    useExitAppOnBackPress();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const handleNext = async () => {
        navigation.navigate('Onboarding')
    }

    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center", display: "flex", justifyContent: "center", height: "80%" }}>
                <SuccessCheckmark />
                <Text style={styles.heading}>Succcess</Text>
                <Text style={styles.subheading}>Your phone number has been successfully verified</Text>
            </View>
            <View style={{ width: "100%", padding: 15, alignItems: "flex-end" }}>
                <IconwithContainer
                    iconName='chevron-forward-outline'
                    onPress={handleNext}
                />
            </View>
        </View>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: "100%",
    },
    heading: {
        color: "white",
        fontSize: 25,
        fontWeight: 600,
        marginTop: 60,
    },
    subheading: {
        color: "white",
        fontSize: 15,
    },
    button: {
        backgroundColor: theme.lightGray1,
        padding: 20,
        paddingHorizontal: 15,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default PhoneFinal