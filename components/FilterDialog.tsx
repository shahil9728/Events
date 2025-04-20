import { FILTER_CATEGORIES } from '@/app/(tabs)/managerConstants';
import { useTheme } from '@/app/ThemeContext';
import { Icon } from '@rneui/themed';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';


interface Props {
    visible: boolean;
    onClose: () => void;
    onApply: (selectedFilters: Record<string, string[]>) => void
}

const FilterSheet: React.FC<Props> = ({ visible, onClose, onApply }) => {

    const { theme } = useTheme();
    const styles = useStyles(theme);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    const handleOptionSelect = (categoryTitle: string, option: string, isMulti: boolean) => {
        setSelectedFilters(prev => {
            const current = prev[categoryTitle] || [];

            if (isMulti) {
                if (current.includes(option)) {
                    return { ...prev, [categoryTitle]: current.filter(o => o !== option) };
                } else {
                    return { ...prev, [categoryTitle]: [...current, option] };
                }
            } else {
                return { ...prev, [categoryTitle]: [option] };
            }
        });
    };
    const selectedCategory = FILTER_CATEGORIES[selectedIndex];

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Filters</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={20} color="#E4F554" />
                        </TouchableOpacity>
                    </View>

                    {/* Body */}
                    <View style={styles.body}>
                        {/* Left Category List */}
                        <ScrollView style={styles.leftColumn}>
                            {FILTER_CATEGORIES.map((cat, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.categoryItem,
                                        index === selectedIndex && styles.selectedCategory,
                                    ]}
                                    onPress={() => setSelectedIndex(index)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            index === selectedIndex && styles.selectedCategoryText,
                                        ]}
                                    >
                                        {cat.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Right Option List */}
                        <ScrollView style={styles.rightColumn}>
                            {selectedCategory.type === 'range' ? (
                                <View style={styles.sliderContainer}>
                                    {typeof selectedCategory.min === 'number' && typeof selectedCategory.max === 'number' && (
                                        <>
                                            <Text style={styles.sliderLabel}>
                                                Min, Max: {selectedFilters[selectedCategory.key]?.[0] ?? selectedCategory.min}
                                            </Text>
                                            <MultiSlider
                                                values={[
                                                    Number(selectedFilters[selectedCategory.key]?.[0].split(",")[0]) || selectedCategory.min,
                                                    Number(selectedFilters[selectedCategory.key]?.[0].split(",")[1]) || selectedCategory.max,
                                                ]}
                                                min={selectedCategory.min}
                                                max={selectedCategory.max}
                                                step={1000}
                                                onValuesChange={(values) =>
                                                    handleOptionSelect(selectedCategory.key, values.toString(), false)
                                                }
                                                sliderLength={170}
                                                minMarkerOverlapDistance={10}
                                                selectedStyle={{
                                                    backgroundColor: '#B6BF48',
                                                }}
                                                unselectedStyle={{
                                                    backgroundColor: '#444',
                                                }}
                                                markerStyle={{
                                                    backgroundColor: '#E4F554',
                                                }}
                                            />
                                        </>
                                    )}
                                </View>
                            ) : (
                                selectedCategory.options?.map((option, idx) => {
                                    const selected = (selectedFilters[selectedCategory.key] || []).includes(option);
                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[
                                                styles.optionItem,
                                                selected && styles.selectedOptionItem,
                                            ]}
                                            onPress={() =>
                                                handleOptionSelect(selectedCategory.key, option, selectedCategory.multiple ?? false)
                                            }
                                        >
                                            <Text style={styles.optionText}>{option}</Text>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </ScrollView>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.showResultsButton, { backgroundColor: "transparent" }]}
                            onPress={() => {
                                setSelectedFilters({});
                                onApply({});
                            }}
                        >
                            <Text style={[styles.showResultsText, { color: theme.lightGray2 }]}>Clear Filters</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.showResultsButton}
                            onPress={() => {
                                onApply(selectedFilters);
                                onClose();
                            }}
                        >
                            <Text style={styles.showResultsText}>Show Results</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FilterSheet;

const useStyles = (theme: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        height: '90%',
        backgroundColor: '#202023',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    selectedOptionItem: {
        backgroundColor: '#B6BF48',
    },

    title: {
        fontSize: 20,
        color: '#E4F554',
        fontWeight: 'bold',
    },
    closeText: {
        color: '#E4F554',
        fontSize: 16,
    },
    body: {
        flex: 1,
        flexDirection: 'row',
    },
    leftColumn: {
        width: '40%',
        backgroundColor: '#060605',
        paddingVertical: 10,
    },
    rightColumn: {
        width: '60%',
        padding: 15,
        backgroundColor: '#202023',
    },
    categoryItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    categoryText: {
        color: '#aaa',
        fontSize: 16,
    },
    selectedCategory: {
        backgroundColor: '#B6BF48',
    },
    selectedCategoryText: {
        color: '#060605',
        fontWeight: '600',
    },
    optionItem: {
        backgroundColor: '#060605',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    optionText: {
        color: '#fff',
    },
    footer: {
        padding: 16,
        backgroundColor: '#060605',
        borderTopWidth: 1,
        borderColor: '#333',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    showResultsButton: {
        backgroundColor: '#E4F554',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    showResultsText: {
        color: '#202023',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sliderContainer: {
        padding: 16,
        backgroundColor: '#1c1c1e', // dark background
        borderRadius: 12,
        marginVertical: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
    },

    sliderLabel: {
        color: '#E4F554', // your preferred text/icon color
        fontSize: 14,
        marginBottom: 8,
        textAlign: 'center',
    },
});
