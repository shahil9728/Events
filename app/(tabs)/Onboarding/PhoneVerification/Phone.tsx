import GenericForm from '@/components/GenericForm'
import React, { useState } from 'react'
import { View } from 'react-native'
import Phone1 from './Phone1';
import Phone2 from './Phone2';
import { useSnackbar } from '@/components/SnackBar';
import * as SMS from 'expo-sms';


const Phone = () => {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [contactNumber, setContactNumber] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
    const { showSnackbar } = useSnackbar();
    const code = 42433;

    const sendOtp = async (contactNumber: string) => {
        setIsLoading(true);
        try {
            const isAvailable = await SMS.isAvailableAsync();
            if (!isAvailable) {
                showSnackbar("SMS is not available on this device.", 'error');
                return;
            }

            const isSent = await SMS.sendSMSAsync([contactNumber], `Your OTP is: ${code}`);
            console.log(isSent);
        } catch (err) {
            showSnackbar("Error sending OTP. Please try again.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async () => {
        setIsLoading(true);
        const otpCode = otp.join('');

        try {
            if (otpCode !== code.toString()) {
                showSnackbar("Invalid OTP. Please try again.", 'error');
                return;
            }
            else {
                showSnackbar("OTP verified successfully.", 'success');
            }
        } catch (err) {
            showSnackbar("Error verifying OTP. Please try again.", 'error');
        } finally {
            setIsLoading(false);
        }
    }


    const handleNext = () => {
        if (currentScreen === 1) {

            if (!contactNumber) {
                showSnackbar("Please enter a valid phone number.", 'error');
                return;
            }
            // Send OTP
            sendOtp(contactNumber);
        }
        else if (currentScreen === 2) {
            // Verify OTP
            if (otp.some(digit => digit !== '')) {
                showSnackbar("Please enter a valid OTP.", 'error');
                return;
            }
            verifyOtp();
        }
    };

    const screenIcons = [
        { iconName: 'phone', active: currentScreen === 1 },
        { iconName: 'verified', active: currentScreen === 2 }
    ];


    return (
        <View>
            {currentScreen === 1 && (
                <GenericForm footerMsg="Step 1 of 2" handleNext={handleNext} icons={screenIcons} isLoading={isLoading}>
                    <Phone1 contactNumber={contactNumber} setContactNumber={setContactNumber} />
                </GenericForm>
            )}
            {currentScreen === 2 && (
                <GenericForm footerMsg="Step 2 of 2" icons={screenIcons}>
                    <Phone2 otp={otp} setOtp={setOtp} handleNext={handleNext} />
                </GenericForm>
            )}
        </View>
    )
}

export default Phone