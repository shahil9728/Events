import React, { useState } from 'react'
import { Keyboard, StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { Button, Icon } from '@rneui/themed'
import Loader from '../../../components/Loader'
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { useTheme } from '../../ThemeContext';
import { useSnackbar } from '@/components/SnackBar';
import { useDispatch } from 'react-redux'
import { setId, setOnboardingData } from '@/app/redux/Employee/onboarding/onboardingActions'
import { Ionicons } from '@expo/vector-icons'

export default function SignUp({ navigation }: NavigationProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const styles = createStyles(theme);
    const { showSnackbar } = useSnackbar();

    async function joinNow() {
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

        console.log("data", session?.user?.id, error1)
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
                console.log('Error saving user data:', error.message);
            }
            else {
                console.log('Successfully saved user data');
            }
            navigation.navigate('Onboarding', {
                email: email,
                password: password,
                name: name
            })
        }
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            {loading ? <Loader /> : (
                <>
                    <View style={styles.verticallySpaced}>
                        <Button
                            title="Sign Up with Google"
                            disabled={loading}
                            onPress={() => navigation.navigate('EmployeeSignUp')}
                            icon={<Icon name='google' type='font-awesome' size={20} color={theme.secondaryColor} />}
                            buttonStyle={styles.socialButtonStyle}
                            containerStyle={styles.socialButtonContainer}
                            titleStyle={styles.socialButtonTitle}
                        />
                        <Button
                            title="Continue with Facebook"
                            disabled={loading}
                            onPress={() => navigation.navigate('ManagerSignUp')}
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
                        <View style={styles.textInputCont}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Name"
                                placeholderTextColor={theme.lightGray2}
                                onChangeText={(text) => setName(text)}
                                value={name}
                            />
                        </View>
                        <View style={styles.textInputCont}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Email"
                                placeholderTextColor={theme.lightGray2}
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={styles.textInputCont}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Password"
                                placeholderTextColor={theme.lightGray2}
                                onChangeText={(text) => setPassword(text)}
                                value={password}
                                secureTextEntry={!passwordVisible}
                                autoCapitalize='none'
                            />
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
                        </View>
                        <Button
                            title="Join Now"
                            disabled={loading}
                            onPress={() => joinNow()}
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
                        <Button title="Log In" disabled={loading}
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
                            TouchableComponent={TouchableWithoutFeedback}
                        />
                    </View>
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
        padding: 12,
        paddingHorizontal: 20,
        height: "100%",
    },
    textInputCont: {
        padding: 15,
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

