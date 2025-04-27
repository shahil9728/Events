import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import PdfModalView from './PdfModalView'; // adjust path as needed
import { Icon } from '@rneui/themed';
import { useTheme } from '@/app/ThemeContext';
import { ActivityIndicator } from 'react-native';

const ResumeUploader = ({ resumeUrl = '', handleUpload, containerStyle = {} }: { resumeUrl?: string; handleUpload: () => Promise<void>; containerStyle?: object; }) => {
    const isResumeUploaded = resumeUrl !== '';
    const [isUploading, setIsUploading] = useState(false);
    const { theme } = useTheme();

    const onUploadPress = async () => {
        try {
            setIsUploading(true);
            await handleUpload();
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <View style={containerStyle}>
            <TouchableOpacity
                style={[
                    styles.uploadButton,
                    { backgroundColor: isResumeUploaded ? theme.primaryColor : theme.secondaryColor }
                ]}
                onPress={onUploadPress}
            >
                {isUploading ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <>
                        <Icon name="upload" type="font-awesome" size={18} color="#000" />
                        <Text style={styles.uploadButtonText}>
                            {isResumeUploaded ? 'Update Resume' : 'Upload Resume'}
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            {isResumeUploaded && (
                <View style={styles.pdfContainer}>
                    <PdfModalView resumeUrl={resumeUrl} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 8,
    },
    uploadButtonText: {
        marginLeft: 10,
        fontWeight: '600',
    },
    pdfContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
});

export default ResumeUploader;
