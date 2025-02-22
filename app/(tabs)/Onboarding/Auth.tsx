import React, { useEffect, useState } from 'react'
import { Keyboard, StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { Button, Icon } from '@rneui/themed'
import { User } from '@supabase/supabase-js';
import Loader from '../../../components/Loader'
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { useDispatch } from 'react-redux';
import { setEmployeeId, setManagerId } from '../../redux/Employee/accountInfo/accountInfoActions';
import { useTheme } from '../../ThemeContext';
import { useSnackbar } from '@/components/SnackBar';
import { Ionicons } from '@expo/vector-icons';

export default function Auth({ navigation }: NavigationProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [userType, setUserType] = useState(null)
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await checkUserType(session.user);
            }
        };

        fetchSession();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkUserType(session.user);
            }
            else {
                setUserType(null);
                navigation.navigate('Auth');
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const checkUserType = async (user: any) => {
        const { data, error } = await supabase
            .from('users')
            .select('user_type,phoneVerified')
            .eq('id', user?.id)
            .maybeSingle()

        if (error) {
            console.error("Error fetching user data:", error.message);
            return;
        }
        if (data == null) {
            console.log("No user data found in db. User is maybe registerd");
            return;
        }
        else if (data?.user_type === null) {
            navigation.navigate('Onboarding', {
                email: user.email ?? '',
                password: password,
                name: user.email ?? '',
            });
        } else if (data && !data?.phoneVerified) {
            if (user) {
                // Case when user leaves without phone verification
                navigation.navigate('Phone', { user_type: data?.user_type });
            }
        } else {
            if (data) {
                setUserType(data.user_type);
            }
        }
    }

    useEffect(() => {
        if (user) {
            if (userType === 'EMPLOYEE') {
                dispatch(setEmployeeId(user.id));
                navigation.navigate('RenderEmployeeTabs');
            } else if (userType === 'MANAGER') {
                dispatch(setManagerId(user.id));
                navigation.navigate('RenderManagerTabs');
            }
        }
    }, [userType, navigation, user])


    async function signInWithEmail() {
        setLoading(true)
        Keyboard.dismiss();
        if (email === '' || password === '') {
            showSnackbar('Email and password cannot be empty!', 'error')
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            console.log("error1", error);
            showSnackbar(error.message, "error")
        }
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            {loading ? <Loader /> : (
                <>
                    <View style={styles.verticallySpaced}>
                        <Button
                            title="Continue with Google"
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
                            title="Sign In"
                            disabled={loading}
                            onPress={() => signInWithEmail()}
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
                            Don't have an account?
                        </Text>
                        <Button title="Create account" disabled={loading}
                            onPress={() => navigation.navigate('SignUp')}
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

