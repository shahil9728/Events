import { useTheme } from '@/app/ThemeContext';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownComponentProps {
    data: { label: string; value: string }[];
    label: string;
    value: string;
    onClick: (value: string) => void;
    maxHeight?: number;
    style?: any;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ data, label, value, onClick, maxHeight, style }) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    return (
        <View>
            <Dropdown
                activeColor='transparent'
                containerStyle={styles.dropdownContainer}
                style={[styles.dropdown, style]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemTextStyle}
                data={data}
                maxHeight={maxHeight || 300}
                labelField="label"
                valueField="value"
                placeholder={label}
                value={value}
                onChange={item => {
                    onClick(item.value);
                }}
                renderItem={(item) => (
                    <View style={[
                        styles.itemContainer,
                        value === item.value && styles.selectedItem
                    ]}>
                        <Text style={styles.itemTextStyle}>{item.label}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default DropdownComponent;

const useStyles = (theme: any) => StyleSheet.create({
    dropdown: {
        backgroundColor: '#202023',
        height: 50,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        color: "#EBFE55",
    },
    dropdownContainer: {
        backgroundColor: '#343436',
        borderColor: "#343436",
        borderRadius: 8,
        color: "#EBFE55",
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#787975'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#ffffff',
    },
    itemTextStyle: {
        color: '#ffffff',
    },
    itemContainer: {
        padding: 10,
    },
    selectedItem: {
        backgroundColor: '#787975',
    }

});
