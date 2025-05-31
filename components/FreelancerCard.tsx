import { Icon } from '@rneui/themed';
import React, { useRef, useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useSnackbar } from './SnackBar';
import { useTheme } from '@/app/ThemeContext';
import { useSelector } from 'react-redux';
import EDialog from './EDialog';
import { formatRoles, getFriendlydate, getLabelFromList, getRandomProfileImage } from '@/app/(tabs)/utils';
import { employeeDetails, EVENT_CATEGORIES, HospitalityRolesObject, ImageKey1, imageRequireMap } from '@/app/(tabs)/employeeConstants';
import AnimatedPressable from './AnimatedPressable';
import ChipsWithText from './ChipsWithText';
import ProfileModal from './ProfileModal';
import EmployeeProfileCard from './EmployeeProfileCard';

type CardProps = {
    item: any;
    alternate?: boolean;
    cardType: 'freelancer' | 'event';
    onSubmit?: Function;
    onEventPress?: Function;
    isLoading?: boolean;
    requestStatus?: string;
    requestId?: string;
};


const FreelancerCard = ({
    item,
    alternate = false,
    cardType,
    onSubmit,
    isLoading,
    onEventPress,
    requestStatus,
    requestId,
}: CardProps) => {
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const manager_id = useSelector((state: any) => state.accountInfo.manager_id);
    const profileImage = useMemo(() => getRandomProfileImage(), []);

    async function sendHireRequest() {
        setLoading(true);
        try {
            if (onSubmit) {
                await onSubmit(manager_id, item.id);
            } else {
                console.warn('onSubmit is not defined.');
            }
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                showSnackbar(String(error), 'error');
            } else {
                showSnackbar('An unknown error occurred.', 'error');
            }
        } finally {
            setLoading(false);
        }
    }

    const eventDetails = (location: string, date: string) => [
        { icon: "calendar", type: "font-awesome", text: getFriendlydate(date) },
        { icon: "tag", type: "feather", text: getLabelFromList(item.metadata?.eventCategory, EVENT_CATEGORIES) || "Wedding" },
        { icon: "map-pin", type: "feather", text: location },
    ];

    const [isModalVisible, setModalVisible] = useState(false);
    if (cardType === 'freelancer') {
        return (
            <>
                <AnimatedPressable onPress={() => setModalVisible(true)} style={[styles.card, alternate && { backgroundColor: theme.lightGray }]}>
                    <EmployeeProfileCard
                        item={item}
                        alternate={alternate}
                        setShowWarning={setShowWarning}
                        loading={loading}
                        profileImage={profileImage}
                    />
                </AnimatedPressable>
                <EDialog
                    visible={showWarning}
                    onClose={() => setShowWarning(false)}
                    onConfirm={() => {
                        setShowWarning(false);
                        sendHireRequest();
                    }}
                    title="Hire Request"
                    message={`Are you sure you want to send a hire request to ${item.name}?`}
                    confirmText="Confirm"
                    cancelText="Cancel"
                />
                <ProfileModal
                    isVisible={isModalVisible}
                    setVisible={setModalVisible}
                    item={item}
                    alternate={alternate}
                    loading={loading}
                    setShowWarning={setShowWarning}
                />
            </>
        );
    }
    else {
        const imageUrl = imageRequireMap[item.metadata.image as ImageKey1] ?? require('../assets/images/wedding.jpg');
        const maxPrice = item.metadata?.freelancer?.length
            ? Math.max(...item.metadata.freelancer.map((f: any) => parseInt(f.price?.toString() || "0")))
            : 0;

        return (
            <AnimatedPressable style={[styles.card, alternate && { backgroundColor: theme.lightGray }]}
                onPress={() => onEventPress && onEventPress(item)}>
                <View style={styles.profileSection}>
                    <Image
                        source={imageUrl}
                        style={styles.profileImage}
                    />
                    {/* <View style={styles.iconsContainer}>
                        <TouchableOpacity style={[styles.iconButton, alternate && { backgroundColor: "#565555" }]}>
                            <Icon name="heart" type='ionicon' size={20} color={alternate ? "#F1F0E6" : "#060605"} />
                        </TouchableOpacity>
                    </View> */}
                </View>

                <Text style={[styles.name, alternate && { color: "#979797" }]}>{item.title}</Text>
                <View style={styles.detailsRow}>
                    {eventDetails(item.metadata?.location || "Unknown", item.startDate).map(({ icon, type, text }, index) => (
                        <View
                            key={index}
                            style={[styles.iconWithTextcont, alternate && { backgroundColor: "#343436" }]}
                        >
                            <TouchableOpacity style={styles.iconWithText}>
                                <Icon name={icon} type={type} size={15} color={alternate ? "#F1F0E6" : "#060605"} />
                                <Text style={[styles.detailItem, alternate && { color: "#F1F0E6" }]}>{text}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={[styles.jobRow, { marginTop: 15 }]}>
                    <View>
                        <Text style={[styles.jobTitle, alternate && { color: "#A5A6A6" }]}>
                            {item.metadata?.description ? item.metadata.description.substring(0, 20) + (item.metadata.description.length > 50 ? '...' : '') : 'No description'}
                        </Text>
                        <Text style={[styles.salary, alternate && { color: "#F1F0E6" }]}>₹{maxPrice}
                            <Text style={[styles.perMonth, alternate && { color: "#F1F0E6" }]}>/event</Text>
                        </Text>
                    </View>

                    <View style={styles.actionButtonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, alternate && { backgroundColor: "#F1F0E6" }]}
                            onPress={() => onSubmit && onSubmit(item)} disabled={isLoading && requestId == item.id && requestStatus == "sent"}
                        >
                            {isLoading && requestId == item.id ?
                                <ActivityIndicator size={25} color={alternate ? "#2C2B2B" : "#F1F0E6"} /> :
                                requestStatus == "pending" ?
                                    <Text style={[styles.buttonText, alternate && { color: "#2C2B2B" }]}>Send Request</Text> :
                                    requestId == item.id ?
                                        <Text style={[styles.buttonText, alternate && { color: "#2C2B2B" }]}>
                                            Request Sent
                                        </Text>
                                        : <Text style={[styles.buttonText, alternate && { color: "#2C2B2B" }]}>Send Request</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </AnimatedPressable>
        );
    }
};

const useStyles = (theme: any) => StyleSheet.create({
    card: {
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
    },
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
    iconWithText: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        gap: 3,
    },
    iconWithTextcont: {
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: '#D4E64E',
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
    detailItem: {
        fontSize: 14,
        color: '#202023',
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
        color: '#202023',
        fontWeight: 'bold',
        marginTop: 5,
    },
    perMonth: {
        fontSize: 15,
        color: '#202023',
    },
    actionButtonRow: {
        height: "100%",
        flexDirection: 'row',
        alignItems: "flex-end",
    },
    actionButton: {
        backgroundColor: '#060605',
        borderRadius: 40,
        padding: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#E4F554',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FreelancerCard;
