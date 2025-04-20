import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { uploadToS3 } from '@/helpers/aws';
import { ProfileUpdateScreenRouteProp } from '@/app/RootLayoutHelpers';
import { useTheme } from '@/app/ThemeContext';
import { useSnackbar } from '@/components/SnackBar';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase';
import IconwithContainer from '@/components/IconwithContainer';
import { HospitalityRoles } from '../../employeeConstants';
import { updateEmployeeInfo } from '@/app/redux/Employee/accountInfo/accountInfoActions';
import ETextInputContainer2 from '@/components/ETextInputContainer2';
import ProfileImage from '@/components/ProfileImage';
import MultiSelectWithChips from '@/components/MultiSelectWithChips';
import useExitAppOnBackPress from '@/hooks/useExitAppOnBackPress';
import * as FileSystem from 'expo-file-system';
import ResumeUploader from '@/components/ResumeUploader';

const ProfileUpdateScreen = ({ route, navigation }: ProfileUpdateScreenRouteProp) => {
    const { theme } = useTheme();
    const { showSnackbar } = useSnackbar();
    const styles = createStyles(theme);
    const onboardingUser = useSelector((state: any) => state.onboardingReducer);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [resume, setResume] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(onboardingUser.name);
    const [location, setLocation] = useState("Hyderabad");
    const [salary, setSalary] = useState("");
    const [height, setHeight] = useState("");
    const [bio, setBio] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const dispatch = useDispatch();
    useExitAppOnBackPress();

    async function handleResumeUpload() {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
            multiple: false,
        });

        if (result.assets && result.assets[0].uri != "") {
            const fileUri = result.assets[0].uri;
            const fileName = `resume_${name}.pdf`;

            try {
                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                const fileSizeInBytes = fileInfo.exists && !fileInfo.isDirectory ? fileInfo.size ?? 0 : 0;
                const maxSizeInMB = 5;

                if (fileSizeInBytes > maxSizeInMB * 1024 * 1024) {
                    showSnackbar(`File size should be less than ${maxSizeInMB}MB.`, 'error');
                    return;
                }
            } catch (err) {
                console.error("Error checking file size:", err);
                return;
            }


            const fileUrl = await uploadToS3(fileUri, fileName, onboardingUser.id, "resumes") as string | null;

            if (fileUrl) {
                setResume(fileUrl);
            }
            else {
                setResume(null);
            }
        } else if (resume != "") {
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
                const fileName = `profile_${name}.jpg`;
                console.log("Uploading image to S3...");
                const fileUrl = await uploadToS3(fileUri, fileName, onboardingUser.id, "profile") as string | null;

                if (fileUrl) {
                    setProfileImage(fileUrl);
                }
                else {
                    setProfileImage(null);
                }
            }
        } catch (e) {
            console.log("Error occurred", e);
        }
    }

    const handleNext = async () => {
        console.log('Profile data:', name, location, salary, selectedSkills, resume, profileImage);
        if (!name || !location || !salary || selectedSkills.length === 0 || !resume) {
            showSnackbar('Please fill all the fields.', 'error');
            return;
        }


        setIsLoading(true);
        let id = ""
        if (onboardingUser.id == "") {
            console.log('No onboarding user found. Using session user id');
            const { data: { session } } = await supabase.auth.getSession();
            id = session?.user?.id ?? "";
        } else {
            id = onboardingUser.id;
        }

        const payload = {
            id: id,
            name: name,
            email: onboardingUser.email,
            number: onboardingUser.number,
            salary: salary,
            location: location,
            height: height,
            resume_url: resume || '',
            profile_url: profileImage || '',
            role: selectedSkills.join(', '),
            bio: bio,
            created_at: new Date(),
        }

        const { error: profileError } = await supabase
            .from('employees')
            .upsert(payload);

        if (profileError) {
            console.log('Error saving profile data:', profileError.message);
        } else {
            dispatch(updateEmployeeInfo(payload));
            console.log('Profile data saved successfully');
            navigation.navigate('Questions');
        }
        setIsLoading(false);
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <ProfileImage profileUrl={profileImage || ''} name={name} editable={true} onEdit={handleImageUpload} conatinerStyle={{ marginBottom: 25 }} />

                        <ETextInputContainer2
                            placeholder="Enter Name"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        <ETextInputContainer2
                            placeholder="Enter Location"
                            value={location}
                            onChangeText={(text) => setLocation(text)}
                        />
                        <ETextInputContainer2
                            placeholder="Enter Expected Salary"
                            value={salary}
                            onChangeText={(text) => setSalary(text)}
                            keyboardType='phone-pad'
                        />
                        <ETextInputContainer2
                            placeholder="Enter Height in ft/in"
                            value={height}
                            onChangeText={(text) => setHeight(text)}
                            keyboardType='phone-pad'
                        />
                        <ETextInputContainer2
                            placeholder="Enter bio in 100 characters"
                            multiline={true}
                            value={bio}
                            onChangeText={(text) => setBio(text)}
                            maxLength={100}
                        />

                        <MultiSelectWithChips
                            selectedValues={selectedSkills}
                            options={HospitalityRoles}
                            placeholder='Type to search roles'
                            onChangeSelectedValues={(newSelected) => {
                                setSelectedSkills(newSelected);
                            }}
                        />

                        <ResumeUploader
                            containerStyle={{ marginTop: 10, width: "100%" }}
                            resumeUrl={resume ?? ""}
                            handleUpload={handleResumeUpload} />

                    </View>
                    <View style={{ width: "100%", padding: 15, alignItems: "flex-end" }}>
                        {isLoading ? (<IconwithContainer>
                            <ActivityIndicator size="small" color={theme.primaryColor} />
                        </IconwithContainer>) : (
                            <IconwithContainer
                                iconName='chevron-forward-outline'
                                onPress={handleNext}
                            />
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    scrollContent: {
        paddingBottom: 100,
    },
    container: {
        padding: 20,
        alignItems: 'center',
        gap: 3,
    },
    uploadButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        width: "100%"
    },
    uploadButtonText: {
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 10,
    },
    textInputCont: {
        backgroundColor: theme.lightGray,
    },
    chipsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 5,
        marginBottom: 8,
    },
    chipText: {
        color: theme.backgroundColor,
        marginRight: 5,
    },
    dropdown: {
        width: "100%",
        backgroundColor: theme.lightGray,
        borderRadius: 10,
        maxHeight: 150,
    },
    dropdownItem: {
        padding: 10,
    },
    dropdownItemText: {
        color: theme.secondaryColor,
    },

});

export default ProfileUpdateScreen;