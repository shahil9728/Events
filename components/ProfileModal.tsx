import React, { useMemo } from 'react';
import {
    Modal,
    Pressable,
    TouchableWithoutFeedback,
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import ChipsWithText from './ChipsWithText';
import { getRandomProfileImage } from '@/app/(tabs)/utils';
import { useTheme } from '@/app/ThemeContext';
import { StyleSheet } from 'react-native';
import { employeeDetails, HospitalityRolesObject } from '@/app/(tabs)/employeeConstants';
import PdfModalView from './PdfModalView';

interface ProfileModalProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    item: {
        name: string;
        location: string;
        role: string | string[];
        salary: string;
        bio?: string;
        photos?: string[];
        profile_url?: string;
        resume_url?: string;
    };
    alternate?: boolean;
    loading?: boolean;
    setShowWarning: (show: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
    isVisible,
    setVisible,
    item,
    alternate = false,
    loading = false,
    setShowWarning,
}) => {

    const { theme } = useTheme();
    const styles = useStyles(theme);
    const profileImage = useMemo(() => getRandomProfileImage(), []);

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setVisible(false)}
        >
            <Pressable style={styles.modalContainer} onPress={() => setVisible(false)}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <View style={styles.profileSection}>
                            <Image
                                source={{ uri: item.profile_url || profileImage }}
                                style={styles.profileImage}
                            />
                            {/* <View style={styles.iconsContainer}>
                                <TouchableOpacity
                                    style={[styles.iconButton, alternate && { backgroundColor: '#565555' }]}
                                >
                                    <Icon
                                        name="heart"
                                        type="ionicon"
                                        size={20}
                                        color={alternate ? '#F1F0E6' : '#060605'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.iconButton, alternate && { backgroundColor: '#565555' }]}
                                >
                                    <Icon
                                        name="chatbox-ellipses"
                                        type="ionicon"
                                        size={20}
                                        color={alternate ? '#F1F0E6' : '#060605'}
                                    />
                                </TouchableOpacity>
                            </View> */}
                        </View>

                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={[styles.name, alternate ? { color: '#979797' } : { color: '#8e993d' }]}>
                                {item.name}
                            </Text>
                        </View>

                        <View style={styles.detailsRow}>
                            {employeeDetails(item.location).map(({ icon, type, text }, index) => (
                                <ChipsWithText
                                    key={index}
                                    icon={icon}
                                    type={type}
                                    text={text}
                                    alternate={alternate}
                                />
                            ))}
                        </View>
                        <View style={styles.jobRow}>
                            <View style={{ width: "70%" }}>
                                <Text
                                    style={[
                                        styles.jobTitle,
                                        alternate ? { color: '#A5A6A6' } : { color: '#8e993d' },
                                    ]}
                                >
                                    {Array.isArray(item.role)
                                        ? item.role.map(r => HospitalityRolesObject[r] || r).join(", ")
                                        : (item.role ?? "")
                                            .split(",")
                                            .map((r: string) => HospitalityRolesObject[r.trim()] || r.trim())
                                            .join(", ")}
                                </Text>
                                <Text style={[styles.salary, { color: '#F1F0E6' }]}>
                                    {item.salary} ₹
                                    <Text style={[styles.perMonth, { color: '#F1F0E6' }]}>/ shift</Text>
                                </Text>
                            </View>

                            <View style={styles.actionButtonRow}>
                                <TouchableOpacity
                                    style={[styles.actionButton, alternate && { backgroundColor: '#F1F0E6' }]}
                                    onPress={() => setShowWarning(true)}
                                >
                                    {loading ? (
                                        <ActivityIndicator
                                            size={25}
                                            color={alternate ? '#060605' : '#F1F0E6'}
                                        />
                                    ) : (
                                        <Text
                                            style={[styles.buttonText, alternate && { color: '#2C2B2B' }]}
                                        >
                                            Hire Now
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* About Section */}
                        <View style={styles.experienceContainer}>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={[styles.experienceTitle, !alternate && { color: '#F1F0E6' }]}>About</Text>
                                <PdfModalView resumeUrl={item.resume_url ?? ''} />
                            </View>
                            <Text style={[styles.description, !alternate && { color: '#F1F0E6' }]}>
                                {item.bio}
                            </Text>
                        </View>

                        {/* Photos */}
                        <View style={styles.statsContainer}>
                            {item.photos?.slice(0, 3).map((photoUrl, index) => (
                                <View key={index} style={styles.statItem}>
                                    <Image source={{ uri: photoUrl }} style={styles.statImage} />
                                </View>
                            ))}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Pressable>
        </Modal>
    );
};

const useStyles = (theme: any) => StyleSheet.create({
    profileSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#5E6623',
        marginTop: 10,
    },
    detailsRow: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 8,
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    jobRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#76802C',
        marginTop: 15,
    },
    salary: {
        fontSize: 22,
        color: theme.lightGray,
        fontWeight: 'bold',
        marginTop: 5,
    },
    perMonth: {
        fontSize: 15,
        color: theme.lightGray,
    },
    actionButtonRow: {
        height: "100%",
        flexDirection: 'row',
        alignItems: "flex-end",
    },
    actionButton: {
        backgroundColor: theme.blackColor,
        borderRadius: 40,
        padding: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: theme.primaryColor,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        padding: 20,
        maxHeight: "70%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: theme.lightGray1,
    },
    experienceContainer: {
        backgroundColor: "#343436",
        padding: 12,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        marginTop: 25,
    },
    experienceTitle: {
        fontSize: 16,
        fontWeight: 800,
        color: "#E4F554",
    },
    description: {
        fontSize: 13,
        color: "#E4F554",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        width: "100%",
    },
    statItem: {
        alignItems: "center",
        flex: 1,
    },
    statImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

})


export default ProfileModal;
