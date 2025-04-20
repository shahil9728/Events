import React, { useEffect, useState } from 'react'
import { Keyboard, StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, Alert, Image } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { Button, Icon } from '@rneui/themed'
import { User } from '@supabase/supabase-js';
import Loader from '../../../components/Loader'
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { useDispatch } from 'react-redux';
import { setEmployeeId, setManagerId, updateEmployeeInfo } from '../../redux/Employee/accountInfo/accountInfoActions';
import { useTheme } from '../../ThemeContext';
import { useSnackbar } from '@/components/SnackBar';
import { Ionicons } from '@expo/vector-icons';
import EDialog from '@/components/EDialog';
import { ICONTYPE } from '@/app/globalConstants';

export default function Auth({ navigation }: NavigationProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [userType, setUserType] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
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
            console.log("No user data found. Please sign up first.");
            // handleDialog("No user data found. Please sign up first.");
            return;
        }
        else if (data?.user_type === null) {
            // Case when user leaves without phone verification
            navigation.navigate('Phone');
        } else if (data && !data?.phoneVerified) {
            if (user) {
                navigation.navigate('Onboarding');
            }
        } else {
            if (data) {
                setUserType(data.user_type);
            }
        }
    }

    useEffect(() => {
        const handleUserType = async () => {
            if (user) {
                async function getEmployeeProfile() {
                    try {
                        setLoading(true);
                        let { data, error, status } = await supabase
                            .from('employees')
                            .select(`*`)
                            .eq('id', user?.id)
                            .single();
                        if (error && status !== 406) {
                            throw error;
                        }
                        if (data) {
                            dispatch(updateEmployeeInfo(data));
                        }
                    } catch (error) {
                        if (error instanceof Error) {
                            console.log("Error at Employee Settings ", error.message);
                        }
                    } finally {
                        setLoading(false);
                    }
                }

                async function getManagerProfile() {
                    try {
                        setLoading(true);
                        let { data, error, status } = await supabase
                            .from('managers')
                            .select(`*`)
                            .eq('id', user?.id)
                            .single();
                        if (error && status !== 406) {
                            throw error;
                        }
                        if (data) {
                            dispatch(updateEmployeeInfo(data));
                        }
                    } catch (error) {
                        if (error instanceof Error) {
                            console.log("Error at Manager Settings ", error.message);
                        }
                    } finally {
                        setLoading(false);
                    }
                }

                if (userType === 'EMPLOYEE') {
                    await getEmployeeProfile();
                    dispatch(setEmployeeId(user.id));
                    navigation.navigate('RenderEmployeeTabs');
                } else if (userType === 'MANAGER') {
                    await getManagerProfile();
                    dispatch(setManagerId(user.id));
                    navigation.navigate('RenderManagerTabs');
                }
            }
        };

        handleUserType();
    }, [userType, navigation, user])

    const handleDialog = (msg: string) => {
        setShowDialog(true);
        setDialogMsg(msg);
    }

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
                    <Image source={require('../../../assets/images/logo1.png')} style={{ width: 250, height: 100, marginBottom: 24 }} />
                    <View style={styles.verticallySpaced}>
                        <Button
                            title="Continue with Google"
                            disabled={loading}
                            onPress={() => handleDialog("Sorry this feature is not available yet. Please use the email and password to sign in.")}
                            icon={<Icon name='google' type={ICONTYPE.FONTAWESOME} size={20} color={theme.secondaryColor} />}
                            buttonStyle={styles.socialButtonStyle}
                            containerStyle={styles.socialButtonContainer}
                            titleStyle={styles.socialButtonTitle}
                        />
                        <Button
                            title="Continue with Facebook"
                            disabled={loading}
                            onPress={() => setShowDialog(true)}
                            icon={<Icon name='facebook' type={ICONTYPE.FONTAWESOME} size={20} color={theme.secondaryColor} />}
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
        padding: 12,
        paddingHorizontal: 20,
        height: "100%",
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

