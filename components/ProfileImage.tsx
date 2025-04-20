import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';

interface ProfileImageProps {
    profileUrl: string;
    name: string;
    editable?: boolean;
    onEdit?: () => void;
    conatinerStyle?: any;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ profileUrl, name, editable = false, onEdit, conatinerStyle }) => {
    return (
        <View style={[styles.container, { ...conatinerStyle }]}>
            <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                    {profileUrl || profileUrl != "" ? (
                        < Image source={{ uri: profileUrl }} style={styles.profileImage} />
                    ) : (
                        <Text style={styles.profileInitial}>{name.charAt(0).toUpperCase()}</Text>
                    )}
                </View>
                {editable && (
                    <TouchableOpacity style={styles.editIcon} onPress={onEdit}>
                        <Icon name="camera" type='font-awesome' size={18} color="#000" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
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
});

export default ProfileImage;
