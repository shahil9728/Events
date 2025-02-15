import { useTheme } from '@/app/ThemeContext'
import React, { useRef, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { TextInput as TextInput1 } from 'react-native-paper';

interface Phone2Props {
    otp: string[];
    setOtp: React.Dispatch<React.SetStateAction<string[]>>;
    handleNext: () => void;
}


const Phone2 = ({ otp, setOtp }: Phone2Props) => {
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const { theme } = useTheme();
    const styles = createStyles(theme);

    interface InputChangeHandler {
        (text: string, index: number): void;
    }

    const handleInputChange: InputChangeHandler = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    interface BackspaceHandler {
        (text: string, index: number): void;
    }

    const handleBackspace: BackspaceHandler = (text, index) => {
        if (!text && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Enter your verification code</Text>
            <Text style={styles.subheading}>Sent on number</Text>
            <View style={styles.otpContainer}>
                {otp.map((digit: string, index: number) => (
                    <TextInput1
                        key={index}
                        ref={(ref: TextInput | null) => (inputRefs.current[index] = ref)}
                        value={digit}
                        onChangeText={(text: string) => handleInputChange(text, index)}
                        onKeyPress={({ nativeEvent }: { nativeEvent: { key: string } }) => {
                            if (nativeEvent.key === 'Backspace') {
                                handleBackspace(digit, index);
                            }
                        }}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        placeholder="_"
                        placeholderTextColor="#999"
                    />
                ))}
            </View>
        </View>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: theme.backgroundColor,
    },
    heading: {
        color: theme.headingColor,
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    subheading: {
        fontSize: 14,
        textAlign: 'center',
        color: theme.lightGray
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
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    otpInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textAlign: 'center',
        fontSize: 18,
        color: '#333',
        borderRadius: 8,
        width: 50,
        height: 50,
    },
})

export default Phone2