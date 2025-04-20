import { NavigationProps } from '@/app/RootLayoutHelpers';
import { useTheme } from '@/app/ThemeContext'
import SuccessCheckmark from '@/components/SuccessCheckMark';
import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const QuestionFinal = ({ navigation }: NavigationProps) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.container}>
            <View style={{ marginTop: 50, alignItems: "center" }}>
                <Text style={styles.heading}>Hey buddy, you are all set.</Text>
                <Text style={styles.subheading}>Fetch top events for you right now.</Text>
                <SuccessCheckmark />
            </View>
            <View style={{ width: "100%" }}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RenderEmployeeTabs')}>
                    <Text style={styles.buttonText}>Go to Events</Text>
                </TouchableOpacity>
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
        textAlign: 'center',
    },
    subheading: {
        color: "white",
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
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

export default QuestionFinal
