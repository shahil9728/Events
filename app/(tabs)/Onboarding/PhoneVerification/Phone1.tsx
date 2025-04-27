import { useTheme } from '@/app/ThemeContext'
import ETextInputContainer from '@/components/ETextInputContainer';
import React from 'react'
import { Keyboard } from 'react-native';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'

const Phone1 = ({ contactNumber, setContactNumber }: { contactNumber: string, setContactNumber: React.Dispatch<React.SetStateAction<string>> }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text style={styles.heading}>What's your phone number?</Text>
                <ETextInputContainer
                    placeholder="Enter Number"
                    value={contactNumber}
                    onChangeText={(text) => setContactNumber(text)}
                    keyboardType='phone-pad'
                />
            </View>
        </TouchableWithoutFeedback>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    heading: {
        color: theme.headingColor,
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 20,
        marginBottom: 40,
    },
})

export default Phone1