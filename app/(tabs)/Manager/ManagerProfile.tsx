import { supabase } from '@/lib/supabase'
import { Icon } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Loader from '@/components/Loader';

const ManagerProfile = () => {
    const [loading, setLoading] = useState(true);
    const [originalValues, setOriginalValues] = useState({
        name: '',
        number: '',
        email: '',
        dob: '',
        gender: ''
    });
    const [currentValues, setCurrentValues] = useState({ ...originalValues });

    useEffect(() => {
        getProfile();
    }, []);

    async function getProfile() {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user on the session!');
            let { data, error, status } = await supabase
                .from('managers')
                .select(`*`)
                .eq('id', user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }
            if (data) {
                setOriginalValues({ ...data });
                setCurrentValues({ ...data });
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile() {
        console.log('Updating profile...');
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Unable to update the profile');
            const updates = {
                id: user.id,
                name: currentValues.name,
                number: currentValues.number,
                email: currentValues.email,
                gender: currentValues.gender,
                updated_at: new Date(),
            };

            let { error } = await supabase.from('managers').upsert(updates);

            if (error) {
                throw error;
            }

            Alert.alert('Profile updated successfully!');
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const isDisabled = JSON.stringify(originalValues) === JSON.stringify(currentValues);

    const handleInputChange = (field: string, value: string) => {
        setCurrentValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            {loading && <Loader />}
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImage}>
                            <Text style={styles.profileInitial}>{currentValues.name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <TouchableOpacity style={styles.editIcon}>
                            <Icon name="pencil" type='font-awesome' size={18} color="#00000" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Name" value={currentValues.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholderTextColor="#787975"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile"
                        value={currentValues.number}
                        onChangeText={(text) => handleInputChange('number', text)}
                        placeholderTextColor="#787975"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={currentValues.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        placeholderTextColor="#787975"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Date of birth"
                        value={currentValues.dob}
                        onChangeText={(text) => handleInputChange('dob', text)}
                        placeholderTextColor="#787975"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.updateButton, { backgroundColor: isDisabled ? '#fff' : '#B6BF48' }]}
                    disabled={isDisabled} onPress={updateProfile}
                >
                    <Text style={styles.updateButtonText}>Update Profile</Text>
                </TouchableOpacity>
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
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImageContainer: {
        width: 100,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#B6BF48',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    profileInitial: {
        fontSize: 40,
        color: '#060605', 
        fontWeight: 'bold',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#E4F554', 
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editText: {
        fontSize: 14,
        color: '#060605', 
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