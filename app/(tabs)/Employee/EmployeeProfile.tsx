import { supabase } from '@/lib/supabase'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import DropdownComponent from '@/components/DropdownComponent';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@/app/ThemeContext';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { uploadToS3, deleteFromS3 } from '@/helpers/aws';
import { useSnackbar } from '@/components/SnackBar';
import { GenderConstants, HospitalityRoles } from '../employeeConstants';
import { updateEmployeeInfo } from '@/app/redux/Employee/accountInfo/accountInfoActions';
import ProfileImage from '@/components/ProfileImage';
import ButtonWithLoader from '@/components/ButtonWithLoader';
import ETextInputContainer2 from '@/components/ETextInputContainer2';
import MultiSelectWithChips from '@/components/MultiSelectWithChips';
import ResumeUploader from '@/components/ResumeUploader';

const EmployeeProfile = () => {
    const [loading, setLoading] = useState(false);
    const accountInfo = useSelector((store: { accountInfo: any }) => store.accountInfo);
    const originalValues = {
        name: accountInfo.name || '',
        number: accountInfo.number || '',
        email: accountInfo.email || '',
        location: accountInfo.location || '',
        bio: accountInfo.bio || '',
        dob: accountInfo.dob || '',
        gender: accountInfo.gender || '',
        role: accountInfo.role || '',
        resume_url: accountInfo.resume_url || '',
        profile_url: accountInfo.profile_url || '',
    };
    const [currentValues, setCurrentValues] = useState({ ...originalValues });
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { showSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    async function updateProfile() {
        if (isDisabled) {
            showSnackbar('No changes made.', 'warning');
            return;
        }
        console.log('Updating profile...');
        try {
            setLoading(true);
            const updates = {
                id: accountInfo.employee_id,
                name: currentValues.name,
                number: currentValues.number,
                location: currentValues.location,
                bio: currentValues.bio,
                email: currentValues.email,
                gender: currentValues.gender,
                dob: currentValues.dob,
                role: currentValues.role,
                profile_url: currentValues.profile_url,
                resume_url: currentValues.resume_url,
                updated_at: new Date(),
            };
            let { error } = await supabase.from('employees').upsert(updates);

            dispatch(updateEmployeeInfo(updates));

            if (error) {
                throw error;
            }
            showSnackbar('Profile updated successfully!', 'success');
            console.log('Profile updated successfully!');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
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

    async function handleResumeUpload() {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
            multiple: false,
        });
        if (result.assets && result.assets[0].uri != "") {
            const fileUri = result.assets[0].uri;
            const fileName = `resume_${currentValues.name}.pdf`;

            if (currentValues.resume_url) {
                console.log("Deleting existing resume from S3...");
                await deleteFromS3(currentValues.resume_url);
            }

            console.log("Uploading new resume to S3...");
            const fileUrl = await uploadToS3(fileUri, fileName, accountInfo.employee_id, "resumes") as string | null;

            if (fileUrl) {
                setCurrentValues((prev) => ({
                    ...prev,
                    resume_url: fileUrl
                }));
            }
            else {
                setCurrentValues((prev) => ({
                    ...prev,
                    resume_url: ''
                }));
            }
        } else if (currentValues.resume_url != "") {
            return;
        } else {
            showSnackbar('Failed to upload resume.', 'error');
        }
    }

    async function handleImageUpload() {
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (!result.canceled) {
                const fileUri = result.assets[0].uri;
                const fileName = `profile_${currentValues.name}.jpg`;
                console.log("Uploading image to S3...");
                const fileUrl = await uploadToS3(fileUri, fileName, accountInfo.employee_id, "profile") as string | null;

                if (fileUrl) {
                    setCurrentValues((prev) => ({
                        ...prev,
                        profile_url: fileUrl
                    }));
                }
                else {
                    setCurrentValues((prev) => ({
                        ...prev,
                        profile_url: ""
                    }));
                }
            }
        } catch (e) {
            console.log("Error occurred", e);
        }
    }

    console.log("Current Values: ", currentValues);

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <ProfileImage profileUrl={currentValues.profile_url} name={currentValues.name} editable={true} onEdit={handleImageUpload} conatinerStyle={{ marginBottom: 25 }} />

                <ETextInputContainer2
                    value={currentValues.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                />

                <ETextInputContainer2
                    value={currentValues.number}
                    onChangeText={(text) => handleInputChange('number', text)}
                    keyboardType='phone-pad'
                />
                <ETextInputContainer2
                    value={currentValues.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />
                <ETextInputContainer2
                    value={currentValues.location}
                    onChangeText={(text) => handleInputChange('location', text)}
                />

                <ETextInputContainer2
                    value={currentValues.bio}
                    multiline={true}
                    onChangeText={(text) => handleInputChange('bio', text)}
                    maxLength={100}
                />
                <ETextInputContainer2
                    value={currentValues.dob}
                    onChangeText={(text) => handleInputChange('dob', text)}
                    placeholder='Enter DOB (dd/mm/yyyy)'
                />

                <DropdownComponent data={GenderConstants} label='Gender' value={currentValues.gender} onClick={(text) => handleInputChange('gender', text)} style={{ backgroundColor: theme.lightGray }} />

                <MultiSelectWithChips
                    selectedValues={currentValues.role.split(',').map((role: string) => role.trim())}
                    options={HospitalityRoles}
                    placeholder='Type to search roles'
                    onChangeSelectedValues={(newSelected) => {
                        console.log("Selected Tags: ", newSelected);
                        setCurrentValues((prev) => ({
                            ...prev,
                            role: newSelected.join(','),
                        }));
                    }}
                    containerStyle={{ marginTop: 10 }}
                />

                <ResumeUploader
                    containerStyle={{ marginTop: 10 }}
                    resumeUrl={currentValues.resume_url ?? ""}
                    handleUpload={handleResumeUpload} />


                <ButtonWithLoader btnText="Update Profile" onClick={updateProfile} disabled={isDisabled} loading={loading} />
            </View>
        </ScrollView>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
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
    uploadButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        width: "100%"
    },
    uploadButtonText: {
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 10,
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
    resumeContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    viewButtonText: {
        marginLeft: 5,
        fontWeight: 'bold',
    },

})

export default EmployeeProfile