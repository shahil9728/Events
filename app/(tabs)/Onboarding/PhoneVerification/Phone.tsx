import GenericForm from '@/components/GenericForm'
import React, { useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'
import Phone1 from './Phone1';
import Phone2 from './Phone2';
import { useSnackbar } from '@/components/SnackBar';
import axios from 'axios';
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { supabase } from '@/lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { setNumber, setNumberVerified } from '@/app/redux/Employee/onboarding/onboardingActions';
import useExitAppOnBackPress from '@/hooks/useExitAppOnBackPress';
import { generateOtp } from '../../utils';

const Phone = ({ navigation }: NavigationProps) => {
    useExitAppOnBackPress();
    const [currentScreen, setCurrentScreen] = useState(1);
    const [contactNumber, setContactNumber] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const { showSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [generatedOtp, setGeneratedOtp] = useState('');
    const onboardingUser = useSelector((state: any) => state.onboardingReducer);

    const sendOtp = async (contactNumber: string) => {
        try {
            const otp = generateOtp();
            setGeneratedOtp(otp);
            dispatch(setNumber(contactNumber));
            console.log(otp);
            const response = await axios.post(
                "https://n4u6j24rib.execute-api.ap-south-1.amazonaws.com/TwillService/sendmessage",
                { "phoneNumber": "+91" + contactNumber, "otp": otp },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            if (!response.data.success) {
                showSnackbar("Error sending OTP. Please try again.", 'error');
                return;
            } else {
                showSnackbar("OTP sent successfully.", 'success');
            }
            setCurrentScreen(2);
        } catch (err) {
            console.log("Error in Phone ", err);
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
                // showSnackbar("OTP verified successfully.", 'success');
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
                        number: contactNumber,
                        phoneVerified: true,
                    });

                if (error) {
                    console.log('Error saving user data:', error.message);
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


    const handleNext = async () => {
        setIsLoading(true);
        if (currentScreen === 1) {
            if (!contactNumber || contactNumber.length !== 10 || isNaN(Number(contactNumber))) {
                showSnackbar("Please enter a valid phone number.", 'error');
                setIsLoading(false);
                return;
            }

            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('number', contactNumber)
                .single();

            if (existingUser) {
                showSnackbar("Phone number is already registered", 'error');
                setIsLoading(false);
                return;
            } else {
                // Send OTP
                await sendOtp(contactNumber);
            }
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
                    <Phone2 otp={otp} setOtp={setOtp} contactNumber={contactNumber} setCurrentScreen={setCurrentScreen} />
                </GenericForm>
            )}
        </View>
    )
}

export default Phone