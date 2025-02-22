import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Icon } from '@rneui/themed';
import * as DocumentPicker from 'expo-document-picker';
// import * as ImagePicker from 'expo-image-picker';
import { uploadToS3 } from '@/helpers/aws';
import { ProfileUpdateScreenRouteProp } from '@/app/RootLayoutHelpers';
import { useTheme } from '@/app/ThemeContext';
import { useSnackbar } from '@/components/SnackBar';
import { useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase';
import IconwithContainer from '@/components/IconwithContainer';

const ProfileUpdateScreen = ({ route, navigation }: ProfileUpdateScreenRouteProp) => {
    const [location, setLocation] = useState("Hyderabad");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [resume, setResume] = useState<string | null>(null);
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { showSnackbar } = useSnackbar();
    const onboardingUser = useSelector((state: any) => state.onboardingReducer);
    const [name, setName] = useState(onboardingUser.name);

    async function handleResumeUpload() {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
            multiple: false,
        });
        if (result.assets && result.assets[0].uri != "") {
            const fileUri = result.assets[0].uri;
            const fileName = `resume_${name}.pdf`;
            console.log("bhadwe", onboardingUser.id);
            // console.log("Uploading resume to S3...");
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
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (status !== 'granted') {
        //     Alert.alert('Permission Denied', 'You need to enable permissions in settings.');
        //     return;
        // }
        // const result = await ImagePicker.launchImageLibraryAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //     allowsEditing: true,
        //     aspect: [1, 1],
        //     quality: 1,
        // });

        // if (!result.canceled) {
        //     const fileUri = result.assets[0].uri;
        //     const fileName = `profile_${name}_${Date.now()}.jpg`;

        //     console.log("Uploading profile image to S3...");
        //     const fileUrl = await uploadToS3(fileUri, fileName, onboardingUser.id, "images") as string | null;

        //     if (fileUrl) {
        //         setProfileImage(fileUrl);
        //     } else {
        //         showSnackbar('Failed to upload profile image.', 'error');
        //     }
        // }
    }

    const handleNext = async () => {
        let id = ""
        if (onboardingUser.id == "") {
            console.log('No onboarding user found. Using session user id');
            const { data: { session } } = await supabase.auth.getSession();
            id = session?.user?.id ?? "";
        } else {
            id = onboardingUser.id;
        }

        const { error: profileError } = await supabase
            .from('employees')
            .upsert({
                id: id,
                name: name,
                resume_url: resume || '',
                profile_image_url: profileImage || '',
            });

        if (profileError) {
            Alert.alert('Error saving profile data:', profileError.message);
        } else {
            navigation.navigate('Questions');
        }
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <View style={styles.profileImageContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <Text style={styles.profileInitial}>{name.charAt(0).toUpperCase()}</Text>
                        )}
                        <TouchableOpacity style={styles.editIcon} onPress={handleImageUpload}>
                            <Icon name="camera" type='font-awesome' size={18} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
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
                        placeholder="Enter Location"
                        placeholderTextColor={theme.lightGray2}
                        onChangeText={(text) => setLocation(text)}
                        value={location}
                    />
                </View>
                <TouchableOpacity style={[styles.uploadButton, { backgroundColor: resume ? theme.primaryColor1 : theme.primaryColor }]} onPress={handleResumeUpload}>
                    <Icon name="upload" type='font-awesome' size={18} color="#000" />
                    <Text style={styles.uploadButtonText}>{resume ? "Resume Uploaded" : "Upload Resume"}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: "100%", padding: 15, alignItems: "flex-end" }}>
                <IconwithContainer
                    iconName='chevron-forward-outline'
                    onPress={handleNext}
                />
            </View>
        </>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#B6BF48',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
    textInputCont: {
        marginTop: 20,
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
    uploadButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        padding: 15,
        borderRadius: 50,
        marginTop: 20,
        width: "100%"
    },
    uploadButtonText: {
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 10,
    },
    button: {
        backgroundColor: theme.lightGray1,
        padding: 20,
        paddingHorizontal: 15,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
    }

});

export default ProfileUpdateScreen;