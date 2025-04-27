import { ICONTYPE } from '@/app/globalConstants';
import { Icon } from '@rneui/themed';
import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import ETextInputContainer2 from './ETextInputContainer2';
import { useTheme } from '@/app/ThemeContext';
import { useSnackbar } from './SnackBar';

type Option = { label: string; value: string };

type Props = {
    selectedValues: string[];
    options: Option[];
    onChangeSelectedValues: (updatedValues: string[]) => void;
    placeholder?: string;
    containerStyle?: object;
};

const MultiSelectWithChips: React.FC<Props> = ({
    selectedValues,
    options,
    onChangeSelectedValues,
    placeholder = "Type to search...",
    containerStyle = {},
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const inputRef = useRef<TextInput>(null);
    const [inputValue, setInputValue] = useState('');
    const { showSnackbar } = useSnackbar(); 
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);

    const handleInputChange = (text: string) => {
        setInputValue(text);
        if (text) {
            const filtered = options.filter(
                opt =>
                    opt.label.toLowerCase().includes(text.toLowerCase()) &&
                    !selectedValues.includes(opt.value)
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions([]);
        }
    };

    const handleSelect = (selectedLabel: string) => {
        if(selectedValues.length >= 5) {
            showSnackbar("You can only select up to 5 options.",'warning');
            return;
        }
        const selected = options.find(opt => opt.label === selectedLabel);
        if (!selected) return;

        const updatedValues = [...selectedValues, selected.value];
        onChangeSelectedValues(updatedValues);

        setInputValue('');
        setFilteredOptions([]);
        inputRef.current?.focus();
    };

    const handleRemove = (value: string) => {
        const updated = selectedValues.filter(val => val !== value);
        onChangeSelectedValues(updated);
    };

    const valueToLabel = (value: string) => options.find(opt => opt.value === value)?.label || value;

    return (
        <>
            <View style={[
                styles.textInputCont,
                {
                    borderRadius: selectedValues.length > 3 ? 25 : 8,
                    paddingTop: selectedValues.length === 0 ? 0 : 5,
                },
                containerStyle
            ]}>
                <View style={styles.chipsContainer}>
                    {selectedValues.map((value, index) => (
                        <TouchableOpacity key={index} style={styles.chip} onPress={() => handleRemove(value)}>
                            <Text style={styles.chipText}>{valueToLabel(value)}</Text>
                            <Icon name="close" type={ICONTYPE.MATERIAL} size={16} color={theme.blackColor} />
                        </TouchableOpacity>
                    ))}
                    <ETextInputContainer2
                        ref={inputRef}
                        placeholder={selectedValues.length ? "" : placeholder}
                        value={inputValue}
                        onChangeText={handleInputChange}
                    />
                </View>
            </View>

            {filteredOptions.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={filteredOptions}
                        keyExtractor={(item) => item.value}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect(item.label)}>
                                <Text style={styles.dropdownItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    textInputCont: {
        backgroundColor: theme.lightGray,
    },
    chipsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 5,
        marginBottom: 8,
    },
    chipText: {
        color: theme.backgroundColor,
        marginRight: 5,
    },
    dropdown: {
        width: "100%",
        backgroundColor: theme.lightGray,
        borderRadius: 10,
        maxHeight: 150,
    },
    dropdownItem: {
        padding: 10,
    },
    dropdownItemText: {
        color: theme.secondaryColor,
    },
});

export default MultiSelectWithChips;
