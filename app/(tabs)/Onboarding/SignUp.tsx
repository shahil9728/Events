import React, { useState } from 'react'
import { Keyboard, StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, Image, useColorScheme } from 'react-native'
import { supabase } from '../../../lib/supabase'
import Icon from '@/helpers/Icon';
import Loader from '../../../components/Loader'
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { useTheme } from '../../ThemeContext';
import { useSnackbar } from '@/components/SnackBar';
import { useDispatch } from 'react-redux'
import { setId, setOnboardingData } from '@/app/redux/Employee/onboarding/onboardingActions'
import { Ionicons } from '@expo/vector-icons'
import EDialog from '@/components/EDialog'
import ETextInputContainer from '@/components/ETextInputContainer'
import * as Sentry from "@sentry/react-native";
import AppButton from '@/components/AppButton';

export default function SignUp({ navigation }: NavigationProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const styles = createStyles(theme);
    const { showSnackbar } = useSnackbar();
    const colorScheme = useColorScheme();

    const joinNow = async () => {
        setLoading(true)
        Keyboard.dismiss();
        if (email === '' || password === '' || name === '') {
            showSnackbar('All fields are required', 'error')
            setLoading(false)
            return
        }

        const { data: session, error: error1 } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    displayName: name
                }
            }
        })

        if (error1) showSnackbar(error1.message, "error")
        else {
            dispatch(setOnboardingData({ email: email, name: name, id: session?.user?.id }))
            const { error } = await supabase
                .from('users')
                .insert({
                    id: session?.user?.id,
                    email: email,
                    name: name,
                    created_at: new Date(),
                });

            if (error) {
                Sentry.captureException("Error saving user data: " + error.message);
            }
            navigation.navigate('Phone')
        }
        setLoading(false)
    }

    const handleDialog = (msg: string) => {
        setShowDialog(true);
        setDialogMsg(msg);
    }

    return (
        <View style={styles.container}>
            {loading ? <Loader /> : (
                <>
                    <Image source={require('../../../assets/images/logo1.png')} style={{ width: 250, height: 100, marginBottom: 5 }} />
                    <View style={styles.verticallySpaced}>
                        <AppButton
                            title="Sign Up with Google"
                            disabled={loading}
                            onPress={() => handleDialog('Google Sign-Up is not available yet')}
                            icon={<Icon name='google' type='font-awesome' size={20} color={theme.secondaryColor} />}
                            buttonStyle={styles.socialButtonStyle}
                            containerStyle={styles.socialButtonContainer}
                            titleStyle={styles.socialButtonTitle}
                        />
                        <AppButton
                            title="Sign Up with Facebook"
                            disabled={loading}
                            onPress={() => handleDialog('Facebook Sign-Up is not available yet')}
                            icon={<Icon name='facebook' type='font-awesome' size={20} color={theme.secondaryColor} />}
                            buttonStyle={styles.socialButtonStyle}
                            containerStyle={styles.socialButtonContainer}
                            titleStyle={styles.socialButtonTitle}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 25 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
                        <View>
                            <Text style={{ paddingHorizontal: 8, color: "gray", fontSize: 15 }}>Or</Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <ETextInputContainer
                            placeholder="Enter Name"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        <ETextInputContainer
                            placeholder="Enter Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            autoCapitalize='none'
                        />
                        <ETextInputContainer
                            placeholder="Enter Password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={!passwordVisible}
                        >
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setPasswordVisible(!passwordVisible)}
                            >
                                <Ionicons
                                    name={passwordVisible ? "eye-off" : "eye"}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </ETextInputContainer>
                        <AppButton
                            title="Join Now"
                            disabled={loading}
                            onPress={joinNow}
                            titleStyle={{
                                textAlign: "center",
                                flex: 1,
                                color: theme.lightGray1,
                            }}
                            buttonStyle={{
                                padding: 15,
                                paddingHorizontal: 15,
                                backgroundColor: theme.primaryColor,
                            }}
                            containerStyle={{
                                borderRadius: 50,
                                width: "100%",
                                marginTop: 10,
                            }}
                        />
                    </View>
                    <View style={styles.signupCont}>
                        <Text style={{ color: theme.lightGray2 }}>
                            Already have an account?
                        </Text>
                        <AppButton title="Log In" disabled={loading}
                            onPress={() => navigation.reset({
                                index: 0,
                                routes: [{ name: 'Auth' }],
                            })}
                            titleStyle={{
                                color: theme.primaryColor1,
                            }}
                            buttonStyle={{
                                backgroundColor: "transparent",
                            }}
                            containerStyle={{
                                width: "50%",
                                display: "flex",
                                alignItems: 'flex-end',
                            }}
                        />
                    </View>
                    <EDialog
                        visible={showDialog}
                        onClose={() => {
                            setShowDialog(false);
                        }}
                        cancelText="Ok"
                        message={dialogMsg}
                    />
                </>
            )}
        </View>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        height: "100%",
        backgroundColor: theme.backgroundColor,
    },
    textInputCont: {
        padding: 10,
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
    verticallySpaced: {
        paddingVertical: 10,
        paddingBottom: 0,
        alignSelf: 'stretch',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
    },
    btn: {
        padding: 15,
        width: "100%",
        borderRadius: 50,
        backgroundColor: theme.primaryColor,
    },
    signupCont: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        width: "95%",
    },
    socialButtonStyle: {
        justifyContent: 'flex-start',
        padding: 15,
        paddingHorizontal: 20,
        backgroundColor: theme.lightGray1,
    },
    socialButtonContainer: {
        borderRadius: 50,
        width: '100%',
    },
    socialButtonTitle: {
        textAlign: 'center',
        flex: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: '50%',
    }
})

