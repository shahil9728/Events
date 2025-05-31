import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { Text, Icon } from '@rneui/themed'
import Loader from '@/components/Loader'
import FreelancerCard from '@/components/FreelancerCard'
import { LogBox } from 'react-native';
import { ManagerHeaderScreenProps } from '@/app/RootLayoutHelpers'
import { useSnackbar } from '@/components/SnackBar'
import { useTheme } from '@/app/ThemeContext'
import { useDispatch, useSelector } from 'react-redux'
import EDialog from '@/components/EDialog'
import { setEvents } from '@/app/redux/Manager/Events/eventActions'
import FilterSheet from '@/components/FilterDialog'
import { HospitalityRoles, UserRole } from '../employeeConstants'
import { FILTER_CATEGORIES } from '../managerConstants'
import useExitAppOnBackPress from '@/hooks/useExitAppOnBackPress'

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested',
]);

const pageSize = 10;

export default function ManagerDashboard({ navigation }: ManagerHeaderScreenProps) {
    useExitAppOnBackPress();
    const { theme } = useTheme();
    const { showSnackbar } = useSnackbar();
    const accountInfo = useSelector((store: { accountInfo: any }) => store.accountInfo);
    const eventReducer = useSelector((store: any) => store.eventReducer);
    const [employees, setEmployees] = useState<any[]>([])
    const [dataloading, setdataLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [eventList, setEventsList] = useState<any[]>(eventReducer.events);
    const [selectedEvent, setSelectedEvent] = useState<{ id: number; metadata?: any; title: string; startDate: string; endDate: string; } | null>(null);
    const [eventloading, setEventLoading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
    const styles = createStyles(theme);
    const openDialog = () => setVisible(true);
    const closeDialog = () => setVisible(false);
    const disaptch = useDispatch();
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    useEffect(() => {
        const load = async () => {
            setdataLoading(true);
            await fetchEmployees(1);
            setdataLoading(false);
        };
        load();
    }, [])

    const fetchEmployees = async (page = 1) => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        try {
            // const { data, error } = await supabase
            //     .from('employee_to_manager')
            //     .select('employee_id, req_status, manager_id, event_metadata')
            //     .or(
            //         'req_status.eq.accepted, and(req_status.eq.pending, manager_id.eq.' + accountInfo.manager_id + ')'
            //     );
            let query = supabase
                .from('employees')
                .select('*')
                .range(from, to);

            // const pendingEmployeeIds = data?.map(d => d.employee_id) || [];
            // if (pendingEmployeeIds.length > 0) {
            //     query = query.not('id', 'in', `(${pendingEmployeeIds.map(id => `"${id}"`).join(',')})`);
            // }

            const { data: employees, error: empError } = await query;
            if (empError) {
                console.log("Manager, Error occurred while fetching employees", empError)
                return
            }

            if (employees) setEmployees(prev => page === 1 ? employees : [...prev, ...employees])
            return true;
        } catch (error) {
            if (error instanceof Error) {
                console.log("Manager. Error during fetching employeesa", error.message)
            }
        }
    }

    // To send the hire request we first need to fetch the events of the manager
    async function fetchEvents(employee: any) {
        openDialog();
        setSelectedEmployee(employee);
        if (eventReducer.eventsFetched) {
            setEventsList(eventReducer.events);
            return;
        }
        setEventLoading(true);

        // const { data, error } = await supabase
        //     .from('employee_to_manager')
        //     .select('employee_id, req_status, manager_id, event_id')
        //     .or(
        //         'req_status.eq.accepted, and(req_status.eq.pending, manager_id.eq.' + accountInfo.manager_id + ')'
        //     );
        // const pendingEventIds = data?.map(d => d.event_id) || [];


        const { data: events, error: reqError } = await supabase.from("events")
            .select("*")
            .eq("manager_id", accountInfo.manager_id)

        if (!events || events.length === 0) {
            showSnackbar('Sorry there are no active events', 'warning');
            setEventLoading(false);
            closeDialog();
        } else {
            setEventLoading(false);
            if (events) setEventsList(events);
            disaptch(setEvents(events));
            openDialog();
        };
    }

    function getCommonRole(employee: any, event: any) {
        const employeeRoles = employee?.role.split(",").map((val: string) => val.trim());
        const eventRoles = event?.metadata?.freelancer.map((x: any) => x?.role) || [];
        console.log("Employee Roles", employeeRoles, eventRoles)
        var roles = employeeRoles.filter((role: string) => eventRoles.includes(role));
        return roles;
    }
    // Send hire request after manager selects an event
    const onSend = async () => {
        console.log("Selected Event", selectedEvent, selectedEmployee)
        if (!selectedEvent) {
            showSnackbar('Please select an event to send hire request.', 'warning');
            return;
        }

        const { data, error } = await supabase
            .from('employee_to_manager')
            .select('employee_id, req_status, manager_id, event_id')
            .eq('employee_id', selectedEmployee?.id)

        if (data) {
            const pendingEventIds = data?.map(d => d.event_id) || [];
            if (pendingEventIds.includes(selectedEvent.id)) {
                showSnackbar('Hire request already sent for this event.', 'warning');
                closeDialog();
                return;
            }
        }


        setEventLoading(true);
        try {
            const updates = {
                employee_id: selectedEmployee?.id,
                manager_id: accountInfo.manager_id,
                req_status: 'pending',
                event_title: selectedEvent?.title,
                event_id: selectedEvent?.id,
                role_id: getCommonRole(selectedEmployee, selectedEvent).join(","),
                event_metadata: { ...selectedEvent?.metadata, startDate: selectedEvent?.startDate, endDate: selectedEvent?.endDate },
                request_initiator: UserRole.MANAGER,
            };

            const { data, error } = await supabase
                .from('employee_to_manager')
                .upsert(updates);

            if (error) throw error;

            showSnackbar('Hire request sent!', 'success');
            fetchEmployees();
            closeDialog();
        } catch (err) {
            console.error('Error sending hire request:', err);
            showSnackbar('Failed to send hire request.', 'error');
        }
        finally {
            setEventLoading(false);
        }
    };

    const getFilteredEmployees = (): any[] => {
        if (Object.keys(appliedFilters).length === 0 || Object.values(appliedFilters).every(arr => arr.length === 0)
        ) return employees;

        return employees.filter((emp) => {
            for (const category of FILTER_CATEGORIES) {
                const { key } = category;
                const multiple = 'multiple' in category ? category.multiple : false; // Check if 'multiple' exists in category
                const type = 'type' in category ? category.type : null; // Check if 'type' exists in category
                const filterValue = appliedFilters[key];

                if (!filterValue) continue; // No filter applied for this category

                let employeeValue = emp[key];
                if (key == "role") {
                    employeeValue = employeeValue.split(",").map((val: string) => {
                        const roleLabel = HospitalityRoles.find(role => role.value === val.trim())?.label;
                        return roleLabel || val.trim();
                    });
                }

                console.log("Employee Value", employeeValue, key, filterValue, category)
                if (type === 'option' && multiple) {
                    // For arrays like skills: check if any selected value is in the employee's list
                    if (
                        !Array.isArray(employeeValue) ||
                        !filterValue.some((val: string) => employeeValue.includes(val))
                    ) {
                        return false;
                    }
                }
                else if (type === 'range') {
                    const [min, max] = filterValue[0].split(",").map(Number); // Ensure values are numbers
                    const numericValue = Number(employeeValue);
                    console.log("Range Filter", numericValue, min, max)
                    if (isNaN(numericValue) || numericValue < min || numericValue > max) {
                        return false;
                    }
                }
                else {
                    // For single-value filters like experience, dealsCompleted
                    if (!filterValue.includes(employeeValue)) {
                        return false;
                    }
                }
            }

            return true;
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Search freelancers</Text>
                <View style={{ gap: 5 }}>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}
                    >
                        <Icon name="tune" size={24} color="#060605" />
                        <Text style={styles.filterText}>Filters</Text>
                        {Object.keys(appliedFilters).length > 0 &&
                            !Object.values(appliedFilters).every(arr => arr.length === 0) && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{Object.keys(appliedFilters).length}</Text>
                                </View>
                            )}
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, height: "auto", paddingBottom: 10 }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
            >
                {dataloading ? <Loader /> : (
                    <>
                        {getFilteredEmployees().length === 0 &&
                            (<View>
                                <Text style={styles.emptyRow}>No active employees</Text>
                            </View>)}
                        <FlatList
                            data={getFilteredEmployees()}
                            renderItem={({ item, index }) => (
                                <FreelancerCard
                                    item={item}
                                    alternate={index % 2 === 0 ? false : true}
                                    cardType="freelancer"
                                    onSubmit={() => {
                                        fetchEvents(item);
                                    }}
                                />
                            )}
                            keyExtractor={(item) => item.id}
                            nestedScrollEnabled={true}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                if (!isFetchingMore) {
                                    setIsFetchingMore(true);
                                    const nextPage = page + 1;
                                    fetchEmployees(nextPage).then(() => {
                                        setPage(nextPage);
                                        setIsFetchingMore(false);
                                    });
                                }
                            }}
                            ListFooterComponent={isFetchingMore ? <ActivityIndicator color="#ffffff" /> : null}
                        />
                    </>
                )}
            </ScrollView>
            <EDialog
                visible={visible}
                onClose={closeDialog}
                onConfirm={onSend}
                title="Active Events"
                confirmText="Send"
                cancelText="Cancel"
            >
                {eventloading ? (
                    <ActivityIndicator size="small" color="red" style={{ height: 40 }} />
                ) : (
                    <View>
                        {eventList.length > 0 && (
                            <FlatList
                                data={eventList}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.eventItem}
                                        onPress={() => setSelectedEvent(item)}
                                    >
                                        <Icon
                                            name={selectedEvent?.id === item.id ? "radio-button-on" : "radio-button-off"}
                                            type="ionicon"
                                            size={24}
                                            color={selectedEvent?.id === item.id ? "#EBFF57" : "#888888"}
                                        />
                                        <Text style={[styles.eventTitle, selectedEvent?.id === item.id && styles.selectedEventItem]}>{item.title}</Text>
                                    </TouchableOpacity>

                                )}
                            />
                        )}
                    </View>
                )}
            </EDialog>
            <FilterSheet visible={isFilterVisible} onClose={() => setFilterVisible(false)} onApply={(filters) => {
                console.log('Selected Filters:', filters);
                setAppliedFilters(filters);
            }}
            />
        </View>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    emptyRow: {
        color: 'white',
        fontSize: 15,
        textAlign: "center",
        marginBottom: 15
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerTitle: {
        width: '60%',
        fontSize: 40,
        fontWeight: 'bold',
        color: theme.headingColor,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.secondaryColor,
        borderRadius: 60,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    filterText: {
        fontSize: 16,
        marginLeft: 6,
    },
    title: {
        color: theme.secondaryColor,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
    eventTitle: {
        color: theme.lightGray2,
        fontSize: 16,
        marginLeft: 10,
    },
    selectedEventItem: {
        color: theme.primaryColor1,
    },
    eventItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 16,
        borderColor: "red",
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sendButton: {
        backgroundColor: '#6200EA',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#E4F554',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    badgeText: {
        color: '#060605',
        fontSize: 12,
        fontWeight: 'bold',
    },

})

