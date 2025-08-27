import React, { useState } from 'react';
import { Alert, StyleSheet,  View,  Keyboard } from 'react-native';
import { supabase } from '@/lib/supabase';
import Loader from '@/components/Loader';
import { NavigationProps } from '../../RootLayoutHelpers';
import * as Sentry from "@sentry/react-native";
import { useSnackbar } from '@/components/SnackBar';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';

export default function ManagerSignUp({ navigation }: NavigationProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setcompanyName] = useState('');
    const [name, setname] = useState('');
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();

    async function signUpWithEmail() {
        setLoading(true);
        Keyboard.dismiss();

        if (email === '' || password === '') {
            Alert.alert('Email and password cannot be empty!');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            showSnackbar(error.message, 'error');
            Sentry.captureException("Error signing up manager: " + error.message);
        }

        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: data?.user?.id,
                name,
                email,
                user_type: 'MANAGER',
                created_at: new Date(),
            });

        const { error: managerError } = await supabase
            .from('managers')
            .insert({
                id: data?.user?.id,
                email,
                name: name,
                company_name: companyName,
                created_at: new Date(),
            });

        if (managerError) {
            Sentry.captureException("Error saving manager data: " + managerError.message);
        }

        if (userError) {
            Sentry.captureException("Error saving user data: " + userError.message);
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (signInError) {
            Sentry.captureException("Error signing in: " + signInError.message);
            showSnackbar(signInError.message, 'error');
            setLoading(false);
            return;
        } 
        navigation.navigate('ManagerDashboard');
        setLoading(false);
    }

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('Auth');
        }
    }

    return (
        <>
            {loading && <Loader />}
            <View style={styles.container}>
                <AppInput
                    label="Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize="none"
                    inputStyle={{ color: '#ffffff' }}
                />
                <AppInput
                    label="Name"
                    onChangeText={(text) => setname(text)}
                    value={name}
                    placeholder="Name"
                    inputStyle={{ color: '#ffffff' }}
                />
                <AppInput
                    label="Company Name"
                    onChangeText={(text) => setcompanyName(text)}
                    value={companyName}
                    placeholder="Company Name"
                    inputStyle={{ color: '#ffffff' }}
                />
                <AppInput
                    label="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                    inputStyle={{ color: '#ffffff' }}
                />
                <View style={styles.btncontainer}>
                    <AppButton title="Back to Home" onPress={handleGoBack} />
                    <AppButton title="Sign Up" onPress={signUpWithEmail} />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    btncontainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
});
