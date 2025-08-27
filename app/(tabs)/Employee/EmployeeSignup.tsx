import React, { useState } from 'react';
import { Alert, StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // For resume upload
import { supabase } from '@/lib/supabase';
import { uploadToS3 } from '../../../helpers/aws';
import Loader from '@/components/Loader';
import { NavigationProps } from '../../RootLayoutHelpers';
import * as Sentry from "@sentry/react-native";
import { useSnackbar } from '@/components/SnackBar';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';

export default function EmployeeSignUp({ navigation }: NavigationProps) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [number, setNumber] = useState('');
    const [salary, setSalary] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resume, setResume] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();

    async function signUpWithEmail() {
        setLoading(true);
        Keyboard.dismiss();

        if (name === '' || email === '' || password === '' || !resume) {
            Alert.alert('All fields are required, including the resume!');
            setLoading(false);
            return;
        }

        const { data: data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            if (error.message.includes("User already registered")) {
                Alert.alert('User already registered. Please sign in instead.');
                navigation.navigate('Auth');
            }
            else {
                Alert.alert(error.message);
            }
        } else {
            const { error } = await supabase
                .from('users')
                .upsert({
                    id: data?.user?.id,
                    name,
                    email,
                    user_type: 'EMPLOYEE',
                    created_at: new Date(),
                });

            if (error) {
                Sentry.captureException("Error saving user data: " + error.message);
                showSnackbar('Error saving user data: ' + error.message, 'error');
            }
            else {
                Sentry.captureMessage('Successfully saved user data');
            }

            const { error: profileError } = await supabase
                .from('employees')
                .insert({
                    id: data?.user?.id,
                    name,
                    number,
                    email,
                    role,
                    salary,
                    resume_url: resume || '',
                    created_at: new Date(),
                });

            if (profileError) {
                Alert.alert('Error saving profile data:', profileError.message);
            } else {
                Alert.alert('Signup successful!');
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (signInError) {
                Alert.alert('Error signing in', signInError.message);
                setLoading(false);
                return;
            } 
            navigation.navigate('EmployeeSettings');
        }
        setLoading(false);
    }

    async function handleResumeUpload() {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
            multiple: false,
        });
        if (result.assets && result.assets[0].uri != "") {
            const file = new File([result.assets[0].uri], "resume.pdf", { type: "application/pdf" });
            const fileUri = result.assets[0].uri;
            const fileName = `resume_${Date.now()}.pdf`; // Unique name for the file

            // const fileUrl = await uploadToS3(fileUri, fileName) as string | null;

            // if (fileUrl) {
            //     console.log("Resume uploaded successfully:", fileUrl);
            //     setResume(fileUrl);
            // }
            // else {
            //     setResume(null);
            // }
        } else {
            Alert.alert('Failed to upload resume.');
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            {loading && <Loader />}
            <View style={styles.container}>
                <AppInput
                    label="Name"
                    onChangeText={(text) => setName(text)}
                    value={name}
                    placeholder="Full Name"
                    inputStyle={{ color: '#ffffff' }}
                />
                <AppInput
                    label="Contat Number"
                    onChangeText={(text) => setNumber(text)}
                    value={number}
                    placeholder="Contat Number"
                    inputStyle={{ color: '#ffffff' }}
                />
                <AppInput
                    label="Role"
                    onChangeText={(text) => setRole(text)}
                    value={role}
                    placeholder="Role"
                    inputStyle={{ color: '#ffffff' }}
                />
                <AppInput
                    label="Expected Salary"
                    onChangeText={(text) => setSalary(text)}
                    value={salary}
                    placeholder="Salary"
                    inputStyle={{ color: '#ffffff' }}
                />
                <AppInput
                    label="Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize="none"
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
                <AppButton
                    title={resume ? "Resume Uploaded" : "Upload Resume (PDF)"}
                    onPress={handleResumeUpload}
                    buttonStyle={{ marginBottom: 20 }}
                />
                <View style={styles.btncontainer}>
                    <AppButton title="Back to Home" onPress={() => { if (navigation.canGoBack()) { navigation.goBack() } else { navigation.navigate('Auth') } }} />
                    <AppButton title="Sign Up" disabled={loading} onPress={signUpWithEmail} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
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
