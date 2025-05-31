import { ManagerEventScreenProps } from '@/app/RootLayoutHelpers';
import { useTheme } from '@/app/ThemeContext';
import { useSnackbar } from '@/components/SnackBar';
import { supabase } from '@/lib/supabase';
import { Icon } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getFriendlydate, getLabelFromList } from '../utils';
import Collapsible from 'react-native-collapsible';
import { FlatList } from 'react-native';
import { EVENT_CATEGORIES, ImageKey1, imageRequireMap } from '../employeeConstants';
import EmployeeProfileModalCard from '@/components/EmployeeProfileModal';
import { ICONTYPE } from '@/app/globalConstants';


const ManagerEventScreen = ({ navigation, route }: ManagerEventScreenProps) => {
    const {
        title = 'Samay Raina Unfiltered',
        startDate = 'Thu 16 Jan 2025 - Sun 27 Apr 2025',
        endDate = 'Sun 27 Apr 2025',
        metadata = {
            eventCategory: route.params?.metadata?.eventCategory || 'Comedy',
            location: route.params?.metadata?.location || 'Shilpakala Vedika: Hyderabad',
            description: route.params?.metadata?.description || 'Last leg of the Unfiltered India tour!',
            freelancer: [],
        },
        id = '1',
    } = route.params || {};

    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { showSnackbar } = useSnackbar();
    const [data, setData] = useState<any>([]);
    const [reqLoadingId, setReqLoadingId] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const [isProfileModalVisible, setProfileModalVisible] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');


    const toggleSection = (section: number) => {
        setActiveSection(activeSection === section ? null : section);
    };


    const fetchEmployeeData = async () => {
        const { data, error } = await supabase
            .from('employee_to_manager')
            .select(`*,employee_details:employee_id(id,name,email)`)
            .eq('event_id', id);
        if (error) {
            console.log(error);
        } else {
            if (data) {
                setData(data);
            }
        }
    }
    useEffect(() => {
        fetchEmployeeData();
    }, [])

    const updateRequestStatus = async (employee_id: string, event_id: string, status: string) => {
        setReqLoadingId(employee_id);
        try {
            const { error } = await supabase.from("employee_to_manager").update({ req_status: status }).eq("employee_id", employee_id).eq("event_id", event_id);
            if (error) {
                console.error(error);
            }
        } catch (error) {
            console.error('Error updating request status:', error);
        } finally {
            setReqLoadingId(null);
            fetchEmployeeData();
            showSnackbar(`Request ${status} successfully!`, "success");
        }
    };

    const acceptedFreelancers = data?.filter((item: { req_status: string }) => item.req_status === "accepted");
    const pendingRequests = data?.filter((item: { req_status: string; request_initiator: string; id: string }) => item.req_status === "pending" && item.request_initiator === "EMPLOYEE");
    const managerRequests = data?.filter((item: { request_initiator: string; id: string; req_status: string; }) => item.request_initiator === "MANAGER" && item.req_status === "pending");

    const renderEmployee = ({ item }: { item: { employee_details: { name: string; id: string; }; employee_id: string } }) => (
        <>
            <TouchableOpacity onPress={() => {
                setSelectedEmployeeId(item.employee_id);
                setProfileModalVisible(true)
            }}>
                <View style={styles.employeeCard}>
                    <Text style={styles.employeeName}>{item.employee_details.name}</Text>
                </View>
            </TouchableOpacity>
        </>
    );

    const renderPendingEmployee = ({ item }: { item: { employee_details: { name: string, id: string }, manager_id: string; employee_id: string; event_id: string } }) => {
        return (
            <>
                <TouchableOpacity onPress={() => {
                    setSelectedEmployeeId(item.employee_id);
                    setProfileModalVisible(true)
                }}>
                    <View style={styles.employeeCard}>
                        <Text style={styles.employeeName}>{item.employee_details.name}</Text>
                        <View style={styles.actions}>
                            {reqLoadingId == item.employee_id ? <ActivityIndicator size="small" color={theme.primaryColor} /> : (
                                <>
                                    <TouchableOpacity onPress={() => updateRequestStatus(item.employee_id, item.event_id, 'accepted')}>
                                        <Icon name="checkmark" type={ICONTYPE.IONICON} size={24} color="green" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => updateRequestStatus(item.employee_id, item.event_id, 'rejected')}>
                                        <Icon name="close" type={ICONTYPE.IONICON} size={24} color="red" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View >
                </TouchableOpacity>
            </>
        )
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={imageRequireMap[metadata?.image as ImageKey1] || (Array.isArray(imageRequireMap['wedding']) ? imageRequireMap['wedding'][0] : undefined)}
                    style={styles.eventImage}
                />
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.eventTitle}>{title}</Text>
            </View>

            <View style={styles.detailsRow}>
                <View style={styles.iconWithTextcont}>
                    <TouchableOpacity style={[styles.iconWithText]}>
                        <Icon name="calendar" type='font-awesome' size={15} color={"#F1F0E6"} />
                        <Text style={[styles.detailItem, { color: "#F1F0E6" }]}> {getFriendlydate(startDate)} - {getFriendlydate(endDate)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconWithTextcont}>
                    <TouchableOpacity style={styles.iconWithText}>
                        <Icon name="school-outline" type='ionicon' size={15} color={"#F1F0E6"} />
                        <Text style={[styles.detailItem, { color: "#F1F0E6" }]}>{getLabelFromList(metadata.eventCategory, EVENT_CATEGORIES)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconWithTextcont}>
                    <TouchableOpacity style={styles.iconWithText}>
                        <Icon name="map-pin" type='feather' size={15} color={"#F1F0E6"} />
                        <Text style={[styles.detailItem, { color: "#F1F0E6" }]}>{metadata.location}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* About the Event */}
            <View style={styles.aboutSection}>
                <View style={styles.aboutTitle}>
                    <Text style={styles.sectionTitle}>About The Event</Text>
                    <View>
                        <Text style={styles.salary}>₹{metadata.freelancer[0]?.price?.toString().split("/")[0] || 'N/A'}
                        </Text>
                        <Text style={styles.perMonth}>Starting from</Text>
                    </View>
                </View>
                <Text style={styles.descriptionText}>{metadata.description}</Text>
            </View>

            <View style={styles.bookingSection}>
                {/* Accepted Freelancers */}
                <TouchableOpacity onPress={() => toggleSection(1)} style={styles.header}>
                    <Text style={styles.headerText}>Freelancers ready to work</Text>
                    <View style={{ transform: [{ rotate: activeSection === 1 ? '90deg' : '0deg' }] }}>
                        <Icon name="chevron-forward" type="ionicon" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Collapsible collapsed={activeSection !== 1}>
                    {acceptedFreelancers.length === 0 && <Text style={{ color: theme.lightGray2, textAlign: 'center' }}>No freelancers accepted yet!</Text>}
                    <FlatList
                        data={acceptedFreelancers}
                        keyExtractor={(item) => item.employee_details.id.toString()}
                        renderItem={renderEmployee}
                    />
                </Collapsible>

                {/* Pending Requests */}
                <TouchableOpacity onPress={() => toggleSection(2)} style={styles.header}>
                    <Text style={styles.headerText}>Freelancer requests on this Event</Text>
                    <View style={{ transform: [{ rotate: activeSection === 2 ? '90deg' : '0deg' }] }}>
                        <Icon name="chevron-forward" type="ionicon" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Collapsible collapsed={activeSection !== 2}>
                    {pendingRequests.length === 0 && <Text style={{ color: theme.lightGray2, textAlign: 'center' }}>No pending requests found!</Text>}
                    <FlatList
                        data={pendingRequests}
                        keyExtractor={(item) => item.employee_details.id.toString()}
                        renderItem={renderPendingEmployee}
                    />
                </Collapsible>

                {/* Manager Requests */}
                <TouchableOpacity onPress={() => toggleSection(3)} style={styles.header}>
                    <Text style={styles.headerText}>Pending Requests by you</Text>
                    <View style={{ transform: [{ rotate: activeSection === 3 ? '90deg' : '0deg' }] }}>
                        <Icon name="chevron-forward" type="ionicon" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Collapsible collapsed={activeSection !== 3}>
                    {managerRequests.length === 0 && <Text style={{ color: theme.lightGray2, textAlign: 'center' }}>No pending requests found!</Text>}
                    <FlatList
                        data={managerRequests}
                        keyExtractor={(item) => item.employee_details.id.toString()}
                        renderItem={renderEmployee}
                    />
                </Collapsible>
            </View>
            <EmployeeProfileModalCard isVisible={isProfileModalVisible} setVisible={setProfileModalVisible} employee_id={selectedEmployeeId} />
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
        marginBottom: 16,
        marginTop: 16,
    },
    aboutTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
    },
    sectionTitle: {
        color: theme.primaryColor,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    descriptionText: {
        color: theme.secondaryColor,
    },
    bookingSection: {
        marginTop: 10,
        paddingBottom: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    detailsRow: {
        flexDirection: 'row',
        marginVertical: 15,
        gap: 8,
        flexWrap: 'wrap',
    },
    detailItem: {
        marginLeft: 4,
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
        backgroundColor: theme.lightGray,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "space-between",
        backgroundColor: theme.lightGray,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    headerText: {
        color: theme.headingColor,
        fontSize: 16,
        fontWeight: 'bold',
    },
    employeeCard: {
        backgroundColor: theme.lightGray,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    employeeName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.primaryColor,
    },
    actions: {
        width: "30%",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    salary: {
        fontSize: 22,
        color: '#F1F0E6',
        fontWeight: 'bold',
    },
    perMonth: {
        fontSize: 12,
        textAlign: 'center',
        color: theme.lightGray2,
    },

});

export default ManagerEventScreen;

