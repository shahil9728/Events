import { useTheme } from '@/app/ThemeContext'
import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-paper';

const Phone1 = ({ contactNumber, setContactNumber }: { contactNumber: string, setContactNumber: React.Dispatch<React.SetStateAction<string>> }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const handleInputChange = useCallback((text: string) => {
        setContactNumber(text);
    }, [setContactNumber]);


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>What's your phone number?</Text>
            <View style={styles.textInputCont}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter Number"
                    placeholderTextColor={theme.lightGray2}
                    onChangeText={handleInputChange}
                    value={contactNumber}
                    keyboardType='numeric'
                    textColor={theme.secondaryColor}
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
        padding: 5,
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
    },

})

export default Phone1