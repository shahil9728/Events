import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSnackbar } from '@/components/SnackBar';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@/components/Loader';
import ProfileImage from '@/components/ProfileImage';
import { updateManagerInfo } from '@/app/redux/Employee/accountInfo/accountInfoActions';
import ETextInputContainer2 from '@/components/ETextInputContainer2';
import ButtonWithLoader from '@/components/ButtonWithLoader';

type ManagerAccountInfo = {
    name: string;
    number: string;
    email: string;
    // profile_url: string;
};

const ManagerProfile = () => {
    const [loading, setLoading] = useState(false);
    const accountInfo = useSelector((store: any) => store.accountInfo);
    const originalValues = {
        name: accountInfo.name || '',
        number: accountInfo.number || '',
        email: accountInfo.email || '',
        // profile_url: accountInfo.profile_url || '',
    };
    const [currentValues, setCurrentValues] = useState({ ...accountInfo });
    const { showSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    async function updateProfile() {
        if (isDisabled) {
            showSnackbar('No changes to update', 'warning');
            return;
        }
        console.log('Updating profile...');
        try {
            setLoading(true);
            const updates = {
                id: accountInfo.id,
                name: currentValues.name,
                number: currentValues.number,
                email: currentValues.email,
                updated_at: new Date(),
            };

            let { error } = await supabase.from('managers').upsert(updates);

            if (error) {
                console.error('Error updating profile:', error);
                throw error;
            }
            dispatch(updateManagerInfo(updates));
            console.log('Profile updated successfully!');
            showSnackbar('Profile updated successfully!', 'success');
        } catch (error) {
            if (error instanceof Error) {
                showSnackbar(error.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    }

    const isDisabled = Object.keys(originalValues).every(
        (key) => originalValues[key as keyof ManagerAccountInfo] === currentValues[key as keyof ManagerAccountInfo]
    );

    const handleInputChange = (field: string, value: string) => {
        setCurrentValues((prev: ManagerAccountInfo) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <ProfileImage profileUrl={""} name={currentValues.name} editable={false} conatinerStyle={{ marginBottom: 30 }} />

                <ETextInputContainer2 placeholder="Name" value={currentValues.name}
                    onChangeText={(text) => handleInputChange('name', text)} />

                <ETextInputContainer2 placeholder="Mobile" value={currentValues.number}
                    onChangeText={(text) => handleInputChange('number', text)} keyboardType='phone-pad' />

                <ETextInputContainer2 placeholder="Email" value={currentValues.email}
                    onChangeText={(text) => handleInputChange('email', text)} keyboardType='email-address' />

                <ButtonWithLoader btnText="Update Profile" onClick={updateProfile} disabled={isDisabled} loading={loading} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#060605',
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: '#202023',
        color: '#ffffff',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    updateButton: {
        backgroundColor: '#B6BF48',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    updateButtonText: {
        color: '#060605',
        fontSize: 16,
        fontWeight: 500,
    },

})


export default ManagerProfile