import { EmployeeEventScreenProps } from '@/app/RootLayoutHelpers';
import { useTheme } from '@/app/ThemeContext';
import { useSnackbar } from '@/components/SnackBar';
import { supabase } from '@/lib/supabase';
import Icon from '@/helpers/Icon';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { getFriendlydate, getLabelFromList } from '../utils';
import { EVENT_CATEGORIES, HospitalityRolesObject, ImageKey1, imageRequireMap, UserRole } from '../employeeConstants';
import { OperationType } from '@/app/globalConstants';
import * as Sentry from "@sentry/react-native";

const EmployeeEventScreen = ({ navigation, route }: EmployeeEventScreenProps) => {
    const {
        title = 'Samay Raina Unfiltered',
        startDate = 'Thu 16 Jan 2025 - Sun 27 Apr 2025',
        endDate = 'Thu 16 Jan 2025 - Sun 27 Apr 2025',
        metadata = {
            eventCategory: 'Wedding',
            location: 'Shilpakala Vedika: Hyderabad',
            image: '',
            description: 'Last leg of the Unfiltered India tour!',
            freelancer: [{ role: 'Shadow', number: 1, price: 1500 }],
        },
        manager_id = '2d08f43b-87e8-4c31-8d18-207b6e2c48f4',
        id = '1',
    } = route.params.eventData || {};

    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { showSnackbar } = useSnackbar();
    const accountInfo = useSelector((store: { accountInfo: any }) => store.accountInfo);

    const [isLoading, setIsLoading] = React.useState(false);
    const [requestStatus, setRequestStatus] = React.useState('pending');

    const getFreelancerWithMaxPrice = () => {
        if (metadata?.freelancer?.length) {
            // Find the freelancer with the maximum price
            return metadata.freelancer.reduce((max, current) => {
                const currentPrice = parseInt(current.price?.toString() || "0");
                const maxPrice = parseInt(max.price?.toString() || "0");
                return currentPrice > maxPrice ? current : max;
            }, metadata.freelancer[0]);
        }
        return null;
    };

    const handleRequest = async () => {
        setIsLoading(true);
        const { data: data1, error: error1 } = await supabase
            .from('employee_to_manager')
            .select('manager_id, req_status, manager_id, event_id,request_initiator')
            .eq('manager_id', manager_id)
            .eq('event_id', id)
            .eq('request_initiator', UserRole.EMPLOYEE)

        if (data1) {
            const pendingEventIds = data1?.map(d => d.event_id) || [];
            if (pendingEventIds.length > 0) {
                showSnackbar('You already sent a request for this event', 'warning');
                setIsLoading(false);
                return;
            }
        }

        const updates = {
            employee_id: accountInfo.employee_id,
            manager_id: manager_id,
            event_id: route.params.eventData?.id || '',
            event_title: title,
            req_status: 'pending',
            role_id: getFreelancerWithMaxPrice()?.role,
            event_metadata: {
                ...route.params.eventData?.metadata,
                startDate: startDate,
                endDate: endDate,
            },
            request_initiator: UserRole.EMPLOYEE,
        }
        const { data, error } = await supabase
            .from('employee_to_manager')
            .upsert(updates);
        if (error) {
            Sentry.captureException("Error sending request: " + error);
        } else {
            setRequestStatus('sent');
        }
        setIsLoading(false);
        showSnackbar('Request Sent Successfully', 'success');
    }

    return (
        <ScrollView style={styles.container}>
            {/* Event Image */}
            <View style={styles.imageContainer}>
                <Image source={imageRequireMap[metadata.image as ImageKey1] || imageRequireMap['wedding']} style={styles.eventImage} />
                {/* <TouchableOpacity style={styles.favoriteIcon}>
                    <Icon name="heart" type='font-awesome' size={20} color="#fff" />
                </TouchableOpacity> */}
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.eventTitle}>{title}</Text>
            </View>

            <View style={styles.detailsRow}>
                <View style={[styles.iconWithTextcont, { backgroundColor: "#343436" }]}>
                    <TouchableOpacity style={[styles.iconWithText]}>
                        <Icon name="calendar" type='font-awesome' size={15} color={"#F1F0E6"} />
                        <Text style={[styles.detailItem, { color: "#F1F0E6" }]}> {getFriendlydate(startDate)} - {getFriendlydate(endDate)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.iconWithTextcont, { backgroundColor: "#343436" }]}>
                    <TouchableOpacity style={styles.iconWithText}>
                        <Icon name="tag" type="feather" size={15} color={"#F1F0E6"} />
                        <Text style={[styles.detailItem, { color: "#F1F0E6" }]}>{getLabelFromList(metadata.eventCategory, EVENT_CATEGORIES)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.iconWithTextcont, { backgroundColor: "#343436" }]}>
                    <TouchableOpacity style={styles.iconWithText}>
                        <Icon name="map-pin" type='feather' size={15} color={"#F1F0E6"} />
                        <Text style={[styles.detailItem, { color: "#F1F0E6" }]}>{metadata.location}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* About the Event */}
            <View style={styles.aboutSection}>
                <View style={{ width: "70%" }}>
                    <Text style={styles.sectionTitle}>About The Event</Text>
                    <Text style={styles.descriptionText}>{metadata.description}</Text>
                </View>
                <View style={styles.aboutTitle}>
                    <View style={{ display: "flex", flexDirection: 'column', gap: "0px", alignItems: "center" }} >
                        <View >
                            <Text style={[styles.sectionTitle, { color: theme.headingColor, fontSize: 18, marginBottom: 0 }]}>₹{getFreelancerWithMaxPrice() ? parseInt(getFreelancerWithMaxPrice()?.price?.toString() || "0") : 0}
                                <Text style={{ fontSize: 12, color: theme.lightGray2 }}></Text>
                            </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: theme.lightGray2 }}>{HospitalityRolesObject[getFreelancerWithMaxPrice()?.role || '0']}</Text>
                    </View>
                </View>
            </View>

            {route.params.mode != OperationType.VIEW &&
                (<View style={styles.bookingSection}>
                    {isLoading ? <ActivityIndicator size={25} color={"#F1F0E6"} /> :
                        requestStatus == "pending" ?
                            (<TouchableOpacity style={styles.bookButton} onPress={handleRequest}>
                                <Text style={styles.bookButtonText}>Send Request</Text>
                                <Icon name="send" type='ionicon' size={20} color={"#000000"} />
                            </TouchableOpacity>)
                            : (
                                <TouchableOpacity style={styles.bookButton} >
                                    <Text style={styles.bookButtonText}>Request sent</Text>
                                    <Icon name="checkmark-outline" type="ionicon" size={20} color={theme.blackColor} />
                                </TouchableOpacity>
                            )}
                </View>
                )}
        </ScrollView >
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    imageContainer: {
        position: 'relative',
    },
    favoriteIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#565555',
        padding: 8,
        borderRadius: 50,
    },
    eventImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    titleContainer: {
        marginBottom: 8,
    },
    eventTitle: {
        color: theme.headingColor,
        fontSize: 24,
        fontWeight: 'bold',
    },
    aboutSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        marginTop: 16,
    },
    aboutTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        color: theme.primaryColor,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    descriptionText: {
        lineHeight: 20,
        color: theme.secondaryColor,
    },
    bookingSection: {
        marginTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    bookButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        backgroundColor: theme.primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 50,
    },
    bookButtonText: {
        fontWeight: 'bold',
    },
    detailsRow: {
        flexDirection: 'row',
        marginVertical: 15,
        gap: 8,
        flexWrap: 'wrap',
    },
    detailItem: {
        fontSize: 14,
        color: '#202023',
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

});

export default EmployeeEventScreen;

