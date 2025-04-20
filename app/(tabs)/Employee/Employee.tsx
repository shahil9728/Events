import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, BackHandler, FlatList, TextInput } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { Text } from '@rneui/themed'
import { useTheme } from '@/app/ThemeContext';
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { getRandomImageKey } from '../utils';
import IconwithContainer from '@/components/IconwithContainer';
import { useSelector } from 'react-redux';
import FreelancerCard from '@/components/FreelancerCard';
import { useSnackbar } from '@/components/SnackBar';
import Loader from '@/components/Loader';
import { OperationType } from '@/app/globalConstants';
import useExitAppOnBackPress from '@/hooks/useExitAppOnBackPress';

export default function Employee({ navigation }: NavigationProps) {
    useExitAppOnBackPress();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const accountInfo = useSelector((state: any) => state.accountInfo);
    const [events, setEvents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEvents, setFilteredEvents] = useState(events || []);
    const { showSnackbar } = useSnackbar();
    const [eventsLoading, setEventsLoading] = useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [requestStatus, setRequestStatus] = React.useState('pending');

    useEffect(() => {
        setEventsLoading(true);
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')

            if (error) {
                console.log(error);
            } else {
                // Filter events based on the employee roles
                const userRoles = accountInfo.role.split(",");
                const filteredEvents = data.filter(event => {
                    const freelancerRoles = event.metadata.freelancer;
                    return freelancerRoles.some((position: { role: string; price: number }) =>
                        userRoles.includes(position.role)
                    );
                });

                const { data: data1, error } = await supabase.from("employee_to_manager").select("*").eq("employee_id", accountInfo.employee_id).eq("req_status", "pending").eq("request_initiator", "EMPLOYEE");

                if (error) {
                    console.log(error);
                } else {
                    const pendingRequests = data1.map((d: any) => d.event_id);
                    setEvents(filteredEvents.filter((event: any) => {
                        return !pendingRequests.includes(event.id);
                    }));
                    console.log("Events", filteredEvents);
                }

            }
            setEventsLoading(false);
        };
        fetchEvents();
    }, [])

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredEvents(events);
            return;
        }

        const filtered = events.filter(event => {
            const searchLower = searchQuery.toLowerCase();

            return (
                (event.title?.toLowerCase().includes(searchLower)) ||
                (event.metadata?.description?.toLowerCase().includes(searchLower)) ||
                (event.metadata?.location?.toLowerCase().includes(searchLower)) ||
                (event.metadata?.category?.toLowerCase().includes(searchLower))
            );
        });

        setFilteredEvents(filtered);
    }, [searchQuery, events]);

    const clearSearch = () => {
        setSearchQuery('');
    };


    const getFreelancerWithMaxPrice = (metadata: any) => {
        if (metadata?.freelancer?.length) {
            return metadata.freelancer.reduce((max: any, current: any) => {
                return (parseInt(current.price?.toString() || "0") > parseInt(max.price?.toString() || "0"))
                    ? current
                    : max;
            }, metadata.freelancer[0]);
        }
        return null;
    };


    const handleRequest = async (item: any) => {
        setIsLoading(true);
        const updates = {
            employee_id: accountInfo.employee_id,
            manager_id: item.manager_id,
            event_id: item.id,
            event_title: item.title,
            req_status: 'pending',
            role_id: getFreelancerWithMaxPrice(item.metadata)?.role,
            event_metadata: { ...item.metadata, startDate: item?.startDate, endDate: item?.endDate },
            request_initiator: 'EMPLOYEE',
        }
        const { data, error } = await supabase
            .from('employee_to_manager')
            .upsert(updates);
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            setRequestStatus('sent');
        }
        setIsLoading(false);
        showSnackbar('Request Sent Successfully', 'success');
    }



    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchBarInput}
                    placeholder="Search events"
                    placeholderTextColor={theme.lightGray2}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                />
                {searchQuery ? (
                    <IconwithContainer
                        iconName='close-circle'
                        onPress={clearSearch} />
                ) : <IconwithContainer
                    iconName='search'
                    onPress={() => { }}
                />}
            </View>
            <View>
                {eventsLoading ? <Loader /> : (
                    <>
                        <Text style={styles.sectionTitle}>EVENTS ({filteredEvents.length})</Text>
                        {filteredEvents.length === 0 &&
                            (<View>
                                <Text style={styles.emptyRow}>No events match your current skills</Text>
                                <Text style={[styles.emptyRow, { fontSize: 12, marginTop: 2 }]}>Try enhancing your profile with more skills to unlock additional opportunities</Text>
                            </View>)}
                        <FlatList
                            data={filteredEvents}
                            renderItem={({ item, index }) => (
                                <FreelancerCard
                                    item={item}
                                    cardType="event"
                                    alternate={index % 2 === 0 ? false : true}
                                    onEventPress={() =>
                                        navigation.navigate('EmployeeEventScreen', {
                                            mode: OperationType.UPDATE,
                                            eventData: {
                                                ...item,
                                                metadata: {
                                                    ...item.metadata,
                                                    image: item.metadata?.image || getRandomImageKey(),
                                                    category: item.metadata?.category || "Wedding",
                                                },
                                            },
                                        })
                                    }
                                    isLoading={isLoading}
                                    onSubmit={handleRequest}
                                    requestStatus={requestStatus}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </>)}
            </View>
        </View>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    searchBar: {
        height: 60,
        borderRadius: 50,
        paddingVertical: 25,
        paddingRight: 5,
        paddingLeft: 20,
        marginBottom: 15,
        backgroundColor: theme.lightGray,
        color: '#fff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchBarInput: {
        color: '#fff',
        height: 60,
        fontSize: 16,
    },
    sectionTitle: {
        color: theme.primaryColor,
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    emptyRow: {
        marginTop: 20,
        color: 'white',
        fontSize: 15,
        textAlign: "center"
    },
});
