import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/app/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface MultiSelectFilterProps {
    filters?: string[];
    onApplyFilters?: (selectedFilters: string[]) => void;
    initialSelectedFilters?: string[];
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({ filters = [], onApplyFilters, initialSelectedFilters = [] }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [selectedFilters, setSelectedFilters] = useState(new Set(initialSelectedFilters));

    const toggleFilter = (filter: string) => {
        setSelectedFilters((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(filter)) {
                newSet.delete(filter);
            } else {
                newSet.add(filter);
            }
            if (onApplyFilters) onApplyFilters(Array.from(newSet));
            return newSet;
        });
    };


    return (
        <View>
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer} horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        flexDirection: 'row'
                    }}>
                    {[...filters.filter((f) => selectedFilters.has(f)),
                    ...filters.filter((f) => !selectedFilters.has(f))
                    ].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterOption,
                                selectedFilters.has(filter) && styles.selectedOption,
                            ]}
                            onPress={() => toggleFilter(filter)}
                        >
                            <Text style={styles.filterText}>{filter}</Text>
                            {selectedFilters.has(filter) &&
                                <Text style={styles.filterText}>
                                    <Ionicons name="close" size={20} />
                                </Text>}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View >
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        marginLeft: 20,
        maxWidth: 250,
        position: "relative",
        zIndex: 10,
    },
    scrollContainer: {
        maxHeight: 48,
    },
    filterOption: {
        padding: 10,
        paddingHorizontal: 10,
        backgroundColor: "#787975",
        borderRadius: 50,
        marginRight: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    selectedOption: {
        backgroundColor: "#2C2B2B",
    },
    filterText: {
        color: "#F1F0E6",
        textTransform: "capitalize"
    },
});

export default MultiSelectFilter;
