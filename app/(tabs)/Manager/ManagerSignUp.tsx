import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View, Text, Keyboard } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { supabase } from '@/lib/supabase';
import Loader from '@/components/Loader';
import { NavigationProps } from '../../RootLayoutHelpers';


export default function ManagerSignUp({ navigation }: NavigationProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setcompanyName] = useState('');
    const [name, setname] = useState('');
    const [loading, setLoading] = useState(false);

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
            Alert.alert(error.message)
            console.log('Error signup data:', error.message);
        }
        else {
            console.log('Successfully signed up');
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
            console.log('Error saving managers data:', managerError.message);
        }
        else {
            console.log('Successfully saved the manager');
        }

        if (userError) {
            console.log('Error saving users data:', userError.message);
        } else {
            console.log('Successfully saved the user');
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (signInError) {
            Alert.alert('Error signing in', signInError.message);
            setLoading(false);
            return;
        } else {
            console.log('Successfully signed in');
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
                <Input
                    label="Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize="none"
                    inputStyle={{ color: '#ffffff' }}
                />
                <Input
                    label="Name"
                    onChangeText={(text) => setname(text)}
                    value={name}
                    placeholder="Name"
                    inputStyle={{ color: '#ffffff' }}
                />
                <Input
                    label="Company Name"
                    onChangeText={(text) => setcompanyName(text)}
                    value={companyName}
                    placeholder="Company Name"
                    inputStyle={{ color: '#ffffff' }}
                />
                <Input
                    label="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                    inputStyle={{ color: '#ffffff' }}
                />
                <View style={styles.btncontainer}>
                    <Button title="Back to Home" onPress={handleGoBack} />
                    <Button title="Sign Up" onPress={signUpWithEmail} />
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
