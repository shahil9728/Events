import React, { useEffect, useMemo } from 'react';
import { View, Alert, StyleSheet, BackHandler, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Icon } from '@rneui/themed';
import { supabase } from '../../../lib/supabase';
import { Text } from '@rneui/themed'
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/app/ThemeContext';
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { event_row } from '@/app/BaseClasses';
import { getFriendlydate } from '../utils';
import IconwithContainer from '@/components/IconwithContainer';

export default function Employee({ navigation }: NavigationProps) {
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert('Exit App', 'Do you want to exit the app?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [events, setEvents] = React.useState<any[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*');
            if (error) {
                console.log(error);
            } else {
                setEvents(data);
                console.log(data);
            }
        };
        fetchEvents();
    }, [])


    const renderEvent = ({ item }: { item: event_row }) => (
        <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate('EmployeeEventScreen', item)} >
            <Image source={{ uri: item.metadata?.image ?? "https://via.placeholder.com/300" }} style={styles.eventImage} />
            <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventSubTitle} numberOfLines={1} ellipsizeMode='tail'>{item.metadata?.description}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Text style={styles.eventDate}>{getFriendlydate(item.startDate)}</Text>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                        <Icon name="map-pin" type='feather' size={15} color={"#F1F0E6"} />
                        <Text style={styles.eventLocation}>{item.metadata?.location}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.eventPrice}>{item.metadata?.freelancer[0].price}$</Text>
            <TouchableOpacity style={styles.favoriteIcon}>
                <Icon name="heart" type='font-awesome' size={20} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchBarInput}
                    placeholder="Trending events"
                    placeholderTextColor={theme.lightGray2}
                />
                <IconwithContainer
                    iconName='search'
                    onPress={() => { }}
                />
            </View>
            <View>
                <Text style={styles.sectionTitle}>EVENTS ({events.length})</Text>
                <FlatList
                    data={events}
                    renderItem={renderEvent}
                    keyExtractor={(item, index) => index.toString()}
                />
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
    eventCard: {
        backgroundColor: theme.lightGray,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    eventImage: {
        height: 80,
        width: 80,
        borderRadius: 8,
    },
    eventDetails: {
        flex: 1,
        gap: 5,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: "transparent",
    },
    eventTitle: {
        color: theme.headingColor,
        fontSize: 14,
        fontWeight: 'bold',
    },
    eventSubTitle: {
        color: theme.lightGray2,
        fontSize: 12,
    },
    eventDate: {
        color: theme.primaryColor1,
        fontSize: 12,
    },
    eventLocation: {
        color: theme.primaryColor1,
        fontSize: 12,
    },
    eventPrice: {
        color: theme.primaryColor,
        fontSize: 14,
        fontWeight: 'bold',
    },
    favoriteIcon: {
        marginLeft: 10,
    },
});
