import GenericForm from '@/components/GenericForm'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Phone1 from './Phone1';
import Phone2 from './Phone2';
import { useSnackbar } from '@/components/SnackBar';
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { supabase } from '@/lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { setNumber, setNumberVerified } from '@/app/redux/Employee/onboarding/onboardingActions';
import useExitAppOnBackPress from '@/hooks/useExitAppOnBackPress';
import * as Sentry from "@sentry/react-native";
const authToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLThFODUwMURGQkUyMzQ2MSIsImlhdCI6MTc1NjI3Mzk5MSwiZXhwIjoxOTEzOTUzOTkxfQ.-eslZtedd5OmFZ9C6MTH5Wc5RREx7uyjj7H-V71DjOE7Adepy98-VsgxAhfEGivRtjk5zfNVbqXdbmFYuW4fwA";

const Phone = ({ navigation }: NavigationProps) => {
    useExitAppOnBackPress();
    const [currentScreen, setCurrentScreen] = useState(1);
    const [contactNumber, setContactNumber] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [otpValidationId, setOtpValidationId] = useState("");
    const { showSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const onboardingUser = useSelector((state: any) => state.onboardingReducer);
    console.log("user", onboardingUser);

    const sendOtp = async (contactNumber: string): Promise<{ data?: any }> => {
        try {
            dispatch(setNumber(contactNumber));
            try {
                const response = await fetch(
                    `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-8E8501DFBE23461&senderId=UTOMOB&flowType=SMS&mobileNumber=${contactNumber}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            authToken: authToken,
                        },
                    }
                );

                const data = await response.json();
                console.log("data", data)
                setCurrentScreen(2);
                return data;
            } catch (error) {
                Sentry.captureException("Error sending OTP: " + error);
                return {};
            }

            // Twilio OTP process
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
        } catch (err) {
            Sentry.captureException("Error sending OTP: " + err);
            showSnackbar("Error sending OTP. Please try again.", 'error');
            return {};
        } finally {
            setIsLoading(false);
        }
    };


    const verifyOtp = async (verificationId: string, mobileNumber: string) => {
        setIsLoading(true);
        const otpCode = otp.join('');
        try {
            const response = await fetch(
                `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=91&mobileNumber=${mobileNumber}&verificationId=${verificationId}&customerId=C-8E8501DFBE23461&code=${otpCode}`,
                {
                    method: "GET",
                    headers: {
                        authToken: authToken,
                    },
                }
            );

            const data = await response.json();
            if (data?.message == "SUCCESS") {
                let id = ""
                if (onboardingUser.id == "") {
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
                    Sentry.captureException("Error saving user data: " + error.message);
                }
                else {
                    dispatch(setNumberVerified(true));
                }
                navigation.navigate('PhoneFinal');

            } else {
                showSnackbar("Error validating OTP. Please try again.", 'error');
            }
        } catch (error) {
            console.log("Error verifying OTP: ", error);
            showSnackbar("Error verifying OTP. Please try again.", 'error');
            throw error;
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
                const res = await sendOtp(contactNumber);
                setOtpValidationId(res?.data?.verificationId || "");
                console.log("res in handle next: ", res);
                console.log("OTP Validation ID: ", otpValidationId, res?.data);
            }
        }
        else if (currentScreen === 2) {
            // Verify OTP
            console.log("OTP Entered: ", otp, otpValidationId);
            if (otp.some(digit => digit === '') || !otpValidationId) {
                showSnackbar("Please enter a valid OTP.", 'error');
                return;
            }
            verifyOtp(otpValidationId, contactNumber);
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