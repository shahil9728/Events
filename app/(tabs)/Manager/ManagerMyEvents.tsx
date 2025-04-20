import { ManagerHeaderScreenProps } from "@/app/RootLayoutHelpers";
import { useTheme } from "@/app/ThemeContext";
import Loader from "@/components/Loader";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { getFriendlydate, getManagerId } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@rneui/themed";
import EDialog from "@/components/EDialog";
import { ICONTYPE, OperationType } from "@/app/globalConstants";
import AnimatedPressable from "@/components/AnimatedPressable";

export default function ManagerMyEvents({ navigation }: ManagerHeaderScreenProps) {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const styles = createStyles(theme);
    const accountInfo = useSelector((store: any) => store.accountInfo);
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [warningDialog, setWarningDialog] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const manager_id = await getManagerId(accountInfo, dispatch);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('manager_id', manager_id);

            if (error) {
                console.error("Error fetching events:", error);
            } else {
                setEvents(data);
            }
        } catch (err) {
            console.error("Unexpected error fetching events:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);
            if (error) {
                console.log(error);
            } else {
                setEvents(events.filter((event) => event.id !== id));
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
        finally {
            setWarningDialog(false);
            setSelectedEventId(null);
        }
    }

    const showDeleteWarning = (id: string) => {
        setSelectedEventId(id);
        setWarningDialog(true);
    };


    const renderEvents = ({ item }: { item: any }) => {
        return (
            <AnimatedPressable onPress={() => navigation.navigate('ManagerEventScreen', item)}>
                <View style={[styles.details]}>
                    <View style={{ flex: 1, gap: 3 }}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle} ellipsizeMode='tail' numberOfLines={1}>{item.metadata.description}</Text>
                        <Text style={styles.date}>{getFriendlydate(item.startDate)} - {getFriendlydate(item.endDate)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => showDeleteWarning(item.id)} activeOpacity={0.7} style={{ padding: 8 }}>
                        <Icon name="trash" type="ionicon" color={theme.headingColor} />
                    </TouchableOpacity>
                </View>
            </AnimatedPressable>
        )
    }

    return (
        <ScrollView style={{ paddingTop: 10 }}>
            {isLoading ? <Loader /> : (
                <View style={{ flex: 1, paddingHorizontal: 10, gap: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: theme.primaryColor, fontSize: 20, fontWeight: 500 }}>My Events</Text>
                        <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('AddEvent', { mode: OperationType.CREATE })}>
                            <Icon name="add-outline" type={ICONTYPE.IONICON} size={24} color="#060605" />
                            <Text style={styles.filterText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                    {events.length === 0 && (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ color: 'white', fontSize: 16, marginBottom: 20 }}>
                                No active events found
                            </Text>
                        </View>
                    )}
                    <FlatList
                        renderItem={renderEvents}
                        data={events}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            )}
            <EDialog
                visible={warningDialog}
                onClose={() => {
                    setWarningDialog(false);
                    setSelectedEventId(null);
                }}
                cancelText="Cancel"
                confirmText="Delete"
                onConfirm={() => selectedEventId && handleDelete(selectedEventId)}
                message="Are you sure you want to delete this event? This action cannot be undone."
            />
        </ScrollView>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    details: {
        gap: 5,
        padding: 16,
        marginTop: 10,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.lightGray,
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
    }
})