import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, Alert, Image, BackHandler, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { Button, Text, Card, Icon, CheckBox } from '@rneui/themed'
import Loader from '@/components/Loader'
import { useFocusEffect } from 'expo-router'
import FreelancerCard from '@/components/FreelancerCard'
import { LogBox } from 'react-native';
import { ManagerHeaderScreenProps } from '@/app/RootLayoutHelpers'
import { useSnackbar } from '@/components/SnackBar'
import { useTheme } from '@/app/ThemeContext'
import { useSelector } from 'react-redux'

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested',
]);

export default function ManagerDashboard({ navigation }: ManagerHeaderScreenProps) {
    const [employees, setEmployees] = useState<any[]>([])
    const [dataloading, setdataLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [eventList, setEventsList] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<{ id: number; metadata?: any; title: string; startDate: string; endDate: string; } | null>(null);
    const [eventloading, setEventLoading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
    const { showSnackbar } = useSnackbar();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const accountInfo = useSelector((store: { accountInfo: any }) => store.accountInfo);
    const openDialog = () => setVisible(true);
    const closeDialog = () => setVisible(false);

    useEffect(() => {
        fetchEmployees()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert('Exit App', 'Do you want to exit the app?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: () => BackHandler.exitApp() }, // Exit app
                ]);
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    async function fetchEmployees() {
        setdataLoading(true);
        try {
            let { data, error } = await supabase
                .from('employees')
                .select(`
                    *,
                    employee_to_manager!inner(req_status,id)
                  `)
                .neq('employee_to_manager.req_status', 'accepted')
            data?.map((d) => {
                console.log(d.employee_to_manager)
            })
            console.log(data)

            if (error) throw error
            if (data) setEmployees(data)
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
        finally {
            setdataLoading(false)
        }
    }

    // To send the hire request we first need to fetch the events of the manager
    async function fetchEvents(employee: any) {
        openDialog();
        setSelectedEmployee(employee);
        setEventLoading(true);
        const { data: events, error: reqError } = await supabase.from("events")
            .select("*")
            .eq("manager_id", accountInfo.manager_id);
        if (events && events.length == 0) {
            showSnackbar('Sorry there are no active events', 'warning');
            setEventLoading(false);
            closeDialog();
        } else {
            setEventLoading(false);
            if (events) setEventsList(events);
            openDialog();
        };
    }

    // Send hire request after manager selects an event
    const onSend = async () => {
        // console.log(selectedEvent);
        if (!selectedEvent) {
            showSnackbar('Please select an event to send hire request.', 'warning');
            return;
        }
        setEventLoading(true);
        try {
            const updates = {
                id: selectedEmployee?.employee_to_manager[0].id,
                employee_id: selectedEmployee?.id,
                manager_id: accountInfo.manager_id,
                req_status: 'pending',
                event_title: selectedEvent?.title,
                event_id: selectedEvent?.id,
                event_metadata: { ...selectedEvent?.metadata, startDate: selectedEvent?.startDate, endDate: selectedEvent?.endDate },
                request_initiator: 'MANAGER',
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

    return (
        <View style={styles.container}>
            <View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visible}
                    onRequestClose={closeDialog}
                >
                    <View style={styles.overlay}>
                        <View style={styles.dialog}>
                            {eventloading ? <ActivityIndicator size="small" color="red" style={{ height: 40 }} />
                                : (
                                    <View>
                                        <Text style={styles.title}>Active Events</Text>
                                        {eventList.length > 0 && (
                                            <FlatList
                                                data={eventList}
                                                keyExtractor={(item) => item.id.toString()}
                                                renderItem={({ item }) => (
                                                    <View style={styles.eventItem}>
                                                        <CheckBox
                                                            checked={selectedEvent?.id === item.id}
                                                            onPress={() => {
                                                                if (item.id === selectedEvent?.id) {
                                                                    setSelectedEvent(null);
                                                                } else {

                                                                    setSelectedEvent(item)
                                                                }
                                                            }
                                                            }
                                                            checkedIcon={<Icon name="checkmark-outline" type='ionicon' size={24} color="#EBFF57" />}
                                                            containerStyle={{ backgroundColor: 'transparent', paddingLeft: 0 }}
                                                        />
                                                        <Text style={{ color: "#ffffff" }}>{item.title}</Text>
                                                    </View>
                                                )}
                                            />
                                        )}
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                style={styles.cancelButton}
                                                onPress={closeDialog}
                                            >
                                                <Text style={styles.buttonText}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.sendButton}
                                                onPress={onSend}
                                            >
                                                <Text style={styles.buttonText}>Send</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                        </View>
                    </View>
                </Modal>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, height: "auto" }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Search freelancers</Text>
                    <View style={{ gap: 5 }}>
                        <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('AddEvent')}>
                            <Icon name="add-outline" type='ionicon' size={24} color="#060605" />
                            <Text style={styles.filterText}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Icon name="tune" size={24} color="#060605" />
                            <Text style={styles.filterText}>Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {dataloading && <Loader />}
                {employees.length === 0 &&
                    (<View>
                        <Text style={styles.emptyRow}>No employees found</Text>
                    </View>)}
                <View style={styles.jobResults}>
                    <Text style={[styles.subHeader, { fontWeight: 600 }]}>Bar Tender</Text>
                    <Text style={styles.subHeader}>{employees.length} results</Text>
                </View>

                <FlatList
                    data={employees}
                    renderItem={({ item, index }) => (
                        <FreelancerCard
                            item={item}
                            alternate={index % 2 === 0 ? false : true}
                            onSubmit={() => {
                                fetchEvents(item);
                            }}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    nestedScrollEnabled={true} />
            </ScrollView>
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
    jobResults: {
        borderWidth: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    subHeader: {
        fontSize: 18,
        color: theme.headingColor,
        fontWeight: "300"
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        width: '80%',
        backgroundColor: '#2C2B2B',
        borderRadius: 10,
        padding: 20,
    },
    title: {
        color: theme.secondaryColor,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#6200EA',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
    eventItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 16,
        borderColor: "red",
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

})

