import { ICONTYPE } from '@/app/globalConstants';
import { useTheme } from '@/app/ThemeContext'
import Icon from '@/helpers/Icon';
import React, { useRef } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

interface Phone2Props {
    otp: string[];
    setOtp: React.Dispatch<React.SetStateAction<string[]>>;
    contactNumber: string;
    setCurrentScreen?: any;
}


const Phone2 = ({ otp, setOtp, contactNumber, setCurrentScreen }: Phone2Props) => {
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

        if (text && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    interface BackspaceHandler {
        (text: string, index: number): void;
    }

    const handleBackspace: BackspaceHandler = (text, index) => {
        const newOtp = [...otp];
        if (!text && index > 0) {
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        } else {
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Enter your verification code</Text>
            <View style={styles.subheading}>
                <Text style={styles.subheading}>Sent on number {contactNumber}</Text>
                <Icon name='pencil' type={ICONTYPE.IONICON} size={20} color={theme.primaryColor} onPress={() => setCurrentScreen(1)} style={{ marginLeft: 5 }} />
            </View>
            <View style={styles.otpContainer}>
                {otp.map((digit: string, index: number) => (
                    <TextInput
                        key={index}
                        ref={(ref: TextInput | null) => { inputRefs.current[index] = ref; }}
                        value={digit}
                        onChangeText={(text: string) => handleInputChange(text, index)}
                        onKeyPress={({ nativeEvent }: { nativeEvent: { key: string } }) => {
                            if (nativeEvent.key === 'Backspace') {
                                handleBackspace(digit, index);
                            }
                        }}
                        style={styles.otpInput}
                        keyboardType="phone-pad"
                        maxLength={1}
                    />
                ))}
            </View>
        </View>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        color: theme.headingColor,
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    subheading: {
        fontSize: 14,
        color: theme.lightGray2,
        display: 'flex',
        flexDirection: 'row',
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
        backgroundColor: "transparent",
    },
    otpInput: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: "transparent",
        padding: 10,
        textAlign: 'center',
        fontSize: 18,
        color: theme.headingColor,
        borderRadius: 8,
        width: 50,
        height: 50,
    },
})

export default Phone2