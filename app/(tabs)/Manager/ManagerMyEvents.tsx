import {  ManagerHeaderScreenProps } from "@/app/RootLayoutHelpers";
import { useTheme } from "@/app/ThemeContext";
import Loader from "@/components/Loader";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { getFriendlydate } from "../utils";
import { useSelector } from "react-redux";

export default function ManagerMyEvents({ navigation }: ManagerHeaderScreenProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const accountInfo = useSelector((store: any) => store.accountInfo);

    const { theme } = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        setIsLoading(true);
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('manager_id', accountInfo.manager_id);
                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                    setEvents(data);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvents();
    }, [])

    const renderEvents = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ManagerEventScreen', item)} >
            <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle} ellipsizeMode='tail' numberOfLines={1}>{item.metadata.description}</Text>
                <Text style={styles.date}>{getFriendlydate(item.startDate)} - {getFriendlydate(item.endDate)}</Text>
            </View>
        </TouchableOpacity >
    )

    return (
        <ScrollView>
            {isLoading ? <Loader /> : (
                <FlatList
                    renderItem={renderEvents}
                    data={events}
                    keyExtractor={(item) => item.id}
                />
            )}
        </ScrollView>

    )
}

const createStyles = (theme: any) => StyleSheet.create({
    details: {
        borderRadius: 8,
        backgroundColor: theme.lightGray,
        padding: 16,
        margin: 16,
        display: 'flex',
        flexDirection: 'column',
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
})