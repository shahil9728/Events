import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { employee_to_manager_row, event_row, Freelancer } from '@/app/BaseClasses';
import { useTheme } from '@/app/ThemeContext';
import Loader from '@/components/Loader';
import { useSnackbar } from '@/components/SnackBar';
import { useSelector } from 'react-redux';
import MultiSelectFilter from '@/components/DropdownMenu';
import { UserRole } from '../employeeConstants';
import AnimatedPressable from '@/components/AnimatedPressable';
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { OperationType } from '@/app/globalConstants';

const EmployeeInbox: React.FC<NavigationProps> = ({ navigation }) => {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reqLoadingId, setReqLoadingId] = useState<string | null>(null);
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const { showSnackbar } = useSnackbar();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const accountInfo = useSelector((store: { accountInfo: any }) => store.accountInfo);

    useEffect(() => {
        setIsLoading(true);
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase.from("employee_to_manager").select("*").eq("employee_id", accountInfo.employee_id);
            if (data) {
                console.log("Employee Inbox", data);
                setRequests(data);
                setFilteredRequests(data.filter((d) => d.req_status === "pending"));
            } else {
                console.error(error);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterRequests = (selectedFilters: string[]) => {
        if (selectedFilters.includes('all')) {
            setFilteredRequests(requests);
        } else {
            setFilteredRequests(requests.filter((d) => {
                if (selectedFilters.includes('sent by me') && d.request_initiator === "EMPLOYEE") {
                    return true;
                }
                if (selectedFilters.includes('received') && d.request_initiator === "MANAGER") {
                    return true;
                }
                return selectedFilters.includes(d.req_status);
            }));
        }

    };

    const updateRequestStatus = async (requestId: string, status: string) => {
        setReqLoadingId(requestId);
        if (status === 'withdraw') {
            const { error } = await supabase
                .from("employee_to_manager")
                .delete()
                .eq("id", requestId);
            showSnackbar("Request withdrawn successfully!", "success");
            setReqLoadingId(null);
            fetchRequests();
            return;
        }


        try {
            const { error } = await supabase.from("employee_to_manager")
                .update({ req_status: status })
                .eq("id", requestId);

            if (error) {
                console.error(error);
            }
        } catch (error) {
            console.error('Error updating request status:', error);
        } finally {
            fetchRequests();
            showSnackbar(`Request ${status} successfully!`, "success");
        }
    };

    const renderRequest = ({ item }: { item: employee_to_manager_row }) => {
        console.log("Item", item);
        return (
            <AnimatedPressable onPress={() => {
                const fullEventRow: event_row = {
                    id: item.id,
                    manager_id: item.manager_id,
                    startDate: item.event_metadata.startDate,
                    endDate: item.event_metadata.endDate,
                    title: item.event_title,
                    role_id: item.event_metadata.freelancer[0].role,
                    metadata: {
                        eventCategory: item.event_metadata.eventCategory,
                        description: item.event_metadata.description,
                        location: item.event_metadata.location,
                        image: item.event_metadata.image || null,
                        freelancer: item.event_metadata.freelancer.map(f => ({
                            ...f,
                            number: f.number.toString(),
                            price: f.price.toString(),
                        })) as Freelancer[],
                    },
                };
                navigation.navigate('EmployeeEventScreen', { mode: OperationType.VIEW, eventData: fullEventRow });
            }}>
                <View style={styles.card}>
                    <View style={styles.details}>
                        <Text style={styles.title}>{item.event_title}</Text>
                        <Text style={styles.subtitle} ellipsizeMode='tail' numberOfLines={1}>{item.event_metadata.description}</Text>
                        <Text style={styles.date}>{`${new Date(item.event_metadata.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} - ${new Date(item.event_metadata.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`}</Text>
                    </View>
                    {item.req_status === 'pending' && item.request_initiator === UserRole.MANAGER &&
                        <View style={styles.icons}>
                            {reqLoadingId === item.id ? <ActivityIndicator size="small" color={theme.primaryColor} /> : (
                                <>
                                    <TouchableOpacity onPress={() => updateRequestStatus(item.id, 'accepted')}>
                                        <Ionicons name="checkmark" size={24} color="green" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => updateRequestStatus(item.id, 'rejected')}>
                                        <Ionicons name="close" size={24} color="red" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>}
                    {item.req_status === 'pending' && item.request_initiator === UserRole.EMPLOYEE &&
                        <View style={styles.icons}>
                            {reqLoadingId === item.id ? <ActivityIndicator size="small" color={theme.primaryColor} /> : (
                                <Text style={{ color: theme.primaryColor }} onPress={() => updateRequestStatus(item.id, 'withdraw')}>
                                    Withdraw
                                </Text>
                            )}
                        </View>}
                    {item.req_status !== 'pending' && (
                        <View>
                            <Text style={[{
                                color: item.req_status === 'accepted' ? 'green' : 'red'
                            }]}>
                                {item.req_status.charAt(0).toUpperCase() + item.req_status.slice(1)}
                            </Text>
                        </View>
                    )}
                </View>
            </AnimatedPressable >
        )
    };
    return (
        <View style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={{ fontSize: 18, color: theme.headingColor }}>
                    All Requests
                </Text>
                <MultiSelectFilter
                    filters={[
                        'pending',
                        'accepted',
                        'rejected',
                        'sent by me',
                        'received',
                        'all'
                    ]}
                    onApplyFilters={filterRequests}
                    initialSelectedFilters={['all']} />
            </View>
            {isLoading ? <Loader /> : filteredRequests.length == 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, color: theme.lightGray2 }} >
                    No new requests found!
                </Text>
            ) : (
                <>
                    <FlatList
                        data={filteredRequests}
                        keyExtractor={(item) => item.id}
                        renderItem={renderRequest}
                    />
                </>
            )}
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        padding: 16,
    },
    headerCont: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%",
    },
    menuItem: {
        fontSize: 16,
        color: theme.headingColor,
    },
    card: {
        padding: 16,
        marginVertical: 14,
        backgroundColor: theme.lightGray,
        borderRadius: 8,
        shadowColor: theme.lightGray,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.lightGray2,
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        width: "70%",
        gap: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    subtitle: {
        fontSize: 14,
        color: theme.lightGray2,
    },
    date: {
        fontSize: 14,
        color: theme.primaryColor,
    },
    icons: {
        flexDirection: "row",
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'space-between',
        width: "20%"
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterText: {
        fontSize: 16,
        marginLeft: 6,
        color: theme.headingColor
    },
});

export default EmployeeInbox;