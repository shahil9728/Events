import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Modal, Button, Pressable } from 'react-native';
import { Icon } from '@rneui/themed';
import { useSnackbar } from '@/components/SnackBar';
import { supabase } from '@/lib/supabase';
import { Calendar } from 'react-native-calendars';
import Loader from '@/components/Loader';
import { AddEventProps, ManagerHeaderScreenProps } from '@/app/RootLayoutHelpers';
import { useSelector } from 'react-redux';
import DropdownComponent from '@/components/DropdownComponent';
import { EVENT_CATEGORIES, HospitalityRoles, HospitalityRolesObject } from '../employeeConstants';
import { useTheme } from '@/app/ThemeContext';
import { OperationType } from '@/app/globalConstants';
import { Freelancer } from '@/app/BaseClasses';

interface DayProps {
    dateString: string;
}

interface MarkedDates {
    [key: string]: {
        color: string;
        textColor: string;
        startingDay: boolean;
        endingDay: boolean;
    };
}

const AddEvent = ({ navigation, route }: AddEventProps) => {
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const [eventName, setEventName] = useState('');
    const [selectedDates, setSelectedDates] = useState({
        startDate: '',
        endDate: '',
        markedDates: {},
    });
    const [eventLocation, setEventLocation] = useState('');
    const [eventCategory, setEventCategory] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [selectedFreelancers, setSelectedFreelancers] = useState<Freelancer[]>([]);
    const [show, setShow] = useState(false);
    const [freelancers, setFreelancers] = useState<Freelancer[]>([
        { role: '', number: '', price: '' },
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const { mode, eventData } = route.params || { mode: OperationType.UPDATE };

    useEffect(() => {
        if (mode === OperationType.UPDATE && eventData?.id) {
            if (eventData) {
                // Populate state directly from eventData
                setEventName(eventData.title);
                setSelectedDates({
                    startDate: eventData.startDate,
                    endDate: eventData.endDate,
                    markedDates: getDateRange(eventData.startDate, eventData.endDate),
                });
                setEventLocation(eventData.metadata.location);
                setEventCategory(eventData.metadata.eventCategory);
                setEventDescription(eventData.metadata.description);
                setSelectedFreelancers(eventData.metadata.freelancer);
            }
            // else if (eventData?.id) {
            //     // fallback fetch if full data not passed
            //     fetchEventDetails(eventData.id);
            // }
        }
    }, [mode, eventData?.id]);

    const fetchEventDetails = async (id: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            if (data) {
                setEventName(data.title);
                setSelectedDates({
                    startDate: data.startDate,
                    endDate: data.endDate,
                    markedDates: getDateRange(data.startDate, data.endDate),
                });
                setEventLocation(data.metadata.location);
                setEventCategory(data.metadata.eventCategory);
                setEventDescription(data.metadata.description);
                setSelectedFreelancers(data.metadata.freelancer);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch event details';
            showSnackbar(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showDatePicker = () => setShow(true);

    const onDayPress = (day: DayProps) => {
        const { dateString } = day;
        if (!selectedDates.startDate) {
            // Selecting the start date
            setSelectedDates({
                ...selectedDates,
                startDate: dateString,
                markedDates: {
                    [dateString]: { startingDay: true, color: theme.primaryColor, textColor: 'black' },
                },
            });
        } else if (selectedDates.startDate && selectedDates.endDate) {
            // Resetting the selected dates
            setSelectedDates({
                startDate: dateString,
                endDate: '',
                markedDates: {
                    [dateString]: { startingDay: true, color: theme.primaryColor, textColor: 'black' },
                },
            });
        } else {
            // Selecting the end date
            const range: MarkedDates = getDateRange(selectedDates.startDate, dateString);
            setSelectedDates({
                ...selectedDates,
                endDate: dateString,
                markedDates: range,
            });
        }
        console.log(selectedDates);
    };

    // Helper function to mark the range between two dates
    const getDateRange = (start: string, end: string) => {
        const range: { [key: string]: { color: string; textColor: string; startingDay: boolean; endingDay: boolean } } = {};
        let currentDate = new Date(start);
        const endDate = new Date(end);

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            range[dateStr] = {
                color: theme.primaryColor,
                textColor: 'black',
                startingDay: dateStr === start,
                endingDay: dateStr === end,
            };
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return range;
    };



    const accountInfo = useSelector((store: { accountInfo: any }) => store.accountInfo);
    const { showSnackbar } = useSnackbar();
    const handleInputChange = (index: number, field: keyof Freelancer, value: string) => {
        const updatedFreelancers = [...freelancers];
        updatedFreelancers[index][field] = value;
        setFreelancers(updatedFreelancers);
    };

    const addFreelancerField = () => {
        setFreelancers([
            ...freelancers,
            { role: '', number: '', price: '' },
        ]);
    };

    const addFreelancer = (freelancer: Freelancer, index: number) => {
        if (!(freelancer.role && freelancer.number && freelancer.price)) {
            showSnackbar('Please fill all fields!', 'error');
            return;
        }

        if (isNaN(Number(freelancer.price)) || Number(freelancer.price) <= 0) {
            showSnackbar('Please enter a valid salary!', 'error');
            return;
        }

        setSelectedFreelancers([...selectedFreelancers, freelancer]);
        const updatedFreelancers = [...freelancers];
        updatedFreelancers.splice(index, 1);
        setFreelancers(updatedFreelancers);
    };

    const removeFreelancer = (index: number) => {
        const updatedSelectedFreelancers = [...selectedFreelancers];
        updatedSelectedFreelancers.splice(index, 1);
        setSelectedFreelancers(updatedSelectedFreelancers);
    };

    const editFreelancer = (index: number) => {
        const freelancerToEdit = selectedFreelancers[index];
        setFreelancers([...freelancers, freelancerToEdit]);
        removeFreelancer(index);
    };

    const handleSubmit = async () => {
        if (!eventName || !eventLocation || !eventDescription || !selectedDates.startDate || !selectedDates.endDate || !selectedFreelancers.length) {
            console.log(selectedFreelancers);
            showSnackbar('Please fill all fields!', 'error');
            return;
        }

        setIsLoading(true);

        const event = {
            manager_id: accountInfo.manager_id,
            title: eventName,
            startDate: selectedDates.startDate,
            endDate: selectedDates.endDate,
            metadata: {
                location: eventLocation,
                description: eventDescription,
                freelancer: selectedFreelancers,
                eventCategory: eventCategory,
            },
            created_at: new Date(),
        };

        try {
            const { error } = mode === OperationType.UPDATE
                ? await supabase.from('events').update(event).eq('id', eventData?.id)
                : await supabase.from('events').insert(event);

            if (error) {
                throw new Error(error.message);
            }

            showSnackbar(`Event ${mode === OperationType.UPDATE ? 'Updated' : 'Created'} Successfully!`, 'success');
            navigation.navigate('RenderManagerTabs', { activeTab: 'ManagerMyEvents' });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Something went wrong!';
            showSnackbar(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <View>
            {isLoading ? <Loader /> : <ScrollView
                contentContainerStyle={styles.mainContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.heading}>{mode === OperationType.UPDATE ? 'Update Event' : 'Create Event'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Event Name"
                    value={eventName}
                    onChangeText={setEventName}
                    placeholderTextColor="#787975"
                />
                <Modal visible={show} transparent={true} animationType="slide" style={{ borderColor: "red", borderWidth: 2 }} onRequestClose={() => setShow(false)}>
                    <Pressable onPress={() => setShow(false)} style={styles.modalBackground}>
                        <View style={styles.dialogContainer}>
                            <Calendar
                                markedDates={selectedDates.markedDates}
                                markingType="period"
                                minDate={(new Date()).toString()}
                                onDayPress={onDayPress}
                                theme={{
                                    backgroundColor: theme.lightGray,
                                    calendarBackground: theme.lightGray,
                                    selectedDayBackgroundColor: theme.primaryColor,
                                    selectedDayTextColor: theme.blackColor,
                                    todayTextColor: theme.primaryColor,
                                    dayTextColor: theme.secondaryColor,
                                    textDisabledColor: theme.lightGray2,
                                    arrowColor: theme.primaryColor,
                                    monthTextColor: theme.headingColor,
                                    indicatorColor: theme.primaryColor,
                                    textSectionTitleColor: theme.primaryColor2,
                                    selectedDotColor: theme.blackColor,
                                }}
                            />
                            <TouchableOpacity style={styles.actionButton} onPress={() => setShow(false)}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
                <TouchableOpacity onPress={showDatePicker}>
                    <TextInput
                        style={styles.input}
                        placeholder="Event Date"
                        value={selectedDates.startDate == "" ? "" : new Date(selectedDates.startDate).toLocaleDateString("en-us", { month: "long", day: "numeric" }) + " - " + new Date(selectedDates.endDate).toLocaleDateString("en-us", { month: "long", day: "numeric" })}
                        editable={false}
                        placeholderTextColor="#787975"
                    />
                </TouchableOpacity>
                <DropdownComponent data={EVENT_CATEGORIES} label='Category' value={eventCategory} onClick={(text) => setEventCategory(text)} style={styles.finput} />
                <TextInput
                    style={styles.input}
                    placeholder="Event Location"
                    value={eventLocation}
                    onChangeText={setEventLocation}
                    placeholderTextColor="#787975"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Event Description"
                    value={eventDescription}
                    onChangeText={setEventDescription}
                    placeholderTextColor="#787975"
                />
                <View>
                    <Text style={styles.subheading}>Employee Details</Text>
                    {selectedFreelancers.map((freelancer, index) => (
                        <View key={index} style={styles.chip}>
                            <Text style={styles.chipText}>
                                {freelancer.number} {HospitalityRolesObject[freelancer.role]} {freelancer.price}
                            </Text>
                            <View style={styles.chipIcons}>
                                <TouchableOpacity onPress={() => editFreelancer(index)}>
                                    <Icon name="edit" type="font-awesome" size={18} color="#E4F554" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeFreelancer(index)}>
                                    <Icon name="trash" type="font-awesome" size={18} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {freelancers.map((freelancer, index) => (
                    <View key={index} style={styles.freelancerinputContainer}>
                        <DropdownComponent data={HospitalityRoles} label='Roles' value={freelancer.role} onClick={(text) => handleInputChange(index, 'role', text)} style={styles.finput} />

                        <TextInput
                            style={styles.finput}
                            placeholder="Number of Freelancers"
                            value={freelancer.number}
                            onChangeText={(text) => handleInputChange(index, 'number', text)}
                            placeholderTextColor="#787975"
                            keyboardType="phone-pad"
                        />

                        <TextInput
                            keyboardType="phone-pad"
                            style={styles.finput}
                            placeholder="Pricing (e.g. 1500Rs/day)"
                            value={freelancer.price}
                            onChangeText={(text) => handleInputChange(index, 'price', text)}
                            placeholderTextColor="#787975"
                        />
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => addFreelancer(freelancer, index)}
                        >
                            <Icon name="checkmark-outline" type="ionicon" size={20} color="#E4F554" />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.addButton} onPress={addFreelancerField}>
                        <Icon name="plus" type="font-awesome" size={20} color="#E4F554" />
                        <Text style={styles.addButtonText}>Add Freelancer Role</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>{mode === OperationType.UPDATE ? 'Update Event' : 'Create Event'}</Text>
                </TouchableOpacity>
            </ScrollView>
            }
        </View>
    );
};

const useStyles = (theme: any) => StyleSheet.create({
    actionButton: {
        backgroundColor: theme.lightGray1,
        borderRadius: 5,
        padding: 10,
    },
    buttonText: {
        color: theme.primaryColor,
        fontSize: 16,
        fontWeight: 500,
    },
    mainContainer: {
        backgroundColor: '#060605',
        padding: 20,
    },
    container: {
        flex: 1,
    },
    heading: {
        fontSize: 24,
        color: '#E4F554',
        textAlign: 'center',
        marginBottom: 20,
    },
    subheading: {
        fontSize: 16,
        color: '#E4F554',
        marginBottom: 20,
        marginTop: 20,
    },
    freelancerinputContainer: {
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        backgroundColor: '#202023',
        color: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    finput: {
        backgroundColor: '#202023',
        color: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        fontSize: 18,
        color: '#E4F554',
        marginLeft: 10,
    },
    submitButton: {
        backgroundColor: '#B6BF48',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        color: '#060605',
    },
    chip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#202023',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    chipText: {
        color: '#fff',
        fontSize: 16,
    },
    chipIcons: {
        flexDirection: 'row',
        gap: 10,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    dialogContainer: {
        width: '80%',
        backgroundColor: theme.lightGray,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
});

export default AddEvent;
