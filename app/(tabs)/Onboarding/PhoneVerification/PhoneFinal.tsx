import { NavigationProps } from '@/app/RootLayoutHelpers';
import { useTheme } from '@/app/ThemeContext'
import IconwithContainer from '@/components/IconwithContainer';
import React from 'react'
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';

const PhoneFinal = ({ navigation }: NavigationProps) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.container}>
            <View style={{ marginTop: 50, alignItems: "center" }}>
                <Text style={styles.heading}>Verified Successfully</Text>
                <Image source={require('../../../../assets/images/check.gif')} />
            </View>
            <View style={{ width: "100%", padding: 15, alignItems: "flex-end" }}>
                <IconwithContainer
                    iconName='chevron-forward-outline'
                    onPress={() => navigation.navigate('ProfileUpdateScreen', { name1: "ProfileUpdateScreen" })}
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
        fontSize: 36,
        fontWeight: 'bold',
        marginVertical: 20,
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