import GenericForm from '@/components/GenericForm'
import React, { useState } from 'react'
import { Alert, BackHandler, View } from 'react-native'
import Phone1 from './Phone1';
import Phone2 from './Phone2';
import { useSnackbar } from '@/components/SnackBar';
import { NavigationProps, PhoneProps } from '@/app/RootLayoutHelpers';
import axios from "axios";
import { supabase } from '@/lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { setNumberVerified } from '@/app/redux/Employee/onboarding/onboardingActions';
import { useFocusEffect } from 'expo-router';

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const Phone = ({ route, navigation }: PhoneProps) => {
    const user_type = route.params.user_type;
    const [currentScreen, setCurrentScreen] = useState(1);
    const [contactNumber, setContactNumber] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const { showSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [generatedOtp, setGeneratedOtp] = useState('');
    const onboardingUser = useSelector((state: any) => state.onboardingReducer);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert('Exit App', 'Do you want to exit the app?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );


    const sendOtp = async (contactNumber: string) => {
        setIsLoading(true);
        try {
            const otp = generateOtp();
            setGeneratedOtp(otp);
            console.log(otp);
            // const response = await axios.post(
            //     "https://n4u6j24rib.execute-api.ap-south-1.amazonaws.com/TwillService/sendmessage",
            //     { "phoneNumber": "+91" + contactNumber, "otp": otp },
            //     {
            //         headers: {
            //             "Content-Type": "application/json",
            //         }
            //     }
            // );
            // if (!response.data.success) {
            //     showSnackbar("Error sending OTP. Please try again.", 'error');
            //     return;
            // } else {
            //     showSnackbar("OTP sent successfully.", 'success');
            // }
            setCurrentScreen(2);
        } catch (err) {
            console.log(err);
            showSnackbar("Error sending OTP. Please try again.", 'error');
        } finally {
            setIsLoading(false);
        }
    };


    const verifyOtp = async () => {
        setIsLoading(true);
        const otpCode = otp.join('');
        try {
            if (otpCode !== generatedOtp) {
                showSnackbar("Error verifying OTP. Please try again.", 'error');
            } else {
                showSnackbar("OTP verified successfully.", 'success');
                let id = ""
                if (onboardingUser.id == "") {
                    console.log('No onboarding user found. Using session user id');
                    const { data: { session } } = await supabase.auth.getSession();
                    id = session?.user?.id ?? "";
                } else {
                    id = onboardingUser.id;
                }

                const { error } = await supabase
                    .from('users')
                    .upsert({
                        id: id,
                        phoneVerified: true,
                        user_type: user_type,
                    });

                if (error) {
                    Alert.alert('Error saving user data:', error.message);
                }
                else {
                    dispatch(setNumberVerified(true));
                    console.log('Successfully saved user phone data');
                }
                navigation.navigate('PhoneFinal');
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
            console.log(otp);
            if (otp.some(digit => digit === '')) {
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
                <GenericForm footerMsg="Step 2 of 2" icons={screenIcons} handleNext={handleNext}>
                    <Phone2 otp={otp} setOtp={setOtp} />
                </GenericForm>
            )}
        </View>
    )
}

export default Phone