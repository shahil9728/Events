import { useTheme } from '@/app/ThemeContext'
import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

const Phone1 = ({ contactNumber, setContactNumber }: { contactNumber: string, setContactNumber: React.Dispatch<React.SetStateAction<string>> }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>What's your phone number?</Text>
            <View style={styles.textInputCont}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter Number"
                    placeholderTextColor={theme.lightGray2}
                    onChangeText={(text) => setContactNumber(text)}
                    value={contactNumber}
                    keyboardType='phone-pad'
                />
            </View>
        </View>
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
    },
    textInputCont: {
        marginTop: 20,
        padding: 15,
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

})

export default Phone1