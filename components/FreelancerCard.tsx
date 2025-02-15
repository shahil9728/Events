import { supabase } from '@/lib/supabase';
import { Icon } from '@rneui/themed';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSnackbar } from './SnackBar';
import { useTheme } from '@/app/ThemeContext';

const FreelancerCard = ({ item, alternate, onSubmit }: { item: { id: string, name: string, role: string, salary: number, resume_url: string }; alternate: boolean; onSubmit: Function }) => {
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

    async function sentHireReq(employeeId: string) {
        setLoading(true);
        try {
            Alert.alert('Hire Request', 'Are you sure you want to send a hire request to this employee?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        const managerId = (await supabase.auth.getUser()).data.user?.id;
                        onSubmit(managerId, employeeId);
                    }
                },
            ]);
        } catch (emperror) {
            console.log(emperror);
            if (emperror instanceof Error) {
                Alert.alert(String(emperror));
            } else {
                showSnackbar('An unknown error occurred.', 'error');
            }
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <View style={[styles.card, alternate && { backgroundColor: theme.lightGray }]}>
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/60' }}
                    style={styles.profileImage}
                />
                <View style={styles.iconsContainer}>
                    <TouchableOpacity style={[styles.iconButton, alternate && { backgroundColor: "#565555" }]}>
                        <Icon name="heart" type='ionicon' size={20} color={alternate ? "#F1F0E6" : "#060605"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, alternate && { backgroundColor: "#565555" }]}>
                        <Icon name="chatbox-ellipses" type='ionicon' size={20} color={alternate ? "#F1F0E6" : "#060605"} />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={[styles.name, alternate && { color: "#979797" }]}>{item.name}</Text>
            <View style={styles.detailsRow}>
                <View style={[styles.iconWithTextcont, alternate && { backgroundColor: "#343436" }]}>
                    <TouchableOpacity style={[styles.iconWithText]}>
                        <Icon name="star" type='font-awesome' size={15} color={alternate ? "#F1F0E6" : "#060605"} />
                        <Text style={[styles.detailItem, alternate && { color: "#F1F0E6" }]}>4.8</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.iconWithTextcont, alternate && { backgroundColor: "#343436" }]}>
                    <TouchableOpacity style={styles.iconWithText}>
                        <Icon name="map-pin" type='feather' size={15} color={alternate ? "#F1F0E6" : "#060605"} />
                        <Text style={[styles.detailItem, alternate && { color: "#F1F0E6" }]}>New York</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.iconWithTextcont, alternate && { backgroundColor: "#343436" }]}>
                    <TouchableOpacity style={styles.iconWithText}>
                        <Icon name="school-outline" type='ionicon' size={15} color={alternate ? "#F1F0E6" : "#060605"} />
                        <Text style={[styles.detailItem, alternate && { color: "#F1F0E6" }]}>3+ year</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.iconWithTextcont, alternate && { backgroundColor: "#343436" }]}>
                    <TouchableOpacity style={styles.iconWithText}>
                        <Icon name="time-outline" type='ionicon' size={15} color={alternate ? "#F1F0E6" : "#060605"} />
                        <Text style={[styles.detailItem, alternate && { color: "#F1F0E6" }]}>Full Time</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.jobRow}>
                <View>
                    <Text style={[styles.jobTitle, alternate && { color: "#A5A6A6" }]}>{item.role}</Text>
                    <Text style={[styles.seniority, alternate && { color: "#F1F0E6" }]}>Senior</Text>
                    <Text style={[styles.salary, alternate && { color: "#F1F0E6" }]}>${item.salary} <Text style={[styles.perMonth, alternate && { color: "#F1F0E6" }]}>/ month</Text>
                    </Text>
                </View>

                <View style={styles.actionButtonRow}>
                    <TouchableOpacity style={[styles.actionButton, alternate && { backgroundColor: "#F1F0E6" }]} onPress={() => sentHireReq(item.id)}>
                        {loading ?
                            <ActivityIndicator size={25} color={alternate ? "#060605" : "#F1F0E6"} />
                            : <Text style={[styles.buttonText, alternate && { color: "#2C2B2B" }]}>Hire Now</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#EBFF57',
        borderRadius: 20,
        padding: 20,
        width: '95%',
        alignSelf: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
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
    iconsContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        backgroundColor: '#D4E64E',
        borderRadius: 40,
        padding: 15,
        marginHorizontal: 3,
    },
    iconText: {
        fontSize: 16,
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
    jobType: {
        fontSize: 14,
        color: '#202023',
        marginTop: 5,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#76802C',
        marginTop: 15,
    },
    seniority: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#202023',
        marginTop: 5,
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
